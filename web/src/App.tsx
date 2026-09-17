import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { NavigationShell, NavTab } from './components/NavigationShell';
import { FeedPage } from './pages/FeedPage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';
import { PlaylistDetailPage } from './pages/PlaylistDetailPage';
import { NewReleasesPage } from './pages/NewReleasesPage';
import { ArtistPage } from './pages/ArtistPage';
import { AlbumPage } from './pages/AlbumPage';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { EqualizerModal } from './components/EqualizerModal';
import { SignalPathModal } from './components/SignalPathModal';
import { OnboardingModal } from './components/OnboardingModal';
import { lastFmApi } from './services/lastFmApi';
import { useSettingsStore } from './store/useSettingsStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { MusicAlbum } from './services/musicService';
import { SplashLoadScreen } from './components/SplashLoadScreen';
import { applyAccentTheme } from './theme/accentThemes';

export const App: React.FC = () => {
  // Global desktop keyboard shortcuts
  useKeyboardShortcuts();

  const [activeTab, setActiveTab] = useState<NavTab>('feed');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | 'liked' | null>(null);
  const [selectedArtistName, setSelectedArtistName] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<MusicAlbum | null>(null);
  const [isNewReleasesOpen, setIsNewReleasesOpen] = useState<boolean>(false);
  const [isGenresOpen, setIsGenresOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const hasCompletedOnboarding = useSettingsStore((s) => s.hasCompletedOnboarding);
  const setHasCompletedOnboarding = useSettingsStore((s) => s.setHasCompletedOnboarding);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!hasCompletedOnboarding);

  const accentTheme = useSettingsStore((s) => s.accentTheme);
  const customAccentColor = useSettingsStore((s) => s.customAccentColor);
  const setLastFmConfig = useSettingsStore((s) => s.setLastFmConfig);
  const setLastFmProfile = useSettingsStore((s) => s.setLastFmProfile);

  useEffect(() => {
    applyAccentTheme(accentTheme, customAccentColor);
  }, [accentTheme, customAccentColor]);

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, [hasCompletedOnboarding]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);
      (async () => {
        try {
          const { username, sessionKey } = await lastFmApi.completeWebAuth(token);
          setLastFmConfig({ username, sessionKey });
          const profile = await lastFmApi.getUserInfo(username);
          if (profile) {
            setLastFmProfile({ avatarUrl: profile.image, playCount: profile.playcount });
          }
          setToast({
            type: 'success',
            message: `Successfully connected Last.fm account (@${username})!`,
          });
        } catch (err: any) {
          console.error('Last.fm web auth error', err);
          setToast({
            type: 'error',
            message: `Last.fm auth failed: ${err.message || 'Unknown error'}`,
          });
        }
      })();
    }
  }, [setLastFmConfig, setLastFmProfile]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleTabChange = (tab: NavTab) => {
    setSelectedPlaylistId(null);
    setSelectedArtistName(null);
    setSelectedAlbum(null);
    setIsNewReleasesOpen(false);
    setIsGenresOpen(false);
    setActiveTab(tab);
  };

  const handleOpenArtist = (name: string) => {
    setSelectedAlbum(null);
    setSelectedPlaylistId(null);
    setIsNewReleasesOpen(false);
    setSelectedArtistName(name);
  };

  const handleOpenAlbum = (albumOrTitle: string | MusicAlbum, artistName?: string) => {
    setSelectedArtistName(null);
    setSelectedPlaylistId(null);
    setIsNewReleasesOpen(false);
    if (typeof albumOrTitle === 'string') {
      setSelectedAlbum({
        id: `album-${encodeURIComponent(albumOrTitle)}`,
        title: albumOrTitle,
        artist: artistName || '',
        artworkUrl: '',
        releaseYear: '',
      });
    } else {
      setSelectedAlbum(albumOrTitle);
    }
  };

  const isDetailPage = Boolean(
    selectedPlaylistId ||
      isNewReleasesOpen ||
      activeTab === 'settings' ||
      isGenresOpen ||
      selectedArtistName ||
      selectedAlbum
  );

  return (
    <>
      <SplashLoadScreen />
      <NavigationShell
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hideBottomNav={isDetailPage}
        onOpenPlaylist={(id) => {
          setSelectedArtistName(null);
          setSelectedAlbum(null);
          setSelectedPlaylistId(id);
        }}
      >
        {selectedArtistName ? (
          <div
            key={`artist-${selectedArtistName}`}
            className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
          >
            <ArtistPage
              artistName={selectedArtistName}
              onBack={() => setSelectedArtistName(null)}
              onOpenAlbum={handleOpenAlbum}
            />
          </div>
        ) : selectedAlbum ? (
          <div
            key={`album-${selectedAlbum.id || selectedAlbum.title}`}
            className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
          >
            <AlbumPage
              album={selectedAlbum}
              onBack={() => setSelectedAlbum(null)}
              onOpenArtist={handleOpenArtist}
            />
          </div>
        ) : selectedPlaylistId ? (
          <div
            key={`playlist-${selectedPlaylistId}`}
            className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
          >
            <PlaylistDetailPage
              playlistId={selectedPlaylistId}
              onBack={() => setSelectedPlaylistId(null)}
            />
          </div>
        ) : isNewReleasesOpen ? (
          <div
            key="new-releases"
            className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
          >
            <NewReleasesPage onBack={() => setIsNewReleasesOpen(false)} />
          </div>
        ) : (
          <>
            {activeTab === 'feed' && (
              <div
                key="tab-feed"
                className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
              >
                <FeedPage
                  onNavigateTab={handleTabChange}
                  onOpenPlaylist={(id) => {
                    setSelectedArtistName(null);
                    setSelectedAlbum(null);
                    setSelectedPlaylistId(id);
                  }}
                  onOpenNewReleases={() => setIsNewReleasesOpen(true)}
                  onOpenArtist={handleOpenArtist}
                  onOpenAlbum={handleOpenAlbum}
                />
              </div>
            )}
            {activeTab === 'stats' && (
              <div
                key="tab-stats"
                className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
              >
                <StatsPage
                  onNavigateTab={handleTabChange}
                  onSubViewChange={(isSubView) => setIsGenresOpen(isSubView)}
                />
              </div>
            )}
            {activeTab === 'search' && (
              <div
                key="tab-search"
                className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
              >
                <SearchPage
                  onBack={() => handleTabChange('feed')}
                  onOpenArtist={handleOpenArtist}
                  onOpenAlbum={handleOpenAlbum}
                />
              </div>
            )}
            {activeTab === 'library' && (
              <div
                key="tab-library"
                className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
              >
                <LibraryPage
                  onOpenPlaylist={(id) => {
                    setSelectedArtistName(null);
                    setSelectedAlbum(null);
                    setSelectedPlaylistId(id);
                  }}
                />
              </div>
            )}
            {activeTab === 'settings' && (
              <div
                key="tab-settings"
                className="animate-in fade-in-50 slide-in-from-bottom-1 duration-300 ease-out min-h-full"
              >
                <SettingsPage
                  onBack={() => handleTabChange('feed')}
                  onOpenOnboarding={() => setIsOnboardingOpen(true)}
                />
              </div>
            )}
          </>
        )}
      </NavigationShell>

      {/* Floating Mini Player */}
      <MiniPlayer isSubPage={isDetailPage} />

      {/* Overlays and Modals */}
      <FullPlayerModal
        onGoToArtist={handleOpenArtist}
        onGoToAlbum={handleOpenAlbum}
      />
      <EqualizerModal />
      <SignalPathModal />
      <OnboardingModal
        isOpen={!hasCompletedOnboarding || isOnboardingOpen}
        onClose={() => {
          setHasCompletedOnboarding(true);
          setIsOnboardingOpen(false);
        }}
      />

      {/* Interactive Notification Toast */}
      {toast && (
        <aside
          aria-label="Notification"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-2xl bg-slate-900/90 border border-white/15 shadow-2xl text-white text-sm max-w-md w-[92vw]"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="flex-1 font-medium select-none">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Hidden YouTube Audio Bridge Mount */}
      <div
        id="lastwave-youtube-bridge"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: 200,
          height: 200,
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -100,
        }}
      />
    </>
  );
};

export default App;
