import Foundation
import Combine

@MainActor
public final class DownloadManager: NSObject, ObservableObject {
    public static let shared = DownloadManager()
    
    @Published public private(set) var downloads: [DownloadedTrack] = []
    @Published public private(set) var activeTasks: [String: Double] = [:] // trackId : progress 0.0 - 1.0
    
    private let storage = KairaStorage.shared
    private let fileManager = FileManager.default
    private let downloadsDirectory: URL
    private var downloadTasks: [String: URLSessionDownloadTask] = [:]
    private var trackMapping: [Int: AudioTrack] = [:] // taskIdentifier -> AudioTrack
    
    private lazy var urlSession: URLSession = {
        let config = URLSessionConfiguration.default
        config.isDiscretionary = false
        config.sessionSendsLaunchEvents = true
        return URLSession(configuration: config, delegate: self, delegateQueue: nil)
    }()
    
    public override init() {
        let docs = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        self.downloadsDirectory = docs.appendingPathComponent("Downloads", isDirectory: true)
        if !fileManager.fileExists(atPath: downloadsDirectory.path) {
            try? fileManager.createDirectory(at: downloadsDirectory, withIntermediateDirectories: true)
        }
        super.init()
        self.downloads = storage.getDownloadedTracks()
    }
    
    public func isDownloaded(trackId: String) -> Bool {
        downloads.contains { $0.id == trackId && $0.isComplete }
    }
    
    public func isDownloading(trackId: String) -> Bool {
        activeTasks[trackId] != nil
    }
    
    public func progress(for trackId: String) -> Double {
        activeTasks[trackId] ?? (isDownloaded(trackId: trackId) ? 1.0 : 0.0)
    }
    
    public func totalStorageUsed() -> Int64 {
        downloads.reduce(0) { $0 + $1.fileSizeBytes }
    }
    
    public var formattedStorageUsed: String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useMB, .useGB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: totalStorageUsed())
    }
    
    // MARK: - Download Operations
    
    public func downloadTrack(_ track: AudioTrack) {
        guard !isDownloaded(trackId: track.id), !isDownloading(trackId: track.id) else { return }
        guard let url = URL(string: track.streamUrl), url.scheme?.hasPrefix("http") == true else {
            print("[DownloadManager] Invalid stream URL for track \(track.title)")
            return
        }
        
        activeTasks[track.id] = 0.05
        let task = urlSession.downloadTask(with: url)
        downloadTasks[track.id] = task
        trackMapping[task.taskIdentifier] = track
        task.resume()
    }
    
    public func downloadAlbum(_ album: MusicAlbum) {
        guard let tracks = album.tracks else { return }
        for t in tracks {
            downloadTrack(t)
        }
    }
    
    public func downloadPlaylist(_ playlist: Playlist) {
        for t in playlist.tracks {
            downloadTrack(t)
        }
    }
    
    public func cancelDownload(trackId: String) {
        if let task = downloadTasks[trackId] {
            task.cancel()
            downloadTasks.removeValue(forKey: trackId)
        }
        activeTasks.removeValue(forKey: trackId)
    }
    
    public func deleteDownload(trackId: String) {
        cancelDownload(trackId: trackId)
        
        if let existing = downloads.first(where: { $0.id == trackId }) {
            let fileURL = URL(fileURLWithPath: existing.localFilePath)
            try? fileManager.removeItem(at: fileURL)
            downloads.removeAll { $0.id == trackId }
            storage.saveDownloadedTracks(downloads)
        }
    }
    
    public func clearAllDownloads() {
        for d in downloads {
            let fileURL = URL(fileURLWithPath: d.localFilePath)
            try? fileManager.removeItem(at: fileURL)
        }
        downloads.removeAll()
        storage.saveDownloadedTracks(downloads)
    }
    
    // Internal completion handler
    fileprivate func handleDownloadFinished(task: URLSessionDownloadTask, tempURL: URL) {
        guard let track = trackMapping[task.taskIdentifier] else { return }
        
        let ext = (track.codec.lowercased() == "flac") ? "flac" : "m4a"
        let safeFilename = "\(track.id)_\(UUID().uuidString).\(ext)"
        let destinationURL = downloadsDirectory.appendingPathComponent(safeFilename)
        
        do {
            if fileManager.fileExists(atPath: destinationURL.path) {
                try fileManager.removeItem(at: destinationURL)
            }
            try fileManager.moveItem(at: tempURL, to: destinationURL)
            
            let attr = try fileManager.attributesOfItem(atPath: destinationURL.path)
            let size = attr[.size] as? Int64 ?? 0
            
            var updatedTrack = track
            updatedTrack.isDownloaded = true
            updatedTrack.localFileUrl = destinationURL.path
            
            let downloadedItem = DownloadedTrack(
                id: track.id,
                track: updatedTrack,
                localFilePath: destinationURL.path,
                downloadedAt: Date(),
                fileSizeBytes: size,
                downloadProgress: 1.0,
                isComplete: true
            )
            
            Task { @MainActor in
                self.downloads.removeAll { $0.id == track.id }
                self.downloads.insert(downloadedItem, at: 0)
                self.storage.saveDownloadedTracks(self.downloads)
                self.activeTasks.removeValue(forKey: track.id)
                self.downloadTasks.removeValue(forKey: track.id)
                self.trackMapping.removeValue(forKey: task.taskIdentifier)
                HapticFeedback.playNotification(type: .success)
            }
        } catch {
            print("[DownloadManager] Move file failed: \(error)")
            Task { @MainActor in
                self.activeTasks.removeValue(forKey: track.id)
                self.downloadTasks.removeValue(forKey: track.id)
                self.trackMapping.removeValue(forKey: task.taskIdentifier)
            }
        }
    }
    
    fileprivate func handleDownloadProgress(task: URLSessionDownloadTask, bytesWritten: Int64, totalBytesExpected: Int64) {
        guard let track = trackMapping[task.taskIdentifier] else { return }
        guard totalBytesExpected > 0 else { return }
        let progress = Double(bytesWritten) / Double(totalBytesExpected)
        Task { @MainActor in
            self.activeTasks[track.id] = min(max(progress, 0.05), 0.99)
        }
    }
}

extension DownloadManager: URLSessionDownloadDelegate {
    public nonisolated func urlSession(
        _ session: URLSession,
        downloadTask: URLSessionDownloadTask,
        didFinishDownloadingTo location: URL
    ) {
        Task { @MainActor in
            DownloadManager.shared.handleDownloadFinished(task: downloadTask, tempURL: location)
        }
    }
    
    public nonisolated func urlSession(
        _ session: URLSession,
        downloadTask: URLSessionDownloadTask,
        didWriteData bytesWritten: Int64,
        totalBytesWritten: Int64,
        totalBytesExpectedToWrite: Int64
    ) {
        Task { @MainActor in
            DownloadManager.shared.handleDownloadProgress(
                task: downloadTask,
                bytesWritten: totalBytesWritten,
                totalBytesExpected: totalBytesExpectedToWrite
            )
        }
    }
    
    public nonisolated func urlSession(
        _ session: URLSession,
        task: URLSessionTask,
        didCompleteWithError error: Error?
    ) {
        if let error = error {
            print("[DownloadManager] Task completed with error: \(error)")
            guard let downloadTask = task as? URLSessionDownloadTask else { return }
            Task { @MainActor in
                if let track = DownloadManager.shared.trackMapping[downloadTask.taskIdentifier] {
                    DownloadManager.shared.activeTasks.removeValue(forKey: track.id)
                    DownloadManager.shared.downloadTasks.removeValue(forKey: track.id)
                    DownloadManager.shared.trackMapping.removeValue(forKey: downloadTask.taskIdentifier)
                }
            }
        }
    }
}
