import XCTest
@testable import Kaira

final class LyricsParserTests: XCTestCase {
    func testParseLRCWithMillisecondPrecision() {
        let lrc = """
        [00:00.00]Hate to give the satisfaction
        [00:06.18]I should've known it was strange
        [01:12.450]Bleedin' me dry
        """
        
        let lines = LrclibAPI.shared.parseLRC(lrc)
        XCTAssertEqual(lines.count, 3)
        XCTAssertEqual(lines[0].timeMs, 0)
        XCTAssertEqual(lines[0].text, "Hate to give the satisfaction")
        XCTAssertEqual(lines[1].timeMs, 6180)
        XCTAssertEqual(lines[2].timeMs, 72450)
    }
    
    func testEmptyLRCProducesEmptyLines() {
        let lines = LrclibAPI.shared.parseLRC("")
        XCTAssertTrue(lines.isEmpty)
    }
}
