import Foundation

public final class MusicService: @unchecked Sendable {
    public static let shared = MusicService()
    
    private let apiClient = APIClient.shared
    
    // Curated Artists
    public static let curatedArtists: [MusicArtist] = [
        MusicArtist(
            id: "artist-the-weeknd",
            name: "The Weeknd",
            artworkUrl: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
            followers: "112.5M",
            genres: ["R&B", "Pop", "Synthwave", "Dark Wave"],
            bio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer known for his sonic versatility and dark lyricism."
        ),
        MusicArtist(
            id: "artist-billie-eilish",
            name: "Billie Eilish",
            artworkUrl: "https://i.scdn.co/image/ab6761610000e5ebd8b9980db6711a43a0d53c7c",
            followers: "98.2M",
            genres: ["Alt-Pop", "Electropop", "Indie"],
            bio: "Billie Eilish Pirate Baird O'Connell is an American singer and songwriter. She first gained public attention in 2015 with her debut single 'Ocean Eyes'."
        ),
        MusicArtist(
            id: "artist-olivia-rodrigo",
            name: "Olivia Rodrigo",
            artworkUrl: "https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6",
            followers: "42.1M",
            genres: ["Pop-Rock", "Alt-Pop", "Grunge Pop"],
            bio: "Olivia Isabel Rodrigo is an American singer-songwriter and actress known for her emotionally raw, critically acclaimed albums SOUR and GUTS."
        ),
        MusicArtist(
            id: "artist-charli-xcx",
            name: "Charli xcx",
            artworkUrl: "https://i.scdn.co/image/ab6761610000e5ebcfb227c2eb392f447f5cf535",
            followers: "14.8M",
            genres: ["Hyperpop", "Electropop", "Club"],
            bio: "Charlotte Emma Aitchison, known professionally as Charli xcx, is an English singer and songwriter who defined the cultural landscape of 2024 with BRAT."
        ),
        MusicArtist(
            id: "artist-sabrina-carpenter",
            name: "Sabrina Carpenter",
            artworkUrl: "https://i.scdn.co/image/ab6761610000e5eb66b5f4be89dd6ff546955a47",
            followers: "38.4M",
            genres: ["Pop", "Disco-Pop", "Nu-Disco"],
            bio: "Sabrina Annlynn Carpenter is an American singer and actress. She dominated 2024 global charts with her critically acclaimed sixth studio album Short n' Sweet."
        ),
        MusicArtist(
            id: "artist-kendrick-lamar",
            name: "Kendrick Lamar",
            artworkUrl: "https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022",
            followers: "32.1M",
            genres: ["Hip-Hop", "Conscious Rap", "West Coast"],
            bio: "Kendrick Lamar Duckworth is an American rapper and songwriter, widely regarded as one of the most influential hip hop artists of his generation."
        ),
        MusicArtist(
            id: "artist-radiohead",
            name: "Radiohead",
            artworkUrl: "https://i.scdn.co/image/ab6761610000e5eba03696716c9f605002041455",
            followers: "10.9M",
            genres: ["Art Rock", "Alternative", "Experimental"],
            bio: "Radiohead are an English rock band formed in Abingdon, Oxfordshire. Known for advancing the sound of rock with experimental electronic textures."
        )
    ]
    
    // Curated Albums
    public static let curatedAlbums: [MusicAlbum] = [
        MusicAlbum(
            id: "album-guts",
            title: "GUTS",
            artist: "Olivia Rodrigo",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d",
            releaseYear: "2023",
            trackCount: 12
        ),
        MusicAlbum(
            id: "album-hmhas",
            title: "HIT ME HARD AND SOFT",
            artist: "Billie Eilish",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62",
            releaseYear: "2024",
            trackCount: 10
        ),
        MusicAlbum(
            id: "album-after-hours",
            title: "After Hours",
            artist: "The Weeknd",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
            releaseYear: "2020",
            trackCount: 14
        ),
        MusicAlbum(
            id: "album-brat",
            title: "BRAT",
            artist: "Charli xcx",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273810cd044b7e88383ee7246b9",
            releaseYear: "2024",
            trackCount: 15
        ),
        MusicAlbum(
            id: "album-short-n-sweet",
            title: "Short n' Sweet",
            artist: "Sabrina Carpenter",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f628",
            releaseYear: "2024",
            trackCount: 12
        ),
        MusicAlbum(
            id: "album-damn",
            title: "DAMN.",
            artist: "Kendrick Lamar",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699",
            releaseYear: "2017",
            trackCount: 14
        ),
        MusicAlbum(
            id: "album-ok-computer",
            title: "OK Computer",
            artist: "Radiohead",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273c8b444df094179b770396495",
            releaseYear: "1997",
            trackCount: 12
        )
    ]
    
    // MARK: - Search Suggestions
    
    public func getSearchSuggestions(query: string) async -> [String] {
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.count >= 2 else { return [] }
        
        guard let encoded = trimmed.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "\(AppConfig.googleSuggestUrl)?client=firefox&ds=yt&q=\(encoded)") else {
            return []
        }
        
        do {
            let (data, _) = try await apiClient.rawRequest(url: url)
            if let json = try? JSONSerialization.jsonObject(with: data) as? [Any],
               json.count > 1,
               let suggestions = json[1] as? [String] {
                return Array(suggestions.prefix(6))
            }
        } catch {
            // Fallback to local filtering
        }
        
        let localNames = ["Olivia Rodrigo", "Billie Eilish", "The Weeknd", "Charli xcx", "Sabrina Carpenter", "Radiohead", "Kendrick Lamar", "vampire", "LUNCH", "Espresso", "360", "Blinding Lights", "Karma Police"]
        return localNames.filter { $0.localizedCaseInsensitiveContains(trimmed) }
    }
    
    // MARK: - Search Tracks
    
    public func searchTracks(query: String, limit: Int = 25) async -> [AudioTrack] {
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            return ClashflacAPI.curatedTracks
        }
        
        let qLower = trimmed.lowercased()
        
        // 1. Curated local matches
        let curatedMatches = ClashflacAPI.curatedTracks.filter {
            $0.title.lowercased().contains(qLower) ||
            $0.artist.lowercased().contains(qLower) ||
            ($0.album?.lowercased().contains(qLower) ?? false)
        }
        
        // 2. Fetch live results from iTunes Search API
        var remoteTracks: [AudioTrack] = []
        if let encoded = trimmed.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
           let url = URL(string: "\(AppConfig.itunesBaseUrl)/search?term=\(encoded)&entity=song&limit=\(limit)") {
            do {
                let (data, _) = try await apiClient.rawRequest(url: url)
                if let response = try? JSONDecoder().decode(ITunesSearchResponse.self, from: data) {
                    for item in response.results {
                        let durationSec = Double(item.trackTimeMillis ?? 180_000) / 1000.0
                        let artwork = item.artworkUrl100?.replacingOccurrences(of: "100x100bb", with: "600x600bb")
                        let track = AudioTrack(
                            id: "itunes-\(item.trackId ?? Int.random(in: 1000...999999))",
                            title: item.trackName ?? "Unknown Title",
                            artist: item.artistName ?? "Unknown Artist",
                            album: item.collectionName,
                            duration: max(30, durationSec),
                            artworkUrl: artwork,
                            streamUrl: item.previewUrl ?? "",
                            quality: .hiRes192,
                            bitDepth: 24,
                            sampleRate: 192_000,
                            codec: "FLAC"
                        )
                        remoteTracks.append(track)
                    }
                }
            } catch {
                print("[MusicService] iTunes track search error: \(error)")
            }
        }
        
        // Combine deduplicating by title and artist
        var combined = curatedMatches
        var seen = Set(curatedMatches.map { "\($0.title.lowercased())::\($0.artist.lowercased())" })
        
        for t in remoteTracks {
            let key = "\(t.title.lowercased())::\(t.artist.lowercased())"
            if !seen.contains(key) {
                seen.insert(key)
                combined.append(t)
            }
        }
        
        return Array(combined.prefix(limit))
    }
    
    // MARK: - Search Artists
    
    public func searchArtists(query: String, limit: Int = 10) async -> [MusicArtist] {
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            return Self.curatedArtists
        }
        
        let qLower = trimmed.lowercased()
        let curatedMatches = Self.curatedArtists.filter {
            $0.name.lowercased().contains(qLower)
        }
        
        var remoteArtists: [MusicArtist] = []
        if let encoded = trimmed.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
           let url = URL(string: "\(AppConfig.itunesBaseUrl)/search?term=\(encoded)&entity=musicArtist&limit=\(limit)") {
            do {
                let (data, _) = try await apiClient.rawRequest(url: url)
                if let response = try? JSONDecoder().decode(ITunesArtistSearchResponse.self, from: data) {
                    for item in response.results {
                        let known = Self.curatedArtists.first { $0.name.lowercased() == item.artistName?.lowercased() }
                        let artist = MusicArtist(
                            id: "artist-\(item.artistId ?? Int.random(in: 100...99999))",
                            name: item.artistName ?? "Unknown Artist",
                            artworkUrl: known?.artworkUrl ?? "https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6",
                            followers: known?.followers ?? "1.5M",
                            genres: item.primaryGenreName != nil ? [item.primaryGenreName!] : ["Music"],
                            bio: known?.bio
                        )
                        remoteArtists.append(artist)
                    }
                }
            } catch {
                print("[MusicService] iTunes artist search error: \(error)")
            }
        }
        
        var combined = curatedMatches
        var seen = Set(curatedMatches.map { $0.name.lowercased() })
        for a in remoteArtists {
            if !seen.contains(a.name.lowercased()) {
                seen.insert(a.name.lowercased())
                combined.append(a)
            }
        }
        
        return Array(combined.prefix(limit))
    }
    
    // MARK: - Search Albums
    
    public func searchAlbums(query: String, limit: Int = 10) async -> [MusicAlbum] {
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        let qLower = trimmed.lowercased()
        
        let curatedMatches = Self.curatedAlbums.filter {
            trimmed.isEmpty || $0.title.lowercased().contains(qLower) || $0.artist.lowercased().contains(qLower)
        }
        
        if trimmed.isEmpty {
            return curatedMatches
        }
        
        var remoteAlbums: [MusicAlbum] = []
        if let encoded = trimmed.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
           let url = URL(string: "\(AppConfig.itunesBaseUrl)/search?term=\(encoded)&entity=album&limit=\(limit)") {
            do {
                let (data, _) = try await apiClient.rawRequest(url: url)
                if let response = try? JSONDecoder().decode(ITunesAlbumSearchResponse.self, from: data) {
                    for item in response.results {
                        let artwork = item.artworkUrl100?.replacingOccurrences(of: "100x100bb", with: "600x600bb")
                        let year = item.releaseDate != nil ? String(item.releaseDate!.prefix(4)) : "2024"
                        let album = MusicAlbum(
                            id: "album-\(item.collectionId ?? Int.random(in: 100...99999))",
                            title: item.collectionName ?? "Unknown Album",
                            artist: item.artistName ?? "Unknown Artist",
                            artworkUrl: artwork,
                            releaseYear: year,
                            trackCount: item.trackCount
                        )
                        remoteAlbums.append(album)
                    }
                }
            } catch {
                print("[MusicService] iTunes album search error: \(error)")
            }
        }
        
        var combined = curatedMatches
        var seen = Set(curatedMatches.map { $0.title.lowercased() })
        for a in remoteAlbums {
            if !seen.contains(a.title.lowercased()) {
                seen.insert(a.title.lowercased())
                combined.append(a)
            }
        }
        
        return Array(combined.prefix(limit))
    }
    
    // MARK: - Full Artist Details
    
    public func getArtistDetails(artistName: String) async -> MusicArtist {
        let trimmed = artistName.trimmingCharacters(in: .whitespacesAndNewlines)
        let known = Self.curatedArtists.first { $0.name.lowercased() == trimmed.lowercased() }
        
        async let topTracks = searchTracks(query: trimmed, limit: 10)
        async let albums = searchAlbums(query: trimmed, limit: 6)
        
        let (tracksResult, albumsResult) = await (topTracks, albums)
        let artwork = known?.artworkUrl ?? tracksResult.first?.artworkUrl ?? "https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6"
        
        return MusicArtist(
            id: known?.id ?? "artist-\(trimmed.lowercased().replacingOccurrences(of: " ", with: "-"))",
            name: known?.name ?? trimmed,
            artworkUrl: artwork,
            followers: known?.followers ?? "3.4M",
            genres: known?.genres ?? ["Alternative", "Pop"],
            popularTracks: tracksResult,
            albums: albumsResult,
            bio: known?.bio ?? "\(trimmed) is an acclaimed recording artist streaming in studio master lossless fidelity on Kaira Music."
        )
    }
    
    // MARK: - Full Album Details & Tracklist
    
    public func getAlbumDetails(album: MusicAlbum) async -> MusicAlbum {
        var updated = album
        
        // Query tracks for this album
        let query = "\(album.artist) \(album.title)"
        let tracks = await searchTracks(query: query, limit: 14)
        let filtered = tracks.filter { $0.artist.localizedCaseInsensitiveContains(album.artist) }
        
        updated.tracks = filtered.isEmpty ? tracks : filtered
        updated.trackCount = updated.tracks?.count ?? 0
        updated.duration = updated.tracks?.reduce(0) { $0 + $1.duration }
        if updated.artworkUrl == nil {
            updated.artworkUrl = updated.tracks?.first?.artworkUrl
        }
        return updated
    }
}

// MARK: - Decodable iTunes Response DTOs

struct ITunesSearchResponse: Decodable {
    let results: [ITunesTrackDTO]
}

struct ITunesTrackDTO: Decodable {
    let trackId: Int?
    let trackName: String?
    let artistName: String?
    let collectionName: String?
    let trackTimeMillis: Int?
    let artworkUrl100: String?
    let previewUrl: String?
}

struct ITunesArtistSearchResponse: Decodable {
    let results: [ITunesArtistDTO]
}

struct ITunesArtistDTO: Decodable {
    let artistId: Int?
    let artistName: String?
    let primaryGenreName: String?
}

struct ITunesAlbumSearchResponse: Decodable {
    let results: [ITunesAlbumDTO]
}

struct ITunesAlbumDTO: Decodable {
    let collectionId: Int?
    let collectionName: String?
    let artistName: String?
    let artworkUrl100: String?
    let releaseDate: String?
    let trackCount: Int?
}
