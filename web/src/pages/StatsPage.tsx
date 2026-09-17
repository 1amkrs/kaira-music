import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  User,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
  Clock,
  ChevronDown,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { NavTab } from '../components/NavigationShell';
import { AudioTrack } from '../audio/types';
import { lastFmApi, LastFmScrobbleTrack } from '../services/lastFmApi';

interface StatsPageProps {
  onNavigateTab?: (tab: NavTab) => void;
  onSubViewChange?: (isSubView: boolean) => void;
}

interface GenreStat {
  name: string;
  percentage: number;
}

const GENRES_DATA: GenreStat[] = [
  { name: 'Pop', percentage: 100 },
  { name: 'Female vocalists', percentage: 90 },
  { name: 'Electronic', percentage: 71 },
  { name: 'Rnb', percentage: 68 },
  { name: 'Hip-hop', percentage: 47 },
  { name: 'Rock', percentage: 46 },
  { name: 'Rap', percentage: 35 },
  { name: 'Alternative', percentage: 26 },
  { name: 'Indie', percentage: 26 },
  { name: 'Dance', percentage: 26 },
  { name: 'Indie pop', percentage: 25 },
  { name: 'Hip hop', percentage: 25 },
  { name: 'Alternative rock', percentage: 17 },
  { name: 'Ariana grande', percentage: 17 },
  { name: 'American', percentage: 17 },
];

const FALLBACK_RECENT_SCROBBLES = [
  {
    id: 'scrobble-1',
    title: 'drivers license',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    artwork: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe94728291353e001e',
    timeAgo: '2m ago',
  },
  {
    id: 'scrobble-2',
    title: 'deja vu',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    artwork: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe94728291353e001e',
    timeAgo: '14m ago',
  },
  {
    id: 'scrobble-3',
    title: 'good 4 u',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    artwork: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe94728291353e001e',
    timeAgo: '32m ago',
  },
  {
    id: 'scrobble-4',
    title: 'traitor',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    artwork: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe94728291353e001e',
    timeAgo: '1h ago',
  },
  {
    id: 'scrobble-5',
    title: 'vampire',
    artist: 'Olivia Rodrigo',
    album: 'GUTS',
    artwork: 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
    timeAgo: '3h ago',
  },
  {
    id: 'scrobble-6',
    title: 'bad idea right?',
    artist: 'Olivia Rodrigo',
    album: 'GUTS',
    artwork: 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
    timeAgo: '5h ago',
  },
  {
    id: 'scrobble-7',
    title: 'get him back!',
    artist: 'Olivia Rodrigo',
    album: 'GUTS',
    artwork: 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
    timeAgo: 'Yesterday',
  },
];

function formatTimeAgo(uts: number): string {
  const diffSec = Math.max(0, Math.floor(Date.now() / 1000 - uts));
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export const StatsPage: React.FC<StatsPageProps> = ({
  onNavigateTab,
  onSubViewChange,
}) => {
  const [view, setView] = useState<'stats' | 'genres'>('stats');
  const [activeListFilter, setActiveListFilter] = useState<'Recent' | 'Top Tracks' | 'Top Artists'>('Recent');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const lastFmUsername = useSettingsStore((s) => s.lastFmUsername);
  const isLastFmConnected = useSettingsStore((s) => s.isLastFmConnected);
  const lastFmPlayCount = useSettingsStore((s) => s.lastFmPlayCount);
  const setLastFmProfile = useSettingsStore((s) => s.setLastFmProfile);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const recentTracks = useLibraryStore((s) => s.recentTracks);

  const [liveScrobbles, setLiveScrobbles] = useState<LastFmScrobbleTrack[]>([]);
  const [totalScrobbles, setTotalScrobbles] = useState<number>(lastFmPlayCount || 0);

  useEffect(() => {
    if (!isLastFmConnected && !lastFmUsername) return;

    let isMounted = true;
    Promise.all([
      lastFmApi.getRecentTracks(lastFmUsername || undefined, 20),
      lastFmApi.getUserInfo(lastFmUsername || undefined),
    ])
      .then(([tracks, profile]) => {
        if (!isMounted) return;
        if (tracks && tracks.length > 0) {
          setLiveScrobbles(tracks);
        }
        if (profile) {
          setTotalScrobbles(profile.playcount);
          setLastFmProfile({ avatarUrl: profile.image, playCount: profile.playcount });
        }
      })
      .catch((err) => {
        console.warn('Could not fetch live Last.fm scrobbles', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isLastFmConnected, lastFmUsername, setLastFmProfile]);

  const handleSetView = (nextView: 'stats' | 'genres') => {
    setView(nextView);
    if (onSubViewChange) {
      onSubViewChange(nextView === 'genres');
    }
  };

  // Now Playing Display fallback
  const nowPlayingTitle = currentTrack?.title || 'the cure';
  const nowPlayingArtist = currentTrack?.artist || 'Olivia Rodrigo';
  const nowPlayingArtwork =
    currentTrack?.artworkUrl ||
    'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d';

  // -------------------------------------------------------------
  // VIEW 2: YOUR GENRES SCREEN (1:1 Android Parity)
  // -------------------------------------------------------------
  if (view === 'genres') {
    return (
      <div className="min-h-full pb-32 pt-2 px-4 sm:px-6 max-w-4xl mx-auto font-sans bg-[#120E11] text-[#EDE0E2] transition-colors duration-300 select-none animate-in fade-in duration-300 space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSetView('stats')}
              className="w-11 h-11 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm flex-shrink-0"
              title="Back to Stats"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold font-sequel text-[#EDE0E2] leading-tight">Your Genres</h1>
              <p className="text-xs text-[#9E9094] mt-0.5">Based on your listening history</p>
            </div>
          </div>

          <button
            onClick={() => {}}
            className="bg-[#2A2428] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all"
          >
            <span>Overall</span>
            <ChevronDown size={14} className="text-[#9E9094]" />
          </button>
        </div>

        {/* Genre Progress Bar List */}
        <div className="space-y-4 pt-1">
          {GENRES_DATA.map((genre) => (
            <div key={genre.name} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#EDE0E2] group-hover:text-white transition-colors">
                  {genre.name}
                </span>
                <span className="text-xs font-bold text-[#E2A9B0]">{genre.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#2A2428] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#E2A9B0] transition-all duration-700 ease-out"
                  style={{ width: `${genre.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: MAIN STATS & SCROBBLES SCREEN (1:1 Android Parity)
  // -------------------------------------------------------------
  return (
    <div className="min-h-full pb-32 pt-2 px-4 sm:px-6 max-w-4xl mx-auto font-sans bg-[#120E11] text-[#EDE0E2] transition-colors duration-300 select-none animate-in fade-in duration-300 space-y-5">
      {/* 1. Top Header */}
      <div className="flex items-center justify-between pt-3">
        <h1 className="text-3xl font-bold font-sequel text-[#EDE0E2] tracking-tight">Stats</h1>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleSetView('genres')}
            className="w-10 h-10 rounded-full bg-[#211B1E] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            title="Explore Vibes & Genres"
          >
            <Compass size={19} />
          </button>
          <button
            onClick={() => onNavigateTab?.('search')}
            className="w-10 h-10 rounded-full bg-[#211B1E] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            title="Search"
          >
            <Search size={19} />
          </button>
          <button
            onClick={() => onNavigateTab?.('settings')}
            className="w-10 h-10 rounded-full bg-[#211B1E] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            title="Profile & Settings"
          >
            <User size={19} />
          </button>
        </div>
      </div>

      {/* 2. Sub-bar: Username & Listening Time Pills */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => onNavigateTab?.('settings')}
          className="bg-[#211B1E] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm border border-white/[0.04] cursor-pointer hover:bg-white/10 transition-colors"
        >
          <span className={`w-2 h-2 rounded-full ${isLastFmConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>{isLastFmConnected ? `@${lastFmUsername}` : 'Connect Last.fm'}</span>
        </div>

        <div className="bg-[#211B1E] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm border border-white/[0.04]">
          <Headphones size={13} className="text-[#E2A9B0]" />
          <span className="tabular-nums">Live Sync</span>
        </div>
      </div>

      {/* 3. Stats Cards Grid */}
      <div className="bg-[#211B1E] rounded-[28px] p-3 space-y-2.5 shadow-lg border border-white/[0.04]">
        {/* Hero Card: Scrobbles */}
        <div
          onClick={() => handleSetView('genres')}
          className="bg-[#543339] rounded-[22px] p-5 flex items-center justify-between text-white cursor-pointer hover:bg-[#633D44] active:scale-[0.99] transition-all shadow-md group"
        >
          <div className="flex flex-col items-center justify-center flex-1 pr-2">
            <span className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
              {totalScrobbles > 0 ? totalScrobbles.toLocaleString() : '—'}
            </span>
            <span className="text-xs text-[#D5BFC3] font-medium mt-0.5">Scrobbles</span>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#E2A9B0] text-[#4A2027] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
            title="View Genres Breakdown"
          >
            <ArrowRight size={20} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Bottom 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#181316] rounded-2xl py-3 px-2 text-center border border-white/[0.03]">
            <div className="text-xl font-bold text-white">—</div>
            <div className="text-[11px] text-[#9E9094] mt-0.5 font-medium">Tracks</div>
          </div>
          <div className="bg-[#181316] rounded-2xl py-3 px-2 text-center border border-white/[0.03]">
            <div className="text-xl font-bold text-white">—</div>
            <div className="text-[11px] text-[#9E9094] mt-0.5 font-medium">Artists</div>
          </div>
          <div className="bg-[#181316] rounded-2xl py-3 px-2 text-center border border-white/[0.03]">
            <div className="text-xl font-bold text-white">—</div>
            <div className="text-[11px] text-[#9E9094] mt-0.5 font-medium">Albums</div>
          </div>
        </div>
      </div>

      {/* 4. List Section */}
      <div className="space-y-3.5 pt-2">
        {/* List Header with Dropdown Filter */}
        <div className="flex items-center justify-between relative">
          <h2 className="text-xl font-bold text-white">List</h2>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="bg-[#211B1E] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all border border-white/[0.04]"
            >
              <Clock size={13} className="text-[#E2A9B0]" />
              <span>{activeListFilter}</span>
              <ChevronDown size={14} className="text-[#9E9094]" />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-[#211B1E] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-30 space-y-0.5">
                {(['Recent', 'Top Tracks', 'Top Artists'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveListFilter(filter);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      activeListFilter === filter
                        ? 'bg-[#E2A9B0] text-[#4A2027] font-bold'
                        : 'text-[#EDE0E2] hover:bg-white/5'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Now Playing Card (Exact Match to Screenshot #382328) */}
        <div className="bg-[#382328] rounded-2xl p-3 flex items-center justify-between shadow-sm border border-white/[0.06]">
          <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800 shadow-inner">
              <img
                src={nowPlayingArtwork}
                alt={nowPlayingTitle}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                  <span className="w-1 h-3 bg-[#E2A9B0] rounded-full animate-pulse" />
                  <span className="w-1 h-5 bg-[#E2A9B0] rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-4 bg-[#E2A9B0] rounded-full animate-pulse delay-150" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate">{nowPlayingTitle}</div>
              <div className="text-xs text-[#D5BFC3] truncate mt-0.5">{nowPlayingArtist}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#E2A9B0] text-[#4A2027] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A2027] animate-pulse" />
              <span>Now Playing</span>
            </div>
            <button
              onClick={() => {}}
              className="p-1.5 text-[#D5BFC3] hover:text-white rounded-full hover:bg-white/10 active:scale-95 transition-all"
              title="More Options"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Recent Scrobbles List */}
        <div className="space-y-1.5 pt-1">
          {liveScrobbles.length > 0
            ? liveScrobbles.map((track, idx) => (
                <div
                  key={`${track.title}-${track.dateUTS}-${idx}`}
                  onClick={() => {
                    const audioTrack: AudioTrack = {
                      id: `lfm-${track.dateUTS}-${idx}`,
                      title: track.title,
                      artist: track.artist,
                      album: track.album,
                      duration: 210,
                      artworkUrl: track.artwork,
                      streamUrl: 'https://archive.org/download/test-flac-audio/track01.flac',
                      quality: 'LOSSLESS_CD',
                      bitDepth: 16,
                      sampleRate: 44100,
                      codec: 'FLAC',
                    };
                    playTrack(audioTrack);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/[0.04] active:bg-white/[0.08] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <img
                      src={track.artwork}
                      alt={track.title}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#EDE0E2] group-hover:text-white truncate">
                        {track.title}
                      </div>
                      <div className="text-xs text-[#9E9094] truncate mt-0.5">{track.artist}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-[#9E9094] font-medium tabular-nums">
                      {track.isNowPlaying ? (
                        <span className="text-emerald-400 font-semibold">Scrobbling</span>
                      ) : (
                        formatTimeAgo(track.dateUTS)
                      )}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1.5 text-[#9E9094] hover:text-white rounded-full hover:bg-white/10 active:scale-95 transition-all"
                      title="Track options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))
            : FALLBACK_RECENT_SCROBBLES.map((track) => (
                <div
                  key={track.id}
                  onClick={() => {
                    const audioTrack: AudioTrack = {
                      id: track.id,
                      title: track.title,
                      artist: track.artist,
                      album: track.album,
                      duration: 210,
                      artworkUrl: track.artwork,
                      streamUrl: 'https://archive.org/download/test-flac-audio/track01.flac',
                      quality: 'LOSSLESS_CD',
                      bitDepth: 16,
                      sampleRate: 44100,
                      codec: 'FLAC',
                    };
                    playTrack(audioTrack);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/[0.04] active:bg-white/[0.08] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <img
                      src={track.artwork}
                      alt={track.title}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#EDE0E2] group-hover:text-white truncate">
                        {track.title}
                      </div>
                      <div className="text-xs text-[#9E9094] truncate mt-0.5">{track.artist}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-[#9E9094] font-medium tabular-nums">{track.timeAgo}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1.5 text-[#9E9094] hover:text-white rounded-full hover:bg-white/10 active:scale-95 transition-all"
                      title="Track options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
