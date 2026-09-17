import SwiftUI
import MediaPlayer

public struct NowPlayingView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    @ObservedObject private var downloadManager = DownloadManager.shared
    @Environment(\.dismiss) private var dismiss
    
    @State private var showingLyrics: Bool = false
    @State private var showingQueue: Bool = false
    @State private var showingEqualizer: Bool = false
    @State private var showingLosslessInfo: Bool = false
    @State private var isDraggingScrubber: Bool = false
    @State private var scrubTime: TimeInterval = 0.0
    
    public init() {}
    
    private var isLiked: Bool {
        guard let track = playback.currentTrack else { return false }
        return KairaStorage.shared.getLikedTracks().contains(where: { $0.id == track.id })
    }
    
    public var body: some View {
        ZStack {
            // Fluid Background Canvas
            Color(red: 0.04, green: 0.04, blue: 0.06)
                .ignoresSafeArea()
            
            // Atmospheric Glow from Artwork
            if let track = playback.currentTrack, let artwork = track.artworkUrl {
                CachedAsyncImage(url: URL(string: artwork), cornerRadius: 0)
                    .blur(radius: 80)
                    .opacity(0.35)
                    .scaleEffect(1.4)
                    .ignoresSafeArea()
            }
            
            // Main Content
            VStack(spacing: 0) {
                // Top Navigation Bar
                HStack {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "chevron.down")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.white.opacity(0.8))
                            .frame(width: 44, height: 44)
                    }
                    
                    Spacer()
                    
                    VStack(spacing: 2) {
                        Text("PLAYING FROM")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                        Text(playback.currentTrack?.album ?? "Studio Master")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.white.opacity(0.9))
                            .lineLimit(1)
                    }
                    
                    Spacer()
                    
                    Button {
                        showingLosslessInfo = true
                    } label: {
                        Image(systemName: "info.circle")
                            .font(.system(size: 18))
                            .foregroundColor(.white.opacity(0.8))
                            .frame(width: 44, height: 44)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                
                Spacer(minLength: 12)
                
                // Center Area: Artwork OR Lyrics
                if showingLyrics {
                    LyricsView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    // Artwork Card
                    GeometryReader { geo in
                        let cardSize = min(geo.size.width - 48, geo.size.height - 24)
                        VStack {
                            Spacer()
                            CachedAsyncImage(
                                url: URL(string: playback.currentTrack?.artworkUrl ?? ""),
                                placeholder: Image(systemName: "music.note"),
                                cornerRadius: 20
                            )
                            .frame(width: cardSize, height: cardSize)
                            .shadow(color: .black.opacity(0.6), radius: 24, x: 0, y: 12)
                            .scaleEffect(playback.isPlaying ? 1.0 : 0.92)
                            .animation(.spring(response: 0.4, dampingFraction: 0.7), value: playback.isPlaying)
                            Spacer()
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    }
                    .padding(.vertical, 8)
                }
                
                Spacer(minLength: 12)
                
                // Track Metadata & Heart Button
                HStack(alignment: .center) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(playback.currentTrack?.title ?? "No Track")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(.white)
                            .lineLimit(1)
                        
                        Text(playback.currentTrack?.artist ?? "Kaira Music")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.gray)
                            .lineLimit(1)
                    }
                    
                    Spacer()
                    
                    // Favorite / Heart Button
                    Button {
                        guard let track = playback.currentTrack else { return }
                        var liked = KairaStorage.shared.getLikedTracks()
                        if liked.contains(where: { $0.id == track.id }) {
                            liked.removeAll { $0.id == track.id }
                            Task { _ = await LastFmService.shared.unloveTrack(track: track.title, artist: track.artist) }
                        } else {
                            liked.insert(track, at: 0)
                            Task { _ = await LastFmService.shared.loveTrack(track: track.title, artist: track.artist) }
                        }
                        KairaStorage.shared.saveLikedTracks(liked)
                        HapticFeedback.playImpact(style: .light)
                    } label: {
                        Image(systemName: isLiked ? "heart.fill" : "heart")
                            .font(.system(size: 24))
                            .foregroundColor(isLiked ? .red : .gray)
                            .frame(width: 44, height: 44)
                    }
                }
                .padding(.horizontal, 24)
                
                // Audio Quality Badge Button
                if let track = playback.currentTrack {
                    HStack {
                        Button {
                            showingLosslessInfo = true
                        } label: {
                            HStack(spacing: 6) {
                                QualityBadgeView(quality: track.quality)
                                Text(track.audioSpecDescription)
                                    .font(.system(size: 11, weight: .medium, design: .monospaced))
                                    .foregroundColor(.gray)
                            }
                        }
                        .buttonStyle(.plain)
                        
                        Spacer()
                    }
                    .padding(.horizontal, 24)
                    .padding(.top, 6)
                }
                
                // Scrubber Slider
                VStack(spacing: 6) {
                    GeometryReader { geo in
                        let effectiveTime = isDraggingScrubber ? scrubTime : playback.currentTime
                        let progress = playback.duration > 0 ? effectiveTime / playback.duration : 0.0
                        
                        ZStack(alignment: .leading) {
                            Capsule()
                                .fill(Color.white.opacity(0.18))
                                .frame(height: 4)
                            
                            Capsule()
                                .fill(Color.white)
                                .frame(width: max(0, min(geo.size.width * CGFloat(progress), geo.size.width)), height: 4)
                            
                            Circle()
                                .fill(Color.white)
                                .frame(width: isDraggingScrubber ? 16 : 10, height: isDraggingScrubber ? 16 : 10)
                                .shadow(color: .black.opacity(0.4), radius: 4)
                                .position(x: max(8, min(geo.size.width * CGFloat(progress), geo.size.width - 8)), y: 2)
                        }
                        .frame(maxHeight: .infinity)
                        .contentShape(Rectangle())
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { g in
                                    isDraggingScrubber = true
                                    let percent = min(max(g.location.x / geo.size.width, 0), 1)
                                    scrubTime = Double(percent) * playback.duration
                                }
                                .onEnded { g in
                                    let percent = min(max(g.location.x / geo.size.width, 0), 1)
                                    let finalTime = Double(percent) * playback.duration
                                    playback.seek(to: finalTime)
                                    isDraggingScrubber = false
                                }
                        )
                    }
                    .frame(height: 20)
                    
                    // Timestamps
                    HStack {
                        let cur = isDraggingScrubber ? scrubTime : playback.currentTime
                        Text(TimeFormatter.formatDuration(cur))
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundColor(.gray)
                        
                        Spacer()
                        
                        let rem = max(0, playback.duration - cur)
                        Text("-\(TimeFormatter.formatDuration(rem))")
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 14)
                
                // Transport Playback Controls
                HStack(spacing: 28) {
                    // Shuffle
                    Button {
                        playback.toggleShuffle()
                    } label: {
                        Image(systemName: "shuffle")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(playback.isShuffleEnabled ? .yellow : .gray.opacity(0.8))
                            .frame(width: 40, height: 40)
                    }
                    
                    // Previous
                    Button {
                        playback.previous()
                    } label: {
                        Image(systemName: "backward.fill")
                            .font(.system(size: 26))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                    }
                    
                    // Big Play/Pause
                    Button {
                        playback.togglePlayPause()
                    } label: {
                        ZStack {
                            Circle()
                                .fill(Color.white)
                                .frame(width: 68, height: 68)
                            
                            Image(systemName: playback.isPlaying ? "pause.fill" : "play.fill")
                                .font(.system(size: 28))
                                .foregroundColor(.black)
                                .offset(x: playback.isPlaying ? 0 : 2)
                        }
                    }
                    .buttonStyle(.plain)
                    
                    // Next
                    Button {
                        playback.next()
                    } label: {
                        Image(systemName: "forward.fill")
                            .font(.system(size: 26))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                    }
                    
                    // Repeat
                    Button {
                        playback.toggleRepeat()
                    } label: {
                        Image(systemName: playback.repeatMode.iconName)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(playback.repeatMode != .off ? .yellow : .gray.opacity(0.8))
                            .frame(width: 40, height: 40)
                    }
                }
                .padding(.vertical, 16)
                
                // Bottom Utility Row: AirPlay, Lyrics, EQ, Queue
                HStack(spacing: 36) {
                    // AirPlay
                    AirPlayView()
                        .frame(width: 32, height: 32)
                    
                    // Synchronized Lyrics
                    Button {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                            showingLyrics.toggle()
                        }
                        HapticFeedback.playSelection()
                    } label: {
                        Image(systemName: "quote.bubble")
                            .font(.system(size: 20))
                            .foregroundColor(showingLyrics ? .yellow : .white.opacity(0.7))
                    }
                    
                    // Equalizer
                    Button {
                        showingEqualizer = true
                    } label: {
                        Image(systemName: "slider.vertical.3")
                            .font(.system(size: 20))
                            .foregroundColor(.white.opacity(0.7))
                    }
                    
                    // Queue
                    Button {
                        showingQueue = true
                    } label: {
                        Image(systemName: "list.bullet")
                            .font(.system(size: 20))
                            .foregroundColor(.white.opacity(0.7))
                    }
                }
                .padding(.top, 8)
                .padding(.bottom, 24)
            }
        }
        .preferredColorScheme(.dark)
        .sheet(isPresented: $showingQueue) {
            QueueView()
        }
        .sheet(isPresented: $showingEqualizer) {
            EqualizerSheetView()
        }
        .sheet(isPresented: $showingLosslessInfo) {
            LosslessInfoSheetView(track: playback.currentTrack)
        }
    }
}

// Lossless Technical Info Sheet
struct LosslessInfoSheetView: View {
    let track: AudioTrack?
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationStack {
            List {
                Section("Master Quality") {
                    HStack {
                        Text("Quality Tier")
                        Spacer()
                        Text(track?.quality.badgeTitle ?? "Lossless")
                            .foregroundColor(.yellow)
                            .bold()
                    }
                    HStack {
                        Text("Audio Codec")
                        Spacer()
                        Text(track?.codec ?? "FLAC")
                            .foregroundColor(.gray)
                    }
                    HStack {
                        Text("Sample Rate")
                        Spacer()
                        Text("\(Int((track?.sampleRate ?? 192000) / 1000)) kHz")
                            .foregroundColor(.gray)
                    }
                    HStack {
                        Text("Bit Depth")
                        Spacer()
                        Text("\(track?.bitDepth ?? 24)-bit Studio Master")
                            .foregroundColor(.gray)
                    }
                }
                
                Section("Audio Signal Path") {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text("Bit-Perfect Native Decoding")
                                .font(.subheadline)
                        }
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text("AVAudioSession Long-Form Audio Policy")
                                .font(.subheadline)
                        }
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text("Hardware DAC High-Res Output (up to 192 kHz)")
                                .font(.subheadline)
                        }
                    }
                    .padding(.vertical, 4)
                }
            }
            .background(Color(red: 0.05, green: 0.05, blue: 0.07))
            .scrollContentBackground(.hidden)
            .navigationTitle("Lossless Audio Specs")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .foregroundColor(.yellow)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}
