import SwiftUI
import AVFoundation

@main
struct KairaApp: App {
    @StateObject private var playbackEngine = PlaybackEngine.shared
    @StateObject private var audioSessionManager = AudioSessionManager.shared
    @StateObject private var downloadManager = DownloadManager.shared
    @StateObject private var lastFmAuthManager = LastFmAuthManager.shared
    @StateObject private var equalizerEngine = EqualizerEngine.shared
    
    init() {
        // Configure native audio session at launch
        AudioSessionManager.shared.setupAudioSession()
    }
    
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .environmentObject(playbackEngine)
                .environmentObject(audioSessionManager)
                .environmentObject(downloadManager)
                .environmentObject(lastFmAuthManager)
                .environmentObject(equalizerEngine)
                .preferredColorScheme(.dark)
        }
    }
}
