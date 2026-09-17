import SwiftUI

public struct MainTabView: View {
    @ObservedObject private var playback = PlaybackEngine.shared
    @State private var selectedTab = 0
    @State private var showingNowPlaying = false
    
    public init() {}
    
    public var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $selectedTab) {
                HomeView()
                    .tabItem {
                        Label("Home", systemImage: "house.fill")
                    }
                    .tag(0)
                
                ExploreView()
                    .tabItem {
                        Label("Explore", systemImage: "sparkles")
                    }
                    .tag(1)
                
                SearchView()
                    .tabItem {
                        Label("Search", systemImage: "magnifyingglass")
                    }
                    .tag(2)
                
                LibraryView()
                    .tabItem {
                        Label("Library", systemImage: "music.note.list")
                    }
                    .tag(3)
                
                SettingsView()
                    .tabItem {
                        Label("Settings", systemImage: "gearshape.fill")
                    }
                    .tag(4)
            }
            .tint(.yellow)
            
            // Floating Mini Player docked above tab bar
            if playback.currentTrack != nil {
                MiniPlayerView {
                    showingNowPlaying = true
                }
                .padding(.bottom, 50)
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .fullScreenCover(isPresented: $showingNowPlaying) {
            NowPlayingView()
        }
        .preferredColorScheme(.dark)
    }
}
