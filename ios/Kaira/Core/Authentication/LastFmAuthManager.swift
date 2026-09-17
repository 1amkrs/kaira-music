import Foundation

@MainActor
public final class LastFmAuthManager: ObservableObject {
    public static let shared = LastFmAuthManager()
    
    @Published public private(set) var isAuthenticated: Bool = false
    @Published public private(set) var username: String?
    @Published public private(set) var sessionKey: String?
    
    private let keychain = KeychainManager.shared
    private let sessionKeyKey = "lastfm_session_key"
    private let usernameKey = "lastfm_username"
    
    private init() {
        if let storedKey = keychain.loadString(key: sessionKeyKey),
           let storedUser = keychain.loadString(key: usernameKey),
           !storedKey.isEmpty {
            self.sessionKey = storedKey
            self.username = storedUser
            self.isAuthenticated = true
        }
    }
    
    public func saveSession(username: String, sessionKey: String) {
        _ = keychain.save(key: usernameKey, string: username)
        _ = keychain.save(key: sessionKeyKey, string: sessionKey)
        self.username = username
        self.sessionKey = sessionKey
        self.isAuthenticated = true
    }
    
    public func clearSession() {
        _ = keychain.delete(key: usernameKey)
        _ = keychain.delete(key: sessionKeyKey)
        self.username = nil
        self.sessionKey = nil
        self.isAuthenticated = false
    }
}
