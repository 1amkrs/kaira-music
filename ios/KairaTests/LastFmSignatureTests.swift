import XCTest
@testable import Kaira

final class LastFmSignatureTests: XCTestCase {
    func testLastFmMD5SignatureGeneration() {
        let params = [
            "method": "auth.getMobileSession",
            "username": "kairatest",
            "password": "secretpassword"
        ]
        let sig = LastFmService.shared.generateSignature(params: params)
        XCTAssertFalse(sig.isEmpty)
        XCTAssertEqual(sig.count, 32) // Valid 128-bit hex string
    }
}
