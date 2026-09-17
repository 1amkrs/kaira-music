import SwiftUI

public struct TrackRowView: View {
    let track: AudioTrack
    var index: Int? = nil
    var showArtwork: Bool = true
    var onTap: () -> Void
    
    @ObservedObject private var playbackEngine = PlaybackEngine.shared
    @ObservedObject private var downloadManager = DownloadManager.shared
    @State private var showingPlaylistPicker = false
    
    public init(
        track: AudioTrack,
        index: Int? = nil,
        showArtwork: Bool = true,
        onTap: @escaping () -> Void
    ) {
        self.track = track
        self.index = index
        self.showArtwork = showArtwork
        self.onTap = onTap
    }
    
    private var isCurrentTrack: Bool {
        playbackEngine.currentTrack?.id == track.id
    }
    
    private var isDownloaded: Bool {
        downloadManager.isDownloaded(trackId: track.id)
    }
    
    private var isDownloading: Bool {
        downloadManager.isDownloading(trackId: track.id)
    }
    
    private var downloadProgress: Double {
        downloadManager.progress(for: track.id)
    }
    
    public var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                // Index or Equalizer animation
                if let index = index {
                    if isCurrentTrack && playbackEngine.isPlaying {
                        Image(systemName: "waveform")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.yellow)
                            .frame(width: 24)
                    } else {
                        Text("\(index)")
                            .font(.system(size: 14, weight: .medium, design: .monospaced))
                            .foregroundColor(.gray)
                            .frame(width: 24)
                    }
                }
                
                // Artwork thumbnail
                if showArtwork {
                    CachedAsyncImage(
                        url: URL(string: track.artworkUrl ?? ""),
                        cornerRadius: 8
                    )
                    .frame(width: 48, height: 48)
                }
                
                // Title and Artist
                VStack(alignment: .leading, spacing: 3) {
                    Text(track.title)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(isCurrentTrack ? .yellow : .white)
                        .lineLimit(1)
                    
                    HStack(spacing: 6) {
                        Text(track.artist)
                            .font(.system(size: 13))
                            .foregroundColor(.gray)
                            .lineLimit(1)
                        
                        Text("•")
                            .font(.system(size: 10))
                            .foregroundColor(.gray.opacity(0.6))
                        
                        Text(TimeFormatter.formatDuration(track.duration))
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundColor(.gray)
                    }
                }
                
                Spacer()
                
                // Quality Badge
                QualityBadgeView(quality: track.quality, compact: true)
                
                // Download Indicator
                if isDownloading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .yellow))
                        .scaleEffect(0.7)
                        .frame(width: 24, height: 24)
                } else if isDownloaded {
                    Image(systemName: "arrow.down.circle.fill")
                        .font(.system(size: 16))
                        .foregroundColor(.green.opacity(0.8))
                        .frame(width: 24, height: 24)
                }
                
                // Options Menu
                Menu {
                    Button {
                        playbackEngine.playNext(track: track)
                    } label: {
                        Label("Play Next", systemImage: "text.insert")
                    }
                    
                    Button {
                        playbackEngine.appendToQueue(track: track)
                    } label: {
                        Label("Add to Queue", systemImage: "text.append")
                    }
                    
                    if isDownloaded {
                        Button(role: .destructive) {
                            downloadManager.deleteDownload(trackId: track.id)
                        } label: {
                            Label("Remove Download", systemImage: "trash")
                        }
                    } else {
                        Button {
                            downloadManager.downloadTrack(track)
                        } label: {
                            Label("Download Lossless", systemImage: "arrow.down.circle")
                        }
                    }
                    
                    Button {
                        showingPlaylistPicker = true
                    } label: {
                        Label("Add to Playlist", systemImage: "plus.circle")
                    }
                    
                    Button {
                        _ = KairaStorage.shared.getLikedTracks()
                        var liked = KairaStorage.shared.getLikedTracks()
                        if liked.contains(where: { $0.id == track.id }) {
                            liked.removeAll { $0.id == track.id }
                            Task { _ = await LastFmService.shared.unloveTrack(track: track.title, artist: track.artist) }
                        } else {
                            liked.insert(track, at: 0)
                            Task { _ = await LastFmService.shared.loveTrack(track: track.title, artist: track.artist) }
                        }
                        KairaStorage.shared.saveLikedTracks(liked)
                        HapticFeedback.playSelection()
                    } label: {
                        Label("Favorite / Love", systemImage: "heart")
                    }
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 15))
                        .foregroundColor(.gray)
                        .frame(width: 32, height: 32)
                }
            }
            .padding(.vertical, 4)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .sheet(isPresented: $showingPlaylistPicker) {
            PlaylistPickerSheet(track: track)
        }
    }
}

struct PlaylistPickerSheet: View {
    let track: AudioTrack
    @Environment(\.dismiss) private var dismiss
    @State private var playlists: [Playlist] = []
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(playlists) { pl in
                    Button {
                        var updated = pl
                        if !updated.tracks.contains(where: { $0.id == track.id }) {
                            updated.tracks.append(track)
                            var all = KairaStorage.shared.getPlaylists()
                            if let idx = all.firstIndex(where: { $0.id == pl.id }) {
                                all[idx] = updated
                                KairaStorage.shared.savePlaylists(all)
                            }
                        }
                        HapticFeedback.playNotification(type: .success)
                        dismiss()
                    } label: {
                        HStack {
                            Image(systemName: "music.note.list")
                                .foregroundColor(.yellow)
                            Text(pl.name)
                                .foregroundColor(.white)
                            Spacer()
                            Text("\(pl.tracks.count) tracks")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    }
                }
            }
            .background(Color(red: 0.05, green: 0.05, blue: 0.07))
            .scrollContentBackground(.hidden)
            .navigationTitle("Add to Playlist")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
            .onAppear {
                playlists = KairaStorage.shared.getPlaylists()
            }
        }
        .preferredColorScheme(.dark)
    }
}
