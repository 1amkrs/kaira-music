import Foundation

public struct LastFmUserProfile: Codable, Hashable, Sendable {
    public let name: String
    public let realname: String?
    public let playcount: Int
    public let image: String?
    public let url: String?
    
    public init(name: String, realname: String? = nil, playcount: Int = 0, image: String? = nil, url: String? = nil) {
        self.name = name
        self.realname = realname
        self.playcount = playcount
        self.image = image
        self.url = url
    }
}

public struct LastFmScrobbleTrack: Identifiable, Codable, Hashable, Sendable {
    public var id: String { "\(title)-\(artist)-\(dateUTS)" }
    public let title: String
    public let artist: String
    public let album: String?
    public let artwork: String?
    public let dateUTS: Int
    public let isNowPlaying: Bool
    
    public init(title: String, artist: String, album: String? = nil, artwork: String? = nil, dateUTS: Int = Int(Date().timeIntervalSince1970), isNowPlaying: Bool = false) {
        self.title = title
        self.artist = artist
        self.album = album
        self.artwork = artwork
        self.dateUTS = dateUTS
        self.isNowPlaying = isNowPlaying
    }
}

public struct LastFmSession: Codable, Sendable {
    public let username: String
    public let sessionKey: String
    
    public init(username: String, sessionKey: String) {
        self.username = username
        self.sessionKey = sessionKey
    }
}
