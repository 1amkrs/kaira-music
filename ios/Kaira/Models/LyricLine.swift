import Foundation

public struct LyricLine: Identifiable, Codable, Hashable, Sendable {
    public let id: Int
    public let timeMs: Int
    public let text: String
    
    public init(id: Int, timeMs: Int, text: String) {
        self.id = id
        self.timeMs = timeMs
        self.text = text
    }
    
    public var timeSeconds: TimeInterval {
        Double(timeMs) / 1000.0
    }
}

public struct LyricsResult: Codable, Sendable {
    public var synced: [LyricLine]
    public var plain: String?
    public var isInstrumental: Bool
    
    public init(synced: [LyricLine] = [], plain: String? = nil, isInstrumental: Bool = false) {
        self.synced = synced
        self.plain = plain
        self.isInstrumental = isInstrumental
    }
    
    public var hasSyncedLyrics: Bool {
        !synced.isEmpty
    }
}
