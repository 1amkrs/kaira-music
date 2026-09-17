import Foundation

public struct MusicAlbum: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public var title: String
    public var artist: String
    public var artworkUrl: String?
    public var releaseYear: String
    public var trackCount: Int?
    public var duration: TimeInterval?
    public var tracks: [AudioTrack]?
    
    public init(
        id: String,
        title: String,
        artist: String,
        artworkUrl: String? = nil,
        releaseYear: String = "2024",
        trackCount: Int? = nil,
        duration: TimeInterval? = nil,
        tracks: [AudioTrack]? = nil
    ) {
        self.id = id
        self.title = title
        self.artist = artist
        self.artworkUrl = artworkUrl
        self.releaseYear = releaseYear
        self.trackCount = trackCount ?? tracks?.count
        self.duration = duration
        self.tracks = tracks
    }
}
