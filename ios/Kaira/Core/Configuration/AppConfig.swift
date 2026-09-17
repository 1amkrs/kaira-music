import Foundation

public enum AppConfig {
    public static let appName = "Kaira Music"
    public static let appVersion = "4.1.0"
    public static let bundleId = "com.kairamusic.app"
    
    // Last.fm Integration Keys
    public static let defaultLastFmApiKey = "b25b959554ed76058ac220b7b2e0a026"
    public static let defaultLastFmSharedSecret = "425b5577c720526e8555e101f3074d0d"
    public static let lastFmApiRootUrl = "https://ws.audioscrobbler.com/2.0/"
    
    // Lyrics API
    public static let lrclibBaseUrl = "https://lrclib.net/api"
    public static let userAgent = "Kaira-Music-iOS/4.1.0 (Native; iOS 17+)"
    
    // iTunes & Catalog
    public static let itunesBaseUrl = "https://itunes.apple.com"
    public static let googleSuggestUrl = "https://suggestqueries.google.com/complete/search"
    
    // Audio Spec Standards
    public static let maxSampleRate: Double = 192_000.0
    public static let maxBitDepth: Int = 24
}
