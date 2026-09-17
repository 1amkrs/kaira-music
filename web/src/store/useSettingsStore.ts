import { create } from 'zustand';
import { AudioQuality, DspSettings, EQ_BAND_FREQUENCIES, EqPreset } from '../audio/types';
import { storage } from '../services/storage';
import { WebAudioEngine } from '../audio/WebAudioEngine';
import { lastFmApi } from '../services/lastFmApi';
import { ytMusicApi } from '../services/ytMusicApi';
import { clashflacApi } from '../services/clashflacApi';

export const EQ_PRESETS: EqPreset[] = [
  {
    id: 'flat',
    name: 'Flat / Reference',
    description: 'Completely uncolored frequency response for studio monitors and neutral cans.',
    gains: new Array(EQ_BAND_FREQUENCIES.length).fill(0),
    preamp: 0,
  },
  {
    id: 'studio_master',
    name: 'Studio Master High-Res',
    description: 'Subtle low-end extension with shimmering ultra-high octave air above 10kHz.',
    gains: [1.5, 1.2, 0.8, 0, 0, 0, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0, 2.5, 2.5, 3.0],
    preamp: -1.5,
  },
  {
    id: 'audiophile_warmth',
    name: 'Audiophile Warmth',
    description: 'Analog tape-like richness with a smooth high-frequency rolloff.',
    gains: [2.5, 2.0, 1.8, 1.2, 0.6, 0.2, 0, -0.2, -0.5, -0.8, -1.0, -1.2, -1.5, -2.0, -2.5],
    preamp: -1.0,
  },
  {
    id: 'bass_boost',
    name: 'Sub-Bass Impact',
    description: 'Deep authoritative low-end punch without muddying midrange vocals.',
    gains: [6.0, 5.5, 4.5, 3.0, 1.5, 0, 0, 0, 0, 0, 0.5, 0.8, 1.0, 1.0, 1.0],
    preamp: -3.0,
  },
  {
    id: 'vocal_presence',
    name: 'Vocal Presence',
    description: 'Brings lead vocals and acoustic strings into intimate forward focus.',
    gains: [-1.0, -1.0, -0.5, 0, 0.5, 1.5, 2.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0, 0],
    preamp: -1.5,
  },
  {
    id: 'electronic_synth',
    name: 'Cyber & Electronic',
    description: 'Dynamic V-shaped curve tailored for synthwave, techno, and fast transients.',
    gains: [4.5, 4.0, 3.0, 1.5, 0, -1.0, -0.5, 0.5, 1.0, 2.0, 3.0, 4.0, 4.5, 4.0, 3.5],
    preamp: -2.5,
  },
];

export type AccentColor =
  | 'crimson'
  | 'violet'
  | 'ocean'
  | 'sage'
  | 'amber'
  | 'rose'
  | 'mono'
  | 'custom';

export interface SettingsState {
  // Streaming & Backend
  clashflacUrl: string;
  clashflacApiKey: string;
  preferredQuality: AudioQuality;
  downloadQuality: AudioQuality;

  // Last.fm BYOK & Auth
  lastFmUsername: string;
  lastFmApiKey: string;
  lastFmSecret: string;
  lastFmSessionKey: string;
  lastFmAvatarUrl?: string;
  lastFmPlayCount?: number;
  isLastFmConnected: boolean;

  // YouTube Music & Playlists
  isYtMusicConnected: boolean;
  ytMusicAccountName: string;
  ytMusicChannelHandle: string;
  ytMusicPhotoUrl: string;
  ytMusicCookies: string;
  ytMusicPlaylistsCount: number;
  twoWayPlaylistSync: boolean;

  // Appearance & Personalization
  amoledMode: boolean;
  dynamicColor: boolean;
  dynamicNowPlaying: boolean;
  useAppFont: boolean;
  homeSectionsCount: number;
  accentTheme: AccentColor;

  // Experimental / Audio Features
  liquidGlass: boolean;
  lyricsAnimation: string;
  wavySeekbar: boolean;
  studioClarity: boolean;
  crossfade: boolean;
  downloadSyncedLyrics: boolean;

  // Scrobbler
  scrobbleMusic: boolean;
  submitNowPlaying: boolean;
  scrobblePercent: number; // 10 to 100

  // DSP
  dsp: DspSettings;
  activePresetId: string;

  // Setters
  setClashflacUrl: (url: string) => void;
  setClashflacApiKey: (key: string) => void;
  setPreferredQuality: (q: AudioQuality) => void;
  setDownloadQuality: (q: AudioQuality) => void;

  setLastFmConfig: (config: { username?: string; apiKey?: string; secret?: string; sessionKey?: string }) => void;
  setLastFmProfile: (profile: { avatarUrl?: string; playCount?: number }) => void;
  disconnectLastFm: () => void;

  setYtMusicConnection: (info: {
    accountName: string;
    channelHandle: string;
    photoUrl: string;
    cookies?: string;
    playlistsCount?: number;
  }) => void;
  disconnectYtMusic: () => void;
  setTwoWayPlaylistSync: (sync: boolean) => void;

  setAmoledMode: (val: boolean) => void;
  setDynamicColor: (val: boolean) => void;
  setDynamicNowPlaying: (val: boolean) => void;
  setUseAppFont: (val: boolean) => void;
  setAccentTheme: (theme: AccentColor) => void;

  setLiquidGlass: (val: boolean) => void;
  setLyricsAnimation: (val: string) => void;
  setWavySeekbar: (val: boolean) => void;
  setStudioClarity: (val: boolean) => void;
  setCrossfade: (val: boolean) => void;
  setDownloadSyncedLyrics: (val: boolean) => void;

  setScrobbleMusic: (val: boolean) => void;
  setSubmitNowPlaying: (val: boolean) => void;
  setScrobblePercent: (val: number) => void;

  setDspSetting: <K extends keyof DspSettings>(key: K, value: DspSettings[K]) => void;
  setEqBandGain: (bandIndex: number, gainDb: number) => void;
  applyPreset: (presetId: string) => void;

  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

const defaultDsp: DspSettings = {
  eqEnabled: true,
  eqGains: new Array(EQ_BAND_FREQUENCIES.length).fill(0),
  preampGainDb: 0,
  crossfeedEnabled: false,
  crossfeedLevel: 0.5,
  limiterEnabled: true,
  bypassAll: false,
};

const savedDsp = storage.getDspSettings();
const initialDsp: DspSettings = savedDsp ? { ...defaultDsp, ...savedDsp } : defaultDsp;
const savedSettings = storage.getSettings() || {};

if (savedSettings.clashflacUrl) {
  clashflacApi.setConfig(savedSettings.clashflacUrl, savedSettings.clashflacApiKey || '');
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  clashflacUrl: savedSettings.clashflacUrl ?? '',
  clashflacApiKey: savedSettings.clashflacApiKey ?? '',
  preferredQuality: savedSettings.preferredQuality ?? 'HI_RES_192',
  downloadQuality: savedSettings.downloadQuality ?? 'HI_RES_192',

  lastFmUsername: savedSettings.lastFmUsername ?? 'i4mkrs',
  lastFmApiKey: savedSettings.lastFmApiKey ?? '',
  lastFmSecret: savedSettings.lastFmSecret ?? '',
  lastFmSessionKey: savedSettings.lastFmSessionKey ?? '',
  lastFmAvatarUrl: savedSettings.lastFmAvatarUrl ?? '',
  lastFmPlayCount: savedSettings.lastFmPlayCount ?? 0,
  isLastFmConnected: Boolean(savedSettings.lastFmSessionKey),

  isYtMusicConnected: savedSettings.isYtMusicConnected ?? false,
  ytMusicAccountName: savedSettings.ytMusicAccountName ?? '',
  ytMusicChannelHandle: savedSettings.ytMusicChannelHandle ?? '',
  ytMusicPhotoUrl: savedSettings.ytMusicPhotoUrl ?? '',
  ytMusicCookies: savedSettings.ytMusicCookies ?? '',
  ytMusicPlaylistsCount: savedSettings.ytMusicPlaylistsCount ?? 0,
  twoWayPlaylistSync: savedSettings.twoWayPlaylistSync ?? false,

  amoledMode: savedSettings.amoledMode ?? false,
  dynamicColor: savedSettings.dynamicColor ?? true,
  dynamicNowPlaying: savedSettings.dynamicNowPlaying ?? true,
  useAppFont: savedSettings.useAppFont ?? true,
  homeSectionsCount: savedSettings.homeSectionsCount ?? 15,
  accentTheme: savedSettings.accentTheme ?? 'rose',

  liquidGlass: savedSettings.liquidGlass ?? true,
  lyricsAnimation: savedSettings.lyricsAnimation ?? 'New UI (Modern)',
  wavySeekbar: savedSettings.wavySeekbar ?? true,
  studioClarity: savedSettings.studioClarity ?? true,
  crossfade: savedSettings.crossfade ?? false,
  downloadSyncedLyrics: savedSettings.downloadSyncedLyrics ?? true,

  scrobbleMusic: savedSettings.scrobbleMusic ?? false,
  submitNowPlaying: savedSettings.submitNowPlaying ?? true,
  scrobblePercent: savedSettings.scrobblePercent ?? 50,

  hasCompletedOnboarding: savedSettings.hasCompletedOnboarding ?? false,

  dsp: initialDsp,
  activePresetId: 'flat',

  setClashflacUrl: (url: string) => {
    clashflacApi.setConfig(url, get().clashflacApiKey);
    set({ clashflacUrl: url });
  },
  setClashflacApiKey: (key: string) => {
    clashflacApi.setConfig(get().clashflacUrl, key);
    set({ clashflacApiKey: key });
  },
  setPreferredQuality: (q: AudioQuality) => set({ preferredQuality: q }),
  setDownloadQuality: (q: AudioQuality) => set({ downloadQuality: q }),

  setLastFmConfig: (config) =>
    set((state) => {
      const username = config.username !== undefined ? config.username : state.lastFmUsername;
      const apiKey = config.apiKey !== undefined ? config.apiKey : state.lastFmApiKey;
      const secret = config.secret !== undefined ? config.secret : state.lastFmSecret;
      const sessionKey = config.sessionKey !== undefined ? config.sessionKey : state.lastFmSessionKey;
      lastFmApi.setCredentials({ username, apiKey, sharedSecret: secret, sessionKey });
      return {
        lastFmUsername: username,
        lastFmApiKey: apiKey,
        lastFmSecret: secret,
        lastFmSessionKey: sessionKey,
        isLastFmConnected: Boolean(sessionKey),
      };
    }),

  setLastFmProfile: (profile) =>
    set((state) => ({
      lastFmAvatarUrl: profile.avatarUrl !== undefined ? profile.avatarUrl : state.lastFmAvatarUrl,
      lastFmPlayCount: profile.playCount !== undefined ? profile.playCount : state.lastFmPlayCount,
    })),

  disconnectLastFm: () => {
    lastFmApi.setCredentials({ username: '', sessionKey: '' });
    set({
      lastFmUsername: '',
      lastFmApiKey: '',
      lastFmSecret: '',
      lastFmSessionKey: '',
      lastFmAvatarUrl: '',
      lastFmPlayCount: 0,
      isLastFmConnected: false,
    });
  },

  setYtMusicConnection: (info) =>
    set({
      isYtMusicConnected: true,
      ytMusicAccountName: info.accountName,
      ytMusicChannelHandle: info.channelHandle,
      ytMusicPhotoUrl: info.photoUrl,
      ytMusicCookies: info.cookies ?? '',
      ytMusicPlaylistsCount: info.playlistsCount ?? 6,
    }),

  disconnectYtMusic: () => {
    ytMusicApi.disconnect();
    set({
      isYtMusicConnected: false,
      ytMusicAccountName: '',
      ytMusicChannelHandle: '',
      ytMusicPhotoUrl: '',
      ytMusicCookies: '',
      ytMusicPlaylistsCount: 0,
    });
  },

  setTwoWayPlaylistSync: (val: boolean) => set({ twoWayPlaylistSync: val }),

  setAmoledMode: (val: boolean) => set({ amoledMode: val }),
  setDynamicColor: (val: boolean) => set({ dynamicColor: val }),
  setDynamicNowPlaying: (val: boolean) => set({ dynamicNowPlaying: val }),
  setUseAppFont: (val: boolean) => set({ useAppFont: val }),
  setAccentTheme: (theme: AccentColor) => set({ accentTheme: theme }),

  setLiquidGlass: (val: boolean) => set({ liquidGlass: val }),
  setLyricsAnimation: (val: string) => set({ lyricsAnimation: val }),
  setWavySeekbar: (val: boolean) => set({ wavySeekbar: val }),
  setStudioClarity: (val: boolean) => set({ studioClarity: val }),
  setCrossfade: (val: boolean) => set({ crossfade: val }),
  setDownloadSyncedLyrics: (val: boolean) => set({ downloadSyncedLyrics: val }),

  setScrobbleMusic: (val: boolean) => set({ scrobbleMusic: val }),
  setSubmitNowPlaying: (val: boolean) => set({ submitNowPlaying: val }),
  setScrobblePercent: (val: number) => set({ scrobblePercent: val }),

  setDspSetting: (key, value) => {
    set((state) => {
      const nextDsp = { ...state.dsp, [key]: value };
      storage.setDspSettings(nextDsp);

      const audioEngine = WebAudioEngine.getInstance();
      const dspChain = audioEngine.getDspChain();
      if (dspChain) {
        dspChain.applySettings({ [key]: value });
      }

      return { dsp: nextDsp };
    });
  },

  setEqBandGain: (bandIndex: number, gainDb: number) => {
    set((state) => {
      const nextGains = [...state.dsp.eqGains];
      nextGains[bandIndex] = gainDb;
      const nextDsp = { ...state.dsp, eqGains: nextGains };
      storage.setDspSettings(nextDsp);

      const audioEngine = WebAudioEngine.getInstance();
      const dspChain = audioEngine.getDspChain();
      if (dspChain) {
        dspChain.setEqGain(bandIndex, gainDb);
      }

      return { dsp: nextDsp, activePresetId: 'custom' };
    });
  },

  applyPreset: (presetId: string) => {
    const preset = EQ_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    set((state) => {
      const nextDsp: DspSettings = {
        ...state.dsp,
        eqGains: [...preset.gains],
        preampGainDb: preset.preamp,
      };
      storage.setDspSettings(nextDsp);

      const audioEngine = WebAudioEngine.getInstance();
      const dspChain = audioEngine.getDspChain();
      if (dspChain) {
        dspChain.applySettings(nextDsp);
      }

      return { dsp: nextDsp, activePresetId: presetId };
    });
  },

  setHasCompletedOnboarding: (completed: boolean) => {
    set({ hasCompletedOnboarding: completed });
  },
}));

// Automatically persist changes to settings
useSettingsStore.subscribe((state) => {
  storage.setSettings({
    clashflacUrl: state.clashflacUrl,
    clashflacApiKey: state.clashflacApiKey,
    preferredQuality: state.preferredQuality,
    downloadQuality: state.downloadQuality,
    lastFmUsername: state.lastFmUsername,
    lastFmApiKey: state.lastFmApiKey,
    lastFmSecret: state.lastFmSecret,
    lastFmSessionKey: state.lastFmSessionKey,
    lastFmAvatarUrl: state.lastFmAvatarUrl,
    lastFmPlayCount: state.lastFmPlayCount,
    isYtMusicConnected: state.isYtMusicConnected,
    ytMusicAccountName: state.ytMusicAccountName,
    ytMusicChannelHandle: state.ytMusicChannelHandle,
    ytMusicPhotoUrl: state.ytMusicPhotoUrl,
    ytMusicCookies: state.ytMusicCookies,
    ytMusicPlaylistsCount: state.ytMusicPlaylistsCount,
    twoWayPlaylistSync: state.twoWayPlaylistSync,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    amoledMode: state.amoledMode,
    dynamicColor: state.dynamicColor,
    dynamicNowPlaying: state.dynamicNowPlaying,
    useAppFont: state.useAppFont,
    homeSectionsCount: state.homeSectionsCount,
    accentTheme: state.accentTheme,
    liquidGlass: state.liquidGlass,
    lyricsAnimation: state.lyricsAnimation,
    wavySeekbar: state.wavySeekbar,
    studioClarity: state.studioClarity,
    crossfade: state.crossfade,
    downloadSyncedLyrics: state.downloadSyncedLyrics,
    scrobbleMusic: state.scrobbleMusic,
    submitNowPlaying: state.submitNowPlaying,
    scrobblePercent: state.scrobblePercent,
  });
});
