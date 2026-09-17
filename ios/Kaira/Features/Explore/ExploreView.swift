import SwiftUI

public struct ExploreView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    @State private var selectedGenre: GenreDNA? = nil
    @State private var genreTracks: [AudioTrack] = []
    @State private var isLoadingGenreTracks = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 26) {
                    // Header
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Explore & Discover")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.white)
                        Text("Discover by Genre DNA, acoustic profile, and curated sonic spaces.")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 12)
                    
                    // Genre DNA Bento Grid
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Genre DNA")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                        
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                            ForEach(RecommendationEngine.genres) { genre in
                                Button {
                                    loadGenre(genre)
                                } label: {
                                    VStack(alignment: .leading, spacing: 12) {
                                        HStack {
                                            Image(systemName: genre.iconName)
                                                .font(.system(size: 22))
                                                .foregroundColor(.yellow)
                                            Spacer()
                                            Image(systemName: "arrow.up.right")
                                                .font(.system(size: 12, weight: .bold))
                                                .foregroundColor(.white.opacity(0.4))
                                        }
                                        
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(genre.name)
                                                .font(.system(size: 15, weight: .bold))
                                                .foregroundColor(.white)
                                                .multilineTextAlignment(.leading)
                                            
                                            Text(genre.artists.joined(separator: " • "))
                                                .font(.system(size: 11))
                                                .foregroundColor(.gray)
                                                .lineLimit(1)
                                        }
                                    }
                                    .padding(16)
                                    .frame(height: 120)
                                    .background(
                                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                                            .fill(Color(red: 0.08, green: 0.08, blue: 0.11))
                                    )
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                                            .stroke(Color.white.opacity(0.08), lineWidth: 1)
                                    )
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.horizontal, 20)
                    }
                    
                    // Taste Profile Card
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Acoustic Signature")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                        
                        VStack(alignment: .leading, spacing: 14) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Dynamic Range Preference")
                                        .font(.system(size: 15, weight: .semibold))
                                        .foregroundColor(.white)
                                    Text("Uncompressed 24-bit studio masters prioritized")
                                        .font(.system(size: 12))
                                        .foregroundColor(.gray)
                                }
                                Spacer()
                                Text("DR14")
                                    .font(.system(size: 14, weight: .bold, design: .monospaced))
                                    .foregroundColor(.yellow)
                            }
                            
                            HStack(spacing: 8) {
                                AcousticTag(text: "High Fidelity", icon: "waveform")
                                AcousticTag(text: "Hi-Res FLAC", icon: "sparkles")
                                AcousticTag(text: "Last.fm Synced", icon: "arrow.triangle.2.circlepath")
                            }
                        }
                        .padding(18)
                        .background(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .fill(Color(red: 0.08, green: 0.08, blue: 0.11))
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .stroke(Color.yellow.opacity(0.2), lineWidth: 1)
                        )
                        .padding(.horizontal, 20)
                    }
                }
                .padding(.bottom, 90)
            }
            .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
            .sheet(item: $selectedGenre) { genre in
                GenreDetailSheet(genre: genre, tracks: genreTracks, isLoading: isLoadingGenreTracks)
            }
        }
        .preferredColorScheme(.dark)
    }
    
    private func loadGenre(_ genre: GenreDNA) {
        selectedGenre = genre
        isLoadingGenreTracks = true
        Task {
            let tracks = await RecommendationEngine.shared.getTracksForGenre(genre)
            await MainActor.run {
                self.genreTracks = tracks
                self.isLoadingGenreTracks = false
            }
        }
    }
}

struct AcousticTag: View {
    let text: String
    let icon: String
    
    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 10))
            Text(text)
                .font(.system(size: 11, weight: .medium))
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .foregroundColor(.white.opacity(0.9))
        .background(Color.white.opacity(0.08))
        .cornerRadius(6)
    }
}

struct GenreDetailSheet: View {
    let genre: GenreDNA
    let tracks: [AudioTrack]
    let isLoading: Bool
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var playback = PlaybackEngine.shared
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(genre.name)
                            .font(.system(size: 26, weight: .bold))
                            .foregroundColor(.white)
                        Text(genre.description)
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                    }
                    .padding(.horizontal, 20)
                    
                    if !tracks.isEmpty {
                        Button {
                            if let first = tracks.first {
                                playback.play(track: first, newQueue: tracks)
                            }
                        } label: {
                            HStack {
                                Image(systemName: "play.fill")
                                Text("Play Genre Mix")
                                    .fontWeight(.bold)
                            }
                            .foregroundColor(.black)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.yellow)
                            .cornerRadius(12)
                        }
                        .padding(.horizontal, 20)
                    }
                    
                    if isLoading {
                        VStack(spacing: 12) {
                            ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .yellow))
                            Text("Loading lossless tracks...")
                                .font(.system(size: 13))
                                .foregroundColor(.gray)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 40)
                    } else {
                        VStack(spacing: 6) {
                            ForEach(tracks) { track in
                                TrackRowView(track: track) {
                                    playback.play(track: track, newQueue: tracks)
                                }
                                .padding(.horizontal, 20)
                            }
                        }
                    }
                }
                .padding(.vertical, 20)
            }
            .background(Color(red: 0.05, green: 0.05, blue: 0.07).ignoresSafeArea())
            .navigationTitle(genre.name)
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
