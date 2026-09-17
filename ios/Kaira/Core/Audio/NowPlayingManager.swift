import Foundation
import MediaPlayer
import UIKit

@MainActor
public final class NowPlayingManager {
    public static let shared = NowPlayingManager()
    
    public var onPlay: (() -> Void)?
    public var onPause: (() -> Void)?
    public var onTogglePlayPause: (() -> Void)?
    public var onNextTrack: (() -> Void)?
    public var onPreviousTrack: (() -> Void)?
    public var onSeek: ((TimeInterval) -> Void)?
    public var onLike: (() -> Void)?
    
    private init() {
        setupRemoteCommands()
    }
    
    private func setupRemoteCommands() {
        let center = MPRemoteCommandCenter.shared()
        
        center.playCommand.isEnabled = true
        center.playCommand.addTarget { [weak self] _ in
            self?.onPlay?()
            return .success
        }
        
        center.pauseCommand.isEnabled = true
        center.pauseCommand.addTarget { [weak self] _ in
            self?.onPause?()
            return .success
        }
        
        center.togglePlayPauseCommand.isEnabled = true
        center.togglePlayPauseCommand.addTarget { [weak self] _ in
            self?.onTogglePlayPause?()
            return .success
        }
        
        center.nextTrackCommand.isEnabled = true
        center.nextTrackCommand.addTarget { [weak self] _ in
            self?.onNextTrack?()
            return .success
        }
        
        center.previousTrackCommand.isEnabled = true
        center.previousTrackCommand.addTarget { [weak self] _ in
            self?.onPreviousTrack?()
            return .success
        }
        
        center.changePlaybackPositionCommand.isEnabled = true
        center.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let posEvent = event as? MPChangePlaybackPositionCommandEvent else {
                return .commandFailed
            }
            self?.onSeek?(posEvent.positionTime)
            return .success
        }
        
        center.likeCommand.isEnabled = true
        center.likeCommand.addTarget { [weak self] _ in
            self?.onLike?()
            return .success
        }
    }
    
    public func updateNowPlayingInfo(
        track: AudioTrack?,
        currentTime: TimeInterval,
        duration: TimeInterval,
        isPlaying: Bool,
        artworkImage: UIImage? = nil
    ) {
        guard let track = track else {
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
            return
        }
        
        var nowPlayingInfo: [String: Any] = [
            MPMediaItemPropertyTitle: track.title,
            MPMediaItemPropertyArtist: track.artist,
            MPMediaItemPropertyPlaybackDuration: duration > 0 ? duration : track.duration,
            MPNowPlayingInfoPropertyElapsedPlaybackTime: currentTime,
            MPNowPlayingInfoPropertyPlaybackRate: isPlaying ? 1.0 : 0.0
        ]
        
        if let album = track.album, !album.isEmpty {
            nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = album
        }
        
        if let artwork = artworkImage {
            let mpArtwork = MPMediaItemArtwork(boundsSize: artwork.size) { _ in artwork }
            nowPlayingInfo[MPMediaItemPropertyArtwork] = mpArtwork
        }
        
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }
}
