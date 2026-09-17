import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Shuffle,
  Heart,
  MoreVertical,
  CheckCircle2,
  Disc3,
  Users,
  Music2,
  Volume2,
} from 'lucide-react';
import { AudioTrack } from '../audio/types';
import { musicService, MusicArtist, MusicAlbum } from '../services/musicService';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import {
  DynamicArtistHeroSkeleton,
  DynamicTrackSkeleton,
  DynamicAlbumGridSkeleton,
} from '../components/skeletons/DynamicSkeleton';

export interface ArtistPageProps {
  artistName: string;
  onBack: () => void;
  onOpenAlbum?: (album: MusicAlbum) => void;
  onOpenTrackContext?: (track: AudioTrack) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const ArtistPage: React.FC<ArtistPageProps> = ({
  artistName,
  onBack,
  onOpenAlbum,
  onOpenTrackContext,
}) => {
  const [artist, setArtist] = useState<MusicArtist | null>(null);
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
      .getArtistDetails(artistName)
      .then((res) => {
        if (isMounted) {
          setArtist(res);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.warn('Failed to load artist details', e);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [artistName]);

  const handlePlayAll = (shuffle: boolean = false) => {
    if (!artist?.popularTracks || artist.popularTracks.length === 0) return;
    const tracks = [...artist.popularTracks];
    if (shuffle) {
      tracks.sort(() => Math.random() - 0.5);
    }
    playTrack(tracks[0], tracks);
  };

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
        <span className="text-xs font-bold text-[#E5B6BD] uppercase tracking-wider">Artist</span>
      </div>

      {loading ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          <DynamicArtistHeroSkeleton />
          <div className="space-y-3 pt-4">
            <div className="h-5 w-32 bg-white/[0.06] rounded-lg animate-pulse" />
            <DynamicTrackSkeleton count={5} />
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-5 w-28 bg-white/[0.06] rounded-lg animate-pulse" />
            <DynamicAlbumGridSkeleton count={4} />
          </div>
        </div>
      ) : !artist ? (
        <div className="text-center py-24 space-y-3 animate-in fade-in duration-300">
          <Music2 size={36} className="text-[#9E9094] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-white">Artist not found</h3>
          <p className="text-xs text-[#9E9094]">Could not retrieve information for "{artistName}"</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* Hero Header */}
          <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-b from-[#2D2228] to-[#1C161A] p-6 sm:p-10 border border-white/5 shadow-2xl">
            {/* Ambient background artwork */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl pointer-events-none scale-125"
              style={{ backgroundImage: `url(${artist.artworkUrl})` }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              <img
                src={artist.artworkUrl}
                alt={artist.name}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white/15 shadow-2xl flex-shrink-0"
              />

              <div className="space-y-2 flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#EDE0E2] border border-white/10">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Verified Artist</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-sequel text-[#EDE0E2] tracking-tight leading-tight truncate">
                  {artist.name}
                </h1>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-[#9E9094] font-medium pt-1">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {artist.followers || '1.2M'} monthly listeners
                  </span>
                  {artist.genres && artist.genres.length > 0 && (
                    <span className="text-[#E2A9B0]">• {artist.genres.slice(0, 2).join(' / ')}</span>
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

          {/* Popular Tracks Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight px-1">Popular</h2>

            <div className="bg-[#1C161A]/80 rounded-[28px] p-2 border border-white/5 divide-y divide-white/[0.04]">
              {artist.popularTracks && artist.popularTracks.length > 0 ? (
                artist.popularTracks.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const liked = isLiked(track.id);

                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track, artist.popularTracks)}
                      className={`flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.04] cursor-pointer transition-colors group ${
                        isCurrent ? 'bg-white/[0.06]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <span className="w-5 text-center text-xs font-semibold text-[#8E8088] tabular-nums">
                          {isTrackPlaying ? (
                            <Volume2 size={16} className="text-[#E2A9B0] animate-pulse mx-auto" />
                          ) : (
                            (idx + 1).toString().padStart(2, '0')
                          )}
                        </span>

                        <img
                          src={track.artworkUrl}
                          alt={track.title}
                          className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-sm"
                        />

                        <div className="min-w-0 pr-2">
                          <h4
                            className={`text-sm font-semibold truncate ${
                              isCurrent ? 'text-[#E2A9B0]' : 'text-white'
                            }`}
                          >
                            {track.title}
                          </h4>
                          <p className="text-xs text-[#8E8088] truncate">{track.album || artist.name}</p>
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
                })
              ) : (
                <div className="p-6 text-center text-xs text-[#9E9094]">No popular tracks available</div>
              )}
            </div>
          </div>

          {/* Discography Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight px-1">Discography</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {artist.albums && artist.albums.length > 0 ? (
                artist.albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => onOpenAlbum?.(album)}
                    className="bg-[#1C161A]/80 border border-white/5 rounded-3xl p-3.5 hover:bg-[#251E23] hover:border-white/10 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md mb-3">
                      <img
                        src={album.artworkUrl}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#E2A9B0] text-[#4A2027] flex items-center justify-center shadow-lg">
                          <Play size={18} className="fill-[#4A2027] ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{album.title}</h4>
                      <p className="text-xs text-[#8E8088] truncate mt-0.5">
                        {album.releaseYear} • {album.trackCount} songs
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-6 text-center text-xs text-[#9E9094]">
                  No albums found
                </div>
              )}
            </div>
          </div>

          {/* About Biography Section */}
          {artist.bio && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight px-1">About</h2>
              <div className="bg-[#1C161A]/80 border border-white/5 rounded-[32px] p-6 space-y-3">
                <p className="text-sm text-[#EDE0E2]/80 leading-relaxed font-normal">{artist.bio}</p>
                {artist.genres && artist.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {artist.genres.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 rounded-full bg-white/5 text-xs font-semibold text-[#E2A9B0] border border-white/5"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
