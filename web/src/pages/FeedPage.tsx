import React, { useState } from 'react';
import {
  Compass,
  Search,
  Settings,
  Play,
  Shuffle,
  Heart,
  Music,
  MoreVertical,
  Radio,
  Sparkles,
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { CURATED_AUDIOPHILE_TRACKS } from '../services/clashflacApi';
import { AudioTrack } from '../audio/types';
import { NavTab } from '../components/NavigationShell';
import { TrackContextMenuModal } from '../components/TrackContextMenuModal';

interface FeedPageProps {
  onNavigateTab?: (tab: NavTab) => void;
  onOpenPlaylist?: (id: string | 'liked') => void;
  onOpenNewReleases?: () => void;
  onOpenArtist?: (artistName: string) => void;
  onOpenAlbum?: (albumTitle: string, artistName: string) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  onNavigateTab,
  onOpenPlaylist,
  onOpenNewReleases,
  onOpenArtist,
  onOpenAlbum,
}) => {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const likedTracks = useLibraryStore((s) => s.likedTracks);
  const [contextTrack, setContextTrack] = useState<AudioTrack | null>(null);

  // Dynamic greeting based on current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Curated tracks and collections matching screenshots
  const quickPickTracks: AudioTrack[] = [
    {
      id: 'track-deja-vu-qp',
      title: 'deja vu',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: 215,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe94728291353e001e',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/5a/c2/835ac220-f31a-006f-b6a9-2acd29eb60d0/mzaf_13621843495437485054.plus.aac.p.m4a',
      quality: 'HI_RES_192',
      bitDepth: 24,
      sampleRate: 192000,
      codec: 'FLAC',
      youtubeId: 'cii6ruuycQA',
    },
    {
      id: 'track-humble-qp',
      title: 'HUMBLE.',
      artist: 'Kendrick Lamar',
      album: 'DAMN.',
      duration: 177,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/2e/37/1f2e37be-bdd0-d770-6ea4-091011a6aade/mzaf_2360827885900940865.plus.aac.p.m4a',
      quality: 'HI_RES_192',
      bitDepth: 24,
      sampleRate: 192000,
      codec: 'FLAC',
      youtubeId: 'tvTRZJ-4EyI',
    },
    {
      id: 'track-vampire',
      title: 'vampire',
      artist: 'Olivia Rodrigo',
      album: 'GUTS',
      duration: 219,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/70/2f/a6/702fa6b5-946c-7a8e-2dba-03de25c732d3/mzaf_12764345117177639836.plus.aac.p.m4a',
      quality: 'HI_RES_192',
      bitDepth: 24,
      sampleRate: 192000,
      codec: 'FLAC',
      youtubeId: 'Fqey8LxQxFU',
    },
    {
      id: 'track-karma-police-qp',
      title: 'Karma Police',
      artist: 'Radiohead',
      album: 'OK Computer',
      duration: 261,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273c8b444df094179b770396495',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a',
      quality: 'HI_RES_192',
      bitDepth: 24,
      sampleRate: 192000,
      codec: 'FLAC',
      youtubeId: '4IJI6soiQhI',
    },
    {
      id: 'track-bad-idea',
      title: 'bad idea right?',
      artist: 'Olivia Rodrigo',
      album: 'GUTS',
      duration: 184,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ed/a4/a8/eda4a89f-53c6-b02d-7d6f-538a54a5f981/mzaf_8747814302721747990.plus.aac.p.m4a',
      quality: 'HI_RES_192',
      bitDepth: 24,
      sampleRate: 192000,
      codec: 'FLAC',
      youtubeId: 'ZsJ-BHohCRI',
    },
    {
      id: 'track-lunch-qp',
      title: 'LUNCH',
      artist: 'Billie Eilish',
      album: 'HIT ME HARD AND SOFT',
      duration: 180,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9d/3e/43/9d3e43aa-682a-7979-8547-d339956c409b/mzaf_710286407585135494.plus.aac.p.m4a',
      quality: 'HI_RES_96',
      bitDepth: 24,
      sampleRate: 96000,
      codec: 'FLAC',
      youtubeId: 'jsptjaAef7Q',
    },
  ];

  const discoverNewTracks: AudioTrack[] = [
    {
      id: 'track-360-disc',
      title: '360',
      artist: 'Charli xcx',
      album: 'BRAT',
      duration: 133,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738202b8d00977462c16118d09',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6a/b2/36/6ab236ac-6b8e-60e4-aa77-8e73c7127ebc/mzaf_17637473173165118705.plus.aac.p.m4a',
      quality: 'LOSSLESS_CD',
      bitDepth: 16,
      sampleRate: 44100,
      codec: 'FLAC',
      youtubeId: 'WJW-VvmrkS8',
    },
    {
      id: 'track-espresso-disc',
      title: 'Espresso',
      artist: 'Sabrina Carpenter',
      album: "Short n' Sweet",
      duration: 175,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f628',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/4d/02/e94d0230-11ee-ef94-d2cf-a5d547bd73f4/mzaf_554140808559155562.plus.aac.p.m4a',
      quality: 'HI_RES_192',
      bitDepth: 24,
      sampleRate: 192000,
      codec: 'FLAC',
      youtubeId: 'eVli-tstM5E',
    },
    {
      id: 'track-blinding-lights-disc',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/d6/60/19d660ff-e3a9-8377-15a3-ce4b28e89cac/mzaf_18422426156481158187.plus.aac.p.m4a',
      quality: 'HI_RES_192',
      bitDepth: 24,
      sampleRate: 192000,
      codec: 'FLAC',
      youtubeId: 'fHI8X4OXluQ',
    },
    {
      id: 'track-illusion-disc',
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
  ];

  const artistList = [
    { name: 'The Weeknd', image: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb' },
    { name: 'Kendrick Lamar', image: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022' },
    { name: 'Charli xcx', image: 'https://i.scdn.co/image/ab6761610000e5ebcfb227c2eb392f447f5cf535' },
    { name: 'Olivia Rodrigo', image: 'https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6' },
    { name: 'Billie Eilish', image: 'https://i.scdn.co/image/ab6761610000e5ebd8b9980db6711a43a0d53c7c' },
  ];

  const albumsList = [
    {
      title: 'After Hours',
      artist: 'The Weeknd',
      year: '2020',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    },
    {
      title: 'HIT ME HARD AND SOFT',
      artist: 'Billie Eilish',
      year: '2024',
      image: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
    },
    {
      title: 'BRAT',
      artist: 'Charli xcx',
      year: '2024',
      image: 'https://i.scdn.co/image/ab67616d0000b2738202b8d00977462c16118d09',
    },
  ];

  const newReleasesList: AudioTrack[] = [
    {
      id: 'track-taste',
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
      id: 'track-so-american',
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
      id: 'track-st-chroma',
      title: 'St. Chroma (feat. Daniel Caesar)',
      artist: 'Tyler, The Creator',
      album: 'CHROMAKOPIA',
      duration: 197,
      artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273449e77660c67084931a29cc8',
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a4/88/d7/a488d754-dd83-7ae2-3163-5b878af0e7ce/mzaf_11646963309078405717.plus.aac.p.m4a',
      quality: 'HI_RES_96',
      bitDepth: 24,
      sampleRate: 96000,
      codec: 'FLAC',
      youtubeId: 'C_Psq31k34k',
    },
  ];

  const soundVibes = [
    { name: 'Rock', color: 'bg-rose-400' },
    { name: 'Electronic', color: 'bg-cyan-400' },
    { name: 'Seen Live', color: 'bg-amber-400' },
    { name: 'Alternative', color: 'bg-purple-400' },
    { name: 'Pop', color: 'bg-pink-400' },
    { name: 'Indie', color: 'bg-emerald-400' },
    { name: 'R&B', color: 'bg-orange-400' },
    { name: 'Hip-Hop', color: 'bg-lime-400' },
  ];

  const handlePlayAll = (tracks: AudioTrack[], shuffle = false) => {
    if (tracks.length === 0) return;
    if (shuffle) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="min-h-full pb-28 pt-2 px-4 sm:px-6 max-w-4xl mx-auto font-sans bg-[#120E11] text-[#EDE0E2] transition-colors duration-300 select-none space-y-8 animate-in fade-in duration-300">
      {/* 1. Top Curved Header Island (1:1 Android Parity) */}
      <div className="bg-[#242125] -mx-4 sm:-mx-6 -mt-2 px-6 pt-4 pb-5 rounded-b-[36px] shadow-lg flex items-center justify-between mb-5">
        <h1 className="text-3xl sm:text-4xl font-bold font-sequel text-white tracking-tight">Home</h1>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handlePlayAll(CURATED_AUDIOPHILE_TRACKS, true)}
            className="w-11 h-11 rounded-full bg-[#363037] flex items-center justify-center text-white hover:bg-[#443D45] active:scale-95 transition-all shadow-sm"
            title="Discover Radio"
          >
            <Compass size={20} />
          </button>
          <button
            onClick={() => onNavigateTab?.('search')}
            className="w-11 h-11 rounded-full bg-[#363037] flex items-center justify-center text-white hover:bg-[#443D45] active:scale-95 transition-all shadow-sm"
            title="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => onNavigateTab?.('settings')}
            className="w-11 h-11 rounded-full bg-[#363037] flex items-center justify-center text-white hover:bg-[#443D45] active:scale-95 transition-all shadow-sm"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Dynamic Greeting & Date */}
      <div className="mt-2 mb-6">
        <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">
          {getGreeting()}
        </h2>
        <p className="text-sm font-medium text-[#9E9094]">{getFormattedDate()}</p>
      </div>

      {/* 2. Hero Card: Infinite Radio */}
      <div className="bg-[#1D1A1D] rounded-[28px] p-6 border border-white/[0.04] shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E282E] text-[#B8A8B0] text-xs font-semibold">
            <Sparkles size={13} className="fill-[#B8A8B0]/20" />
            <span>MADE FOR YOU</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3.5 tracking-tight">
            Infinite Radio
          </h3>
          <p className="text-sm text-[#9E9094] mt-1.5 leading-relaxed">
            An endless station shaped by your listening
          </p>

          <button
            onClick={() => handlePlayAll(CURATED_AUDIOPHILE_TRACKS, true)}
            className="bg-[#BAC6D7] text-[#1A1E24] font-bold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 mt-5 hover:bg-white active:scale-95 transition-all shadow-md"
          >
            <Play size={16} className="fill-[#1A1E24]" />
            <span>Play</span>
          </button>
        </div>

        {/* Ambient Subtle Background Graphic */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-lime/10 via-brand-cyan/10 to-transparent rounded-full filter blur-3xl -mr-16 -mt-16 pointer-events-none" />
      </div>

      {/* 3. Quick Access Tiles: Exact 2 + 1 Layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Tile 1 (Row 1, Left): Liked Songs */}
        <div
          onClick={() => (onOpenPlaylist ? onOpenPlaylist('liked') : onNavigateTab?.('library'))}
          className="bg-[#2A2E3D] rounded-[24px] p-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-[#34394B] active:scale-[0.99] transition-all shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#3E475A] text-white flex items-center justify-center flex-shrink-0">
            <Heart size={22} className="fill-white text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">Liked Songs</h4>
            <p className="text-xs text-[#8A96AB] truncate">Your collection</p>
          </div>
        </div>

        {/* Tile 2 (Row 1, Right): Mix */}
        <div
          onClick={() => handlePlayAll(CURATED_AUDIOPHILE_TRACKS, true)}
          className="bg-[#242023] rounded-[24px] p-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-[#2F292E] active:scale-[0.99] transition-all shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#322A30] text-[#A898A0] flex items-center justify-center flex-shrink-0">
            <Music size={22} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">Mix</h4>
            <p className="text-xs text-[#8E8088] truncate">Made for you</p>
          </div>
        </div>

        {/* Tile 3 (Row 2, Left Only): New releases */}
        <div
          onClick={() => (onOpenNewReleases ? onOpenNewReleases() : handlePlayAll(newReleasesList, false))}
          className="bg-[#242023] col-span-1 rounded-[24px] p-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-[#2F292E] active:scale-[0.99] transition-all shadow-sm"
        >
          <img
            src="https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62"
            alt="New Releases"
            className="w-12 h-12 rounded-2xl object-cover flex-shrink-0 bg-black"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">New releases</h4>
            <p className="text-xs text-[#8E8088] truncate">Fresh drops</p>
          </div>
        </div>
      </div>

      {/* 4. Section: Your sound (Horizontal Vibe Pills) */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Your sound</h3>
          <p className="text-xs text-[#8E8088] mt-0.5">Tap a vibe to start instant radio</p>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {['Rock', 'Electronic', 'Seen Live', 'Alternative', 'Pop', 'Indie', 'R&B', 'Hip-Hop'].map((vibe) => (
            <button
              key={vibe}
              onClick={() => handlePlayAll(CURATED_AUDIOPHILE_TRACKS, true)}
              className="bg-[#211D20] text-[#EDE0E2] text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/5 whitespace-nowrap shadow-sm hover:bg-white/10 active:scale-95 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{vibe}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Section: Quick picks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Quick picks</h3>
            <p className="text-xs text-[#8E8088] mt-0.5">Matched to your taste profile</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayAll(quickPickTracks, true)}
              className="w-10 h-10 rounded-full bg-[#242023] text-[#A8BED8] flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-sm"
              title="Shuffle Quick Picks"
            >
              <Shuffle size={18} />
            </button>
            <button
              onClick={() => handlePlayAll(quickPickTracks, false)}
              className="bg-[#BAC6D7] text-[#1A1E24] px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              <Play size={13} className="fill-[#1A1E24]" />
              <span>Play all</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {quickPickTracks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, quickPickTracks)}
                className={`bg-[#211B1E] rounded-2xl p-3 flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] transition-all ${
                  isCurrent ? 'border border-[#E2A9B0]/40 bg-[#E2A9B0]/5' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={track.artworkUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play size={16} className="fill-[#BAC6D7] text-[#BAC6D7]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#E2A9B0]' : 'text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-[#9E9094] truncate">{track.artist}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setContextTrack(track);
                  }}
                  className="p-1.5 rounded-lg text-[#9E9094] hover:text-white"
                  title="Options"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Section: Discover something new (Horizontal Carousel) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Discover something new</h3>
            <p className="text-xs text-[#9E9094]">A mix inspired by the cure</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayAll(discoverNewTracks, true)}
              className="w-8 h-8 rounded-full bg-[#211B1E] flex items-center justify-center text-[#EDE0E2] hover:bg-white/10 transition-colors"
            >
              <Shuffle size={15} />
            </button>
            <button
              onClick={() => handlePlayAll(discoverNewTracks, false)}
              className="bg-[#2A313D] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-[#3B4657] transition-colors"
            >
              <Play size={12} className="fill-white" />
              <span>Play all</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {discoverNewTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => playTrack(track, discoverNewTracks)}
              className="w-40 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-slate-800 shadow-md">
                <img
                  src={track.artworkUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#3B4657] text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
                  <Play size={14} className="fill-white translate-x-0.5" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white truncate mt-2 group-hover:text-[#E2A9B0] transition-colors">
                {track.title}
              </h4>
              <p className="text-xs text-[#9E9094] truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Section: Artist Spotlight Card */}
      <div className="bg-gradient-to-br from-[#292025] via-[#211B1E] to-[#1C1619] rounded-[28px] p-6 border border-white/[0.04] shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] text-[#D5BFC3] text-[11px] font-semibold">
              <span>✦ ARTIST SPOTLIGHT</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <img
                src="https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6"
                alt="Olivia Rodrigo"
                className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white/10"
              />
              <div>
                <h4 className="text-xl font-bold text-white">Olivia Rodrigo</h4>
                <p className="text-xs text-[#E2A9B0] font-medium mt-0.5">♪ vampire • GUTS</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handlePlayAll(CURATED_AUDIOPHILE_TRACKS, true)}
              className="bg-[#DDE2EB] text-[#120E11] font-semibold px-5 py-2.5 rounded-full text-xs hover:bg-white active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <Play size={12} className="fill-[#120E11]" />
              <span>Artist radio</span>
            </button>
            <button
              onClick={() => (onOpenArtist ? onOpenArtist('Olivia Rodrigo') : onNavigateTab?.('search'))}
              className="bg-[#34272C] text-white font-semibold px-5 py-2.5 rounded-full text-xs hover:bg-[#45333A] active:scale-95 transition-all"
            >
              View artist
            </button>
          </div>
        </div>
      </div>

      {/* 8. Section: Artists for you */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Artists for you</h3>
          <p className="text-xs text-[#9E9094]">Worth another listen</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {artistList.map((artist) => (
            <div
              key={artist.name}
              onClick={() => (onOpenArtist ? onOpenArtist(artist.name) : onNavigateTab?.('search'))}
              className="flex flex-col items-center cursor-pointer group flex-shrink-0"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-transparent group-hover:border-[#C6F100] transition-all shadow-md"
              />
              <span className="text-xs font-semibold text-white mt-2 group-hover:text-[#C6F100] transition-colors text-center w-20 truncate">
                {artist.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Section: Favorites to revisit */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Favorites to revisit</h3>
            <p className="text-xs text-[#9E9094]">From your listening profile</p>
          </div>

          <button
            onClick={() => handlePlayAll(CURATED_AUDIOPHILE_TRACKS, false)}
            className="bg-[#2A313D] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-[#3B4657] transition-colors"
          >
            <Play size={12} className="fill-white" />
            <span>Play all</span>
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {CURATED_AUDIOPHILE_TRACKS.slice(0, 4).map((track) => (
            <div
              key={track.id}
              onClick={() => playTrack(track, CURATED_AUDIOPHILE_TRACKS)}
              className="w-40 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-slate-800 shadow-md">
                <img
                  src={track.artworkUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#3B4657] text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
                  <Play size={14} className="fill-white translate-x-0.5" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white truncate mt-2 group-hover:text-[#E2A9B0] transition-colors">
                {track.title}
              </h4>
              <p className="text-xs text-[#9E9094] truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Section: Albums for you */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Albums for you</h3>
          <p className="text-xs text-[#9E9094]">
            Real albums from your taste — Last.fm tops + YT Music picks
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {albumsList.map((album) => (
            <div
              key={album.title}
              onClick={() => (onOpenAlbum ? onOpenAlbum(album.title, album.artist) : handlePlayAll(CURATED_AUDIOPHILE_TRACKS, false))}
              className="w-40 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-slate-800 shadow-md">
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#3B4657] text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
                  <Play size={14} className="fill-white translate-x-0.5" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white truncate mt-2 group-hover:text-[#E2A9B0] transition-colors">
                {album.title}
              </h4>
              <p className="text-xs text-[#9E9094] truncate">{album.artist} • {album.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 11. Section: New releases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">New releases</h3>
            <p className="text-xs text-[#9E9094]">Fresh drops and new albums</p>
          </div>

          <button
            onClick={() => (onOpenNewReleases ? onOpenNewReleases() : onNavigateTab?.('search'))}
            className="text-xs font-semibold text-[#E2A9B0] hover:underline"
          >
            &gt; See all
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {newReleasesList.map((track) => (
            <div
              key={track.id}
              onClick={() => playTrack(track, newReleasesList)}
              className="w-40 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-slate-800 shadow-md">
                <img
                  src={track.artworkUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {/* NEW Badge on top-left */}
                <div className="absolute top-2.5 left-2.5 bg-[#3B4657]/85 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  NEW
                </div>
                <div className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#3B4657] text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform">
                  <Play size={14} className="fill-white translate-x-0.5" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white truncate mt-2 group-hover:text-[#E2A9B0] transition-colors">
                {track.title}
              </h4>
              <p className="text-xs text-[#9E9094] truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Track Context Menu Modal */}
      <TrackContextMenuModal
        isOpen={Boolean(contextTrack)}
        onClose={() => setContextTrack(null)}
        track={contextTrack}
        onGoToArtist={(artist) => {
          setContextTrack(null);
          if (onOpenArtist) onOpenArtist(artist);
        }}
        onGoToAlbum={(album, artist) => {
          setContextTrack(null);
          if (onOpenAlbum) onOpenAlbum(album, artist || '');
        }}
      />
    </div>
  );
};
