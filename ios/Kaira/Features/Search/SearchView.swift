import SwiftUI

public struct SearchView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    @State private var searchText = ""
    @State private var selectedScope = 0 // 0: Tracks, 1: Artists, 2: Albums
    @State private var suggestions: [String] = []
    @State private var tracks: [AudioTrack] = []
    @State private var artists: [MusicArtist] = []
    @State private var albums: [MusicAlbum] = []
    @State private var isSearching = false
    @State private var searchTask: Task<Void, Never>? = nil
    
    @State private var selectedArtist: MusicArtist? = nil
    @State private var selectedAlbum: MusicAlbum? = nil
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search Input Field
                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    
                    TextField("Tracks, artists, albums, or lyrics...", text: $searchText)
                        .foregroundColor(.white)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                        .onChange(of: searchText) { newValue in
                            performSearch(query: newValue)
                        }
                    
                    if !searchText.isEmpty {
                        Button {
                            searchText = ""
                            suggestions = []
                            tracks = []
                            artists = []
                            albums = []
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.gray)
                        }
                    }
                }
                .padding(12)
                .background(Color(red: 0.10, green: 0.10, blue: 0.13))
                .cornerRadius(12)
                .padding(.horizontal, 20)
                .padding(.top, 10)
                
                // Scope Filter (when search text entered)
                if !searchText.isEmpty {
                    Picker("Scope", selection: $selectedScope) {
                        Text("Tracks").tag(0)
                        Text("Artists").tag(1)
                        Text("Albums").tag(2)
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal, 20)
                    .padding(.top, 12)
                }
                
                // Content Area
                if isSearching {
                    VStack(spacing: 12) {
                        Spacer()
                        ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .yellow))
                        Text("Searching lossless catalog...")
                            .font(.system(size: 13))
                            .foregroundColor(.gray)
                        Spacer()
                    }
                } else if searchText.isEmpty {
                    // Empty State / Trending Searches
                    ScrollView {
                        VStack(alignment: .leading, spacing: 20) {
                            Text("Trending Searches")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 20)
                                .padding(.top, 16)
                            
                            let trending = ["Olivia Rodrigo", "vampire", "Billie Eilish", "LUNCH", "Radiohead", "Karma Police", "Charli xcx", "360", "The Weeknd"]
                            FlowLayout(spacing: 8) {
                                ForEach(trending, id: \.self) { term in
                                    Button {
                                        searchText = term
                                        performSearch(query: term)
                                    } label: {
                                        Text(term)
                                            .font(.system(size: 13))
                                            .foregroundColor(.white)
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 8)
                                            .background(Color(white: 0.12))
                                            .cornerRadius(16)
                                    }
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                        .padding(.bottom, 90)
                    }
                } else {
                    // Search Results List
                    ScrollView {
                        VStack(spacing: 6) {
                            // Suggestions Row if available
                            if !suggestions.isEmpty && tracks.isEmpty {
                                ForEach(suggestions, id: \.self) { sugg in
                                    Button {
                                        searchText = sugg
                                        performSearch(query: sugg)
                                    } label: {
                                        HStack {
                                            Image(systemName: "magnifyingglass")
                                                .foregroundColor(.gray)
                                            Text(sugg)
                                                .foregroundColor(.white)
                                            Spacer()
                                        }
                                        .padding(.horizontal, 20)
                                        .padding(.vertical, 10)
                                    }
                                }
                            }
                            
                            // Tracks Scope
                            if selectedScope == 0 {
                                ForEach(tracks) { track in
                                    TrackRowView(track: track) {
                                        playback.play(track: track, newQueue: tracks)
                                    }
                                    .padding(.horizontal, 20)
                                }
                            } else if selectedScope == 1 {
                                ForEach(artists) { artist in
                                    Button {
                                        selectedArtist = artist
                                    } label: {
                                        HStack(spacing: 14) {
                                            CachedAsyncImage(
                                                url: URL(string: artist.artworkUrl ?? ""),
                                                placeholder: Image(systemName: "person.circle.fill"),
                                                cornerRadius: 26
                                            )
                                            .frame(width: 52, height: 52)
                                            .clipShape(Circle())
                                            
                                            VStack(alignment: .leading, spacing: 3) {
                                                Text(artist.name)
                                                    .font(.system(size: 16, weight: .semibold))
                                                    .foregroundColor(.white)
                                                Text(artist.genres?.first ?? "Artist")
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
                            } else if selectedScope == 2 {
                                ForEach(albums) { album in
                                    Button {
                                        selectedAlbum = album
                                    } label: {
                                        HStack(spacing: 14) {
                                            CachedAsyncImage(
                                                url: URL(string: album.artworkUrl ?? ""),
                                                cornerRadius: 8
                                            )
                                            .frame(width: 52, height: 52)
                                            
                                            VStack(alignment: .leading, spacing: 3) {
                                                Text(album.title)
                                                    .font(.system(size: 16, weight: .semibold))
                                                    .foregroundColor(.white)
                                                    .lineLimit(1)
                                                Text("\(album.artist) • \(album.releaseYear)")
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
                        .padding(.top, 14)
                        .padding(.bottom, 90)
                    }
                }
            }
            .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.inline)
            .navigationDestination(item: $selectedArtist) { artist in
                ArtistDetailView(artist: artist)
            }
            .navigationDestination(item: $selectedAlbum) { album in
                AlbumDetailView(album: album)
            }
        }
        .preferredColorScheme(.dark)
    }
    
    private func performSearch(query: String) {
        searchTask?.cancel()
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else {
            isSearching = false
            tracks = []
            artists = []
            albums = []
            suggestions = []
            return
        }
        
        searchTask = Task {
            try? await Task.sleep(nanoseconds: 250_000_000) // 250ms debounce
            guard !Task.isCancelled else { return }
            
            await MainActor.run { isSearching = true }
            
            async let sTracks = MusicService.shared.searchTracks(query: trimmed, limit: 25)
            async let sArtists = MusicService.shared.searchArtists(query: trimmed, limit: 12)
            async let sAlbums = MusicService.shared.searchAlbums(query: trimmed, limit: 12)
            async let sSuggs = MusicService.shared.getSearchSuggestions(query: trimmed)
            
            let (tr, ar, al, su) = await (sTracks, sArtists, sAlbums, sSuggs)
            
            guard !Task.isCancelled else { return }
            await MainActor.run {
                self.tracks = tr
                self.artists = ar
                self.albums = al
                self.suggestions = su
                self.isSearching = false
            }
        }
    }
}

// FlowLayout for pill chips
struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let width = proposal.width ?? 320
        var height: CGFloat = 0
        var currentX: CGFloat = 0
        var currentY: CGFloat = 0
        var maxHeightInRow: CGFloat = 0
        
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if currentX + size.width > width {
                currentX = 0
                currentY += maxHeightInRow + spacing
                maxHeightInRow = 0
            }
            currentX += size.width + spacing
            maxHeightInRow = max(maxHeightInRow, size.height)
            height = max(height, currentY + maxHeightInRow)
        }
        return CGSize(width: width, height: height)
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var currentX: CGFloat = bounds.minX
        var currentY: CGFloat = bounds.minY
        var maxHeightInRow: CGFloat = 0
        
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if currentX + size.width > bounds.maxX {
                currentX = bounds.minX
                currentY += maxHeightInRow + spacing
                maxHeightInRow = 0
            }
            subview.place(at: CGPoint(x: currentX, y: currentY), proposal: .unspecified)
            currentX += size.width + spacing
            maxHeightInRow = max(maxHeightInRow, size.height)
        }
    }
}
