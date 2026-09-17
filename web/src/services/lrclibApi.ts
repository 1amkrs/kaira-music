export interface LyricLine {
  id: number;
  timeMs: number;
  text: string;
}

export interface LrclibResponse {
  id?: number;
  name?: string;
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  instrumental?: boolean;
  plainLyrics?: string;
  syncedLyrics?: string;
}

export class LrclibApiClient {
  private baseUrl = 'https://lrclib.net/api';

  public parseLrc(lrcText: string): LyricLine[] {
    if (!lrcText) return [];

    const lines = lrcText.split('\n');
    const result: LyricLine[] = [];
    const timestampRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

    let index = 0;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      let match: RegExpExecArray | null;
      timestampRegex.lastIndex = 0;

      // Extract all timestamps in the line (some LRCs have multiple timestamps per line)
      const matches: { timeMs: number }[] = [];
      while ((match = timestampRegex.exec(line)) !== null) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const fraction = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10) : 0;
        const timeMs = minutes * 60 * 1000 + seconds * 1000 + fraction;
        matches.push({ timeMs });
      }

      const text = line.replace(/\[\d{2}:\d{2}(?:\.\d{2,3})?\]/g, '').trim();

      for (const m of matches) {
        result.push({
          id: index++,
          timeMs: m.timeMs,
          text: text,
        });
      }
    }

    return result.sort((a, b) => a.timeMs - b.timeMs);
  }

  public async getLyrics(
    trackName: string,
    artistName: string,
    albumName?: string,
    durationSeconds?: number
  ): Promise<{ synced: LyricLine[]; plain?: string; isInstrumental: boolean }> {
    try {
      const params = new URLSearchParams();
      params.set('track_name', trackName);
      params.set('artist_name', artistName);
      if (albumName) params.set('album_name', albumName);
      if (durationSeconds && durationSeconds > 0) {
        params.set('duration', Math.round(durationSeconds).toString());
      }

      const res = await fetch(`${this.baseUrl}/get?${params.toString()}`, {
        headers: {
          'User-Agent': 'Kaira-Music-Web/4.1.0 (https://github.com/duxtami/LastWave-native)',
        },
      });

      if (!res.ok) {
        // Fallback: search endpoint
        return await this.searchLyrics(trackName, artistName);
      }

      const data: LrclibResponse = await res.json();
      if (data.instrumental) {
        return { synced: [], isInstrumental: true };
      }

      if (data.syncedLyrics) {
        return {
          synced: this.parseLrc(data.syncedLyrics),
          plain: data.plainLyrics,
          isInstrumental: false,
        };
      }

      if (data.plainLyrics) {
        return {
          synced: [],
          plain: data.plainLyrics,
          isInstrumental: false,
        };
      }
    } catch (e) {
      console.warn('LRCLIB getLyrics network error', e);
    }

    return { synced: [], isInstrumental: false };
  }

  public async searchLyrics(
    trackName: string,
    artistName: string
  ): Promise<{ synced: LyricLine[]; plain?: string; isInstrumental: boolean }> {
    try {
      const params = new URLSearchParams({
        track_name: trackName,
        artist_name: artistName,
      });

      const res = await fetch(`${this.baseUrl}/search?${params.toString()}`);
      if (!res.ok) return { synced: [], isInstrumental: false };

      const items: LrclibResponse[] = await res.json();
      if (Array.isArray(items) && items.length > 0) {
        const item = items[0];
        if (item.instrumental) return { synced: [], isInstrumental: true };
        if (item.syncedLyrics) {
          return {
            synced: this.parseLrc(item.syncedLyrics),
            plain: item.plainLyrics,
            isInstrumental: false,
          };
        }
      }
    } catch (e) {
      console.warn('LRCLIB searchLyrics error', e);
    }
    return { synced: [], isInstrumental: false };
  }
}

export const lrclibApi = new LrclibApiClient();
