import SwiftUI

public struct ArtistDetailView: View {
    let artist: MusicArtist
    @ObservedObject private var playback = PlaybackEngine.shared
    @State private var detailedArtist: MusicArtist? = nil
    @State private var isLoading = true
    @State private var selectedAlbum: MusicAlbum? = nil
    
    public init(artist: MusicArtist) {
        self.artist = artist
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 24) {
                // Hero Header
                ZStack(alignment: .bottomLeading) {
                    CachedAsyncImage(
                        url: URL(string: detailedArtist?.artworkUrl ?? artist.artworkUrl ?? ""),
                        placeholder: Image(systemName: "person.fill"),
                        cornerRadius: 0
                    )
                    .frame(height: 280)
                    .frame(maxWidth: .infinity)
                    .overlay(
                        LinearGradient(
                            colors: [.clear, Color(red: 0.04, green: 0.04, blue: 0.06)],
                            startPoint: .center,
                            endPoint: .bottom
                        )
                    )
                    
                    VStack(alignment: .leading, spacing: 6) {
                        Text(artist.name)
                            .font(.system(size: 32, weight: .bold))
                            .foregroundColor(.white)
                        
                        if let followers = detailedArtist?.followers ?? artist.followers {
                            Text("\(followers) fans • Studio Master Catalog")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(.gray)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 16)
                }
                
                // Action Buttons: Play All & Shuffle
                HStack(spacing: 12) {
                    Button {
                        if let tracks = detailedArtist?.popularTracks, let first = tracks.first {
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
                        if let tracks = detailedArtist?.popularTracks, let random = tracks.randomElement() {
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
                }
                .padding(.horizontal, 20)
                
                // Popular Tracks
                VStack(alignment: .leading, spacing: 14) {
                    Text("Top Master Tracks")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 20)
                    
                    if isLoading {
                        ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .yellow))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 20)
                    } else if let tracks = detailedArtist?.popularTracks, !tracks.isEmpty {
                        VStack(spacing: 4) {
                            ForEach(tracks.indices, id: \.self) { idx in
                                let track = tracks[idx]
                                TrackRowView(track: track, index: idx + 1) {
                                    playback.play(track: track, newQueue: tracks)
                                }
                                .padding(.horizontal, 20)
                            }
                        }
                    }
                }
                
                // Discography / Albums
                if let albums = detailedArtist?.albums, !albums.isEmpty {
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Albums & Discography")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                ForEach(albums) { album in
                                    AlbumCardView(album: album) {
                                        selectedAlbum = album
                                    }
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                    }
                }
                
                // About / Bio
                if let bio = detailedArtist?.bio ?? artist.bio {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("About")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                        
                        Text(bio)
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                            .lineSpacing(4)
                    }
                    .padding(20)
                    .background(Color(white: 0.08))
                    .cornerRadius(16)
                    .padding(.horizontal, 20)
                }
            }
            .padding(.bottom, 90)
        }
        .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(item: $selectedAlbum) { album in
            AlbumDetailView(album: album)
        }
        .task {
            let details = await MusicService.shared.getArtistDetails(artistName: artist.name)
            await MainActor.run {
                self.detailedArtist = details
                self.isLoading = false
            }
        }
    }
}
