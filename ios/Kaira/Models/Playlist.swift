import Foundation

public struct Playlist: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public var name: String
    public var description: String?
    public var createdAt: Date
    public var tracks: [AudioTrack]
    
    public init(
        id: String = UUID().uuidString,
        name: String,
        description: String? = nil,
        createdAt: Date = Date(),
        tracks: [AudioTrack] = []
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.createdAt = createdAt
        self.tracks = tracks
    }
    
    public var totalDuration: TimeInterval {
        tracks.reduce(0) { $0 + $1.duration }
    }
    
    public var artworkUrl: String? {
        tracks.first(where: { $0.artworkUrl != nil })?.artworkUrl
    }
}
