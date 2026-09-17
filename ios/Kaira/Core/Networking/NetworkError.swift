import Foundation

public enum NetworkError: LocalizedError, Sendable {
    case invalidURL
    case invalidResponse(statusCode: Int)
    case decodingError(String)
    case noData
    case unauthorized
    case serverError(String)
    case offline
    
    public var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "The requested URL is invalid."
        case .invalidResponse(let statusCode):
            return "Server responded with status code \(statusCode)."
        case .decodingError(let msg):
            return "Failed to parse data: \(msg)"
        case .noData:
            return "No data received from the server."
        case .unauthorized:
            return "Authentication required or session expired."
        case .serverError(let msg):
            return msg
        case .offline:
            return "You appear to be offline. Playing from local cache."
        }
    }
}
