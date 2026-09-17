import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, CheckCircle2, Trash2, FileDown } from 'lucide-react';
import { AudioTrack } from '../audio/types';
import { useOfflineStore } from '../store/useOfflineStore';

interface DownloadButtonProps {
  track: AudioTrack;
  size?: number;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  track,
  size = 16,
  className = '',
}) => {
  const isDownloaded = useOfflineStore((s) => s.isDownloaded(track.id));
  const isDownloading = useOfflineStore((s) => s.isDownloading(track.id));
  const downloadProgress = useOfflineStore((s) => s.getDownloadProgress(track.id));
  const downloadTrack = useOfflineStore((s) => s.downloadTrack);
  const removeDownload = useOfflineStore((s) => s.removeDownload);
  const exportTrackFile = useOfflineStore((s) => s.exportTrackFile);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDownloading) {
      return;
    }

    if (isDownloaded) {
      setIsMenuOpen((prev) => !prev);
      return;
    }

    try {
      await downloadTrack(track);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    await exportTrackFile(track.id);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    await removeDownload(track.id);
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDownloading}
        className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
          isDownloading
            ? 'cursor-wait opacity-90'
            : isDownloaded
            ? 'text-accent hover:bg-accent/15 active:scale-95'
            : 'text-[#9E9094] hover:text-white hover:bg-white/10 active:scale-95'
        }`}
        title={
          isDownloading
            ? `Downloading "${track.title}" (${downloadProgress}%)...`
            : isDownloaded
            ? `Downloaded for offline playback. Click for options.`
            : `Download "${track.title}" for offline playback`
        }
        aria-label={
          isDownloading
            ? `Downloading (${downloadProgress}%)`
            : isDownloaded
            ? 'Downloaded'
            : 'Download track'
        }
      >
        {isDownloading ? (
          <Loader2 size={size} className="animate-spin text-accent" />
        ) : isDownloaded ? (
          <CheckCircle2 size={size} className="text-accent fill-accent/20" />
        ) : (
          <Download size={size} />
        )}
      </button>

      {/* Options Dropdown Popover for Downloaded Track */}
      {isMenuOpen && isDownloaded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1.5 w-44 bg-[#1E181C] border border-white/10 rounded-2xl p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 select-none"
        >
          <div className="px-3 py-1.5 border-b border-white/5">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
              Offline Ready
            </span>
            <span className="text-[11px] font-medium text-[#EDE0E2] truncate block">
              {track.title}
            </span>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#EDE0E2] hover:bg-white/10 rounded-xl transition-colors text-left"
          >
            <FileDown size={14} className="text-accent" />
            <span>Export Audio File</span>
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
          >
            <Trash2 size={14} />
            <span>Delete Download</span>
          </button>
        </div>
      )}
    </div>
  );
};
