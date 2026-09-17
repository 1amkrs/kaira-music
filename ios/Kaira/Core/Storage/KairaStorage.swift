import Foundation

public final class KairaStorage: @unchecked Sendable {
    public static let shared = KairaStorage()
    
    private let fileManager = FileManager.default
    private let appSupportURL: URL
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    private let lock = NSLock()
    
    private init() {
        let paths = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)
        let dir = paths[0].appendingPathComponent("KairaMusic", isDirectory: true)
        if !fileManager.fileExists(atPath: dir.path) {
            try? fileManager.createDirectory(at: dir, withIntermediateDirectories: true)
        }
        self.appSupportURL = dir
        self.encoder.outputFormatting = .prettyPrinted
    }
    
    private func fileURL(for key: String) -> URL {
        appSupportURL.appendingPathComponent("\(key).json")
    }
    
    // MARK: - Generic Persistence
    
    public func save<T: Encodable>(_ object: T, for key: String) {
        lock.lock()
        defer { lock.unlock() }
        do {
            let data = try encoder.encode(object)
            let url = fileURL(for: key)
            try data.write(to: url, options: .atomic)
        } catch {
            print("[KairaStorage] Failed to save \(key): \(error)")
        }
    }
    
    public func load<T: Decodable>(_ type: T.Type, for key: String) -> T? {
        lock.lock()
        defer { lock.unlock() }
        let url = fileURL(for: key)
        guard fileManager.fileExists(atPath: url.path) else { return nil }
        do {
            let data = try Data(contentsOf: url)
            return try decoder.decode(type, from: data)
        } catch {
            print("[KairaStorage] Failed to load \(key): \(error)")
            return nil
        }
    }
    
    // MARK: - Liked Tracks
    
    public func getLikedTracks() -> [AudioTrack] {
        load([AudioTrack].self, for: "liked_tracks") ?? []
    }
    
    public func saveLikedTracks(_ tracks: [AudioTrack]) {
        save(tracks, for: "liked_tracks")
    }
    
    // MARK: - Recent Tracks
    
    public func getRecentTracks() -> [AudioTrack] {
        load([AudioTrack].self, for: "recent_tracks") ?? []
    }
    
    public func saveRecentTracks(_ tracks: [AudioTrack]) {
        save(tracks, for: "recent_tracks")
    }
    
    // MARK: - Playlists
    
    public func getPlaylists() -> [Playlist] {
        load([Playlist].self, for: "playlists") ?? []
    }
    
    public func savePlaylists(_ playlists: [Playlist]) {
        save(playlists, for: "playlists")
    }
    
    // MARK: - Downloaded Tracks
    
    public func getDownloadedTracks() -> [DownloadedTrack] {
        load([DownloadedTrack].self, for: "downloaded_tracks") ?? []
    }
    
    public func saveDownloadedTracks(_ downloads: [DownloadedTrack]) {
        save(downloads, for: "downloaded_tracks")
    }
}
