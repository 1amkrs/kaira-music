import Foundation

public struct DownloadedTrack: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public var track: AudioTrack
    public var localFilePath: String
    public var downloadedAt: Date
    public var fileSizeBytes: Int64
    public var downloadProgress: Double
    public var isComplete: Bool
    
    public init(
        id: String,
        track: AudioTrack,
        localFilePath: String,
        downloadedAt: Date = Date(),
        fileSizeBytes: Int64 = 0,
        downloadProgress: Double = 1.0,
        isComplete: Bool = true
    ) {
        self.id = id
        self.track = track
        self.localFilePath = localFilePath
        self.downloadedAt = downloadedAt
        self.fileSizeBytes = fileSizeBytes
        self.downloadProgress = downloadProgress
        self.isComplete = isComplete
    }
    
    public var formattedFileSize: String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useMB, .useGB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: fileSizeBytes)
    }
}
