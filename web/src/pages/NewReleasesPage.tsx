import React, { useState } from 'react';
import {
  ArrowLeft,
  RotateCw,
  Shuffle,
  Play,
  MoreVertical,
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { AudioTrack } from '../audio/types';

interface NewReleasesPageProps {
  onBack: () => void;
}

export const NEW_RELEASES_DATA: AudioTrack[] = [
  {
    id: 'nr-birds-of-a-feather',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    duration: 196,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/34/31/d3/3431d34e-847f-5d66-df83-0bce688d997e/mzaf_18106743962423782018.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    youtubeId: 'd5gf9dXHevw',
  },
  {
    id: 'nr-apple',
    title: 'Apple',
    artist: 'Charli xcx',
    album: 'BRAT',
    duration: 151,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738202b8d00977462c16118d09',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/49/bf/cc/49bfccd3-9776-c2e3-59a7-a907a25bdbb8/mzaf_1987563113959627320.plus.aac.p.m4a',
    quality: 'HI_RES_96',
    bitDepth: 24,
    sampleRate: 96000,
    codec: 'FLAC',
    youtubeId: '6gCj7w9v_B8',
  },
  {
    id: 'nr-taste',
    title: 'Taste',
    artist: 'Sabrina Carpenter',
    album: "Short n' Sweet",
    duration: 157,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f628',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/26/57/a6/2657a620-c596-e0e4-efa2-e814f3572d1c/mzaf_5475540510703120797.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    youtubeId: 'tf96qH8g9V0',
  },
  {
    id: 'nr-illusion',
    title: 'Illusion',
    artist: 'Dua Lipa',
    album: 'Radical Optimism',
    duration: 188,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2739818817a78e7cfbbde73fa60',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/25/04/d9/2504d908-2a6a-64df-be8d-c6916ff0b763/mzaf_11647511398423168038.plus.aac.p.m4a',
    quality: 'LOSSLESS_CD',
    bitDepth: 16,
    sampleRate: 44100,
    codec: 'FLAC',
    youtubeId: 'dmsbQ_gG_3M',
  },
  {
    id: 'nr-good-luck-babe',
    title: 'Good Luck, Babe!',
    artist: 'Chappell Roan',
    album: 'The Rise and Fall of a Midwest Princess',
    duration: 218,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273898b965f377c8e96b86fb049',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c3/6d/4f/c36d4f23-b87f-046d-7a0e-e3e05d180b2a/mzaf_17235999651335214399.plus.aac.p.m4a',
    quality: 'HI_RES_96',
    bitDepth: 24,
    sampleRate: 96000,
    codec: 'FLAC',
    youtubeId: '1RKqOmSkGgM',
  },
  {
    id: 'nr-st-chroma',
    title: 'St. Chroma (feat. Daniel Caesar)',
    artist: 'Tyler, The Creator',
    album: 'CHROMAKOPIA',
    duration: 197,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273449e77660c67084931a29cc8',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a4/88/d7/a488d754-dd83-7ae2-3163-5b878af0e7ce/mzaf_11646963309078405717.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    youtubeId: 'C_Psq31k34k',
  },
  {
    id: 'nr-fortnight',
    title: 'Fortnight (feat. Post Malone)',
    artist: 'Taylor Swift',
    album: 'THE TORTURED POETS DEPARTMENT',
    duration: 228,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b27356a12b7796d3f22d56f65805',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/90/67/b5/9067b561-f437-d4ce-1f2f-ac3913339d72/mzaf_9669199482319820236.plus.aac.p.m4a',
    quality: 'HI_RES_96',
    bitDepth: 24,
    sampleRate: 96000,
    codec: 'FLAC',
    youtubeId: 'q3zkkLckeyM',
  },
  {
    id: 'nr-so-american',
    title: 'so american',
    artist: 'Olivia Rodrigo',
    album: 'GUTS (spilled)',
    duration: 169,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/43/13/c9/4313c92b-cf1c-0191-45ef-58e0f1eac07f/mzaf_15738418925021275838.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    youtubeId: 'jZ-U6sQhE7g',
  },
  {
    id: 'nr-not-like-us',
    title: 'Not Like Us',
    artist: 'Kendrick Lamar',
    album: 'GNX',
    duration: 274,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2d/e0/e8/2de0e874-cd0b-e9a9-e876-76be13a86662/mzaf_12385336780649591409.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    youtubeId: 'H58vbez_m4E',
  },
];

export const NewReleasesPage: React.FC<NewReleasesPageProps> = ({ onBack }) => {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const [tracks, setTracks] = useState<AudioTrack[]>(NEW_RELEASES_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTracks([...NEW_RELEASES_DATA].sort(() => Math.random() - 0.5));
      setIsRefreshing(false);
    }, 400);
  };

  const handlePlayAll = (shuffle = false) => {
    if (tracks.length === 0) return;
    if (shuffle) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="min-h-full pb-32 pt-2 px-4 sm:px-6 max-w-4xl mx-auto font-sans bg-[#120E11] text-[#EDE0E2] transition-colors duration-300 select-none animate-in fade-in duration-300">
      {/* 1. Top Header Bar matching native screenshot media_1789553982321.png */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm flex-shrink-0"
            title="Back"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold font-sequel text-[#EDE0E2] tracking-tight truncate">
              New releases
            </h1>
            <p className="text-xs sm:text-sm text-[#9E9094] mt-0.5 truncate">
              Fresh drops and new songs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className={`w-11 h-11 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Refresh New Releases"
          >
            <RotateCw size={19} />
          </button>

          {/* Shuffle Button */}
          <button
            onClick={() => handlePlayAll(true)}
            className="w-11 h-11 rounded-full bg-[#211B1E] flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            title="Shuffle All"
          >
            <Shuffle size={19} />
          </button>
        </div>
      </div>

      {/* 2. Action Buttons (Equal-Width Side-by-Side Pills) */}
      <div className="flex items-center gap-3 mt-3">
        {/* Play all */}
        <button
          onClick={() => handlePlayAll(false)}
          className="bg-[#DDE2EB] text-[#120E11] font-bold py-3 rounded-full flex items-center justify-center gap-2 flex-1 shadow-sm hover:bg-white active:scale-95 transition-all text-sm"
        >
          <Play size={16} className="fill-[#120E11]" />
          <span>Play all</span>
        </button>

        {/* Shuffle */}
        <button
          onClick={() => handlePlayAll(true)}
          className="bg-[#2A313D] text-[#DDE2EB] font-bold py-3 rounded-full flex items-center justify-center gap-2 flex-1 shadow-sm hover:bg-[#384252] active:scale-95 transition-all text-sm"
        >
          <Shuffle size={16} />
          <span>Shuffle</span>
        </button>
      </div>

      {/* 3. Track List: Vertical Stack of Fresh Drops */}
      <div className="mt-5 space-y-2">
        {tracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              onClick={() => playTrack(track, tracks)}
              className={`bg-[#211B1E] rounded-2xl p-3 flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] transition-all shadow-sm ${
                isCurrent ? 'border border-[#E2A9B0]/40 bg-[#E2A9B0]/5' : ''
              }`}
            >
              {/* Left: Artwork, Title, Artist */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
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
                  <h4 className={`text-[15px] font-semibold truncate ${isCurrent ? 'text-[#E2A9B0]' : 'text-[#EDE0E2] group-hover:text-white'}`}>
                    {track.title}
                  </h4>
                  <p className="text-xs text-[#9E9094] truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Right: 3-Dot Menu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`${track.title} • Released by ${track.artist}`);
                }}
                className="p-2 text-[#9E9094] hover:text-white rounded-xl transition-colors flex-shrink-0"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
