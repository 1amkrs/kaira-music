import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  History,
  Compass,
  Play,
  MoreVertical,
  User,
  Disc,
  ListMusic,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { musicService, MusicArtist, MusicAlbum } from '../services/musicService';
import { AudioTrack } from '../audio/types';
import { TrackContextMenuModal } from '../components/TrackContextMenuModal';
import {
  DynamicTrackSkeleton,
  DynamicArtistGridSkeleton,
  DynamicAlbumGridSkeleton,
} from '../components/skeletons/DynamicSkeleton';

interface SearchPageProps {
  onBack?: () => void;
  onOpenArtist?: (artistName: string) => void;
  onOpenAlbum?: (albumTitle: string, artistName: string) => void;
}

type SearchFilter = 'Tracks' | 'Artists' | 'Albums' | 'Playlists';

const RECENT_SEARCHES_KEY = 'lastwave_recent_searches_v1';

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onBack,
  onOpenArtist,
  onOpenAlbum,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('Tracks');
  const [trackResults, setTrackResults] = useState<AudioTrack[]>([]);
  const [artistResults, setArtistResults] = useState<MusicArtist[]>([]);
  const [albumResults, setAlbumResults] = useState<MusicAlbum[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Context menu track selection
  const [menuTrack, setMenuTrack] = useState<AudioTrack | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Recent searches state with localStorage persistence
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['Kendrick Lamar', 'Olivia Rodrigo', 'Billie Eilish'];
    } catch {
      return ['Kendrick Lamar', 'Olivia Rodrigo', 'Billie Eilish'];
    }
  });

  const playTrack = usePlayerStore((s) => s.playTrack);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const userPlaylists = useLibraryStore((s) => s.playlists);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions with debouncing
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const fetched = await musicService.getSearchSuggestions(trimmed);
        setSuggestions(fetched);
      } catch {
        setSuggestions([]);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Execute search based on active filter
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setTrackResults([]);
      setArtistResults([]);
      setAlbumResults([]);
      setIsSearching(false);
      return;
    }

    let active = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        if (activeFilter === 'Tracks') {
          const tracks = await musicService.searchTracks(trimmed);
          if (active) {
            setTrackResults(tracks);
            setIsSearching(false);
          }
        } else if (activeFilter === 'Artists') {
          const artists = await musicService.searchArtists(trimmed);
          if (active) {
            setArtistResults(artists);
            setIsSearching(false);
          }
        } else if (activeFilter === 'Albums') {
          const albums = await musicService.searchAlbums(trimmed);
          if (active) {
            setAlbumResults(albums);
            setIsSearching(false);
          }
        } else {
          setIsSearching(false);
        }
      } catch {
        if (active) setIsSearching(false);
      }
    }, 280);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, activeFilter]);

  const saveRecentSearches = (updated: string[]) => {
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save recent searches', e);
    }
  };

  const handleAddRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const filtered = recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 10);
    saveRecentSearches(updated);
  };

  const handleRemoveRecentSearch = (term: string) => {
    const updated = recentSearches.filter((s) => s !== term);
    saveRecentSearches(updated);
  };

  const handleClearAllRecent = () => {
    saveRecentSearches([]);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleAddRecentSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      handleAddRecentSearch(query.trim());
    }
  };

  const filterTabs: SearchFilter[] = ['Tracks', 'Artists', 'Albums', 'Playlists'];

  const genreChips = [
    'Hip-Hop',
    'Pop',
    'Rock',
    'Indie',
    'R&B',
    'Electronic',
    'Lo-Fi',
    'Jazz',
    'Alternative',
    'Acoustic',
    'Synthwave',
    'Classical',
  ];

  const matchedPlaylists = userPlaylists.filter((pl) =>
    pl.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-full pb-32 pt-2 px-4 sm:px-6 max-w-4xl mx-auto font-sans bg-[#120E11] text-[#EDE0E2] transition-colors duration-300 select-none animate-in fade-in duration-300 space-y-5">
      {/* 1. Header Bar: Circular Back Button & Search Input Pill */}
      <div ref={searchContainerRef} className="relative pt-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : window.history.back())}
            className="w-11 h-11 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm flex-shrink-0"
            title="Back"
          >
            <ArrowLeft size={22} />
          </button>

          {/* Long Pill Search Input */}
          <div className="bg-[#241E22] rounded-full px-4 py-2.5 flex items-center gap-3 text-sm text-[#EDE0E2] flex-1 border border-white/5 focus-within:border-white/20 transition-all shadow-sm">
            <Search size={20} className="text-[#9E9094] flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search tracks, artists, albums..."
              className="bg-transparent placeholder:text-[#9E9094] text-white focus:outline-none w-full text-sm sm:text-base font-medium"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }}
                className="p-1 rounded-full text-[#9E9094] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>

        {/* Live Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-14 right-0 mt-2 bg-[#1E171B]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl z-40 space-y-1 animate-in fade-in duration-150">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E9094] px-3 py-1">
              Suggestions
            </div>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-[#EDE0E2] hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Search size={15} className="text-[#9E9094]" />
                  <span>{suggestion}</span>
                </div>
                <ExternalLink size={13} className="text-[#9E9094]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Filter Chips: Tracks, Artists, Albums, Playlists */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-[#BAC6D7] text-[#120E11] font-bold'
                  : 'bg-[#2A313D] text-[#DDE2EB] font-medium hover:bg-[#353E4E]'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* When Query is Empty: Recent Searches + Explore Genres & Moods */}
      {!query && (
        <div className="space-y-8 pt-2">
          {/* Recent Searches Section */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-3">
                <h3 className="text-sm font-bold text-[#EDE0E2]">Recent searches</h3>
                <button
                  type="button"
                  onClick={handleClearAllRecent}
                  className="text-xs font-medium text-[#9E9094] hover:text-white cursor-pointer transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-1">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div
                      onClick={() => {
                        setQuery(term);
                        handleAddRecentSearch(term);
                      }}
                      className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                    >
                      <History size={18} className="text-[#9E9094] flex-shrink-0" />
                      <span className="text-[15px] font-medium text-[#EDE0E2] truncate group-hover:text-white">
                        {term}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRecentSearch(term)}
                      className="p-1 text-[#9E9094] hover:text-white rounded-lg transition-colors"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explore Genres & Moods Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass size={18} className="text-[#EDE0E2]" />
              <h3 className="text-sm font-bold text-[#EDE0E2]">Explore genres & moods</h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {genreChips.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => {
                    setQuery(genre);
                    handleAddRecentSearch(genre);
                  }}
                  className="bg-[#211B1E] text-[#EDE0E2] text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer border border-white/[0.04] shadow-sm"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* When Query is present */}
      {query && (
        <div className="space-y-3 pt-1">
          {/* ==================== TRACKS TAB ==================== */}
          {activeFilter === 'Tracks' && (
            <div className="space-y-2">
              {isSearching ? (
                <DynamicTrackSkeleton count={7} />
              ) : trackResults.length > 0 ? (
                <div className="space-y-2 animate-in fade-in-50 duration-300">
                  {trackResults.map((track) => {
                    const isCurrent = currentTrack?.id === track.id;

                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          handleAddRecentSearch(query);
                          playTrack(track, trackResults);
                        }}
                        className={`bg-[#211B1E] rounded-2xl p-3 flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] transition-all shadow-sm ${
                          isCurrent ? 'border border-[#BAC6D7]/40 bg-[#BAC6D7]/10' : ''
                        }`}
                      >
                        {/* Left: Artwork & Info */}
                        <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900 shadow-sm border border-white/5">
                            <img
                              src={track.artworkUrl || '/icons/icon-512.png'}
                              alt={track.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isCurrent && isPlaying && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Play size={16} className="fill-[#BAC6D7] text-[#BAC6D7]" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4
                              className={`text-[15px] font-semibold truncate ${
                                isCurrent ? 'text-[#BAC6D7]' : 'text-[#EDE0E2] group-hover:text-white'
                              }`}
                            >
                              {track.title}
                            </h4>
                            <p className="text-xs text-[#9E9094] truncate mt-0.5">
                              {track.artist} {track.album ? `• ${track.album}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Right: Duration & 3-Dot Menu */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs tabular-nums text-[#9E9094]">
                            {formatDuration(track.duration)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuTrack(track);
                            }}
                            className="p-1.5 rounded-lg text-[#9E9094] hover:text-white transition-colors"
                            title="Options"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center animate-in fade-in-50 duration-300">
                  <Search size={36} className="text-[#9E9094]/40 mb-3" />
                  <p className="text-sm text-[#9E9094] font-medium">No tracks found for "{query}"</p>
                  <p className="text-xs text-[#9E9094]/70 mt-1">
                    Try searching for an artist or album name
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ==================== ARTISTS TAB ==================== */}
          {activeFilter === 'Artists' && (
            <div className="space-y-2">
              {isSearching ? (
                <DynamicArtistGridSkeleton count={8} />
              ) : artistResults.length > 0 ? (
                <div className="space-y-2 animate-in fade-in-50 duration-300">
                  {artistResults.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => {
                        handleAddRecentSearch(artist.name);
                        if (onOpenArtist) onOpenArtist(artist.name);
                      }}
                      className="bg-[#211B1E] rounded-2xl p-3 flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <img
                          src={artist.artworkUrl || '/icons/icon-512.png'}
                          alt={artist.name}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0 shadow-md border-2 border-white/10 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-base font-bold text-[#EDE0E2] group-hover:text-white truncate">
                              {artist.name}
                            </h4>
                            <CheckCircle2 size={15} className="text-[#BAC6D7] flex-shrink-0" />
                          </div>
                          <p className="text-xs text-[#9E9094] truncate mt-0.5">
                            Artist {artist.genres && artist.genres.length > 0 ? `• ${artist.genres.join(', ')}` : ''}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-[#BAC6D7] px-3 py-1.5 rounded-full bg-[#281E22] group-hover:bg-[#35282F] transition-colors">
                        View
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center animate-in fade-in-50 duration-300">
                  <User size={36} className="text-[#9E9094]/40 mb-3" />
                  <p className="text-sm text-[#9E9094] font-medium">No artists found for "{query}"</p>
                </div>
              )}
            </div>
          )}

          {/* ==================== ALBUMS TAB ==================== */}
          {activeFilter === 'Albums' && (
            <div>
              {isSearching ? (
                <DynamicAlbumGridSkeleton count={8} />
              ) : albumResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in-50 duration-300">
                  {albumResults.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => {
                        handleAddRecentSearch(album.title);
                        if (onOpenAlbum) onOpenAlbum(album.title, album.artist);
                      }}
                      className="bg-[#211B1E] rounded-2xl p-3 cursor-pointer group hover:bg-white/[0.04] transition-all shadow-sm flex flex-col"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-neutral-900 border border-white/10 shadow-sm">
                        <img
                          src={album.artworkUrl || '/icons/icon-512.png'}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="text-sm font-bold text-[#EDE0E2] truncate group-hover:text-white">
                        {album.title}
                      </h4>
                      <p className="text-xs text-[#9E9094] truncate mt-0.5">
                        {album.artist} • {album.releaseYear}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-span-full py-20 text-center flex flex-col items-center justify-center animate-in fade-in-50 duration-300">
                  <Disc size={36} className="text-[#9E9094]/40 mb-3" />
                  <p className="text-sm text-[#9E9094] font-medium">No albums found for "{query}"</p>
                </div>
              )}
            </div>
          )}

          {/* ==================== PLAYLISTS TAB ==================== */}
          {activeFilter === 'Playlists' && (
            <div className="space-y-2">
              {isSearching ? (
                <DynamicTrackSkeleton count={4} />
              ) : matchedPlaylists.length > 0 ? (
                <div className="space-y-2 animate-in fade-in-50 duration-300">
                  {matchedPlaylists.map((pl) => (
                    <div
                      key={pl.id}
                      className="bg-[#211B1E] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#2E2429] flex items-center justify-center text-[#BAC6D7]">
                          <ListMusic size={22} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#EDE0E2] group-hover:text-white">
                            {pl.name}
                          </h4>
                          <p className="text-xs text-[#9E9094] mt-0.5 tabular-nums">
                            {pl.tracks.length} {pl.tracks.length === 1 ? 'track' : 'tracks'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#9E9094]">Playlist</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center animate-in fade-in-50 duration-300">
                  <ListMusic size={36} className="text-[#9E9094]/40 mb-3" />
                  <p className="text-sm text-[#9E9094] font-medium">No playlists found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Track Context Menu Modal */}
      <TrackContextMenuModal
        isOpen={Boolean(menuTrack)}
        onClose={() => setMenuTrack(null)}
        track={menuTrack}
        onGoToArtist={(artist) => {
          setMenuTrack(null);
          if (onOpenArtist) onOpenArtist(artist);
        }}
        onGoToAlbum={(album, artist) => {
          setMenuTrack(null);
          if (onOpenAlbum) onOpenAlbum(album, artist || '');
        }}
      />
    </div>
  );
};

export default SearchPage;
