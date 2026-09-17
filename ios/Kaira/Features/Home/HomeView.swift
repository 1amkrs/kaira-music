import SwiftUI

public struct HomeView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    @State private var curatedTracks = ClashflacAPI.curatedTracks
    @State private var curatedAlbums = MusicService.curatedAlbums
    @State private var curatedArtists = MusicService.curatedArtists
    @State private var selectedAlbum: MusicAlbum? = nil
    @State private var selectedArtist: MusicArtist? = nil
    
    public init() {}
    
    private var greetingText: String {
        let hour = Calendar.current.component(.hour, from: Date())
        if hour < 12 { return "Good Morning" }
        if hour < 18 { return "Good Afternoon" }
        return "Good Evening"
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 28) {
                    // Header Greeting
                    VStack(alignment: .leading, spacing: 4) {
                        Text(greetingText)
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.white)
                        Text("Stream in bit-perfect 24-bit studio master lossless.")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 12)
                    
                    // Start Mix Hero Card
                    if let featured = curatedTracks.first {
                        Button {
                            playback.play(track: featured, newQueue: curatedTracks)
                        } label: {
                            ZStack(alignment: .bottomLeading) {
                                CachedAsyncImage(
                                    url: URL(string: featured.artworkUrl ?? ""),
                                    placeholder: Image(systemName: "music.note"),
                                    cornerRadius: 18
                                )
                                .frame(height: 180)
                                .frame(maxWidth: .infinity)
                                .overlay(
                                    LinearGradient(
                                        colors: [.clear, .black.opacity(0.85)],
                                        startPoint: .top,
                                        endPoint: .bottom
                                    )
                                    .cornerRadius(18)
                                )
                                
                                VStack(alignment: .leading, spacing: 6) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "sparkles")
                                            .font(.system(size: 12))
                                        Text("STUDIO MASTER MIX")
                                            .font(.system(size: 11, weight: .bold, design: .monospaced))
                                    }
                                    .foregroundColor(.yellow)
                                    
                                    Text("Start Hi-Res Flow")
                                        .font(.system(size: 22, weight: .bold))
                                        .foregroundColor(.white)
                                    
                                    Text("Continuous playback tuned to your acoustic preferences")
                                        .font(.system(size: 13))
                                        .foregroundColor(.white.opacity(0.8))
                                        .lineLimit(1)
                                }
                                .padding(18)
                            }
                        }
                        .buttonStyle(.plain)
                        .padding(.horizontal, 20)
                    }
                    
                    // Curated Audiophile Tracks
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            Text("Audiophile Masterclass")
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(.white)
                            Spacer()
                            Text("24-BIT / 192k")
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundColor(.yellow)
                        }
                        .padding(.horizontal, 20)
                        
                        VStack(spacing: 6) {
                            ForEach(curatedTracks.prefix(5)) { track in
                                TrackRowView(track: track) {
                                    playback.play(track: track, newQueue: curatedTracks)
                                }
                                .padding(.horizontal, 20)
                            }
                        }
                    }
                    
                    // Trending Lossless Albums
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Trending Lossless Albums")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                ForEach(curatedAlbums) { album in
                                    AlbumCardView(album: album) {
                                        selectedAlbum = album
                                    }
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                    }
                    
                    // Featured Artists
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Featured Artists")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 18) {
                                ForEach(curatedArtists) { artist in
                                    ArtistCardView(artist: artist) {
                                        selectedArtist = artist
                                    }
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                    }
                    
                    // Recently Played
                    let recents = KairaStorage.shared.getRecentTracks()
                    if !recents.isEmpty {
                        VStack(alignment: .leading, spacing: 14) {
                            Text("Recently Played")
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 20)
                            
                            VStack(spacing: 6) {
                                ForEach(recents.prefix(5)) { track in
                                    TrackRowView(track: track) {
                                        playback.play(track: track)
                                    }
                                    .padding(.horizontal, 20)
                                }
                            }
                        }
                    }
                }
                .padding(.bottom, 90) // Room for mini player
            }
            .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
            .navigationDestination(item: $selectedAlbum) { album in
                AlbumDetailView(album: album)
            }
            .navigationDestination(item: $selectedArtist) { artist in
                ArtistDetailView(artist: artist)
            }
        }
        .preferredColorScheme(.dark)
    }
}
