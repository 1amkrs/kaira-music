import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  Shuffle,
  Play,
  ArrowUpDown,
  Lock,
  Heart,
  Pin,
  Image as ImageIcon,
  Share2,
  Trash2,
  Music,
  HardDrive,
} from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useOfflineStore } from '../store/useOfflineStore';
import { AudioTrack } from '../audio/types';
import { DownloadButton } from '../components/DownloadButton';

interface PlaylistDetailPageProps {
  playlistId: string | 'liked' | 'downloaded';
  onBack: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 MB';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const PlaylistDetailPage: React.FC<PlaylistDetailPageProps> = ({
  playlistId,
  onBack,
}) => {
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const playlists = useLibraryStore((s) => s.playlists);
  const deletePlaylist = useLibraryStore((s) => s.deletePlaylist);
  const toggleLike = useLibraryStore((s) => s.toggleLike);
  const isLiked = useLibraryStore((s) => s.isLiked);

  const downloadedTracks = useOfflineStore((s) => s.downloadedTracks);
  const totalStorageBytes = useOfflineStore((s) => s.totalStorageBytes);
  const clearAllDownloads = useOfflineStore((s) => s.clearAllDownloads);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [sortOrder, setSortOrder] = useState<'custom' | 'title' | 'artist'>('custom');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLikedPlaylist = playlistId === 'liked';
  const isDownloadedPlaylist = playlistId === 'downloaded';
  const customPlaylist = !isLikedPlaylist && !isDownloadedPlaylist
    ? playlists.find((p) => p.id === playlistId)
    : null;

  const title = isLikedPlaylist
    ? 'Liked Songs'
    : isDownloadedPlaylist
    ? 'Downloaded Songs'
    : customPlaylist?.name || 'Playlist';

  const rawTracks: AudioTrack[] = isLikedPlaylist
    ? likedTracks
    : isDownloadedPlaylist
    ? downloadedTracks.map((d) => ({
        id: d.id,
        title: d.title,
        artist: d.artist,
        album: d.album,
        artworkUrl: d.artworkUrl,
        duration: d.duration,
        streamUrl: d.streamUrl || '',
        quality: d.quality || 'LOSSLESS_CD',
        bitDepth: 16,
        sampleRate: 44100,
        codec: 'Local Audio',
      }))
    : customPlaylist?.tracks || [];

  // Sort tracks according to selection
  const tracks = [...rawTracks].sort((a, b) => {
    if (sortOrder === 'title') return a.title.localeCompare(b.title);
    if (sortOrder === 'artist') return a.artist.localeCompare(b.artist);
    return 0; // custom default
  });

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePlayAll = (shuffle = false) => {
    if (tracks.length === 0) return;
    if (shuffle) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    setIsMenuOpen(false);
  };

  const handleChangeCover = () => {
    alert('Cover image customization updated.');
    setIsMenuOpen(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Listen to ${title} on Kaira Music`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Playlist link copied to clipboard!');
    }
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (isLikedPlaylist) {
      alert('Liked Songs collection cannot be deleted.');
      return;
    }
    if (isDownloadedPlaylist) {
      if (confirm('Clear all downloaded offline songs?')) {
        clearAllDownloads();
      }
      return;
    }
    if (confirm(`Delete playlist "${title}"?`)) {
      if (customPlaylist) deletePlaylist(customPlaylist.id);
      onBack();
    }
  };

  const toggleSortOrder = () => {
    if (sortOrder === 'custom') setSortOrder('title');
    else if (sortOrder === 'title') setSortOrder('artist');
    else setSortOrder('custom');
  };

  return (
    <div className="min-h-full pb-32 pt-2 px-4 sm:px-6 max-w-4xl mx-auto font-sans bg-[#120E11] text-[#EDE0E2] transition-colors duration-300 select-none animate-in fade-in duration-300">
      {/* 1. Header Bar: Circular Back Button and 3-Dot Menu */}
      <div className="relative flex items-center justify-between py-4">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm"
          title="Back"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-11 h-11 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            title="More Options"
          >
            <MoreVertical size={20} />
          </button>

          {/* 3-Dot Dropdown Context Menu (media_1789553956735.png) */}
          {isMenuOpen && (
            <div className="absolute top-14 right-0 z-50 bg-[#211B1E] border border-white/10 rounded-[22px] p-1.5 shadow-2xl space-y-0.5 w-56 text-sm font-medium text-[#EDE0E2] animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={handleTogglePin}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors"
              >
                <Pin size={18} className={isPinned ? 'text-[#E2A9B0]' : 'text-[#9E9094]'} />
                <span>{isPinned ? 'Unpin playlist' : 'Pin playlist'}</span>
              </button>

              <button
                onClick={handleChangeCover}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors"
              >
                <ImageIcon size={18} className="text-[#9E9094]" />
                <span>Change cover image</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors"
              >
                <Share2 size={18} className="text-[#9E9094]" />
                <span>Export / Share</span>
              </button>

              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-rose-950/30 text-[#E2A9B0] text-left transition-colors"
              >
                <Trash2 size={18} />
                <span>{isDownloadedPlaylist ? 'Clear all downloads' : 'Delete playlist'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Playlist Title & Metadata */}
      <div className="mt-4">
        <h1 className="text-4xl sm:text-5xl font-black font-sequel text-[#EDE0E2] tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-sm font-medium text-[#9E9094] mt-2">
          {tracks.length} songs • {isDownloadedPlaylist ? `${formatBytes(totalStorageBytes)} • Offline Ready` : formattedDate}
        </p>
      </div>

      {/* 3. Action Controls (Shuffle & Play) */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => handlePlayAll(true)}
          className="w-12 h-12 rounded-full bg-[#2A313D] text-[#DDE2EB] flex items-center justify-center hover:bg-[#384252] shadow-sm active:scale-95 transition-all"
          title="Shuffle Play"
        >
          <Shuffle size={20} />
        </button>

        <button
          onClick={() => handlePlayAll(false)}
          className="bg-[#DDE2EB] text-[#120E11] font-bold px-7 py-3 rounded-full flex items-center gap-2 hover:bg-white text-sm shadow-sm active:scale-95 transition-all"
        >
          <Play size={16} className="fill-[#120E11]" />
          <span>Play</span>
        </button>
      </div>

      {/* 4. Ordering & Lock Bar */}
      <div className="flex items-center justify-between mt-7 pb-2 border-b border-white/[0.04]">
        <button
          onClick={toggleSortOrder}
          className="bg-[#2A313D] text-[#DDE2EB] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#384252] active:scale-95 transition-all"
        >
          <ArrowUpDown size={13} />
          <span>
            {sortOrder === 'custom' ? 'Custom order ↑' : sortOrder === 'title' ? 'Title order ↑' : 'Artist order ↑'}
          </span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#9E9094] font-medium">
          <Lock size={13} className="text-[#9E9094]" />
          <span>{tracks.length} tracks</span>
        </div>
      </div>

      {/* 5. Track Content Area */}
      <div className="mt-4 space-y-1.5">
        {tracks.length === 0 ? (
          <div className="py-28 text-center flex flex-col items-center justify-center">
            <Music size={40} className="text-[#9E9094]/40 mb-3" />
            <p className="text-sm text-[#9E9094] font-medium">No tracks in this playlist yet.</p>
          </div>
        ) : (
          tracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const liked = isLiked(track.id);

            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => playTrack(track, tracks)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer group transition-all ${
                  isCurrent
                    ? 'bg-[#211B1E] border border-[#E2A9B0]/30 text-[#E2A9B0]'
                    : 'hover:bg-[#211B1E]/60 text-white'
                }`}
              >
                {/* Left: Index, Art, Title, Artist */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                  <span className="text-xs font-sans tabular-nums text-[#9E9094] w-5 text-center flex-shrink-0">
                    {idx + 1}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 shadow-sm">
                    <img
                      src={track.artworkUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play size={16} className="fill-[#C6F100] text-[#C6F100]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className={`text-[15px] font-semibold truncate ${isCurrent ? 'text-[#E2A9B0]' : 'text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-[#9E9094] truncate mt-0.5">{track.artist}</p>
                  </div>
                </div>

                {/* Right: Duration, Download & Like Heart */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="text-xs font-sans tabular-nums text-[#9E9094]">
                    {formatDuration(track.duration)}
                  </span>

                  <DownloadButton track={track} size={16} />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track);
                    }}
                    className="p-1.5 rounded-full text-[#9E9094] hover:text-rose-400 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={liked ? 'fill-rose-500 text-rose-500' : 'text-[#9E9094]'}
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
