import Foundation
import AVFoundation
import Combine
import UIKit

public enum RepeatMode: String, CaseIterable, Sendable {
    case off
    case all
    case one
    
    public var iconName: String {
        switch self {
        case .off: return "repeat"
        case .all: return "repeat"
        case .one: return "repeat.1"
        }
    }
}

@MainActor
public final class PlaybackEngine: ObservableObject {
    public static let shared = PlaybackEngine()
    
    // Playback State
    @Published public private(set) var currentTrack: AudioTrack?
    @Published public private(set) var isPlaying: Bool = false
    @Published public private(set) var isBuffering: Bool = false
    @Published public private(set) var currentTime: TimeInterval = 0.0
    @Published public private(set) var duration: TimeInterval = 0.0
    @Published public private(set) var queue: [AudioTrack] = []
    @Published public var isShuffleEnabled: Bool = false
    @Published public var repeatMode: RepeatMode = .off
    @Published public private(set) var lyrics: LyricsResult = LyricsResult()
    @Published public private(set) var currentLyricIndex: Int? = nil
    
    private var avPlayer: AVPlayer?
    private var timeObserverToken: Any?
    private var itemEndObserver: Any?
    private var uncommittedSeekTime: TimeInterval?
    private var scrobbledCurrentTrack: Bool = false
    private let nowPlayingManager = NowPlayingManager.shared
    private let audioSessionManager = AudioSessionManager.shared
    private let storage = KairaStorage.shared
    
    private init() {
        setupRemoteCommandHandlers()
        setupAudioSessionCallbacks()
        restorePersistedQueue()
    }
    
    deinit {
        if let token = timeObserverToken {
            avPlayer?.removeTimeObserver(token)
        }
    }
    
    // MARK: - Queue Management
    
    public func play(track: AudioTrack, newQueue: [AudioTrack]? = nil) {
        if let newQueue = newQueue, !newQueue.isEmpty {
            self.queue = newQueue
        } else if !queue.contains(where: { $0.id == track.id }) {
            self.queue.append(track)
        }
        
        self.currentTrack = track
        self.scrobbledCurrentTrack = false
        self.storage.saveLikedTracks(storage.getLikedTracks())
        
        // Add to recent tracks
        var recents = storage.getRecentTracks().filter { $0.id != track.id }
        recents.insert(track, at: 0)
        storage.saveRecentTracks(Array(recents.prefix(50)))
        
        loadAndPlay(track: track)
        fetchLyricsForCurrentTrack()
        updateLastFmNowPlaying()
        HapticFeedback.playSelection()
    }
    
    public func playNext(track: AudioTrack) {
        if let current = currentTrack, let index = queue.firstIndex(where: { $0.id == current.id }) {
            queue.insert(track, at: index + 1)
        } else {
            queue.append(track)
        }
        HapticFeedback.playSelection()
    }
    
    public func appendToQueue(track: AudioTrack) {
        queue.append(track)
        HapticFeedback.playSelection()
    }
    
    public func removeFromQueue(at offsets: IndexSet) {
        queue.remove(atOffsets: offsets)
    }
    
    public func moveInQueue(from source: IndexSet, to destination: Int) {
        queue.move(fromOffsets: source, toOffset: destination)
    }
    
    // MARK: - Core Playback Controls
    
    public func togglePlayPause() {
        if isPlaying {
            pause()
        } else {
            resume()
        }
    }
    
    public func resume() {
        guard let player = avPlayer else {
            if let track = currentTrack {
                loadAndPlay(track: track)
            }
            return
        }
        player.play()
        isPlaying = true
        updateNowPlaying()
        HapticFeedback.playSelection()
    }
    
    public func pause() {
        avPlayer?.pause()
        isPlaying = false
        updateNowPlaying()
        HapticFeedback.playSelection()
    }
    
    public func next() {
        guard !queue.isEmpty else { return }
        
        if repeatMode == .one, let current = currentTrack {
            seek(to: 0)
            resume()
            return
        }
        
        if isShuffleEnabled {
            let available = queue.filter { $0.id != currentTrack?.id }
            if let random = available.randomElement() {
                play(track: random)
                return
            }
        }
        
        if let current = currentTrack, let index = queue.firstIndex(where: { $0.id == current.id }) {
            let nextIndex = index + 1
            if nextIndex < queue.count {
                play(track: queue[nextIndex])
            } else if repeatMode == .all, !queue.isEmpty {
                play(track: queue[0])
            } else {
                pause()
                seek(to: 0)
            }
        } else if let first = queue.first {
            play(track: first)
        }
    }
    
    public func previous() {
        if currentTime > 3.0 {
            seek(to: 0)
            return
        }
        
        guard let current = currentTrack, let index = queue.firstIndex(where: { $0.id == current.id }) else {
            return
        }
        
        let prevIndex = index - 1
        if prevIndex >= 0 {
            play(track: queue[prevIndex])
        } else {
            seek(to: 0)
        }
    }
    
    public func seek(to seconds: TimeInterval) {
        let target = max(0, min(seconds, duration))
        self.currentTime = target
        let cmTime = CMTime(seconds: target, preferredTimescale: 1000)
        avPlayer?.seek(to: cmTime, toleranceBefore: .zero, toleranceAfter: .zero) { [weak self] _ in
            self?.updateNowPlaying()
        }
    }
    
    public func toggleShuffle() {
        isShuffleEnabled.toggle()
        HapticFeedback.playSelection()
    }
    
    public func toggleRepeat() {
        switch repeatMode {
        case .off: repeatMode = .all
        case .all: repeatMode = .one
        case .one: repeatMode = .off
        }
        HapticFeedback.playSelection()
    }
    
    // MARK: - Audio Player Loading
    
    private func loadAndPlay(track: AudioTrack) {
        if let token = timeObserverToken {
            avPlayer?.removeTimeObserver(token)
            timeObserverToken = nil
        }
        if let observer = itemEndObserver {
            NotificationCenter.default.removeObserver(observer)
            itemEndObserver = nil
        }
        
        guard let url = track.playbackURL else {
            print("[PlaybackEngine] No valid playback URL for track \(track.title)")
            return
        }
        
        isBuffering = true
        let playerItem = AVPlayerItem(url: url)
        let player = AVPlayer(playerItem: playerItem)
        player.automaticallyWaitsToMinimizeStalling = true
        self.avPlayer = player
        
        // Duration observer
        self.duration = track.duration
        self.currentTime = 0.0
        
        // Periodic Time Observer
        let interval = CMTime(seconds: 0.25, preferredTimescale: 1000)
        timeObserverToken = player.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            guard let self = self else { return }
            let seconds = CMTimeGetSeconds(time)
            guard !seconds.isNaN && !seconds.isInfinite else { return }
            
            self.currentTime = seconds
            self.updateCurrentLyricIndex(currentTimeSeconds: seconds)
            
            // Scrobble after 50% or 4 minutes
            if !self.scrobbledCurrentTrack && self.duration > 30 {
                if seconds > min(self.duration * 0.5, 240.0) {
                    self.scrobbledCurrentTrack = true
                    self.submitLastFmScrobble()
                }
            }
        }
        
        // Item End Notification
        itemEndObserver = NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: playerItem,
            queue: .main
        ) { [weak self] _ in
            self?.next()
        }
        
        player.play()
        self.isPlaying = true
        self.isBuffering = false
        updateNowPlaying()
        loadArtworkForNowPlaying(urlStr: track.artworkUrl)
    }
    
    // MARK: - Lyrics Synchronization
    
    private func fetchLyricsForCurrentTrack() {
        guard let track = currentTrack else { return }
        
        // Check if track has hardcoded LRC
        if let lrc = track.lyricsLrc, !lrc.isEmpty {
            let lines = LrclibAPI.shared.parseLRC(lrc)
            self.lyrics = LyricsResult(synced: lines, plain: nil, isInstrumental: false)
            return
        }
        
        Task {
            let res = await LrclibAPI.shared.fetchLyrics(
                trackTitle: track.title,
                artistName: track.artist,
                albumName: track.album,
                duration: track.duration
            )
            if self.currentTrack?.id == track.id {
                self.lyrics = res
            }
        }
    }
    
    private func updateCurrentLyricIndex(currentTimeSeconds: TimeInterval) {
        guard !lyrics.synced.isEmpty else {
            currentLyricIndex = nil
            return
        }
        
        let targetMs = Int(currentTimeSeconds * 1000)
        var activeIdx: Int? = nil
        
        for (idx, line) in lyrics.synced.enumerated() {
            if line.timeMs <= targetMs {
                activeIdx = idx
            } else {
                break
            }
        }
        
        if self.currentLyricIndex != activeIdx {
            self.currentLyricIndex = activeIdx
        }
    }
    
    // MARK: - Last.fm Scrobble & Now Playing
    
    private func updateLastFmNowPlaying() {
        guard let track = currentTrack else { return }
        Task {
            _ = await LastFmService.shared.updateNowPlaying(track: track.title, artist: track.artist, album: track.album)
        }
    }
    
    private func submitLastFmScrobble() {
        guard let track = currentTrack else { return }
        let timestamp = Int(Date().timeIntervalSince1970)
        Task {
            _ = await LastFmService.shared.scrobble(track: track.title, artist: track.artist, timestamp: timestamp, album: track.album)
        }
    }
    
    // MARK: - Now Playing Info Center
    
    private func updateNowPlaying(artworkImage: UIImage? = nil) {
        nowPlayingManager.updateNowPlayingInfo(
            track: currentTrack,
            currentTime: currentTime,
            duration: duration > 0 ? duration : (currentTrack?.duration ?? 0),
            isPlaying: isPlaying,
            artworkImage: artworkImage
        )
    }
    
    private func loadArtworkForNowPlaying(urlStr: String?) {
        guard let urlStr = urlStr, let url = URL(string: urlStr) else { return }
        Task {
            if let (data, _) = try? await URLSession.shared.data(from: url),
               let image = UIImage(data: data) {
                self.updateNowPlaying(artworkImage: image)
            }
        }
    }
    
    // MARK: - Callbacks Setup
    
    private func setupRemoteCommandHandlers() {
        nowPlayingManager.onPlay = { [weak self] in self?.resume() }
        nowPlayingManager.onPause = { [weak self] in self?.pause() }
        nowPlayingManager.onTogglePlayPause = { [weak self] in self?.togglePlayPause() }
        nowPlayingManager.onNextTrack = { [weak self] in self?.next() }
        nowPlayingManager.onPreviousTrack = { [weak self] in self?.previous() }
        nowPlayingManager.onSeek = { [weak self] time in self?.seek(to: time) }
    }
    
    private func setupAudioSessionCallbacks() {
        audioSessionManager.onInterruption = { [weak self] began, shouldResume in
            if began {
                self?.pause()
            } else if shouldResume {
                self?.resume()
            }
        }
        
        audioSessionManager.onHeadphonesDisconnected = { [weak self] in
            self?.pause()
        }
    }
    
    private func restorePersistedQueue() {
        let recents = storage.getRecentTracks()
        if let first = recents.first {
            self.currentTrack = first
            self.queue = recents
            self.duration = first.duration
        } else {
            self.queue = ClashflacAPI.curatedTracks
            self.currentTrack = ClashflacAPI.curatedTracks.first
            self.duration = self.currentTrack?.duration ?? 200
        }
    }
}
