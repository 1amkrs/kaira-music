import Foundation

public final class APIClient: Sendable {
    public static let shared = APIClient()
    
    private let session: URLSession
    
    public init(session: URLSession = .shared) {
        self.session = session
    }
    
    public func request<T: Decodable>(
        url: URL,
        method: String = "GET",
        headers: [String: String] = [:],
        body: Data? = nil,
        retryCount: Int = 2
    ) async throws -> T {
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.httpBody = body
        req.setValue(AppConfig.userAgent, forHTTPHeaderField: "User-Agent")
        
        for (k, v) in headers {
            req.setValue(v, forHTTPHeaderField: k)
        }
        
        var attempts = 0
        var lastError: Error = NetworkError.invalidResponse(statusCode: 0)
        
        while attempts <= retryCount {
            do {
                let (data, response) = try await session.data(for: req)
                guard let httpResponse = response as? HTTPURLResponse else {
                    throw NetworkError.invalidResponse(statusCode: 0)
                }
                
                guard (200...299).contains(httpResponse.statusCode) else {
                    if httpResponse.statusCode == 401 || httpResponse.statusCode == 403 {
                        throw NetworkError.unauthorized
                    }
                    throw NetworkError.invalidResponse(statusCode: httpResponse.statusCode)
                }
                
                let decoder = JSONDecoder()
                return try decoder.decode(T.self, from: data)
            } catch let error as NetworkError {
                if case .unauthorized = error { throw error }
                lastError = error
                attempts += 1
                if attempts <= retryCount {
                    try? await Task.sleep(nanoseconds: UInt64(Double(attempts) * 0.5 * 1_000_000_000))
                }
            } catch {
                lastError = NetworkError.decodingError(error.localizedDescription)
                attempts += 1
                if attempts <= retryCount {
                    try? await Task.sleep(nanoseconds: UInt64(Double(attempts) * 0.5 * 1_000_000_000))
                }
            }
        }
        
        throw lastError
    }
    
    public func rawRequest(
        url: URL,
        method: String = "GET",
        headers: [String: String] = [:],
        body: Data? = nil
    ) async throws -> (Data, HTTPURLResponse) {
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.httpBody = body
        req.setValue(AppConfig.userAgent, forHTTPHeaderField: "User-Agent")
        
        for (k, v) in headers {
            req.setValue(v, forHTTPHeaderField: k)
        }
        
        let (data, response) = try await session.data(for: req)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse(statusCode: 0)
        }
        return (data, httpResponse)
    }
}
