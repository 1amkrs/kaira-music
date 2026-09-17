import { create } from 'zustand';
import { AudioTrack } from '../audio/types';
import { DownloadedTrack, offlineStorage } from '../services/offlineStorage';
import { musicService } from '../services/musicService';
import { lrclibApi } from '../services/lrclibApi';

export interface OfflineState {
  downloadedTracks: DownloadedTrack[];
  downloadingTrackIds: Record<string, number>; // trackId -> percent (0-100)
  isOnline: boolean;
  totalStorageBytes: number;
  isLoading: boolean;

  // Actions
  downloadTrack: (track: AudioTrack) => Promise<void>;
  removeDownload: (trackId: string) => Promise<void>;
  clearAllDownloads: () => Promise<void>;
  exportTrackFile: (trackId: string) => Promise<void>;
  refreshDownloads: () => Promise<void>;
  isDownloaded: (trackId: string) => boolean;
  isDownloading: (trackId: string) => boolean;
  getDownloadProgress: (trackId: string) => number;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  downloadedTracks: [],
  downloadingTrackIds: {},
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  totalStorageBytes: 0,
  isLoading: true,

  downloadTrack: async (track: AudioTrack) => {
    const { id } = track;
    if (get().downloadingTrackIds[id] !== undefined) return;

    // Set initial progress
    set((state) => ({
      downloadingTrackIds: { ...state.downloadingTrackIds, [id]: 15 },
    }));

    try {
      // 1. Resolve full stream URL
      const streamUrl = await musicService.resolvePlayableStream(track);
      set((state) => ({
        downloadingTrackIds: { ...state.downloadingTrackIds, [id]: 35 },
      }));

      // 2. Fetch audio file as Blob
      const response = await fetch(streamUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio file (${response.status} ${response.statusText})`);
      }

      set((state) => ({
        downloadingTrackIds: { ...state.downloadingTrackIds, [id]: 70 },
      }));

      const audioBlob = await response.blob();

      // 3. Fetch synchronized lyrics in background
      let lyrics = null;
      try {
        const lyricsRes = await lrclibApi.getLyrics(
          track.title,
          track.artist,
          track.album,
          track.duration
        );
        if (lyricsRes.synced && lyricsRes.synced.length > 0) {
          lyrics = lyricsRes;
        }
      } catch (lyricsErr) {
        console.warn('Optional lyrics fetch failed during download:', lyricsErr);
      }

      set((state) => ({
        downloadingTrackIds: { ...state.downloadingTrackIds, [id]: 90 },
      }));

      // 4. Save to native IndexedDB
      await offlineStorage.saveDownloadedTrack(track, audioBlob, lyrics);

      // 5. Refresh store state
      await get().refreshDownloads();
    } catch (error) {
      console.error(`[useOfflineStore] Download failed for track "${track.title}":`, error);
      throw error;
    } finally {
      set((state) => {
        const updated = { ...state.downloadingTrackIds };
        delete updated[id];
        return { downloadingTrackIds: updated };
      });
    }
  },

  removeDownload: async (trackId: string) => {
    try {
      await offlineStorage.deleteDownloadedTrack(trackId);
      await get().refreshDownloads();
    } catch (e) {
      console.error(`[useOfflineStore] Failed to remove download for ${trackId}:`, e);
    }
  },

  clearAllDownloads: async () => {
    try {
      await offlineStorage.clearAllDownloads();
      await get().refreshDownloads();
    } catch (e) {
      console.error('[useOfflineStore] Failed to clear downloads:', e);
    }
  },

  exportTrackFile: async (trackId: string) => {
    const track = get().downloadedTracks.find((t) => t.id === trackId) ||
      (await offlineStorage.getDownloadedTrack(trackId));

    if (!track || !track.audioBlob) {
      console.warn(`[useOfflineStore] Cannot export track ${trackId}: audioBlob not found.`);
      return;
    }

    // Determine clean file extension from mimeType
    const mime = track.mimeType || 'audio/mp4';
    let ext = 'm4a';
    if (mime.includes('flac')) ext = 'flac';
    else if (mime.includes('mpeg') || mime.includes('mp3')) ext = 'mp3';
    else if (mime.includes('ogg')) ext = 'ogg';
    else if (mime.includes('wav')) ext = 'wav';

    // Sanitize filename
    const safeTitle = (track.title || 'Track').replace(/[/\\?%*:|"<>]/g, '-');
    const safeArtist = (track.artist || 'Unknown').replace(/[/\\?%*:|"<>]/g, '-');
    const filename = `${safeTitle} - ${safeArtist}.${ext}`;

    const objectUrl = URL.createObjectURL(track.audioBlob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  },

  refreshDownloads: async () => {
    try {
      const tracks = await offlineStorage.getAllDownloadedTracks();
      const totalBytes = tracks.reduce((acc, t) => acc + (t.sizeBytes || 0), 0);
      set({
        downloadedTracks: tracks,
        totalStorageBytes: totalBytes,
        isLoading: false,
      });
    } catch (e) {
      console.warn('[useOfflineStore] refreshDownloads error:', e);
      set({ isLoading: false });
    }
  },

  isDownloaded: (trackId: string) => {
    return get().downloadedTracks.some((t) => t.id === trackId);
  },

  isDownloading: (trackId: string) => {
    return get().downloadingTrackIds[trackId] !== undefined;
  },

  getDownloadProgress: (trackId: string) => {
    return get().downloadingTrackIds[trackId] || 0;
  },
}));

// Hydrate on startup and attach network listeners
if (typeof window !== 'undefined') {
  useOfflineStore.getState().refreshDownloads();

  window.addEventListener('online', () => {
    useOfflineStore.setState({ isOnline: true });
  });

  window.addEventListener('offline', () => {
    useOfflineStore.setState({ isOnline: false });
  });
}
