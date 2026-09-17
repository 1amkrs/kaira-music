import SwiftUI

public struct LyricsView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    
    public init() {}
    
    public var body: some View {
        ScrollViewReader { proxy in
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 22) {
                    if playback.lyrics.isInstrumental {
                        VStack(spacing: 12) {
                            Image(systemName: "guitars.fill")
                                .font(.system(size: 40))
                                .foregroundColor(.yellow.opacity(0.8))
                            Text("This track is an instrumental")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(.white)
                            Text("Enjoy the pristine lossless acoustic arrangement")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 80)
                    } else if playback.lyrics.hasSyncedLyrics {
                        ForEach(playback.lyrics.synced) { line in
                            let isCurrent = playback.currentLyricIndex == line.id
                            Button {
                                playback.seek(to: line.timeSeconds)
                                HapticFeedback.playSelection()
                            } label: {
                                Text(line.text)
                                    .font(.system(size: isCurrent ? 24 : 20, weight: isCurrent ? .bold : .medium))
                                    .foregroundColor(isCurrent ? .white : .gray.opacity(0.45))
                                    .multilineTextAlignment(.leading)
                                    .scaleEffect(isCurrent ? 1.02 : 1.0, anchor: .leading)
                                    .animation(.spring(response: 0.35, dampingFraction: 0.7), value: isCurrent)
                            }
                            .buttonStyle(.plain)
                            .id(line.id)
                        }
                    } else if let plain = playback.lyrics.plain, !plain.isEmpty {
                        Text(plain)
                            .font(.system(size: 18, weight: .regular))
                            .foregroundColor(.white.opacity(0.8))
                            .lineSpacing(10)
                            .padding(.vertical, 20)
                    } else {
                        VStack(spacing: 12) {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .yellow))
                            Text("Fetching synchronized lyrics...")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 80)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 32)
            }
            .onChange(of: playback.currentLyricIndex) { newIndex in
                if let idx = newIndex {
                    withAnimation(.easeInOut(duration: 0.4)) {
                        proxy.scrollTo(idx, anchor: .center)
                    }
                }
            }
        }
    }
}
