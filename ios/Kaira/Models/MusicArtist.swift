import Foundation

public struct MusicArtist: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public var name: String
    public var artworkUrl: String?
    public var followers: String?
    public var genres: [String]?
    public var popularTracks: [AudioTrack]?
    public var albums: [MusicAlbum]?
    public var bio: String?
    
    public init(
        id: String,
        name: String,
        artworkUrl: String? = nil,
        followers: String? = nil,
        genres: [String]? = nil,
        popularTracks: [AudioTrack]? = nil,
        albums: [MusicAlbum]? = nil,
        bio: String? = nil
    ) {
        self.id = id
        self.name = name
        self.artworkUrl = artworkUrl
        self.followers = followers
        self.genres = genres
        self.popularTracks = popularTracks
        self.albums = albums
        self.bio = bio
    }
}
