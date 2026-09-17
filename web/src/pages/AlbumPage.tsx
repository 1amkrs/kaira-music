import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Shuffle,
  Heart,
  MoreVertical,
  Volume2,
  Clock,
  Disc3,
  Sparkles,
} from 'lucide-react';
import { AudioTrack } from '../audio/types';
import { musicService, MusicAlbum } from '../services/musicService';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import {
  DynamicTrackSkeleton,
  DynamicAlbumHeroSkeleton,
} from '../components/skeletons/DynamicSkeleton';

export interface AlbumPageProps {
  album: MusicAlbum;
  onBack: () => void;
  onOpenArtist?: (artistName: string) => void;
  onOpenTrackContext?: (track: AudioTrack) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTotalDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs} hr ${remMins} min`;
}

export const AlbumPage: React.FC<AlbumPageProps> = ({
  album: initialAlbum,
  onBack,
  onOpenArtist,
  onOpenTrackContext,
}) => {
  const [album, setAlbum] = useState<MusicAlbum>(initialAlbum);
  const [loading, setLoading] = useState(true);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const isLiked = useLibraryStore((s) => s.isLiked);
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    musicService
      .getAlbumDetails(initialAlbum.id, initialAlbum.title, initialAlbum.artist)
      .then((res) => {
        if (isMounted) {
          setAlbum(res);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.warn('Failed to load full album details', e);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialAlbum]);

  const handlePlayAll = (shuffle: boolean = false) => {
    if (!album.tracks || album.tracks.length === 0) return;
    const tracks = [...album.tracks];
    if (shuffle) {
      tracks.sort(() => Math.random() - 0.5);
    }
    playTrack(tracks[0], tracks);
  };

  const totalSeconds = album.tracks ? album.tracks.reduce((acc, t) => acc + t.duration, 0) : 0;

  return (
    <div className="min-h-full pb-36 pt-2 px-4 sm:px-8 max-w-5xl mx-auto font-sans bg-[#120E11] text-[#EDE0E2] select-none animate-in fade-in duration-300">
      {/* Top Back Navigation */}
      <div className="flex items-center gap-4 pt-2 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-xs font-bold text-[#E5B6BD] uppercase tracking-wider">Album</span>
      </div>

      <div className="space-y-8">
        {/* Album Hero Header */}
        <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-b from-[#2D2228] to-[#1C161A] p-6 sm:p-10 border border-white/5 shadow-2xl">
          {/* Ambient background artwork */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl pointer-events-none scale-125"
            style={{ backgroundImage: `url(${album.artworkUrl})` }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 text-center sm:text-left">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl flex-shrink-0">
              <img src={album.artworkUrl} alt={album.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#EDE0E2] border border-white/10">
                <Disc3 size={14} className="text-[#E2A9B0]" />
                <span>Lossless Album</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-sequel text-[#EDE0E2] tracking-tight leading-tight truncate">
                {album.title}
              </h1>

              <button
                type="button"
                onClick={() => onOpenArtist?.(album.artist)}
                className="text-sm font-semibold text-[#E2A9B0] hover:underline block truncate"
              >
                {album.artist}
              </button>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#9E9094] font-medium pt-1">
                <span>{album.releaseYear}</span>
                <span>•</span>
                <span>{album.tracks?.length || album.trackCount} songs</span>
                {totalSeconds > 0 && (
                  <>
                    <span>•</span>
                    <span>{formatTotalDuration(totalSeconds)}</span>
                  </>
                )}
              </div>

              {/* Primary Actions */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-4">
                <button
                  onClick={() => handlePlayAll(false)}
                  className="bg-[#E2A9B0] text-[#4A2027] px-7 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  <Play size={16} className="fill-[#4A2027]" />
                  <span>Play</span>
                </button>

                <button
                  onClick={() => handlePlayAll(true)}
                  className="bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Shuffle size={16} />
                  <span>Shuffle</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tracklist Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs font-bold text-[#9E9094] uppercase tracking-wider border-b border-white/5 pb-2">
            <span className="w-8 text-center">#</span>
            <span className="flex-1 px-4">Title</span>
            <div className="flex items-center gap-8 pr-2">
              <span className="hidden sm:inline">Time</span>
              <span className="w-6"></span>
            </div>
          </div>

          <div className="bg-[#1C161A]/80 rounded-[28px] p-2 border border-white/5 divide-y divide-white/[0.04]">
            {loading && (!album.tracks || album.tracks.length === 0) ? (
              <DynamicTrackSkeleton count={album.trackCount || 8} />
            ) : album.tracks && album.tracks.length > 0 ? (
              <div className="divide-y divide-white/[0.04] animate-in fade-in-50 duration-300">
                {album.tracks.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const liked = isLiked(track.id);

                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track, album.tracks)}
                      className={`flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.04] cursor-pointer transition-colors group ${
                        isCurrent ? 'bg-white/[0.06]' : ''
                      }`}
                    >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span className="w-6 text-center text-xs font-semibold text-[#8E8088] tabular-nums">
                        {isTrackPlaying ? (
                          <Volume2 size={16} className="text-[#E2A9B0] animate-pulse mx-auto" />
                        ) : (
                          (idx + 1).toString().padStart(2, '0')
                        )}
                      </span>

                      <div className="min-w-0 flex-1 pr-2">
                        <h4
                          className={`text-sm font-semibold truncate ${
                            isCurrent ? 'text-[#E2A9B0]' : 'text-white'
                          }`}
                        >
                          {track.title}
                        </h4>
                        <p className="text-xs text-[#8E8088] truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#8E8088] tabular-nums hidden sm:inline">
                        {formatDuration(track.duration)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track);
                        }}
                        className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                          liked ? 'text-[#E2A9B0]' : 'text-[#8E8088]'
                        }`}
                      >
                        <Heart size={16} className={liked ? 'fill-current' : ''} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTrackContext?.(track);
                        }}
                        className="p-2 rounded-full text-[#8E8088] hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#9E9094]">No tracks in this album</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
