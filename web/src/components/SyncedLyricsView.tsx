import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sparkles,
  Music2,
  X,
} from 'lucide-react';
import { LyricLine, lrclibApi } from '../services/lrclibApi';
import { usePlayerStore } from '../store/usePlayerStore';
import { WavySeekbar } from './WavySeekbar';

interface SyncedLyricsViewProps {
  onBack: () => void;
  onOpenMenu?: () => void;
}

export const SyncedLyricsView: React.FC<SyncedLyricsViewProps> = ({
  onBack,
  onOpenMenu,
}) => {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const nextTrack = usePlayerStore((s) => s.nextTrack);
  const prevTrack = usePlayerStore((s) => s.prevTrack);
  const seek = usePlayerStore((s) => s.seek);

  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);
  const [isFullscreenLyrics, setIsFullscreenLyrics] = useState<boolean>(false);
  const [showFullscreenTooltip, setShowFullscreenTooltip] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isUserScrollingRef = useRef<boolean>(false);
  const userScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch or resolve lyrics
  useEffect(() => {
    if (!currentTrack) {
      setLyrics([]);
      return;
    }

    if (currentTrack.lyricsLrc) {
      const parsed = lrclibApi.parseLrc(currentTrack.lyricsLrc);
      setLyrics(parsed);
      return;
    }

    lrclibApi
      .getLyrics(currentTrack.title, currentTrack.artist, currentTrack.album, currentTrack.duration)
      .then((res) => {
        if (res.synced && res.synced.length > 0) {
          setLyrics(res.synced);
        } else if (res.plain) {
          // Wrap plain lyrics into dummy lines with synthetic timestamps
          const lines = res.plain.split('\n').filter((l) => l.trim().length > 0);
          const interval = (currentTrack.duration * 1000) / (lines.length || 1);
          setLyrics(lines.map((text, i) => ({ id: i, text, timeMs: i * interval })));
        }
      })
      .catch((err) => {
        console.warn('Failed to load lyrics', err);
      });
  }, [currentTrack?.id]);

  // Track active line
  useEffect(() => {
    if (lyrics.length === 0) return;
    const currentMs = currentTime * 1000;
    let found = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentMs >= lyrics[i].timeMs) {
        found = i;
      } else {
        break;
      }
    }
    setActiveLineIndex(found);

    if (!isUserScrollingRef.current && found >= 0 && lineRefs.current[found]) {
      lineRefs.current[found]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime, lyrics]);

  const handleScroll = () => {
    isUserScrollingRef.current = true;
    if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    userScrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 3000);
  };

  const toggleFullscreen = () => {
    const nextState = !isFullscreenLyrics;
    setIsFullscreenLyrics(nextState);
    if (nextState) {
      setShowFullscreenTooltip(true);
      setTimeout(() => setShowFullscreenTooltip(false), 4500);
    } else {
      setShowFullscreenTooltip(false);
    }
  };

  if (!currentTrack) return null;

  // Calculate current active line progress for kinetic word illumination
  const activeLine = activeLineIndex >= 0 ? lyrics[activeLineIndex] : null;
  const nextLine =
    activeLineIndex >= 0 && activeLineIndex < lyrics.length - 1
      ? lyrics[activeLineIndex + 1]
      : null;

  const currentMs = currentTime * 1000;
  const lineStartMs = activeLine ? activeLine.timeMs : 0;
  const lineEndMs = nextLine ? nextLine.timeMs : lineStartMs + 4000;
  const lineDuration = Math.max(1000, lineEndMs - lineStartMs);
  const lineProgress = Math.min(1, Math.max(0, (currentMs - lineStartMs) / lineDuration));

  return (
    <div className="relative flex flex-col h-full w-full bg-[#120E11] text-[#EDE0E2] select-none overflow-hidden animate-in fade-in duration-300">
      {/* 1. Header Bar (Hidden in Immersive Fullscreen Mode) */}
      {!isFullscreenLyrics && (
        <header className="relative z-20 flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0 animate-in slide-in-from-top duration-200">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            title="Back to Now Playing"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex flex-col items-center max-w-[65%] text-center">
            <span className="text-[11px] uppercase tracking-widest text-[#9E9094] font-semibold">
              Lyrics
            </span>
            <span className="text-xs font-semibold text-[#EDE0E2] truncate w-full mt-0.5">
              {currentTrack.title} • {currentTrack.artist}
            </span>
          </div>

          <button
            onClick={onOpenMenu}
            className="w-11 h-11 rounded-full bg-[#281E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            title="Options"
          >
            <MoreVertical size={18} />
          </button>
        </header>
      )}

      {/* 2. Word Sync Pill Badge */}
      <div className="pt-2 pb-1 flex justify-center flex-shrink-0 z-10">
        <div className="bg-[#2D222E] text-[#C4A5D8] px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border border-white/5 flex items-center gap-1.5 shadow-sm">
          <Sparkles size={12} className="fill-current text-[#C4A5D8]" />
          <span>Word Sync • Kugou KRC</span>
        </div>
      </div>

      {/* 3. Lyrics Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-12 space-y-7 scroll-smooth text-left"
        style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}
      >
        {lyrics.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center text-[#9E9094] space-y-3">
            <Music2 size={36} className="opacity-40 animate-pulse" />
            <p className="text-sm">Looking up synced lyrics for {currentTrack.title}...</p>
          </div>
        ) : (
          lyrics.map((line, index) => {
            const isActive = index === activeLineIndex;
            const isPast = index < activeLineIndex;
            const words = line.text.split(' ');
            const activeWordIndex = isActive ? Math.floor(lineProgress * words.length) : -1;

            return (
              <div
                key={index}
                ref={(el) => {
                  lineRefs.current[index] = el;
                }}
                onClick={() => seek(line.timeMs / 1000)}
                className={`transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'scale-100 font-extrabold text-white text-3xl sm:text-4xl leading-tight'
                    : isPast
                    ? 'opacity-35 text-[#7A6672] text-2xl sm:text-3xl font-bold leading-tight hover:opacity-75'
                    : 'opacity-35 text-[#7A6672] text-2xl sm:text-3xl font-bold leading-tight hover:opacity-75'
                }`}
              >
                {isActive ? (
                  <p className="flex flex-wrap gap-x-2 gap-y-1">
                    {words.map((word, wIdx) => {
                      const isWordPastOrCurrent = wIdx <= activeWordIndex;
                      const isCurrentWord = wIdx === activeWordIndex;

                      return (
                        <span
                          key={wIdx}
                          className={`transition-colors duration-150 ${
                            isWordPastOrCurrent
                              ? 'text-white font-black drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                              : 'text-[#B090A0] font-bold'
                          } ${isCurrentWord ? 'scale-105 inline-block' : ''}`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </p>
                ) : (
                  <p>{line.text}</p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. Bottom Right Floating Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className={`fixed z-30 w-12 h-12 rounded-full bg-[#21181E]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all ${
          isFullscreenLyrics ? 'bottom-6 right-6' : 'bottom-36 right-6'
        }`}
        title={isFullscreenLyrics ? 'Exit Full Screen' : 'View Full Screen'}
      >
        {isFullscreenLyrics ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

      {/* 5. Fullscreen Toast Tooltip Prompt (1:1 Match to media_1789554883402.png) */}
      {showFullscreenTooltip && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#281E23]/95 backdrop-blur-xl border border-white/10 text-white rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
          <span className="text-xs font-medium">
            Viewing full screen • To exit, tap the button
          </span>
          <button
            onClick={() => setShowFullscreenTooltip(false)}
            className="bg-[#E2A9B0] text-[#4A2027] text-[11px] font-bold px-3 py-1 rounded-full hover:bg-white active:scale-95 transition-all"
          >
            Got it
          </button>
        </div>
      )}

      {/* 6. Bottom Docked Player Bar (Hidden in Immersive Fullscreen Mode) */}
      {!isFullscreenLyrics && (
        <div className="relative z-20 bg-[#181316]/95 backdrop-blur-2xl border-t border-white/10 px-5 pt-2 pb-5 flex-shrink-0 space-y-2 animate-in slide-in-from-bottom duration-200">
          {/* Wavy Seekbar */}
          <WavySeekbar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
          />

          {/* Mini Playback Controls */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <button
              onClick={prevTrack}
              className="w-10 h-10 rounded-full bg-[#251E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all"
              title="Previous"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-[#BAC6D7] text-[#1E242E] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={24} className="fill-current" />
              ) : (
                <Play size={24} className="fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="w-10 h-10 rounded-full bg-[#251E22] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 active:scale-95 transition-all"
              title="Next"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncedLyricsView;
