import SwiftUI

public struct LastFmView: View {
    @ObservedObject private var auth = LastFmAuthManager.shared
    @State private var usernameInput = ""
    @State private var passwordInput = ""
    @State private var isLoggingIn = false
    @State private var errorMessage: String? = nil
    
    @State private var userProfile: LastFmUserProfile? = nil
    @State private var recentScrobbles: [LastFmScrobbleTrack] = []
    @State private var isLoadingData = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    if auth.isAuthenticated {
                        authenticatedContent
                    } else {
                        loginFormContent
                    }
                }
                .padding(.vertical, 20)
                .padding(.bottom, 90)
            }
            .background(Color(red: 0.04, green: 0.04, blue: 0.06).ignoresSafeArea())
            .navigationTitle("Last.fm")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                if auth.isAuthenticated {
                    await loadLastFmData()
                }
            }
        }
        .preferredColorScheme(.dark)
    }
    
    // MARK: - Authenticated User Dashboard
    
    private var authenticatedContent: some View {
        VStack(spacing: 24) {
            // Profile Card
            VStack(spacing: 12) {
                CachedAsyncImage(
                    url: URL(string: userProfile?.image ?? ""),
                    placeholder: Image(systemName: "person.crop.circle.fill"),
                    cornerRadius: 40
                )
                .frame(width: 80, height: 80)
                .clipShape(Circle())
                .overlay(Circle().stroke(Color.red.opacity(0.6), lineWidth: 2))
                
                VStack(spacing: 2) {
                    Text(userProfile?.name ?? auth.username ?? "Last.fm User")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                    
                    if let realname = userProfile?.realname, !realname.isEmpty {
                        Text(realname)
                            .font(.system(size: 13))
                            .foregroundColor(.gray)
                    }
                }
                
                // Scrobble Playcount Metric
                HStack(spacing: 8) {
                    Image(systemName: "music.note")
                        .foregroundColor(.red)
                    Text("\(userProfile?.playcount ?? 0) scrobbles")
                        .font(.system(size: 14, weight: .bold, design: .monospaced))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 6)
                .background(Color.red.opacity(0.15))
                .cornerRadius(12)
            }
            .frame(maxWidth: .infinity)
            .padding(20)
            .background(Color(white: 0.08))
            .cornerRadius(16)
            .padding(.horizontal, 20)
            
            // Recent Scrobbles List
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Text("Recent Scrobbles")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                    Spacer()
                    Button {
                        Task { await loadLastFmData() }
                    } label: {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal, 20)
                
                if isLoadingData {
                    ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .red))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 20)
                } else if recentScrobbles.isEmpty {
                    Text("No recent scrobbles recorded yet.")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                        .padding(.horizontal, 20)
                } else {
                    VStack(spacing: 6) {
                        ForEach(recentScrobbles) { item in
                            HStack(spacing: 12) {
                                CachedAsyncImage(
                                    url: URL(string: item.artwork ?? ""),
                                    placeholder: Image(systemName: "music.note"),
                                    cornerRadius: 6
                                )
                                .frame(width: 44, height: 44)
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(item.title)
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(.white)
                                        .lineLimit(1)
                                    
                                    Text(item.artist)
                                        .font(.system(size: 12))
                                        .foregroundColor(.gray)
                                        .lineLimit(1)
                                }
                                
                                Spacer()
                                
                                if item.isNowPlaying {
                                    HStack(spacing: 4) {
                                        Image(systemName: "waveform")
                                            .font(.system(size: 10, weight: .bold))
                                        Text("Scrobbling")
                                            .font(.system(size: 10, weight: .bold))
                                    }
                                    .foregroundColor(.red)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 3)
                                    .background(Color.red.opacity(0.12))
                                    .cornerRadius(6)
                                }
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 4)
                        }
                    }
                }
            }
            
            // Disconnect Button
            Button(role: .destructive) {
                auth.clearSession()
                userProfile = nil
                recentScrobbles = []
                HapticFeedback.playNotification(type: .warning)
            } label: {
                Text("Disconnect Last.fm")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.red)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Color.red.opacity(0.12))
                    .cornerRadius(12)
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
        }
    }
    
    // MARK: - Login Form
    
    private var loginFormContent: some View {
        VStack(spacing: 20) {
            // Hero Icon
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(Color.red.opacity(0.15))
                        .frame(width: 80, height: 80)
                    
                    Image(systemName: "dot.radiowaves.left.and.right")
                        .font(.system(size: 34))
                        .foregroundColor(.red)
                }
                
                Text("Connect Last.fm")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                
                Text("Scrobble bit-perfect lossless streams in real time, view history, and love tracks.")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
            }
            .padding(.top, 20)
            
            // Form Fields
            VStack(spacing: 14) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Username")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.gray)
                    
                    TextField("Last.fm username", text: $usernameInput)
                        .foregroundColor(.white)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                        .padding(14)
                        .background(Color(white: 0.10))
                        .cornerRadius(12)
                }
                
                VStack(alignment: .leading, spacing: 6) {
                    Text("Password")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.gray)
                    
                    SecureField("Password", text: $passwordInput)
                        .foregroundColor(.white)
                        .padding(14)
                        .background(Color(white: 0.10))
                        .cornerRadius(12)
                }
                
                if let err = errorMessage {
                    Text(err)
                        .font(.system(size: 13))
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                }
                
                Button {
                    login()
                } label: {
                    HStack {
                        if isLoggingIn {
                            ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Connect Account")
                                .fontWeight(.bold)
                        }
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.red)
                    .cornerRadius(12)
                }
                .disabled(isLoggingIn || usernameInput.isEmpty || passwordInput.isEmpty)
                .padding(.top, 8)
            }
            .padding(20)
            .background(Color(white: 0.08))
            .cornerRadius(16)
            .padding(.horizontal, 20)
        }
    }
    
    private func login() {
        isLoggingIn = true
        errorMessage = nil
        Task {
            do {
                _ = try await LastFmService.shared.loginWithPassword(
                    username: usernameInput.trimmingCharacters(in: .whitespaces),
                    password: passwordInput
                )
                await MainActor.run {
                    self.isLoggingIn = false
                    self.usernameInput = ""
                    self.passwordInput = ""
                    HapticFeedback.playNotification(type: .success)
                }
                await loadLastFmData()
            } catch {
                await MainActor.run {
                    self.errorMessage = "Login failed: \(error.localizedDescription)"
                    self.isLoggingIn = false
                    HapticFeedback.playNotification(type: .error)
                }
            }
        }
    }
    
    private func loadLastFmData() async {
        await MainActor.run { isLoadingData = true }
        let profile = await LastFmService.shared.getUserProfile()
        let recents = await LastFmService.shared.getRecentTracks(limit: 20)
        await MainActor.run {
            self.userProfile = profile
            self.recentScrobbles = recents
            self.isLoadingData = false
        }
    }
}
