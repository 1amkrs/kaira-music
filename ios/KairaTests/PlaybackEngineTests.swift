import XCTest
@testable import Kaira

@MainActor
final class PlaybackEngineTests: XCTestCase {
    func testQueueManagement() {
        let engine = PlaybackEngine.shared
        let track = AudioTrack(
            id: "test-01",
            title: "Test Track",
            artist: "Test Artist",
            duration: 180,
            streamUrl: "https://example.com/audio.flac",
            quality: .hiRes192
        )
        
        engine.appendToQueue(track: track)
        XCTAssertTrue(engine.queue.contains(where: { $0.id == "test-01" }))
        
        engine.toggleShuffle()
        XCTAssertTrue(engine.isShuffleEnabled)
        engine.toggleShuffle()
        XCTAssertFalse(engine.isShuffleEnabled)
        
        XCTAssertEqual(engine.repeatMode, .off)
        engine.toggleRepeat()
        XCTAssertEqual(engine.repeatMode, .all)
        engine.toggleRepeat()
        XCTAssertEqual(engine.repeatMode, .one)
        engine.toggleRepeat()
        XCTAssertEqual(engine.repeatMode, .off)
    }
}
