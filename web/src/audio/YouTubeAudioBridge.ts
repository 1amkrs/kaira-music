import { PlaybackEvent } from './types';

// Ambient definitions for YouTube IFrame API
declare global {
  interface Window {
    YT?: {
      Player: any;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export class YouTubeAudioBridge {
  private static instance: YouTubeAudioBridge | null = null;

  private player: any = null;
  private isReady: boolean = false;
  private isApiLoaded: boolean = false;
  private readyPromise: Promise<void> | null = null;
  private currentVideoId: string | null = null;
  private _isPlaying: boolean = false;
  private pollIntervalId: any = null;
  private lastDuration: number = 0;
  private listeners: ((event: PlaybackEvent) => void)[] = [];
  private pendingPlayVideoId: { videoId: string; startSeconds?: number } | null = null;
  private fallbackVideoIds: string[] = [];

  private constructor() {}

  public static getInstance(): YouTubeAudioBridge {
    if (!YouTubeAudioBridge.instance) {
      YouTubeAudioBridge.instance = new YouTubeAudioBridge();
    }
    return YouTubeAudioBridge.instance;
  }

  /**
   * Ensure YouTube IFrame API script is dynamically loaded
   */
  private ensureApiLoaded(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    if (window.YT && window.YT.Player) {
      this.isApiLoaded = true;
      return Promise.resolve();
    }

    if (this.readyPromise) {
      return this.readyPromise;
    }

    this.readyPromise = new Promise<void>((resolve) => {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      const prevCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        this.isApiLoaded = true;
        resolve();
      };

      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }
    });

    return this.readyPromise;
  }

  /**
   * Initializes the underlying YT.Player in #lastwave-youtube-bridge container
   */
  private async initPlayer(initialVideoId: string, startSeconds: number = 0): Promise<void> {
    await this.ensureApiLoaded();

    return new Promise<void>((resolve) => {
      let container = document.getElementById('lastwave-youtube-bridge');
      if (!container) {
        container = document.createElement('div');
        container.id = 'lastwave-youtube-bridge';
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.right = '0';
        container.style.width = '200px';
        container.style.height = '200px';
        container.style.opacity = '0.001';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '-100';
        document.body.appendChild(container);
      }

      // Create an internal div for YT to replace
      const playerDiv = document.createElement('div');
      playerDiv.id = 'yt-player-internal';
      container.innerHTML = '';
      container.appendChild(playerDiv);

      this.player = new window.YT!.Player('yt-player-internal', {
        height: '200',
        width: '200',
        videoId: initialVideoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          start: Math.floor(startSeconds),
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            this.isReady = true;
            this.currentVideoId = initialVideoId;
            event.target.playVideo();
            resolve();
          },
          onStateChange: (event: any) => {
            this.handleStateChange(event.data);
          },
          onError: (event: any) => {
            const errCode = event.data;
            console.warn(
              `[YouTubeAudioBridge] Player encountered code ${errCode} on video "${this.currentVideoId}".`
            );

            // Check if alternate fallback video candidates are available (e.g., error 101/150 embed restricted, or blocked)
            if (this.fallbackVideoIds.length > 0) {
              const nextId = this.fallbackVideoIds.shift()!;
              console.warn(
                `[YouTubeAudioBridge] Automatically recovering with alternate video candidate: "${nextId}". (${this.fallbackVideoIds.length} remaining)`
              );
              this.loadAndPlay(nextId, this.fallbackVideoIds, this.getCurrentTime()).catch((err) => {
                console.error('[YouTubeAudioBridge] Failed to play fallback video candidate', err);
              });
              return;
            }

            const errMsg = `YouTube Player error code: ${errCode}`;
            console.error(errMsg);
            this.dispatch({ type: 'error', message: errMsg });
          },
        },
      });
    });
  }

  private handleStateChange(state: number) {
    if (!window.YT) return;

    switch (state) {
      case window.YT.PlayerState.PLAYING:
        this._isPlaying = true;
        this.dispatch({ type: 'play' });
        this.startPolling();
        break;

      case window.YT.PlayerState.PAUSED:
        this._isPlaying = false;
        this.dispatch({ type: 'pause' });
        this.stopPolling();
        break;

      case window.YT.PlayerState.ENDED:
        this._isPlaying = false;
        this.dispatch({ type: 'ended' });
        this.stopPolling();
        break;

      case window.YT.PlayerState.BUFFERING:
        this.dispatch({ type: 'waiting' });
        break;

      case window.YT.PlayerState.CUED:
        this.dispatch({ type: 'canplay' });
        break;
    }
  }

  private startPolling() {
    this.stopPolling();
    this.pollIntervalId = setInterval(() => {
      if (!this.player || !this.isReady) return;

      try {
        const currentTime = this.player.getCurrentTime?.() || 0;
        const duration = this.player.getDuration?.() || 0;

        this.dispatch({ type: 'timeupdate', currentTime });

        if (duration > 0 && Math.abs(duration - this.lastDuration) > 0.5) {
          this.lastDuration = duration;
          this.dispatch({ type: 'durationchange', duration });
        }
      } catch (err) {
        // Player might be re-buffering
      }
    }, 200);
  }

  private stopPolling() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  }

  public subscribe(listener: (event: PlaybackEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private dispatch(event: PlaybackEvent) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (e) {
        console.error('Error in YouTube audio bridge listener', e);
      }
    }
  }

  /**
   * Load and immediately play a YouTube video track in full length
   */
  public async loadAndPlay(
    videoId: string,
    fallbackIds: string[] = [],
    startSeconds: number = 0
  ): Promise<void> {
    this.fallbackVideoIds = fallbackIds ? fallbackIds.filter((id) => id && id !== videoId) : [];
    this.pendingPlayVideoId = { videoId, startSeconds };

    if (!this.player || !this.isReady) {
      await this.initPlayer(videoId, startSeconds);
      return;
    }

    try {
      this.currentVideoId = videoId;
      this.player.loadVideoById({
        videoId,
        startSeconds: startSeconds || 0,
      });
      this.player.playVideo();
    } catch (e) {
      console.warn('YouTube loadVideoById failed, reinitializing player', e);
      await this.initPlayer(videoId, startSeconds);
    }
  }

  public play(): void {
    if (this.player && this.isReady && typeof this.player.playVideo === 'function') {
      this.player.playVideo();
    }
  }

  public pause(): void {
    if (this.player && this.isReady && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo();
    }
    this._isPlaying = false;
    this.stopPolling();
  }

  public seek(seconds: number): void {
    if (this.player && this.isReady && typeof this.player.seekTo === 'function') {
      this.player.seekTo(Math.max(0, seconds), true);
    }
  }

  public setVolume(volume0to1: number): void {
    if (this.player && this.isReady && typeof this.player.setVolume === 'function') {
      const vol = Math.round(Math.max(0, Math.min(1, volume0to1)) * 100);
      this.player.setVolume(vol);
    }
  }

  public toggleMute(isMuted: boolean): void {
    if (this.player && this.isReady) {
      if (isMuted && typeof this.player.mute === 'function') {
        this.player.mute();
      } else if (!isMuted && typeof this.player.unMute === 'function') {
        this.player.unMute();
      }
    }
  }

  public getCurrentTime(): number {
    if (this.player && this.isReady && typeof this.player.getCurrentTime === 'function') {
      return this.player.getCurrentTime() || 0;
    }
    return 0;
  }

  public getDuration(): number {
    if (this.player && this.isReady && typeof this.player.getDuration === 'function') {
      return this.player.getDuration() || this.lastDuration || 0;
    }
    return this.lastDuration || 0;
  }

  public isPlaying(): boolean {
    return this._isPlaying;
  }
}
