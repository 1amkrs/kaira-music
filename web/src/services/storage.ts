import { AudioTrack, DspSettings } from '../audio/types';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artworkUrl?: string;
  createdAt: number;
  tracks: AudioTrack[];
}

const STORAGE_KEYS = {
  SETTINGS: 'lastwave_settings_v1',
  LIKED_TRACKS: 'lastwave_liked_tracks_v1',
  RECENT_TRACKS: 'lastwave_recent_tracks_v1',
  PLAYLISTS: 'lastwave_playlists_v1',
  DSP: 'lastwave_dsp_settings_v1',
} as const;

export const storage = {
  getSettings(): any | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSettings(settings: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage error saving settings', e);
    }
  },

  getLikedTracks(): AudioTrack[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIKED_TRACKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setLikedTracks(tracks: AudioTrack[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED_TRACKS, JSON.stringify(tracks));
    } catch (e) {
      console.warn('Storage error saving liked tracks', e);
    }
  },

  getRecentTracks(): AudioTrack[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_TRACKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setRecentTracks(tracks: AudioTrack[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT_TRACKS, JSON.stringify(tracks.slice(0, 50)));
    } catch (e) {
      console.warn('Storage error saving recent tracks', e);
    }
  },

  getPlaylists(): Playlist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setPlaylists(playlists: Playlist[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.warn('Storage error saving playlists', e);
    }
  },

  getDspSettings(): Partial<DspSettings> | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DSP);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setDspSettings(dsp: DspSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DSP, JSON.stringify(dsp));
    } catch (e) {
      console.warn('Storage error saving DSP settings', e);
    }
  },
};
