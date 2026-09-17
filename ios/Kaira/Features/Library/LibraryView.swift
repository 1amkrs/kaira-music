import SwiftUI

public struct LibraryView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    @ObservedObject private var downloadManager = DownloadManager.shared
    @State private var selectedTab = 0 // 0: Liked, 1: Downloads, 2: Playlists, 3: History
    @State private var likedTracks: [AudioTrack] = []
    @State private var playlists: [Playlist] = []
    @State private var recentTracks: [AudioTrack] = []
    @State private var showingCreatePlaylist = false
    @State private var newPlaylistName = ""
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Segmented Tab Picker
                Picker("Library Category", selection: $selectedTab) {
                    Text("Liked").tag(0)
                    Text("Downloads").tag(1)
                    Text("Playlists").tag(2)
                    Text("History").tag(3)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 20)
                .padding(.top, 12)
                .padding(.bottom, 12)
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        // MARK: - Liked Songs
                        if selectedTab == 0 {
                            if likedTracks.isEmpty {
                                EmptyLibraryStateView(
                                    icon: "heart.slash",
                                    title: "No Liked Songs",
                                    subtitle: "Tap the heart on any track to save it here for quick playback."
                                )
                            } else {
                                HStack {
                                    Text("\(likedTracks.count) Saved Tracks")
                                        .font(.system(size: 14))
                                        .foregroundColor(.gray)
                                    Spacer()
                                    Button {
                                        if let first = likedTracks.first {
                                            playback.play(track: first, newQueue: likedTracks)
                                        }
                                    } label: {
                                        Label("Play All", systemImage: "play.fill")
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(.yellow)
                                    }
                                }
                                .padding(.horizontal, 20)
                                
                                VStack(spacing: 4) {
                                    ForEach(likedTracks) { track in
                                        TrackRowView(track: track) {
                                            playback.play(track: track, newQueue: likedTracks)
                                        }
                                        .padding(.horizontal, 20)
                                    }
                                }
                            }
                        }
                        
                        // MARK: - Offline Downloads
                        else if selectedTab == 1 {
                            VStack(alignment: .leading, spacing: 14) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Offline Storage")
                                            .font(.system(size: 16, weight: .semibold))
                                            .foregroundColor(.white)
                                        Text("\(downloadManager.downloads.count) tracks • \(downloadManager.formattedStorageUsed)")
                                            .font(.system(size: 13))
                                            .foregroundColor(.gray)
                                    }
                                    Spacer()
                                    if !downloadManager.downloads.isEmpty {
                                        Button(role: .destructive) {
                                            downloadManager.clearAllDownloads()
                                        } label: {
                                            Text("Clear All")
                                                .font(.system(size: 12, weight: .semibold))
                                                .foregroundColor(.red)
                                        }
                                    }
                                }
                                .padding(.horizontal, 20)
                                
                                if downloadManager.downloads.isEmpty {
                                    EmptyLibraryStateView(
                                        icon: "arrow.down.circle",
                                        title: "No Offline Downloads",
                                        subtitle: "Download tracks, albums, or playlists for offline studio master playback."
                                    )
                                } else {
                                    VStack(spacing: 4) {
                                        ForEach(downloadManager.downloads) { item in
                                            TrackRowView(track: item.track) {
                                                let downloadedTracks = downloadManager.downloads.map { $0.track }
                                                playback.play(track: item.track, newQueue: downloadedTracks)
                                            }
                                            .padding(.horizontal, 20)
                                        }
                                    }
                                }
                            }
                        }
                        
                        // MARK: - Playlists
                        else if selectedTab == 2 {
                            HStack {
                                Text("\(playlists.count) Custom Playlists")
                                    .font(.system(size: 14))
                                    .foregroundColor(.gray)
                                Spacer()
                                Button {
                                    showingCreatePlaylist = true
                                } label: {
                                    Label("New Playlist", systemImage: "plus")
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(.yellow)
                                }
                            }
                            .padding(.horizontal, 20)
                            
                            if playlists.isEmpty {
                                EmptyLibraryStateView(
                                    icon: "music.note.list",
                                    title: "No Playlists Yet",
                                    subtitle: "Create a playlist to organize your favorite lossless music."
                                )
                            } else {
                                ForEach(playlists) { pl in
                                    NavigationLink {
                                        PlaylistDetailView(playlist: pl)
                                    } label: {
                                        HStack(spacing: 14) {
                                            CachedAsyncImage(
                                                url: URL(string: pl.artworkUrl ?? ""),
                                                placeholder: Image(systemName: "music.note.list"),
                                                cornerRadius: 8
                                            )
                                            .frame(width: 54, height: 54)
                                            
                                            VStack(alignment: .leading, spacing: 3) {
                                                Text(pl.name)
                                                    .font(.system(size: 16, weight: .semibold))
                                                    .foregroundColor(.white)
                                                Text("\(pl.tracks.count) tracks")
                                                    .font(.system(size: 13))
                                                    .foregroundColor(.gray)
                                            }
                                            Spacer()
                                            Image(systemName: "chevron.right")
                                                .font(.system(size: 14))
                                                .foregroundColor(.gray)
                                        }
                                        .padding(.horizontal, 20)
                                        .padding(.vertical, 8)
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }
                        
                        // MARK: - History
                        else if selectedTab == 3 {
                            if recentTracks.isEmpty {
                                EmptyLibraryStateView(
                                    icon: "clock.arrow.circlepath",
                                    title: "No Playback History",
                                    subtitle: "Tracks you stream will automatically appear in your listening history."
                                )
                            } else {
                                VStack(spacing: 4) {
                                    ForEach(recentTracks) { track in
                                        TrackRowView(track: track) {
                                            playback.play(track: track, newQueue: recentTracks)
                                        }
                                        .padding(.horizontal, 20)
                                    }
                                }
                            }
                        }
                    }
                    .padding(.vertical, 10)
                    .padding(.bottom, 90)
                }
            }
            .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
            .navigationTitle("Your Library")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear {
                reloadLibrary()
            }
            .alert("Create Playlist", isPresented: $showingCreatePlaylist) {
                TextField("Playlist Name", text: $newPlaylistName)
                Button("Cancel", role: .cancel) {
                    newPlaylistName = ""
                }
                Button("Create") {
                    let trimmed = newPlaylistName.trimmingCharacters(in: .whitespaces)
                    if !trimmed.isEmpty {
                        var current = KairaStorage.shared.getPlaylists()
                        current.insert(Playlist(name: trimmed), at: 0)
                        KairaStorage.shared.savePlaylists(current)
                        reloadLibrary()
                    }
                    newPlaylistName = ""
                }
            }
        }
        .preferredColorScheme(.dark)
    }
    
    private func reloadLibrary() {
        likedTracks = KairaStorage.shared.getLikedTracks()
        playlists = KairaStorage.shared.getPlaylists()
        recentTracks = KairaStorage.shared.getRecentTracks()
    }
}

struct EmptyLibraryStateView: View {
    let icon: String
    let title: String
    let subtitle: String
    
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 44))
                .foregroundColor(.gray.opacity(0.5))
                .padding(.top, 40)
            
            Text(title)
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)
            
            Text(subtitle)
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 40)
    }
}

// Playlist Detail View
struct PlaylistDetailView: View {
    let playlist: Playlist
    @ObservedObject private var playback = PlaybackEngine.shared
    @State private var currentPlaylist: Playlist
    
    init(playlist: Playlist) {
        self.playlist = playlist
        self._currentPlaylist = State(initialValue: playlist)
    }
    
    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                VStack(spacing: 8) {
                    CachedAsyncImage(
                        url: URL(string: currentPlaylist.artworkUrl ?? ""),
                        placeholder: Image(systemName: "music.note.list"),
                        cornerRadius: 16
                    )
                    .frame(width: 180, height: 180)
                    .shadow(color: .black.opacity(0.5), radius: 14)
                    
                    Text(currentPlaylist.name)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text("\(currentPlaylist.tracks.count) tracks • \(TimeFormatter.formatDetailedDuration(currentPlaylist.totalDuration))")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 16)
                
                if !currentPlaylist.tracks.isEmpty {
                    Button {
                        if let first = currentPlaylist.tracks.first {
                            playback.play(track: first, newQueue: currentPlaylist.tracks)
                        }
                    } label: {
                        HStack {
                            Image(systemName: "play.fill")
                            Text("Play Playlist")
                                .fontWeight(.bold)
                        }
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.yellow)
                        .cornerRadius(12)
                    }
                    .padding(.horizontal, 20)
                    
                    VStack(spacing: 4) {
                        ForEach(currentPlaylist.tracks) { track in
                            TrackRowView(track: track) {
                                playback.play(track: track, newQueue: currentPlaylist.tracks)
                            }
                            .padding(.horizontal, 20)
                        }
                    }
                } else {
                    EmptyLibraryStateView(
                        icon: "music.note",
                        title: "Playlist is Empty",
                        subtitle: "Tap the options menu on any track and select 'Add to Playlist'."
                    )
                }
            }
            .padding(.bottom, 90)
        }
        .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
    }
}
