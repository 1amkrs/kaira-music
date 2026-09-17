import { create } from 'zustand';
import { AudioTrack } from '../audio/types';
import { storage, Playlist } from '../services/storage';
import { lastFmApi } from '../services/lastFmApi';

export interface LibraryState {
  likedTracks: AudioTrack[];
  recentTracks: AudioTrack[];
  playlists: Playlist[];

  isLiked: (trackId: string) => boolean;
  toggleLike: (track: AudioTrack) => void;
  addRecentTrack: (track: AudioTrack) => void;
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: AudioTrack) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  importYtMusicPlaylists: (playlists: Playlist[]) => number;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  likedTracks: storage.getLikedTracks(),
  recentTracks: storage.getRecentTracks(),
  playlists: storage.getPlaylists(),

  isLiked: (trackId: string) => {
    return get().likedTracks.some((t) => t.id === trackId);
  },

  toggleLike: (track: AudioTrack) => {
    const isCurrentlyLiked = get().isLiked(track.id);
    let updated: AudioTrack[];
    if (isCurrentlyLiked) {
      updated = get().likedTracks.filter((t) => t.id !== track.id);
      lastFmApi.unloveTrack(track.title, track.artist).catch(() => {});
    } else {
      updated = [track, ...get().likedTracks];
      // Last.fm love
      lastFmApi.loveTrack(track.title, track.artist).catch(() => {});
    }

    storage.setLikedTracks(updated);
    set({ likedTracks: updated });
  },

  addRecentTrack: (track: AudioTrack) => {
    const prev = get().recentTracks.filter((t) => t.id !== track.id);
    const updated = [track, ...prev].slice(0, 50);
    storage.setRecentTracks(updated);
    set({ recentTracks: updated });
  },

  createPlaylist: (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name,
      description,
      createdAt: Date.now(),
      tracks: [],
    };
    const updated = [newPlaylist, ...get().playlists];
    storage.setPlaylists(updated);
    set({ playlists: updated });
    return newPlaylist;
  },

  deletePlaylist: (playlistId: string) => {
    const updated = get().playlists.filter((p) => p.id !== playlistId);
    storage.setPlaylists(updated);
    set({ playlists: updated });
  },

  addTrackToPlaylist: (playlistId: string, track: AudioTrack) => {
    const updated = get().playlists.map((p) => {
      if (p.id === playlistId) {
        if (p.tracks.some((t) => t.id === track.id)) return p;
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    });
    storage.setPlaylists(updated);
    set({ playlists: updated });
  },

  removeTrackFromPlaylist: (playlistId: string, trackId: string) => {
    const updated = get().playlists.map((p) => {
      if (p.id === playlistId) {
        return { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) };
      }
      return p;
    });
    storage.setPlaylists(updated);
    set({ playlists: updated });
  },

  importYtMusicPlaylists: (incoming: Playlist[]) => {
    let importedCount = 0;
    const current = [...get().playlists];
    for (const pl of incoming) {
      const existingIdx = current.findIndex(
        (p) => p.id === pl.id || p.name.toLowerCase() === pl.name.toLowerCase()
      );
      if (existingIdx === -1) {
        current.push(pl);
        importedCount++;
      } else {
        const existing = current[existingIdx];
        const newTracks = pl.tracks.filter((t) => !existing.tracks.some((et) => et.id === t.id));
        if (newTracks.length > 0) {
          current[existingIdx] = {
            ...existing,
            tracks: [...existing.tracks, ...newTracks],
          };
          importedCount++;
        }
      }
    }
    storage.setPlaylists(current);
    set({ playlists: current });
    return importedCount;
  },
}));
