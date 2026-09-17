import SwiftUI

public struct MiniPlayerView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    var onTap: () -> Void
    
    public init(onTap: @escaping () -> Void) {
        self.onTap = onTap
    }
    
    public var body: some View {
        if let track = playback.currentTrack {
            VStack(spacing: 0) {
                // Hairline Progress Bar
                GeometryReader { geo in
                    let progress = playback.duration > 0 ? playback.currentTime / playback.duration : 0.0
                    ZStack(alignment: .leading) {
                        Rectangle()
                            .fill(Color.white.opacity(0.1))
                            .frame(height: 2)
                        
                        Rectangle()
                            .fill(Color.yellow)
                            .frame(width: max(0, min(geo.size.width * CGFloat(progress), geo.size.width)), height: 2)
                    }
                }
                .frame(height: 2)
                
                // Mini Player Content
                HStack(spacing: 12) {
                    CachedAsyncImage(
                        url: URL(string: track.artworkUrl ?? ""),
                        cornerRadius: 6
                    )
                    .frame(width: 44, height: 44)
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text(track.title)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                            .lineLimit(1)
                        
                        Text(track.artist)
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                            .lineLimit(1)
                    }
                    
                    Spacer()
                    
                    // Quality indicator
                    Text(track.quality.shortLabel)
                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                        .foregroundColor(.yellow)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.yellow.opacity(0.15))
                        .cornerRadius(4)
                    
                    // Play/Pause Button
                    Button {
                        playback.togglePlayPause()
                    } label: {
                        Image(systemName: playback.isPlaying ? "pause.fill" : "play.fill")
                            .font(.system(size: 18))
                            .foregroundColor(.white)
                            .frame(width: 36, height: 36)
                    }
                    .buttonStyle(.plain)
                    
                    // Next Button
                    Button {
                        playback.next()
                    } label: {
                        Image(systemName: "forward.fill")
                            .font(.system(size: 16))
                            .foregroundColor(.gray)
                            .frame(width: 36, height: 36)
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color(red: 0.10, green: 0.10, blue: 0.13))
                        .shadow(color: .black.opacity(0.5), radius: 10, x: 0, y: 5)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .stroke(Color.white.opacity(0.08), lineWidth: 1)
                )
                .padding(.horizontal, 10)
                .padding(.bottom, 4)
            }
            .contentShape(Rectangle())
            .onTapGesture {
                onTap()
            }
            .gesture(
                DragGesture(minimumDistance: 30)
                    .onEnded { value in
                        if value.translation.width < -50 {
                            playback.next()
                        } else if value.translation.width > 50 {
                            playback.previous()
                        }
                    }
            )
        }
    }
}
