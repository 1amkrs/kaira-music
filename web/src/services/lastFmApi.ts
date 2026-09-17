// Lightweight, pure TypeScript MD5 implementation for Last.fm API signatures
function md5Cycle(x: number[], k: number[]): void {
  let a = x[0], b = x[1], c = x[2], d = x[3];

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = (((a + q) | 0) + ((x + t) | 0)) | 0;
    return (((a << s) | (a >>> (32 - s))) + b) | 0;
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = (a + x[0]) | 0;
  x[1] = (b + x[1]) | 0;
  x[2] = (c + x[2]) | 0;
  x[3] = (d + x[3]) | 0;
}

export function md5(s: string): string {
  const n = s.length;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  let i: number;
  for (i = 64; i <= s.length; i += 64) {
    const tail: number[] = [];
    for (let j = 0; j < 16; j++) {
      const idx = i - 64 + j * 4;
      tail[j] =
        s.charCodeAt(idx) +
        (s.charCodeAt(idx + 1) << 8) +
        (s.charCodeAt(idx + 2) << 16) +
        (s.charCodeAt(idx + 3) << 24);
    }
    md5Cycle(state, tail);
  }
  s = s.substring(i - 64);
  const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < s.length; i++) {
    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5Cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5Cycle(state, tail);

  return state
    .map((num) => {
      let hex = '';
      for (let j = 0; j < 4; j++) {
        const byte = (num >> (j * 8)) & 0xff;
        hex += ('0' + byte.toString(16)).slice(-2);
      }
      return hex;
    })
    .join('');
}

export const DEFAULT_LASTFM_API_KEY = 'a84d4ecb9543e346f059cb2cf10bc035';
export const DEFAULT_LASTFM_SHARED_SECRET = '8bb51fb016e3c91e459a7ffc3a502efc';

export interface LastFmCredentials {
  apiKey: string;
  sharedSecret: string;
  sessionKey: string;
  username: string;
}

export interface LastFmUserProfile {
  name: string;
  realname?: string;
  playcount: number;
  image?: string;
  url?: string;
}

export interface LastFmScrobbleTrack {
  title: string;
  artist: string;
  album: string;
  artwork: string;
  dateUTS: number;
  isNowPlaying: boolean;
}

export class LastFmApiClient {
  private rootUrl = 'https://ws.audioscrobbler.com/2.0/';
  private creds: LastFmCredentials = {
    apiKey: DEFAULT_LASTFM_API_KEY,
    sharedSecret: DEFAULT_LASTFM_SHARED_SECRET,
    sessionKey: '',
    username: '',
  };

  constructor() {
    this.hydrateFromStorage();
  }

  public hydrateFromStorage() {
    try {
      const raw = localStorage.getItem('lastwave_settings_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lastFmApiKey) this.creds.apiKey = parsed.lastFmApiKey;
        if (parsed.lastFmSecret) this.creds.sharedSecret = parsed.lastFmSecret;
        if (parsed.lastFmSessionKey) this.creds.sessionKey = parsed.lastFmSessionKey;
        if (parsed.lastFmUsername) this.creds.username = parsed.lastFmUsername;
      }
    } catch {
      // Ignore fallback
    }
  }

  public setCredentials(creds: Partial<LastFmCredentials>) {
    this.creds = {
      ...this.creds,
      ...creds,
      apiKey: creds.apiKey || this.creds.apiKey || DEFAULT_LASTFM_API_KEY,
      sharedSecret: creds.sharedSecret || this.creds.sharedSecret || DEFAULT_LASTFM_SHARED_SECRET,
    };
  }

  public getCredentials(): LastFmCredentials {
    return { ...this.creds };
  }

  public isConfigured(): boolean {
    return Boolean(this.creds.sessionKey && (this.creds.apiKey || DEFAULT_LASTFM_API_KEY));
  }

  public getEffectiveApiKey(): string {
    return this.creds.apiKey || DEFAULT_LASTFM_API_KEY;
  }

  public getEffectiveSecret(): string {
    return this.creds.sharedSecret || DEFAULT_LASTFM_SHARED_SECRET;
  }

  public getAuthUrl(callbackUrl?: string): string {
    const cb = callbackUrl || window.location.origin + window.location.pathname;
    return `https://www.last.fm/api/auth/?api_key=${this.getEffectiveApiKey()}&cb=${encodeURIComponent(cb)}`;
  }

  public generateSignature(params: Record<string, string>): string {
    const keys = Object.keys(params)
      .filter((k) => k !== 'format' && k !== 'api_sig')
      .sort();
    let signatureRaw = '';
    for (const k of keys) {
      signatureRaw += k + params[k];
    }
    signatureRaw += this.getEffectiveSecret();
    return md5(signatureRaw);
  }

  /**
   * Complete Last.fm Web Authentication via callback ?token=...
   */
  public async completeWebAuth(token: string): Promise<{ username: string; sessionKey: string }> {
    const params: Record<string, string> = {
      method: 'auth.getSession',
      api_key: this.getEffectiveApiKey(),
      token,
    };
    params.api_sig = this.generateSignature(params);
    params.format = 'json';

    const formData = new URLSearchParams(params);
    const res = await fetch(this.rootUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to exchange token for session key');
    }

    const data = await res.json();
    if (!data.session?.key || !data.session?.name) {
      throw new Error('Invalid session response from Last.fm');
    }

    const sessionKey = data.session.key;
    const username = data.session.name;
    this.setCredentials({ sessionKey, username });

    return { username, sessionKey };
  }

  /**
   * Obtain session key via mobile authentication (username & password)
   */
  public async obtainMobileSession(
    username: string,
    password: string
  ): Promise<{ username: string; sessionKey: string }> {
    const params: Record<string, string> = {
      method: 'auth.getMobileSession',
      api_key: this.getEffectiveApiKey(),
      username,
      password,
    };
    params.api_sig = this.generateSignature(params);
    params.format = 'json';

    const formData = new URLSearchParams(params);
    const res = await fetch(this.rootUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid username or password');
    }

    const data = await res.json();
    if (!data.session?.key) {
      throw new Error('Could not retrieve session key');
    }

    const sessionKey = data.session.key;
    const resolvedUsername = data.session.name || username;
    this.setCredentials({ sessionKey, username: resolvedUsername });

    return { username: resolvedUsername, sessionKey };
  }

  /**
   * Fetch user profile info (playcount, avatar, etc.)
   */
  public async getUserInfo(username?: string): Promise<LastFmUserProfile | null> {
    const userToQuery = username || this.creds.username;
    if (!userToQuery) return null;

    try {
      const params: Record<string, string> = {
        method: 'user.getinfo',
        user: userToQuery,
        api_key: this.getEffectiveApiKey(),
        format: 'json',
      };

      const url = new URL(this.rootUrl);
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

      const res = await fetch(url.toString());
      if (!res.ok) return null;

      const data = await res.json();
      const u = data.user;
      if (!u) return null;

      // Extract largest avatar image
      let avatar = '';
      if (Array.isArray(u.image) && u.image.length > 0) {
        const large = u.image.find((img: any) => img.size === 'extralarge' || img.size === 'large');
        avatar = large ? large['#text'] : u.image[u.image.length - 1]['#text'];
      }

      return {
        name: u.name,
        realname: u.realname,
        playcount: parseInt(u.playcount || '0', 10),
        image: avatar,
        url: u.url,
      };
    } catch (e) {
      console.warn('Failed to fetch Last.fm user info', e);
      return null;
    }
  }

  /**
   * Fetch live recent scrobbles
   */
  public async getRecentTracks(
    username?: string,
    limit = 20
  ): Promise<LastFmScrobbleTrack[]> {
    const userToQuery = username || this.creds.username;
    if (!userToQuery) return [];

    try {
      const params: Record<string, string> = {
        method: 'user.getrecenttracks',
        user: userToQuery,
        api_key: this.getEffectiveApiKey(),
        limit: limit.toString(),
        format: 'json',
      };

      const url = new URL(this.rootUrl);
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

      const res = await fetch(url.toString());
      if (!res.ok) return [];

      const data = await res.json();
      const rawTracks = data.recenttracks?.track;
      if (!rawTracks) return [];

      const trackList = Array.isArray(rawTracks) ? rawTracks : [rawTracks];

      return trackList.map((t: any) => {
        let artwork = '';
        if (Array.isArray(t.image) && t.image.length > 0) {
          const img = t.image.find((i: any) => i.size === 'medium' || i.size === 'large');
          artwork = img ? img['#text'] : t.image[t.image.length - 1]['#text'];
        }

        const isNowPlaying = Boolean(t['@attr']?.nowplaying === 'true');
        const dateUTS = t.date?.uts ? parseInt(t.date.uts, 10) : Math.floor(Date.now() / 1000);

        return {
          title: t.name || 'Unknown Track',
          artist: typeof t.artist === 'string' ? t.artist : t.artist?.['#text'] || 'Unknown Artist',
          album: t.album?.['#text'] || '',
          artwork: artwork || 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
          dateUTS,
          isNowPlaying,
        };
      });
    } catch (e) {
      console.warn('Failed to fetch Last.fm recent tracks', e);
      return [];
    }
  }

  /**
   * Update Now Playing status on Last.fm
   */
  public async updateNowPlaying(track: string, artist: string, album?: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const params: Record<string, string> = {
        method: 'track.updateNowPlaying',
        api_key: this.getEffectiveApiKey(),
        sk: this.creds.sessionKey,
        track,
        artist,
      };
      if (album) params.album = album;

      params.api_sig = this.generateSignature(params);
      params.format = 'json';

      const formData = new URLSearchParams(params);
      const res = await fetch(this.rootUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      return res.ok;
    } catch (e) {
      console.warn('Last.fm updateNowPlaying error', e);
      return false;
    }
  }

  /**
   * Submit a scrobble to Last.fm
   */
  public async scrobble(
    track: string,
    artist: string,
    timestampSeconds: number,
    album?: string
  ): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const params: Record<string, string> = {
        method: 'track.scrobble',
        api_key: this.getEffectiveApiKey(),
        sk: this.creds.sessionKey,
        track,
        artist,
        timestamp: timestampSeconds.toString(),
      };
      if (album) params.album = album;

      params.api_sig = this.generateSignature(params);
      params.format = 'json';

      const formData = new URLSearchParams(params);
      const res = await fetch(this.rootUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      return res.ok;
    } catch (e) {
      console.warn('Last.fm scrobble error', e);
      return false;
    }
  }

  /**
   * Love a track on Last.fm
   */
  public async loveTrack(track: string, artist: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const params: Record<string, string> = {
        method: 'track.love',
        api_key: this.getEffectiveApiKey(),
        sk: this.creds.sessionKey,
        track,
        artist,
      };
      params.api_sig = this.generateSignature(params);
      params.format = 'json';

      const formData = new URLSearchParams(params);
      const res = await fetch(this.rootUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      return res.ok;
    } catch (e) {
      console.warn('Last.fm loveTrack error', e);
      return false;
    }
  }

  /**
   * Unlove a track on Last.fm
   */
  public async unloveTrack(track: string, artist: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const params: Record<string, string> = {
        method: 'track.unlove',
        api_key: this.getEffectiveApiKey(),
        sk: this.creds.sessionKey,
        track,
        artist,
      };
      params.api_sig = this.generateSignature(params);
      params.format = 'json';

      const formData = new URLSearchParams(params);
      const res = await fetch(this.rootUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      return res.ok;
    } catch (e) {
      console.warn('Last.fm unloveTrack error', e);
      return false;
    }
  }
}

export const lastFmApi = new LastFmApiClient();
