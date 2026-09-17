import SwiftUI

public struct SettingsView: View {
    @AppStorage("streaming_quality") private var streamingQuality: String = AudioQuality.hiRes192.rawValue
    @AppStorage("download_quality") private var downloadQuality: String = AudioQuality.hiRes192.rawValue
    @AppStorage("custom_backend_url") private var customBackendUrl: String = ""
    @AppStorage("auto_scrobble") private var autoScrobble: Bool = true
    
    @ObservedObject private var downloadManager = DownloadManager.shared
    @State private var showingClearCacheAlert = false
    @State private var cacheClearedMessage = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            List {
                // Section: Audio Fidelity
                Section("Audio Fidelity & Streaming") {
                    Picker("Streaming Quality", selection: $streamingQuality) {
                        ForEach(AudioQuality.allCases) { q in
                            Text(q.displayName).tag(q.rawValue)
                        }
                    }
                    
                    Picker("Download Quality", selection: $downloadQuality) {
                        ForEach(AudioQuality.allCases) { q in
                            Text(q.displayName).tag(q.rawValue)
                        }
                    }
                    
                    NavigationLink {
                        EqualizerSheetView()
                    } label: {
                        HStack {
                            Text("10-Band Studio Equalizer")
                            Spacer()
                            Text(EqualizerEngine.shared.currentPreset)
                                .foregroundColor(.gray)
                        }
                    }
                }
                
                // Section: Last.fm
                Section("Scrobbling Integration") {
                    Toggle("Auto Scrobble to Last.fm", isOn: $autoScrobble)
                        .tint(.red)
                    
                    NavigationLink {
                        LastFmView()
                    } label: {
                        HStack {
                            Text("Last.fm Account")
                            Spacer()
                            if LastFmAuthManager.shared.isAuthenticated {
                                Text(LastFmAuthManager.shared.username ?? "Connected")
                                    .foregroundColor(.green)
                            } else {
                                Text("Not Connected")
                                    .foregroundColor(.gray)
                            }
                        }
                    }
                }
                
                // Section: Storage & Cache
                Section("Storage & Offline Cache") {
                    HStack {
                        Text("Downloaded Music")
                        Spacer()
                        Text("\(downloadManager.downloads.count) tracks (\(downloadManager.formattedStorageUsed))")
                            .foregroundColor(.gray)
                    }
                    
                    Button {
                        ImageCache.shared.removeAllObjects()
                        cacheClearedMessage = true
                        HapticFeedback.playNotification(type: .success)
                    } label: {
                        Text("Clear Artwork Cache")
                            .foregroundColor(.white)
                    }
                    
                    if !downloadManager.downloads.isEmpty {
                        Button(role: .destructive) {
                            showingClearCacheAlert = true
                        } label: {
                            Text("Delete All Offline Downloads")
                                .foregroundColor(.red)
                        }
                    }
                }
                
                // Section: Backend Configuration
                Section("Backend & Network") {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Custom Backend Node")
                            .font(.system(size: 14))
                        TextField("Default high-res endpoint", text: $customBackendUrl)
                            .font(.system(size: 13, design: .monospaced))
                            .foregroundColor(.gray)
                            .autocorrectionDisabled()
                            .textInputAutocapitalization(.never)
                    }
                }
                
                // Section: About
                Section("About Kaira Music") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text(AppConfig.appVersion)
                            .foregroundColor(.gray)
                    }
                    HStack {
                        Text("Architecture")
                        Spacer()
                        Text("Native Swift / SwiftUI")
                            .foregroundColor(.gray)
                    }
                    HStack {
                        Text("Engine")
                        Spacer()
                        Text("AVFoundation + FLAC/Opus")
                            .foregroundColor(.gray)
                    }
                }
            }
            .listStyle(.insetGrouped)
            .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
            .scrollContentBackground(.hidden)
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .alert("Delete Offline Downloads?", isPresented: $showingClearCacheAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Delete All", role: .destructive) {
                    downloadManager.clearAllDownloads()
                }
            } message: {
                Text("This will remove all downloaded studio master tracks from your device.")
            }
            .alert("Cache Cleared", isPresented: $cacheClearedMessage) {
                Button("OK") {}
            } message: {
                Text("All cached artwork assets have been released from memory.")
            }
        }
        .preferredColorScheme(.dark)
    }
}
