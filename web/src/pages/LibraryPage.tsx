import React, { useState } from 'react';
import {
  Plus,
  SlidersHorizontal,
  Music,
  Pin,
  MoreVertical,
  X,
  FolderPlus,
  Check,
  Play,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { ytMusicApi } from '../services/ytMusicApi';
import { Playlist } from '../services/storage';

interface LibraryPageProps {
  onOpenPlaylist?: (playlistId: string | 'liked') => void;
}

type SortOption = 'custom' | 'name' | 'tracks' | 'recent';

export const LibraryPage: React.FC<LibraryPageProps> = ({ onOpenPlaylist }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('custom');
  const [activeMenuPlaylistId, setActiveMenuPlaylistId] = useState<string | null>(null);
  const [isSyncingYtMusic, setIsSyncingYtMusic] = useState(false);

  // Form states
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const playlists = useLibraryStore((s) => s.playlists);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const deletePlaylist = useLibraryStore((s) => s.deletePlaylist);
  const importYtMusicPlaylists = useLibraryStore((s) => s.importYtMusicPlaylists);
  const isYtMusicConnected = useSettingsStore((s) => s.isYtMusicConnected);
  const playTrack = usePlayerStore((s) => s.playTrack);

  // Counts
  const playlistsCount = 1 + playlists.length;
  const totalTracksCount =
    likedTracks.length + playlists.reduce((sum, p) => sum + p.tracks.length, 0);

  // Formatted date for Liked Songs
  const likedSongsDate = 'Sep 16, 2026';

  // Sort user playlists
  const sortedPlaylists = [...playlists].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortOption === 'tracks') {
      return b.tracks.length - a.tracks.length;
    }
    if (sortOption === 'recent') {
      return b.createdAt - a.createdAt;
    }
    return 0; // custom / default order
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const created = createPlaylist(newPlaylistName.trim(), newPlaylistDesc.trim());
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setIsCreateModalOpen(false);
    if (onOpenPlaylist) {
      onOpenPlaylist(created.id);
    }
  };

  const handlePlayPlaylist = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
    setActiveMenuPlaylistId(null);
  };

  const handleDeletePlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deletePlaylist(id);
    setActiveMenuPlaylistId(null);
  };

  const handleSyncYtMusic = async () => {
    setIsSyncingYtMusic(true);
    try {
      const result = await ytMusicApi.syncTwoWay(playlists);
      if (result.importedPlaylists.length > 0) {
        importYtMusicPlaylists(result.importedPlaylists);
      }
    } catch (e) {
      console.warn('YTM sync error', e);
    } finally {
      setIsSyncingYtMusic(false);
    }
  };

  return (
    <div className="min-h-full pb-32 pt-2 px-4 sm:px-6 max-w-4xl mx-auto font-sans bg-[#120E11] text-[#EDE0E2] transition-colors duration-300 select-none animate-in fade-in duration-300 space-y-5">
      {/* 1. Top Header Bar (1:1 Native Android Parity) */}
      <div className="flex items-center justify-between pt-3">
        <div>
          <h1 className="text-3xl font-black font-sequel text-[#EDE0E2] tracking-tight">Playlist</h1>
          <p className="text-sm text-[#9E9094] mt-1">
            {playlistsCount} Playlists • {totalTracksCount} Tracks
          </p>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* YouTube Music Sync Button if connected */}
          {isYtMusicConnected && (
            <button
              onClick={handleSyncYtMusic}
              disabled={isSyncingYtMusic}
              className="bg-[#211B1E] text-white px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all shadow-sm border border-white/[0.04]"
              title="Sync YouTube Music Playlists"
            >
              <RefreshCw size={13} className={`text-red-500 ${isSyncingYtMusic ? 'animate-spin' : ''}`} />
              <span>{isSyncingYtMusic ? 'Syncing...' : 'Sync YTM'}</span>
            </button>
          )}

          {/* New Playlist '+' Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            title="Create New Playlist"
          >
            <Plus size={20} />
          </button>

          {/* Sort Pill Button */}
          <button
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="bg-[#211B1E] text-white px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all shadow-sm border border-white/[0.04]"
            title="Sort Playlists"
          >
            <SlidersHorizontal size={14} className="text-[#E2A9B0]" />
            <span>Sort</span>
          </button>

          {/* Sort Dropdown Menu */}
          {isSortMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-[#211B1E] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-30 space-y-0.5 animate-in zoom-in-95 duration-150">
              {(
                [
                  { id: 'custom', label: 'Default / Pinned' },
                  { id: 'name', label: 'Alphabetical (A-Z)' },
                  { id: 'tracks', label: 'Track Count' },
                  { id: 'recent', label: 'Recently Created' },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortOption(option.id);
                    setIsSortMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    sortOption === option.id
                      ? 'bg-[#E2A9B0] text-[#4A2027] font-bold'
                      : 'text-[#EDE0E2] hover:bg-white/5'
                  }`}
                >
                  <span>{option.label}</span>
                  {sortOption === option.id && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Playlist Items List */}
      <div className="space-y-3 pt-2">
        {/* Pinned Liked Songs Card (Exact match to screenshot) */}
        <div
          onClick={() => onOpenPlaylist?.('liked')}
          className="bg-[#211B1E] rounded-[24px] p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:scale-[0.99] transition-all shadow-md border border-white/[0.04] group"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
            <div className="w-14 h-14 rounded-2xl bg-[#2A2428] text-[#9E9094] flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors shadow-inner">
              <Music size={26} className="stroke-[1.75]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold text-white flex items-center gap-2 truncate">
                <span>Liked Songs</span>
                <span className="text-xs text-[#E2A9B0] flex items-center gap-0.5 bg-[#543339]/50 px-2 py-0.5 rounded-full">
                  <Pin size={10} className="fill-[#E2A9B0]" />
                  <span>Pinned</span>
                </span>
              </div>
              <div className="text-xs text-[#9E9094] mt-1 truncate">
                {likedTracks.length} tracks • {likedSongsDate}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPlaylist?.('liked');
            }}
            className="p-2 text-[#9E9094] hover:text-white rounded-full hover:bg-white/10 active:scale-95 transition-all flex-shrink-0"
            title="Options"
          >
            <MoreVertical size={18} />
          </button>
        </div>

        {/* User-Created Playlists */}
        {sortedPlaylists.map((playlist) => {
          const dateStr = new Date(playlist.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={playlist.id}
              onClick={() => onOpenPlaylist?.(playlist.id)}
              className="relative bg-[#211B1E] rounded-[24px] p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:scale-[0.99] transition-all shadow-md border border-white/[0.04] group"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                <div className="w-14 h-14 rounded-2xl bg-[#2A2428] text-[#9E9094] flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors shadow-inner">
                  <Music size={26} className="stroke-[1.75]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-white truncate">
                    {playlist.name}
                  </div>
                  <div className="text-xs text-[#9E9094] mt-1 truncate">
                    {playlist.tracks.length} tracks • {dateStr}
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuPlaylistId(
                      activeMenuPlaylistId === playlist.id ? null : playlist.id
                    );
                  }}
                  className="p-2 text-[#9E9094] hover:text-white rounded-full hover:bg-white/10 active:scale-95 transition-all flex-shrink-0"
                  title="Playlist options"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Playlist Context Menu */}
                {activeMenuPlaylistId === playlist.id && (
                  <div className="absolute right-0 top-10 w-40 bg-[#211B1E] border border-white/10 rounded-2xl p-1.5 shadow-2xl z-30 space-y-0.5">
                    {playlist.tracks.length > 0 && (
                      <button
                        onClick={(e) => handlePlayPlaylist(playlist, e)}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#EDE0E2] hover:bg-white/5 flex items-center gap-2 transition-colors"
                      >
                        <Play size={13} />
                        <span>Play All</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State when no user playlists exist */}
        {playlists.length === 0 && (
          <div className="py-12 text-center flex flex-col items-center justify-center text-[#9E9094] space-y-2">
            <p className="text-xs">No custom playlists yet.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs text-[#E2A9B0] font-semibold hover:underline"
            >
              + Create your first playlist
            </button>
          </div>
        )}
      </div>

      {/* 3. Create Playlist Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-sm bg-[#211B1E] border border-white/10 rounded-[28px] p-6 shadow-2xl space-y-5 select-none animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#543339] text-[#E2A9B0] flex items-center justify-center shadow-sm">
                  <FolderPlus size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">New Playlist</h3>
                  <p className="text-xs text-[#9E9094]">Save tracks for offline and playback</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#9E9094] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#9E9094] uppercase tracking-wider block mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="My Lossless Mix"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-[#181316] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-[#9E9094] focus:outline-none focus:border-[#E2A9B0] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9E9094] uppercase tracking-wider block mb-1.5">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Curated 24-bit audiophile tracks"
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full bg-[#181316] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-[#9E9094] focus:outline-none focus:border-[#E2A9B0] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#9E9094] hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="px-6 py-2 rounded-full bg-[#E2A9B0] text-[#4A2027] text-xs font-bold shadow-md hover:bg-[#EAA9B1] active:scale-95 transition-all disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
