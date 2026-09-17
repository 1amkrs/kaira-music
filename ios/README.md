# Kaira Music — Native iOS Application

A first-class, native iOS client for **Kaira Music**, built with Swift 5.9+, SwiftUI, AVFoundation, and CoreAudio, designed for iOS 17+.

## Architecture & Design Principles

The Kaira Music iOS app is designed following clean, modular MVVM principles with unidirectional data flow and Swift Concurrency (`async/await`, `@MainActor`, `Sendable`).

```
ios/
├── Package.swift                    # Swift Package Manager manifest
├── Kaira/
│   ├── App/
│   │   └── KairaApp.swift           # Application lifecycle & environment configuration
│   ├── Core/
│   │   ├── Audio/
│   │   │   ├── AudioSessionManager.swift  # AVAudioSession long-form audio & interruption handling
│   │   │   ├── EqualizerEngine.swift      # 10-band parametric equalizer & studio presets
│   │   │   ├── NowPlayingManager.swift    # MPNowPlayingInfoCenter & MPRemoteCommandCenter
│   │   │   └── PlaybackEngine.swift       # Core native playback engine with queue & scrubbing
│   │   ├── Authentication/
│   │   │   └── LastFmAuthManager.swift    # Secure session token handling
│   │   ├── Configuration/
│   │   │   └── AppConfig.swift            # Static endpoints, specs, and default keys
│   │   ├── Networking/
│   │   │   ├── APIClient.swift            # Resilient URLSession client with retries & decoding
│   │   │   └── NetworkError.swift         # Typed network failure definitions
│   │   ├── Storage/
│   │   │   ├── KeychainManager.swift      # Apple Keychain Services wrapper for tokens
│   │   │   └── KairaStorage.swift         # Local sandbox persistence for likes, history, playlists
│   │   └── Utilities/
│   │       ├── ArtworkColorExtractor.swift # CoreImage dynamic ambient backdrops
│   │       ├── HapticFeedback.swift       # Apple Taptic Engine feedback generators
│   │       ├── MD5.swift                  # Cryptographic MD5 for Last.fm API signatures
│   │       └── TimeFormatter.swift        # Duration formatting utilities
│   ├── Models/
│   │   ├── AudioQuality.swift             # Hi-Res 24/192, 24/96, Lossless CD, High 320
│   │   ├── AudioTrack.swift               # Playable track definition with audio specs
│   │   ├── DownloadedTrack.swift          # Sandbox-cached track representation
│   │   ├── LastFmModels.swift             # Last.fm user, scrobble, and session models
│   │   ├── LyricLine.swift                # Synchronized LRC lines & millisecond timestamps
│   │   ├── MusicAlbum.swift               # Album discography and tracklist
│   │   ├── MusicArtist.swift              # Artist metadata and biography
│   │   └── Playlist.swift                 # Custom user playlists
│   ├── Services/
│   │   ├── Downloads/
│   │   │   └── DownloadManager.swift      # Background URLSession downloads & sandbox storage
│   │   ├── LastFM/
│   │   │   └── LastFmService.swift        # Scrobbling, Now Playing, and Loved tracks
│   │   ├── Lyrics/
│   │   │   └── LrclibAPI.swift            # LRCLIB synchronized lyrics client & parser
│   │   ├── Music/
│   │   │   ├── ClashflacAPI.swift         # Curated 24-bit studio master catalog
│   │   │   └── MusicService.swift         # Multi-tiered discovery & iTunes search
│   │   └── Recommendations/
│   │       └── RecommendationEngine.swift # Genre DNA & acoustic signature mixes
│   ├── Components/
│   │   ├── AirPlayView.swift              # AVRoutePickerView wrapper for AirPlay
│   │   ├── AlbumCardView.swift            # Album presentation card
│   │   ├── ArtistCardView.swift           # Artist circular presentation card
│   │   ├── CachedAsyncImage.swift         # High-performance in-memory image cache
│   │   ├── QualityBadgeView.swift         # Lossless & Hi-Res audiophile badges
│   │   └── TrackRowView.swift             # Interactive track row with options menu
│   ├── Features/
│   │   ├── Album/
│   │   │   └── AlbumDetailView.swift      # Full album tracklist & download action
│   │   ├── Artist/
│   │   │   └── ArtistDetailView.swift     # Artist hero, discography & popular tracks
│   │   ├── Explore/
│   │   │   └── ExploreView.swift          # Genre DNA exploration & taste profile
│   │   ├── Home/
│   │   │   └── HomeView.swift             # Discovery home, new releases & studio masters
│   │   ├── LastFM/
│   │   │   └── LastFmView.swift           # Scrobble stats, recent history & login
│   │   ├── Library/
│   │   │   └── LibraryView.swift          # Liked tracks, offline downloads & playlists
│   │   ├── Navigation/
│   │   │   └── MainTabView.swift          # Root navigation with floating MiniPlayer
│   │   ├── NowPlaying/
│   │   │   ├── EqualizerSheetView.swift   # Interactive 10-band equalizer sheet
│   │   │   ├── LyricsView.swift           # Real-time auto-scrolling synchronized lyrics
│   │   │   ├── MiniPlayerView.swift       # Persistent floating player docked above tabs
│   │   │   ├── NowPlayingView.swift       # Flagship player with atmospheric glow & specs
│   │   │   └── QueueView.swift            # Reorderable and editable play queue
│   │   └── Search/
│   │       └── SearchView.swift           # Live search suggestions, scopes & history
│   └── Resources/
│       ├── Assets.xcassets/               # Universal AppIcon, colors, accents
│       ├── Info.plist                     # Background audio modes & network configuration
│       └── Kaira.entitlements             # Keychain sharing & audio entitlements
└── KairaTests/
    ├── DownloadManagerTests.swift         # Download lifecycle unit tests
    ├── LastFmSignatureTests.swift         # Last.fm MD5 signature tests
    ├── LyricsParserTests.swift            # LRC timestamp parser tests
    └── PlaybackEngineTests.swift          # Queue & repeat mode tests
```

## Key Features

1. **Native Audiophile Audio Pipeline**:
   - Bit-perfect native decoding supporting FLAC, Opus, ALAC, and AAC.
   - Real-time technical metadata inspection: 24-bit / 192 kHz FLAC with sample rate and bit depth badges.
   - Long-form audio policy with `AVAudioSession` properly configured for background playback.
   - Full Lock Screen and Control Center integration via `MPNowPlayingInfoCenter` and `MPRemoteCommandCenter`.
   - Interruptions and route change handling: automatically pauses when headphones/Bluetooth disconnect.

2. **Synchronized Lyrics (LRCLIB)**:
   - High-precision millisecond timestamp synchronization.
   - Smooth auto-scrolling with current line magnification.
   - Tap-to-seek: tap any lyric line to immediately jump playback to that timestamp.
   - Instrumental and plain lyric fallbacks.

3. **Offline Lossless Downloads**:
   - Complete sandboxed downloads surviving app restarts.
   - Progress tracking, storage management (MB/GB used), and clear storage options.
   - Offline-first playback priority when cached.

4. **Last.fm Integration**:
   - Secure Keychain storage for session tokens.
   - Automatic scrobbling after 50% track completion or 4 minutes.
   - Live "Now Playing" status update to Last.fm.
   - Recent scrobbles feed and playcount inspection.

5. **10-Band Studio Graphic Equalizer**:
   - Real-time gains (-12 dB to +12 dB) across 32Hz to 16kHz.
   - Curated acoustic presets: *Audiophile Flat*, *Bass Boost*, *Vocal Clarity*, *Electronic Club*, *Acoustic Warmth*, *Rock Dynamic*, *Treble Air*.

6. **Premium Dark iOS Design**:
   - Deep obsidian/onyx canvas (`#0A0A0C`) with warm gold/amber accents.
   - Dynamic ambient backdrops extracted from album artwork using CoreImage.
   - Fluid interactive gestures, swipe-to-skip, and Apple Taptic Engine feedback.
