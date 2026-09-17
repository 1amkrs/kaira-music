import { AudioTrack } from './types';

export interface MediaSessionCallbacks {
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeekTo: (timeSeconds: number) => void;
  onSeekBackward?: (amountSeconds: number) => void;
  onSeekForward?: (amountSeconds: number) => void;
  onStop?: () => void;
}

export class MediaSessionController {
  private callbacks: MediaSessionCallbacks | null = null;

  constructor() {
    this.setupActionHandlers();
  }

  public setCallbacks(callbacks: MediaSessionCallbacks) {
    this.callbacks = callbacks;
  }

  private setupActionHandlers() {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    try {
      navigator.mediaSession.setActionHandler('play', () => {
        this.callbacks?.onPlay();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        this.callbacks?.onPause();
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.callbacks?.onPrevious();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.callbacks?.onNext();
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          this.callbacks?.onSeekTo(details.seekTime);
        }
      });

      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const offset = details.seekOffset || 10;
        this.callbacks?.onSeekBackward ? this.callbacks.onSeekBackward(offset) : undefined;
      });

      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const offset = details.seekOffset || 10;
        this.callbacks?.onSeekForward ? this.callbacks.onSeekForward(offset) : undefined;
      });

      navigator.mediaSession.setActionHandler('stop', () => {
        this.callbacks?.onStop ? this.callbacks.onStop() : this.callbacks?.onPause();
      });
    } catch (e) {
      console.warn('Failed to bind MediaSession action handler', e);
    }
  }

  public updateTrack(track: AudioTrack | null) {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    if (!track) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      return;
    }

    const artworkUrl = track.artworkUrl || '/icons/icon-512.png';
    const artworkList: MediaImage[] = [
      { src: artworkUrl, sizes: '96x96', type: 'image/png' },
      { src: artworkUrl, sizes: '128x128', type: 'image/png' },
      { src: artworkUrl, sizes: '192x192', type: 'image/png' },
      { src: artworkUrl, sizes: '256x256', type: 'image/png' },
      { src: artworkUrl, sizes: '384x384', type: 'image/png' },
      { src: artworkUrl, sizes: '512x512', type: 'image/png' },
    ];

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'Kaira Music Hi-Res',
        artwork: artworkList,
      });
    } catch (e) {
      console.warn('Error setting MediaMetadata', e);
    }
  }

  public updatePlaybackState(isPlaying: boolean) {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }
    try {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch (e) {
      // Ignore
    }
  }

  public updatePositionState(duration: number, position: number, playbackRate: number = 1.0) {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    if ('setPositionState' in navigator.mediaSession && duration > 0 && !isNaN(duration) && !isNaN(position)) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, duration),
          playbackRate: Math.max(0, playbackRate),
          position: Math.min(Math.max(0, position), duration),
        });
      } catch (e) {
        // Ignore potential timing race conditions
      }
    }
  }
}
