import React from 'react';
import { Play, Pause, SkipForward, Activity } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

interface MiniPlayerProps {
  isSubPage?: boolean;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ isSubPage = false }) => {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const nextTrack = usePlayerStore((s) => s.nextTrack);
  const setFullPlayerOpen = usePlayerStore((s) => s.setFullPlayerOpen);

  if (!currentTrack) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`fixed z-35 ${
        isSubPage ? 'bottom-3' : 'bottom-[76px]'
      } md:bottom-4 left-3 right-3 md:left-[272px] md:right-6 select-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
    >
      <div className="relative group overflow-hidden rounded-[26px] bg-[#242126] border border-white/5 p-2.5 shadow-2xl hover:border-white/10 transition-all duration-300 flex items-center gap-3">
        {/* Clickable Area for Full Player */}
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={() => setFullPlayerOpen(true)}
        >
          {/* Artwork Thumbnail */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-neutral-900 border border-white/10">
            <img
              src={currentTrack.artworkUrl || '/icons/icon-192.png'}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Activity size={15} className="text-accent animate-pulse" />
              </div>
            )}
          </div>

          {/* Track Metadata */}
          <div className="flex flex-col min-w-0 pr-2">
            <h4 className="text-sm font-bold text-white truncate group-hover:text-accent transition-colors">
              {currentTrack.title}
            </h4>
            <span className="text-xs text-[#9E9094] truncate mt-0.5">
              {currentTrack.artist}
            </span>
          </div>
        </div>

        {/* Action Controls matching native screenshot media_1789555663562.png */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Play / Pause Accent Pill Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-11 h-11 rounded-full bg-accent text-accent-dark flex items-center justify-center font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} className="fill-current" />
            ) : (
              <Play size={18} className="fill-current translate-x-0.5" />
            )}
          </button>

          {/* Next Circular Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            className="w-10 h-10 rounded-full bg-[#312C33] text-white flex items-center justify-center shadow-md hover:bg-[#3E3840] active:scale-95 transition-all"
            title="Next Track"
          >
            <SkipForward size={17} />
          </button>
        </div>

        {/* Micro Progress Bar on Bottom Border (Clean Accent Wave) */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full bg-accent transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
