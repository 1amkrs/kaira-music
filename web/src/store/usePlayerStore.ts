import { create } from 'zustand';
import { AudioTrack } from '../audio/types';
import { WebAudioEngine, PlaybackEvent } from '../audio/WebAudioEngine';
import { lastFmApi } from '../services/lastFmApi';
import { useLibraryStore } from './useLibraryStore';

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isPlayingOffline: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;

  queue: AudioTrack[];
  queueIndex: number;
  originalQueue: AudioTrack[];
  shuffle: boolean;
  repeatMode: RepeatMode;

  // Modal visibility
  isFullPlayerOpen: boolean;
  isLyricsOpen: boolean;
  isEqOpen: boolean;
  isSignalPathOpen: boolean;
  fullPlayerView: 'cover' | 'lyrics' | 'queue';

  // Internal scrobble tracking
  hasScrobbledCurrentTrack: boolean;
  playStartTime: number;

  // Actions
  playTrack: (track: AudioTrack, customQueue?: AudioTrack[]) => Promise<void>;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: AudioTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  setFullPlayerOpen: (open: boolean) => void;
  setFullPlayerView: (view: 'cover' | 'lyrics' | 'queue') => void;
  setLyricsOpen: (open: boolean) => void;
  setEqOpen: (open: boolean) => void;
  setSignalPathOpen: (open: boolean) => void;
}

const engine = WebAudioEngine.getInstance();

export const usePlayerStore = create<PlayerState>((set, get) => {
  // Wire up audio engine event subscriptions
  engine.subscribe((event: PlaybackEvent) => {
    switch (event.type) {
      case 'timeupdate': {
        const time = event.currentTime;
        const dur = get().duration;
        set({ currentTime: time });

        // Scrobble trigger when played 50% or 4 minutes
        if (!get().hasScrobbledCurrentTrack && dur > 0 && get().currentTrack) {
          const track = get().currentTrack!;
          if (time >= dur * 0.5 || time >= 240) {
            set({ hasScrobbledCurrentTrack: true });
            lastFmApi.scrobble(track.title, track.artist, Math.floor(get().playStartTime / 1000), track.album);
          }
        }
        break;
      }
      case 'durationchange':
        set({ duration: event.duration });
        break;
      case 'progress':
        set({ buffered: event.buffered });
        break;
      case 'play':
        set({ isPlaying: true });
        break;
      case 'pause':
        set({ isPlaying: false });
        break;
      case 'ended':
        {
          const { repeatMode } = get();
          if (repeatMode === 'one') {
            engine.seek(0);
            engine.play().catch(() => {});
          } else {
            get().nextTrack();
          }
        }
        break;
    }
  });

  // Connect mediaSession next/previous callbacks
  engine.getMediaSession().setCallbacks({
    onPlay: () => {
      engine.play();
      set({ isPlaying: true });
    },
    onPause: () => {
      engine.pause();
      set({ isPlaying: false });
    },
    onPrevious: () => {
      get().prevTrack();
    },
    onNext: () => {
      get().nextTrack();
    },
    onSeekTo: (seconds) => {
      get().seek(seconds);
    },
    onSeekBackward: (sec) => {
      get().seek(Math.max(0, get().currentTime - sec));
    },
    onSeekForward: (sec) => {
      get().seek(Math.min(get().duration, get().currentTime + sec));
    },
  });

  // Direct binding for mediaSession next/previous handlers
  engine.setTrackNavigationHandlers(
    () => get().nextTrack(),
    () => get().prevTrack()
  );

  return {
    currentTrack: null,
    isPlaying: false,
    isPlayingOffline: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1.0,
    isMuted: false,

    queue: [],
    queueIndex: -1,
    originalQueue: [],
    shuffle: false,
    repeatMode: 'off',

    isFullPlayerOpen: false,
    isLyricsOpen: false,
    isEqOpen: false,
    isSignalPathOpen: false,
    fullPlayerView: 'cover',

    hasScrobbledCurrentTrack: false,
    playStartTime: 0,

    playTrack: async (track: AudioTrack, customQueue?: AudioTrack[]) => {
      let targetQueue = get().queue;
      let targetIndex = 0;

      if (customQueue && customQueue.length > 0) {
        targetQueue = customQueue;
        targetIndex = targetQueue.findIndex((t) => t.id === track.id);
        if (targetIndex === -1) {
          targetIndex = 0;
          targetQueue = [track, ...customQueue];
        }
      } else if (targetQueue.length === 0) {
        targetQueue = [track];
        targetIndex = 0;
      } else {
        targetIndex = targetQueue.findIndex((t) => t.id === track.id);
        if (targetIndex === -1) {
          targetQueue = [...targetQueue, track];
          targetIndex = targetQueue.length - 1;
        }
      }

      set({
        currentTrack: track,
        queue: targetQueue,
        originalQueue: targetQueue,
        queueIndex: targetIndex,
        hasScrobbledCurrentTrack: false,
        playStartTime: Date.now(),
      });

      // Track in recent history
      useLibraryStore.getState().addRecentTrack(track);

      // Last.fm now playing
      lastFmApi.updateNowPlaying(track.title, track.artist, track.album);

      try {
        await engine.loadAndPlay(track);
        set({ isPlayingOffline: engine.isPlayingOffline() });
      } catch (e) {
        console.error('Failed to play track', e);
      }
    },

    togglePlay: async () => {
      const { isPlaying, currentTrack, queue } = get();
      if (!currentTrack) {
        if (queue.length > 0) {
          await get().playTrack(queue[0]);
        }
        return;
      }

      if (isPlaying) {
        engine.pause();
      } else {
        await engine.play();
      }
    },

    nextTrack: async () => {
      const { queue, queueIndex, repeatMode } = get();
      if (queue.length === 0) return;

      let nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          engine.pause();
          set({ isPlaying: false });
          return;
        }
      }

      const nextTrack = queue[nextIndex];
      if (nextTrack) {
        set({ queueIndex: nextIndex });
        await get().playTrack(nextTrack);
      }
    },

    prevTrack: async () => {
      const { currentTime, queue, queueIndex } = get();
      // If played more than 3 seconds, seek to beginning first
      if (currentTime > 3) {
        get().seek(0);
        return;
      }

      let prevIndex = queueIndex - 1;
      if (prevIndex < 0) {
        prevIndex = queue.length - 1;
      }

      const prevTrack = queue[prevIndex];
      if (prevTrack) {
        set({ queueIndex: prevIndex });
        await get().playTrack(prevTrack);
      }
    },

    seek: (seconds: number) => {
      engine.seek(seconds);
      set({ currentTime: seconds });
    },

    setVolume: (volume: number) => {
      engine.setVolume(volume);
      set({ volume, isMuted: volume === 0 });
    },

    toggleMute: () => {
      const { isMuted, volume } = get();
      const nextMuted = !isMuted;
      engine.setMuted(nextMuted);
      set({ isMuted: nextMuted, volume: nextMuted ? 0 : volume || 0.8 });
    },

    toggleShuffle: () => {
      const { shuffle, queue, currentTrack, originalQueue } = get();
      const nextShuffle = !shuffle;

      if (nextShuffle) {
        // Shuffle queue keeping currentTrack first
        const remaining = queue.filter((t) => t.id !== currentTrack?.id);
        const shuffled = [...remaining].sort(() => Math.random() - 0.5);
        const newQueue = currentTrack ? [currentTrack, ...shuffled] : shuffled;
        set({ shuffle: true, queue: newQueue, queueIndex: 0 });
      } else {
        // Restore original order
        const newIndex = originalQueue.findIndex((t) => t.id === currentTrack?.id);
        set({ shuffle: false, queue: originalQueue, queueIndex: Math.max(0, newIndex) });
      }
    },

    cycleRepeat: () => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const current = get().repeatMode;
      const nextIdx = (modes.indexOf(current) + 1) % modes.length;
      set({ repeatMode: modes[nextIdx] });
    },

    addToQueue: (track: AudioTrack) => {
      set((state) => ({
        queue: [...state.queue, track],
        originalQueue: [...state.originalQueue, track],
      }));
    },

    removeFromQueue: (index: number) => {
      set((state) => {
        const newQueue = state.queue.filter((_, i) => i !== index);
        let newIndex = state.queueIndex;
        if (index < state.queueIndex) {
          newIndex--;
        } else if (index === state.queueIndex && newIndex >= newQueue.length) {
          newIndex = Math.max(0, newQueue.length - 1);
        }
        return { queue: newQueue, queueIndex: newIndex };
      });
    },

    clearQueue: () => {
      set({ queue: [], originalQueue: [], queueIndex: -1 });
    },

    setFullPlayerOpen: (open: boolean) => set({ isFullPlayerOpen: open }),
    setFullPlayerView: (view: 'cover' | 'lyrics' | 'queue') => set({ fullPlayerView: view }),
    setLyricsOpen: (open: boolean) => set({ isLyricsOpen: open }),
    setEqOpen: (open: boolean) => set({ isEqOpen: open }),
    setSignalPathOpen: (open: boolean) => set({ isSignalPathOpen: open }),
  };
});
