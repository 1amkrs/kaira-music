import SwiftUI

public struct AlbumDetailView: View {
    let album: MusicAlbum
    @ObservedObject private var playback = PlaybackEngine.shared
    @ObservedObject private var downloadManager = DownloadManager.shared
    @State private var detailedAlbum: MusicAlbum? = nil
    @State private var isLoading = true
    
    public init(album: MusicAlbum) {
        self.album = album
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                // Large Artwork
                CachedAsyncImage(
                    url: URL(string: detailedAlbum?.artworkUrl ?? album.artworkUrl ?? ""),
                    placeholder: Image(systemName: "opticaldisc"),
                    cornerRadius: 16
                )
                .frame(width: 220, height: 220)
                .shadow(color: .black.opacity(0.6), radius: 20, x: 0, y: 10)
                .padding(.top, 16)
                
                // Metadata
                VStack(spacing: 6) {
                    Text(album.title)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                    
                    Text(album.artist)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.yellow)
                    
                    HStack(spacing: 6) {
                        Text(album.releaseYear)
                        Text("•")
                        Text("\(detailedAlbum?.tracks?.count ?? album.trackCount ?? 0) tracks")
                        if let dur = detailedAlbum?.duration, dur > 0 {
                            Text("•")
                            Text(TimeFormatter.formatDetailedDuration(dur))
                        }
                    }
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
                    
                    QualityBadgeView(quality: .hiRes192)
                        .padding(.top, 4)
                }
                
                // Action Buttons: Play, Shuffle, Download
                HStack(spacing: 12) {
                    Button {
                        if let tracks = detailedAlbum?.tracks, let first = tracks.first {
                            playback.play(track: first, newQueue: tracks)
                        }
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "play.fill")
                            Text("Play")
                                .fontWeight(.bold)
                        }
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.yellow)
                        .cornerRadius(12)
                    }
                    
                    Button {
                        if let tracks = detailedAlbum?.tracks, let random = tracks.randomElement() {
                            playback.toggleShuffle()
                            playback.play(track: random, newQueue: tracks)
                        }
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "shuffle")
                            Text("Shuffle")
                                .fontWeight(.semibold)
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color(white: 0.16))
                        .cornerRadius(12)
                    }
                    
                    Button {
                        if let dAlbum = detailedAlbum {
                            downloadManager.downloadAlbum(dAlbum)
                            HapticFeedback.playNotification(type: .success)
                        }
                    } label: {
                        Image(systemName: "arrow.down.circle")
                            .font(.system(size: 20))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                            .background(Color(white: 0.16))
                            .cornerRadius(12)
                    }
                }
                .padding(.horizontal, 20)
                
                // Tracklist
                VStack(alignment: .leading, spacing: 10) {
                    Text("Tracks")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 20)
                    
                    if isLoading {
                        ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .yellow))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 20)
                    } else if let tracks = detailedAlbum?.tracks {
                        VStack(spacing: 4) {
                            ForEach(tracks.indices, id: \.self) { idx in
                                let track = tracks[idx]
                                TrackRowView(track: track, index: idx + 1, showArtwork: false) {
                                    playback.play(track: track, newQueue: tracks)
                                }
                                .padding(.horizontal, 20)
                            }
                        }
                    }
                }
            }
            .padding(.bottom, 90)
        }
        .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
        .task {
            let details = await MusicService.shared.getAlbumDetails(album: album)
            await MainActor.run {
                self.detailedAlbum = details
                self.isLoading = false
            }
        }
    }
}
