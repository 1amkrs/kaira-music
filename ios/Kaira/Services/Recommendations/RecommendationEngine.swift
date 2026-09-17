import Foundation

public struct GenreDNA: Identifiable, Hashable, Sendable {
    public var id: String { name }
    public let name: String
    public let gradientColors: [String] // Hex codes
    public let iconName: String
    public let artists: [String]
    public let description: String
}

public final class RecommendationEngine: Sendable {
    public static let shared = RecommendationEngine()
    
    public static let genres: [GenreDNA] = [
        GenreDNA(
            name: "Audiophile Masterclass",
            gradientColors: ["#D4AF37", "#1A1A24"],
            iconName: "waveform.path.ecg",
            artists: ["Radiohead", "Billie Eilish", "Daft Punk", "The Weeknd"],
            description: "Studio Master 24-bit/192kHz recordings mastered for maximum dynamic range."
        ),
        GenreDNA(
            name: "Hyperpop & Electronic",
            gradientColors: ["#00F5D4", "#7B2CBF"],
            iconName: "bolt.horizontal.fill",
            artists: ["Charli xcx", "Daft Punk", "SOPHIE", "A. G. Cook"],
            description: "Futuristic synths, metallic textures, and bass-heavy club rhythms."
        ),
        GenreDNA(
            name: "Dark Pop & Alt",
            gradientColors: ["#E63946", "#1D3557"],
            iconName: "moon.stars.fill",
            artists: ["Billie Eilish", "Olivia Rodrigo", "Lorde", "Gracie Abrams"],
            description: "Intimate vocals, brooding minimalism, and driving alt-rock hooks."
        ),
        GenreDNA(
            name: "R&B & Synthwave",
            gradientColors: ["#FF007F", "#3A0CA3"],
            iconName: "flame.fill",
            artists: ["The Weeknd", "Frank Ocean", "SZA", "Brent Faiyaz"],
            description: "Silky falsettos, 80s analog synthesizers, and midnight atmospheres."
        ),
        GenreDNA(
            name: "Conscious Hip-Hop",
            gradientColors: ["#F77F00", "#003049"],
            iconName: "speaker.wave.3.fill",
            artists: ["Kendrick Lamar", "Travis Scott", "J. Cole", "Tyler, The Creator"],
            description: "Complex lyricism, jazz-infused production, and heavy 808 subs."
        ),
        GenreDNA(
            name: "Art Rock & Indie",
            gradientColors: ["#48CAE4", "#03045E"],
            iconName: "guitars.fill",
            artists: ["Radiohead", "The Strokes", "Tame Impala", "Arctic Monkeys"],
            description: "Atmospheric guitars, experimental arrangements, and rich analog warmth."
        )
    ]
    
    // MARK: - Start Mix
    
    public func startMix(basedOn track: AudioTrack) async -> [AudioTrack] {
        var mix: [AudioTrack] = [track]
        let service = MusicService.shared
        
        // 1. Same artist track
        let artistTracks = await service.searchTracks(query: track.artist, limit: 6)
        for t in artistTracks where t.id != track.id {
            if !mix.contains(where: { $0.id == t.id }) {
                mix.append(t)
            }
        }
        
        // 2. Curated audiophile tracks
        for t in ClashflacAPI.curatedTracks {
            if !mix.contains(where: { $0.id == t.id }) {
                mix.append(t)
            }
        }
        
        return Array(mix.prefix(15))
    }
    
    // MARK: - Genre Discovery Tracks
    
    public func getTracksForGenre(_ genre: GenreDNA) async -> [AudioTrack] {
        var tracks: [AudioTrack] = []
        let service = MusicService.shared
        
        for artist in genre.artists.prefix(3) {
            let found = await service.searchTracks(query: artist, limit: 4)
            tracks.append(contentsOf: found)
        }
        
        // Deduplicate
        var unique: [AudioTrack] = []
        var seen = Set<String>()
        for t in tracks {
            if !seen.contains(t.id) {
                seen.insert(t.id)
                unique.append(t)
            }
        }
        return Array(unique.prefix(18))
    }
}
