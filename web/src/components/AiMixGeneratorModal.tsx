import React, { useState } from 'react';
import { Sparkles, X, Wand2, Music2, Check, ArrowRight } from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { AudioTrack } from '../audio/types';

interface AiMixGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlaylist?: (id: string) => void;
}

interface MixPreset {
  id: string;
  title: string;
  description: string;
  badge: string;
  tracks: AudioTrack[];
}

const SMART_MIX_PRESETS: MixPreset[] = [
  {
    id: 'mix-late-night',
    title: 'Late Night Lossless Chill',
    description: 'Moody downtempo, lush synth pads, and warm acoustic low-end.',
    badge: 'Ambient & Lo-Fi',
    tracks: [
      {
        id: 'ln-1',
        title: 'Nikes',
        artist: 'Frank Ocean',
        album: 'Blonde',
        duration: 314,
        artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526',
        streamUrl: 'https://archive.org/download/test-flac-audio/track01.flac',
        quality: 'HI_RES_192',
        bitDepth: 24,
        sampleRate: 192000,
        codec: 'FLAC',
      },
      {
        id: 'ln-2',
        title: 'Snooze',
        artist: 'SZA',
        album: 'SOS',
        duration: 201,
        artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2730c471c36970b94093ed59fed',
        streamUrl: 'https://archive.org/download/test-flac-audio/track02.flac',
        quality: 'HI_RES_96',
        bitDepth: 24,
        sampleRate: 96000,
        codec: 'FLAC',
      },
      {
        id: 'ln-3',
        title: 'Touch',
        artist: 'Daft Punk',
        album: 'Random Access Memories',
        duration: 498,
        artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2739b6ac98a52f62d5cb473da40',
        streamUrl: 'https://archive.org/download/test-flac-audio/track03.flac',
        quality: 'LOSSLESS_CD',
        bitDepth: 16,
        sampleRate: 44100,
        codec: 'FLAC',
      },
    ],
  },
  {
    id: 'mix-audiophile',
    title: 'Audiophile Master Showcase',
    description: 'Uncompressed dynamic range, binaural depth, and sparkling micro-detail.',
    badge: '192kHz / 24-bit',
    tracks: [
      {
        id: 'ap-1',
        title: 'HUMBLE.',
        artist: 'Kendrick Lamar',
        album: 'DAMN.',
        duration: 177,
        artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699',
        streamUrl: 'https://archive.org/download/test-flac-audio/track01.flac',
        quality: 'HI_RES_192',
        bitDepth: 24,
        sampleRate: 192000,
        codec: 'FLAC',
      },
      {
        id: 'ap-2',
        title: 'Karma Police',
        artist: 'Radiohead',
        album: 'OK Computer',
        duration: 261,
        artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273c8b444df094179b770396495',
        streamUrl: 'https://archive.org/download/test-flac-audio/track02.flac',
        quality: 'HI_RES_192',
        bitDepth: 24,
        sampleRate: 192000,
        codec: 'FLAC',
      },
    ],
  },
  {
    id: 'mix-vocal',
    title: 'Intimate Female Vocals',
    description: 'Forward midrange presence, breath articulation, and acoustic guitar strings.',
    badge: 'Vocal Focus',
    tracks: [
      {
        id: 'vc-1',
        title: 'deja vu',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        duration: 215,
        artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe94728291353e001e',
        streamUrl: 'https://archive.org/download/test-flac-audio/track01.flac',
        quality: 'LOSSLESS_CD',
        bitDepth: 16,
        sampleRate: 44100,
        codec: 'FLAC',
      },
      {
        id: 'vc-2',
        title: 'CHIHIRO',
        artist: 'Billie Eilish',
        album: 'HIT ME HARD AND SOFT',
        duration: 303,
        artworkUrl: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
        streamUrl: 'https://archive.org/download/test-flac-audio/track02.flac',
        quality: 'LOSSLESS_CD',
        bitDepth: 16,
        sampleRate: 44100,
        codec: 'FLAC',
      },
    ],
  },
];

export const AiMixGeneratorModal: React.FC<AiMixGeneratorModalProps> = ({
  isOpen,
  onClose,
  onOpenPlaylist,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('mix-late-night');
  const [isGenerating, setIsGenerating] = useState(false);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const addTrackToPlaylist = useLibraryStore((s) => s.addTrackToPlaylist);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    const preset = SMART_MIX_PRESETS.find((p) => p.id === selectedPresetId) || SMART_MIX_PRESETS[0];

    setTimeout(() => {
      const newPlaylist = createPlaylist(
        `✦ ${preset.title}`,
        `${preset.description} (AI Smart Mix)`
      );

      preset.tracks.forEach((track) => {
        addTrackToPlaylist(newPlaylist.id, track);
      });

      setIsGenerating(false);
      onClose();
      if (onOpenPlaylist) {
        onOpenPlaylist(newPlaylist.id);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#211B1E] border border-white/10 rounded-[28px] p-6 shadow-2xl space-y-5 select-none animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#543339] text-[#E2A9B0] flex items-center justify-center shadow-sm">
              <Sparkles size={20} className="fill-[#E2A9B0]/20" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">AI Smart Mix</h3>
              <p className="text-xs text-[#9E9094]">Generate tailored lossless playlists</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#9E9094] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Presets List */}
        <div className="space-y-2.5">
          {SMART_MIX_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#543339]/60 border-[#E2A9B0] shadow-md'
                    : 'bg-[#181316] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{preset.title}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E2A9B0]/15 text-[#E2A9B0]">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-xs text-[#9E9094] mt-1 line-clamp-2">{preset.description}</p>
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[11px] text-[#D5BFC3]">
                  <span>{preset.tracks.length} tracks included</span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[#E2A9B0] font-semibold">
                      <Check size={12} /> Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#9E9094] hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E2A9B0] text-[#4A2027] text-xs font-bold shadow-md hover:bg-[#EAA9B1] active:scale-95 transition-all disabled:opacity-50"
          >
            <Wand2 size={14} />
            <span>{isGenerating ? 'Curating Mix...' : 'Generate Playlist'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiMixGeneratorModal;
