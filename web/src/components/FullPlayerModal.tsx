import React, { useState } from 'react';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Quote,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Trash2,
  X,
  Volume2,
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { WavySeekbar } from './WavySeekbar';
import { SyncedLyricsView } from './SyncedLyricsView';
import { TrackContextMenuModal } from './TrackContextMenuModal';
import { DownloadButton } from './DownloadButton';

interface FullPlayerModalProps {
  onGoToArtist?: (artistName: string) => void;
  onGoToAlbum?: (albumTitle: string, artistName?: string) => void;
}

const formatDuration = (seconds: number) => {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({
  onGoToArtist,
  onGoToAlbum,
}) => {
  const isFullPlayerOpen = usePlayerStore((s) => s.isFullPlayerOpen);
  const setFullPlayerOpen = usePlayerStore((s) => s.setFullPlayerOpen);

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isPlayingOffline = usePlayerStore((s) => s.isPlayingOffline);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);

  const queue = usePlayerStore((s) => s.queue);
  const queueIndex = usePlayerStore((s) => s.queueIndex);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const nextTrack = usePlayerStore((s) => s.nextTrack);
  const prevTrack = usePlayerStore((s) => s.prevTrack);
  const seek = usePlayerStore((s) => s.seek);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const setSignalPathOpen = usePlayerStore((s) => s.setSignalPathOpen);

  const isLiked = useLibraryStore((s) => (currentTrack ? s.isLiked(currentTrack.id) : false));
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  const activeView = usePlayerStore((s) => s.fullPlayerView);
  const setActiveView = usePlayerStore((s) => s.setFullPlayerView);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  if (!isFullPlayerOpen || !currentTrack) return null;

  // Format quality string e.g. FLAC 16/44.1 or FLAC 24/96
  const sampleRateKhz = (currentTrack.sampleRate / 1000).toFixed(1).replace('.0', '');
  const qualityLabel = `FLAC ${currentTrack.bitDepth || 16}/${sampleRateKhz}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#120E11] text-[#EDE0E2] overflow-hidden select-none animate-in slide-in-from-bottom duration-300">
      {/* Ambient Artwork Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <img
          src={currentTrack.artworkUrl || '/icons/icon-512.png'}
          alt="Ambient Background"
          className="w-full h-full object-cover filter blur-3xl scale-125 saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120E11] via-[#120E11]/80 to-transparent" />
      </div>

      {activeView === 'lyrics' ? (
        <div className="relative z-10 flex-1 flex flex-col h-full w-full animate-in fade-in-50 duration-300 ease-out">
          <SyncedLyricsView
            onBack={() => setActiveView('cover')}
            onOpenMenu={() => setIsContextMenuOpen(true)}
          />
        </div>
      ) : activeView === 'queue' ? (
        /* ======================== QUEUE VIEW ======================== */
        <div className="relative z-10 flex flex-col h-full w-full max-w-lg mx-auto px-6 py-4 animate-in fade-in-50 duration-300 ease-out">
          {/* Top Header */}
          <header className="flex items-center justify-between pt-2 pb-4 border-b border-white/5">
            <button
              onClick={() => setActiveView('cover')}
              className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
              title="Back to Now Playing"
            >
              <ChevronDown size={24} />
            </button>

            <div className="flex flex-col items-center">
              <h2 className="text-base font-bold font-sequel text-[#EDE0E2]">Playback Queue</h2>
              <span className="text-[11px] font-semibold text-[#9E9094] tabular-nums">
                {queue.length} {queue.length === 1 ? 'track' : 'tracks'}
              </span>
            </div>

            {queue.length > 0 ? (
              <button
                onClick={clearQueue}
                className="px-3 py-1.5 rounded-full bg-[#281E22] text-xs font-semibold text-[#E2A9B0] hover:bg-[#34282F] active:scale-95 transition-all flex items-center gap-1.5"
                title="Clear Queue"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            ) : (
              <div className="w-11" />
            )}
          </header>

          {/* Scrollable Queue Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {/* Now Playing Highlight Card */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#9E9094] mb-2 px-1">
                Now Playing
              </div>
              <div className="bg-[#281E22]/90 border border-white/10 rounded-2xl p-3 flex items-center gap-3.5 shadow-md">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900 border border-white/10">
                  <img
                    src={currentTrack.artworkUrl || '/icons/icon-512.png'}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                      <span className="w-1 h-3.5 bg-[#BAC6D7] rounded-full animate-pulse" />
                      <span className="w-1 h-5 bg-[#BAC6D7] rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-2.5 bg-[#BAC6D7] rounded-full animate-pulse delay-150" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#EDE0E2] truncate">{currentTrack.title}</p>
                  <p className="text-xs font-medium text-[#9E9094] truncate">{currentTrack.artist}</p>
                </div>
                <span className="text-xs font-semibold text-[#BAC6D7] tabular-nums flex-shrink-0 pr-1">
                  {formatDuration(duration || currentTrack.duration)}
                </span>
              </div>
            </div>

            {/* Up Next List */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#9E9094] mb-2 px-1">
                Up Next ({Math.max(0, queue.length - 1)})
              </div>

              {queue.length <= 1 ? (
                <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <ListMusic size={32} className="mx-auto text-[#9E9094]/60" />
                  <p className="text-sm font-semibold text-[#EDE0E2]">Queue is empty</p>
                  <p className="text-xs text-[#9E9094]">
                    Add songs from Search, Albums, or Artists using "Play Next".
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {queue.map((track, idx) => {
                    const isCurrent = idx === queueIndex;
                    return (
                      <div
                        key={`${track.id}-${idx}`}
                        className={`group flex items-center justify-between p-2.5 rounded-2xl transition-colors ${
                          isCurrent
                            ? 'bg-[#2E2428] border border-[#BAC6D7]/20'
                            : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        <div
                          onClick={() => playTrack(track)}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        >
                          <span className="text-xs font-bold text-[#9E9094] w-5 text-center tabular-nums flex-shrink-0">
                            {idx + 1}
                          </span>
                          <img
                            src={track.artworkUrl || '/icons/icon-512.png'}
                            alt={track.title}
                            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-neutral-900 border border-white/5"
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isCurrent ? 'text-[#BAC6D7]' : 'text-[#EDE0E2]'
                              }`}
                            >
                              {track.title}
                            </p>
                            <p className="text-xs font-medium text-[#9E9094] truncate">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                          <span className="text-xs font-semibold text-[#9E9094] tabular-nums">
                            {formatDuration(track.duration)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromQueue(idx);
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9E9094] hover:text-accent hover:bg-white/10 transition-colors"
                            title="Remove from queue"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Queue Controls */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setActiveView('cover')}
              className="text-xs font-semibold text-[#BAC6D7] hover:underline"
            >
              Back to Player
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={prevTrack}
                className="w-10 h-10 rounded-full bg-[#251E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
                title="Previous"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-accent text-accent-dark flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={20} className="fill-current" />
                ) : (
                  <Play size={20} className="fill-current ml-0.5" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="w-10 h-10 rounded-full bg-[#251E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
                title="Next"
              >
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ======================== COVER VIEW ======================== */
        <div
          className={`flex flex-col justify-between flex-1 px-6 sm:px-10 py-6 max-w-lg mx-auto w-full transition-all duration-300 ${
            activeView === 'cover'
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none absolute inset-0'
          }`}
        >
          {/* 1. Header Bar: Collapse Chevron, Title Pill, Right Action Icons */}
          <header className="flex items-center justify-between">
            <button
              onClick={() => setFullPlayerOpen(false)}
              className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
              title="Minimize Player"
            >
              <ChevronDown size={22} />
            </button>

            {/* Now Playing Title Pill */}
            <div className="px-4 py-1.5 rounded-full bg-[#281E22] border border-white/5 shadow-sm flex items-center gap-1.5">
              {isPlayingOffline && (
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
              <span className="text-xs font-semibold tracking-wider text-[#9E9094] uppercase">
                {isPlayingOffline ? 'Offline Playback' : 'Now Playing'}
              </span>
            </div>

            {/* Top Right Action Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('queue')}
                className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm relative"
                title="Playback Queue"
              >
                <ListMusic size={19} />
                {queue.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-dark text-[9px] font-bold flex items-center justify-center tabular-nums">
                    {queue.length > 9 ? '9+' : queue.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsContextMenuOpen(true)}
                className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
                title="Track Context Menu"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </header>

          {/* 2. Album Artwork Card */}
          <div className="my-auto py-2 flex items-center justify-center">
            <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
              <img
                src={currentTrack.artworkUrl || '/icons/icon-512.png'}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 3. Track Info & Action Buttons Row */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-black font-sequel text-[#EDE0E2] tracking-tight truncate">
                  {currentTrack.title}
                </h1>
                <p
                  onClick={() => {
                    if (onGoToArtist) {
                      setFullPlayerOpen(false);
                      onGoToArtist(currentTrack.artist);
                    }
                  }}
                  className={`text-base sm:text-lg text-[#D0C0C6] font-medium truncate mt-0.5 ${
                    onGoToArtist ? 'cursor-pointer hover:underline' : ''
                  }`}
                >
                  {currentTrack.artist}
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                {/* Offline Download Button */}
                <div className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm">
                  <DownloadButton track={currentTrack} size={20} />
                </div>

                {/* Heart Button */}
                <button
                  onClick={() => toggleLike(currentTrack)}
                  className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart
                    size={20}
                    className={isLiked ? 'fill-accent text-accent' : 'text-[#EDE0E2]'}
                  />
                </button>

                {/* Lyrics / Quotes Button */}
                <button
                  onClick={() => setActiveView('lyrics')}
                  className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
                  title="Synced Lyrics"
                >
                  <Quote size={18} className="fill-current" />
                </button>
              </div>
            </div>

            {/* 4. Wavy Seekbar Component */}
            <WavySeekbar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
            />

            {/* 5. Primary Playback Controls Row */}
            <div className="flex items-center justify-between px-6 pt-2">
              <button
                onClick={prevTrack}
                className="w-14 h-14 rounded-full bg-[#251E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
                title="Previous"
              >
                <SkipBack size={24} />
              </button>

              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-accent text-accent-dark flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_var(--color-accent-glow)]"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={34} className="fill-current" />
                ) : (
                  <Play size={34} className="fill-current ml-1" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="w-14 h-14 rounded-full bg-[#251E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
                title="Next"
              >
                <SkipForward size={24} />
              </button>
            </div>

            {/* 6. Bottom Controls Row: Shuffle, Quality Badge Pill, Repeat */}
            <div className="flex items-center justify-between pt-2 pb-2">
              {/* Shuffle Pill Button */}
              <button
                onClick={toggleShuffle}
                className={`rounded-2xl px-6 py-4 flex flex-col items-center justify-center relative min-w-[72px] transition-all active:scale-95 ${
                  shuffle
                    ? 'bg-[#374457] text-white shadow-md'
                    : 'bg-[#2A313D] text-[#A8BED8] hover:bg-[#323b49]'
                }`}
                title="Shuffle"
              >
                <Shuffle size={20} className={shuffle ? 'stroke-[2.5]' : ''} />
                {shuffle && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1.5 shadow-sm" />
                )}
              </button>

              {/* Quality Badge Pill (Opens SignalPathModal) */}
              <button
                onClick={() => setSignalPathOpen(true)}
                className="bg-[#202936] text-[#A8BED8] rounded-full px-5 py-3 border border-white/5 flex items-center gap-2 font-sans tabular-nums text-xs font-bold tracking-wider hover:bg-[#283446] active:scale-95 transition-all shadow-sm"
                title="Audiophile Signal Path Inspector"
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    isPlayingOffline
                      ? 'bg-accent/20 text-accent'
                      : 'bg-[#A8BED8]/20 text-[#D0D8E2]'
                  }`}
                >
                  {isPlayingOffline ? 'OFFLINE' : 'HQ'}
                </span>
                <span>{isPlayingOffline ? 'IndexedDB Local' : qualityLabel}</span>
              </button>

              {/* Repeat Pill Button */}
              <button
                onClick={cycleRepeat}
                className={`rounded-2xl px-6 py-4 flex flex-col items-center justify-center relative min-w-[72px] transition-all active:scale-95 ${
                  repeatMode !== 'off'
                    ? 'bg-[#374457] text-white shadow-md'
                    : 'bg-[#2A313D] text-[#A8BED8] hover:bg-[#323b49]'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 size={20} className="stroke-[2.5]" />
                ) : (
                  <Repeat size={20} className={repeatMode === 'all' ? 'stroke-[2.5]' : ''} />
                )}
                {repeatMode !== 'off' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1.5 shadow-sm" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track 3-dot Bottom Sheet Context Menu */}
      <TrackContextMenuModal
        isOpen={isContextMenuOpen}
        onClose={() => setIsContextMenuOpen(false)}
        track={currentTrack}
        onStartMix={() => {
          setIsContextMenuOpen(false);
          toggleShuffle();
        }}
        onGoToArtist={(artist) => {
          setIsContextMenuOpen(false);
          setFullPlayerOpen(false);
          if (onGoToArtist) onGoToArtist(artist);
        }}
        onGoToAlbum={(album, artist) => {
          setIsContextMenuOpen(false);
          setFullPlayerOpen(false);
          if (onGoToAlbum) onGoToAlbum(album, artist);
        }}
      />
    </div>
  );
};

export default FullPlayerModal;
