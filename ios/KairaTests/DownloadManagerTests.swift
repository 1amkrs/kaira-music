import XCTest
@testable import Kaira

@MainActor
final class DownloadManagerTests: XCTestCase {
    func testDownloadStateLifecycle() {
        let dm = DownloadManager.shared
        XCTAssertFalse(dm.isDownloaded(trackId: "non-existent-track"))
        XCTAssertEqual(dm.progress(for: "non-existent-track"), 0.0)
    }
}
