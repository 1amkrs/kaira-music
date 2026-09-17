import { AudioTrack, AudioQuality } from '../audio/types';

export interface DownloadedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  artworkUrl: string;
  duration: number;
  audioBlob: Blob;
  mimeType: string;
  sizeBytes: number;
  downloadedAt: number;
  lyrics?: any;
  streamUrl?: string;
  quality?: AudioQuality;
}

const DB_NAME = 'KairaOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'downloaded_tracks';

class OfflineStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported in this environment.'));
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        console.error('[OfflineStorage] Error opening IndexedDB:', error);
        reject(error || new Error('Failed to open IndexedDB'));
      };
    });

    return this.dbPromise;
  }

  public async saveDownloadedTrack(
    track: AudioTrack,
    audioBlob: Blob,
    lyrics?: any
  ): Promise<void> {
    const db = await this.getDB();
    const item: DownloadedTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album || '',
      artworkUrl: track.artworkUrl || '',
      duration: track.duration || 0,
      audioBlob,
      mimeType: audioBlob.type || 'audio/mp4',
      sizeBytes: audioBlob.size,
      downloadedAt: Date.now(),
      lyrics: lyrics || null,
      streamUrl: track.streamUrl || '',
      quality: track.quality,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error('Failed to save track to IndexedDB'));
    });
  }

  public async getDownloadedTrack(trackId: string): Promise<DownloadedTrack | null> {
    if (!trackId) return null;
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(trackId);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error('Failed to get track from IndexedDB'));
      });
    } catch (e) {
      console.warn(`[OfflineStorage] getDownloadedTrack error for ${trackId}:`, e);
      return null;
    }
  }

  public async getAllDownloadedTracks(): Promise<DownloadedTrack[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error || new Error('Failed to get all tracks'));
      });
    } catch (e) {
      console.warn('[OfflineStorage] getAllDownloadedTracks error:', e);
      return [];
    }
  }

  public async deleteDownloadedTrack(trackId: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(trackId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error('Failed to delete track'));
    });
  }

  public async clearAllDownloads(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error('Failed to clear downloads'));
    });
  }

  public async getOfflineStorageUsage(): Promise<{ trackCount: number; totalBytes: number }> {
    try {
      const tracks = await this.getAllDownloadedTracks();
      const totalBytes = tracks.reduce((sum, t) => sum + (t.sizeBytes || 0), 0);
      return {
        trackCount: tracks.length,
        totalBytes,
      };
    } catch {
      return { trackCount: 0, totalBytes: 0 };
    }
  }

  public async isTrackDownloaded(trackId: string): Promise<boolean> {
    const track = await this.getDownloadedTrack(trackId);
    return Boolean(track && track.audioBlob && track.audioBlob.size > 0);
  }
}

export const offlineStorage = new OfflineStorageService();
