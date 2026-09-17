import { useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * Global desktop keyboard shortcuts for LastWave Web
 *
 * Space: Play / Pause
 * ArrowLeft / ArrowRight: Seek -5s / +5s
 * ArrowUp / ArrowDown: Volume +/- 5%
 * n / N: Next Track
 * p / P: Previous Track
 * m / M: Toggle Mute
 * f / F: Toggle Full Player modal
 * Escape: Close any open modal (Full Player, Signal Path, EQ)
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts when typing in inputs or text areas
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      const store = usePlayerStore.getState();

      switch (e.key) {
        case ' ': {
          e.preventDefault();
          store.togglePlay();
          break;
        }

        case 'ArrowLeft': {
          e.preventDefault();
          const newTime = Math.max(0, store.currentTime - 5);
          store.seek(newTime);
          break;
        }

        case 'ArrowRight': {
          e.preventDefault();
          const maxDuration = store.duration || 300;
          const newTime = Math.min(maxDuration, store.currentTime + 5);
          store.seek(newTime);
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          const newVol = Math.min(1, Math.round((store.volume + 0.05) * 100) / 100);
          store.setVolume(newVol);
          break;
        }

        case 'ArrowDown': {
          e.preventDefault();
          const newVol = Math.max(0, Math.round((store.volume - 0.05) * 100) / 100);
          store.setVolume(newVol);
          break;
        }

        case 'n':
        case 'N': {
          e.preventDefault();
          store.nextTrack();
          break;
        }

        case 'p':
        case 'P': {
          e.preventDefault();
          store.prevTrack();
          break;
        }

        case 'm':
        case 'M': {
          e.preventDefault();
          store.toggleMute();
          break;
        }

        case 'f':
        case 'F': {
          e.preventDefault();
          const willOpen = !store.isFullPlayerOpen;
          store.setFullPlayerOpen(willOpen);
          if (willOpen) {
            store.setFullPlayerView('cover');
          }
          break;
        }

        case 'q':
        case 'Q': {
          e.preventDefault();
          if (store.isFullPlayerOpen && store.fullPlayerView === 'queue') {
            store.setFullPlayerOpen(false);
          } else {
            store.setFullPlayerOpen(true);
            store.setFullPlayerView('queue');
          }
          break;
        }

        case 'Escape': {
          if (store.isFullPlayerOpen || store.isSignalPathOpen || store.isEqOpen) {
            e.preventDefault();
            store.setFullPlayerOpen(false);
            store.setSignalPathOpen(false);
            store.setEqOpen(false);
          }
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

export default useKeyboardShortcuts;
