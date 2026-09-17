import React, { useState } from 'react';
import {
  Shuffle,
  Play,
  ListPlus,
  Timer,
  Tag,
  ListMusic,
  User,
  Disc,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';
import { AudioTrack } from '../audio/types';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';

interface TrackContextMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: AudioTrack | null;
  onStartMix?: () => void;
  onGoToArtist?: (artist: string) => void;
  onGoToAlbum?: (album: string, artist?: string) => void;
}

export const TrackContextMenuModal: React.FC<TrackContextMenuModalProps> = ({
  isOpen,
  onClose,
  track,
  onStartMix,
  onGoToArtist,
  onGoToAlbum,
}) => {
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const playlists = useLibraryStore((s) => s.playlists);
  const addTrackToPlaylist = useLibraryStore((s) => s.addTrackToPlaylist);

  if (!isOpen || !track) return null;

  const handleStartMix = () => {
    onClose();
    if (onStartMix) {
      onStartMix();
    } else {
      playTrack(track);
    }
  };

  const handlePlay = () => {
    playTrack(track);
    onClose();
  };

  const handlePlayNext = () => {
    addToQueue(track);
    onClose();
  };

  const handleSetTimer = (mins: number | null) => {
    setTimerMinutes(mins);
    setShowTimerPicker(false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#1D161B]/98 backdrop-blur-2xl rounded-t-[32px] p-5 pb-8 border-t border-white/10 shadow-2xl select-none animate-in slide-in-from-bottom duration-300 space-y-4"
      >
        {/* Drag Handle */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />

        {/* Hero Highlight Action: Start Mix with this Song */}
        <div
          onClick={handleStartMix}
          className="w-full bg-[#BCC8DB] text-[#181E27] rounded-2xl p-4 flex items-center gap-3.5 shadow-lg hover:bg-[#CAD4E4] active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#202734] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Shuffle size={20} className="stroke-[2.5]" />
          </div>
          <div className="text-base font-bold tracking-tight">Start Mix with this Song</div>
        </div>

        {/* 3-Tile Quick Actions Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handlePlay}
            className="bg-[#281E23] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#34282F] active:scale-95 transition-all text-white shadow-sm border border-white/[0.04]"
          >
            <Play size={22} className="fill-current text-[#EDE0E2]" />
            <span className="text-xs font-semibold text-[#EDE0E2]">Play</span>
          </button>

          <button
            type="button"
            onClick={handlePlayNext}
            className="bg-[#281E23] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#34282F] active:scale-95 transition-all text-white shadow-sm border border-white/[0.04]"
          >
            <ListPlus size={22} className="text-[#EDE0E2]" />
            <span className="text-xs font-semibold text-[#EDE0E2]">Play next</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTimerPicker(!showTimerPicker)}
            className="bg-[#281E23] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#34282F] active:scale-95 transition-all text-white shadow-sm border border-white/[0.04] relative"
          >
            <Timer size={22} className="text-[#EDE0E2]" />
            <span className="text-xs font-semibold text-[#EDE0E2]">
              {timerMinutes ? `${timerMinutes}m` : 'Timer'}
            </span>
          </button>
        </div>

        {/* Sleep Timer Picker Popup */}
        {showTimerPicker && (
          <div className="bg-[#281E23] rounded-2xl p-3 border border-white/10 space-y-1 animate-in zoom-in-95 duration-150">
            <div className="text-xs font-bold text-[#9E9094] uppercase tracking-wider px-2 py-1">
              Sleep Timer
            </div>
            {[15, 30, 45, 60, null].map((mins) => (
              <button
                key={mins ?? 'off'}
                onClick={() => handleSetTimer(mins)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <span>{mins ? `${mins} minutes` : 'Turn off'}</span>
                {timerMinutes === mins && <Check size={14} className="text-[#E2A9B0]" />}
              </button>
            ))}
          </div>
        )}

        {/* Grouped List Card */}
        <div className="bg-[#281E23] rounded-[24px] overflow-hidden divide-y divide-white/5 border border-white/[0.04]">
          {/* Genre */}
          <div className="p-3.5 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#E2A9B0]">
                <Tag size={16} />
              </div>
              <span className="text-sm font-semibold text-[#EDE0E2]">Genre: Hip-Hop, rap</span>
            </div>
            <ChevronRight size={18} className="text-[#9E9094] group-hover:text-white transition-colors" />
          </div>

          {/* Add to playlist */}
          <div
            onClick={() => setShowPlaylistPicker(!showPlaylistPicker)}
            className="p-3.5 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#E2A9B0]">
                <ListMusic size={16} />
              </div>
              <span className="text-sm font-semibold text-[#EDE0E2]">Add to playlist</span>
            </div>
            <ChevronRight size={18} className="text-[#9E9094] group-hover:text-white transition-colors" />
          </div>

          {/* Playlist Picker Accordion */}
          {showPlaylistPicker && (
            <div className="p-2.5 bg-[#1E171B] space-y-1">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => {
                    addTrackToPlaylist(pl.id, track);
                    setShowPlaylistPicker(false);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{pl.name}</span>
                  <span className="text-[#9E9094]">{pl.tracks.length} tracks</span>
                </button>
              ))}
            </div>
          )}

          {/* Go to Artist */}
          <div
            onClick={() => {
              onClose();
              if (onGoToArtist) onGoToArtist(track.artist);
            }}
            className="p-3.5 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#E2A9B0] flex-shrink-0">
                <User size={16} />
              </div>
              <span className="text-sm font-semibold text-[#EDE0E2] truncate">
                Go to Artist ({track.artist})
              </span>
            </div>
            <ChevronRight size={18} className="text-[#9E9094] group-hover:text-white transition-colors flex-shrink-0" />
          </div>

          {/* Go to Album */}
          <div
            onClick={() => {
              onClose();
              if (onGoToAlbum && (track.album || track.title)) {
                onGoToAlbum(track.album || track.title, track.artist);
              }
            }}
            className="p-3.5 flex items-center justify-between hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#E2A9B0] flex-shrink-0">
                <Disc size={16} />
              </div>
              <span className="text-sm font-semibold text-[#EDE0E2] truncate">
                Go to Album ({track.album || track.title})
              </span>
            </div>
            <ChevronRight size={18} className="text-[#9E9094] group-hover:text-white transition-colors flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackContextMenuModal;
