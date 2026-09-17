import Foundation

public struct AudioTrack: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public var title: String
    public var artist: String
    public var album: String?
    public var duration: TimeInterval
    public var artworkUrl: String?
    public var streamUrl: String
    public var quality: AudioQuality
    public var bitDepth: Int
    public var sampleRate: Double
    public var codec: String
    public var clashflacId: String?
    public var youtubeId: String?
    public var lyricsLrc: String?
    public var isDownloaded: Bool
    public var localFileUrl: String?
    
    public init(
        id: String,
        title: String,
        artist: String,
        album: String? = nil,
        duration: TimeInterval,
        artworkUrl: String? = nil,
        streamUrl: String,
        quality: AudioQuality = .hiRes192,
        bitDepth: Int = 24,
        sampleRate: Double = 192_000,
        codec: String = "FLAC",
        clashflacId: String? = nil,
        youtubeId: String? = nil,
        lyricsLrc: String? = nil,
        isDownloaded: Bool = false,
        localFileUrl: String? = nil
    ) {
        self.id = id
        self.title = title
        self.artist = artist
        self.album = album
        self.duration = duration
        self.artworkUrl = artworkUrl
        self.streamUrl = streamUrl
        self.quality = quality
        self.bitDepth = bitDepth
        self.sampleRate = sampleRate
        self.codec = codec
        self.clashflacId = clashflacId
        self.youtubeId = youtubeId
        self.lyricsLrc = lyricsLrc
        self.isDownloaded = isDownloaded
        self.localFileUrl = localFileUrl
    }
    
    /// Audio specification label, e.g. "24-bit / 192 kHz FLAC"
    public var audioSpecDescription: String {
        let rateKHz = String(format: "%.1f", sampleRate / 1000.0)
            .replacingOccurrences(of: ".0", with: "")
        return "\(bitDepth)-bit / \(rateKHz) kHz \(codec)"
    }
    
    /// Returns the effective playable URL (prefers local downloaded file if present)
    public var playbackURL: URL? {
        if isDownloaded, let localFileUrl = localFileUrl {
            let fileURL = URL(fileURLWithPath: localFileUrl)
            if FileManager.default.fileExists(atPath: fileURL.path) {
                return fileURL
            }
        }
        return URL(string: streamUrl)
    }
}
