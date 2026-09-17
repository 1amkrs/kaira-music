export type AudioQuality = 'HI_RES_192' | 'HI_RES_96' | 'LOSSLESS_CD' | 'HIGH_320';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  artworkUrl?: string;
  streamUrl: string;
  quality: AudioQuality;
  bitDepth: number; // e.g. 24, 16
  sampleRate: number; // e.g. 192000, 96000, 44100
  codec: string; // e.g. 'FLAC', 'ALAC', 'Opus', 'MP3'
  clashflacId?: string;
  youtubeId?: string;
  lyricsLrc?: string;
}

export type PlaybackEvent =
  | { type: 'timeupdate'; currentTime: number }
  | { type: 'durationchange'; duration: number }
  | { type: 'progress'; buffered: number }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'ended' }
  | { type: 'waiting' }
  | { type: 'canplay' }
  | { type: 'error'; message: string };

export interface EqBandConfig {
  frequency: number;
  label: string;
  type: BiquadFilterType;
  q: number;
}

export const EQ_BAND_FREQUENCIES: EqBandConfig[] = [
  { frequency: 32, label: '32Hz', type: 'lowshelf', q: 0.7 },
  { frequency: 45, label: '45Hz', type: 'peaking', q: 1.4 },
  { frequency: 64, label: '64Hz', type: 'peaking', q: 1.4 },
  { frequency: 125, label: '125Hz', type: 'peaking', q: 1.4 },
  { frequency: 250, label: '250Hz', type: 'peaking', q: 1.4 },
  { frequency: 500, label: '500Hz', type: 'peaking', q: 1.4 },
  { frequency: 1000, label: '1kHz', type: 'peaking', q: 1.4 },
  { frequency: 2000, label: '2kHz', type: 'peaking', q: 1.4 },
  { frequency: 3000, label: '3kHz', type: 'peaking', q: 1.4 },
  { frequency: 4000, label: '4kHz', type: 'peaking', q: 1.4 },
  { frequency: 6000, label: '6kHz', type: 'peaking', q: 1.4 },
  { frequency: 8000, label: '8kHz', type: 'peaking', q: 1.4 },
  { frequency: 10000, label: '10kHz', type: 'peaking', q: 1.4 },
  { frequency: 12000, label: '12kHz', type: 'peaking', q: 1.4 },
  { frequency: 16000, label: '16kHz', type: 'highshelf', q: 0.7 },
];

export interface DspSettings {
  eqEnabled: boolean;
  eqGains: number[]; // 15 gain values in dB (-12 to +12)
  preampGainDb: number; // -12 to +12 dB
  crossfeedEnabled: boolean;
  crossfeedLevel: number; // 0.0 (subtle) to 1.0 (pronounced)
  limiterEnabled: boolean;
  bypassAll: boolean; // Bit-perfect bypass
}

export interface EqPreset {
  id: string;
  name: string;
  description: string;
  gains: number[];
  preamp: number;
}

export interface SignalPathNodeInfo {
  name: string;
  detail: string;
  status: 'lossless' | 'dsp' | 'direct' | 'resampled' | 'bypassed';
  color: string;
}
