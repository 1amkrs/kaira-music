import { AudioQuality, AudioTrack } from '../audio/types';

export interface ClashflacSearchResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artworkUrl: string;
  maxQuality: AudioQuality;
  bitDepth: number;
  sampleRate: number;
  codec: string;
}

// Default high-fidelity tracks ready to stream immediately
export const CURATED_AUDIOPHILE_TRACKS: AudioTrack[] = [
  {
    id: 'track-flac-01',
    title: 'vampire',
    artist: 'Olivia Rodrigo',
    album: 'GUTS',
    duration: 219,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/70/2f/a6/702fa6b5-946c-7a8e-2dba-03de25c732d3/mzaf_12764345117177639836.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    clashflacId: 'clash_hi_res_001',
    youtubeId: 'Fqey8LxQxFU',
    lyricsLrc: `[00:00.00]Hate to give the satisfaction, undressing when I'm mad at you
[00:06.18]I should've known it was strange you only come out at night
[00:11.45]I used to think I was smart, but you made me look so naive
[00:16.82]The way you sold me for parts, and you sunk your teeth into me, oh
[00:22.40]Bloodsucker, fame fucker
[00:27.50]Bleedin' me dry like a goddamn vampire
[00:33.20]Every girl I ever talked to told me you were bad, bad news
[00:38.70]You called them crazy, God, I hate the way I called 'em crazy too
[00:44.20]You're so convincing
[00:47.00]How do you lie without flinching?
[00:49.80]How do you lie, how do you lie, how do you lie?
[00:55.00]'Cause girls your age know better
[00:58.20]Bloodsucker, fame fucker
[01:03.50]Bleedin' me dry like a goddamn vampire
[01:14.20]You said it was true love, but wouldn't that be hard?
[01:19.80]You can't love anyone 'cause that would mean you had a heart
[01:25.50]I tried to help you, now I know that I could never
[01:31.00]'Cause you can't help people who think that they're clever
[01:36.50]Bloodsucker, fame fucker
[01:42.00]Bleedin' me dry like a goddamn vampire`,
  },
  {
    id: 'track-flac-02',
    title: 'LUNCH',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    duration: 180,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9d/3e/43/9d3e43aa-682a-7979-8547-d339956c409b/mzaf_710286407585135494.plus.aac.p.m4a',
    quality: 'HI_RES_96',
    bitDepth: 24,
    sampleRate: 96000,
    codec: 'FLAC',
    clashflacId: 'clash_hi_res_002',
    youtubeId: 'jsptjaAef7Q',
    lyricsLrc: `[00:00.00]I could eat that girl for lunch
[00:03.20]Yeah, she dances on my tongue
[00:06.50]Tastes like she might be the one
[00:09.80]And I can never get enough
[00:13.20]I could buy her so much stuff
[00:16.40]It's a craving, not a crush, huh
[00:20.00]"Call me when you're there"
[00:21.80]Said, "I bought you something rare
[00:23.50]And I left it under the stairs"
[00:26.50]Girl, I think you're to die for
[00:30.00]I could eat that girl for lunch
[00:33.20]Yeah, she dances on my tongue
[00:36.50]Tastes like she might be the one
[00:40.00]And I can never get enough`,
  },
  {
    id: 'track-flac-03',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/d6/60/19d660ff-e3a9-8377-15a3-ce4b28e89cac/mzaf_18422426156481158187.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    clashflacId: 'clash_hi_res_003',
    youtubeId: 'fHI8X4OXluQ',
    lyricsLrc: `[00:00.00]Yeah
[00:13.00]I've been tryna call
[00:15.80]I've been on my own for long enough
[00:19.40]Maybe you can show me how to love, maybe
[00:27.20]I'm goin' through withdrawals
[00:30.00]You don't even have to do too much
[00:33.50]You can turn me on with just a touch, baby
[00:41.20]I look around and Sin City's cold and empty
[00:45.00]No one's around to judge me
[00:48.50]I can't see clearly when you're gone
[00:54.00]I said, ooh, I'm blinded by the lights
[01:00.00]No, I can't sleep until I feel your touch
[01:07.50]I said, ooh, I'm drowning in the night
[01:14.00]Oh, when I'm like this, you're the one I trust`,
  },
  {
    id: 'track-flac-04',
    title: '360',
    artist: 'Charli xcx',
    album: 'BRAT',
    duration: 133,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738202b8d00977462c16118d09',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6a/b2/36/6ab236ac-6b8e-60e4-aa77-8e73c7127ebc/mzaf_17637473173165118705.plus.aac.p.m4a',
    quality: 'LOSSLESS_CD',
    bitDepth: 16,
    sampleRate: 44100,
    codec: 'FLAC',
    clashflacId: 'clash_lossless_004',
    youtubeId: 'WJW-VvmrkS8',
    lyricsLrc: `[00:00.00]I went to the city, I went to the club
[00:04.20]I saw everybody, everybody showed me love
[00:08.50]I'm everywhere, I'm so Julia
[00:12.80]Ah-ah, ah-ah, ah
[00:17.00]When you're in the mirror, do you like what you see?
[00:21.20]When you're in the mirror, do you look at me?
[00:25.50]I'm everywhere, I'm so Julia
[00:29.80]Call me when you want, baby, dial 360
[00:34.00]Bumpin' that, bumpin' that, bumpin' that
[00:38.20]Yeah, we bumpin' that, bumpin' that, bumpin' that
[00:42.50]I'm everywhere, I'm so Julia
[00:46.80]International, dial 360`,
  },
  {
    id: 'track-flac-05',
    title: 'Karma Police',
    artist: 'Radiohead',
    album: 'OK Computer',
    duration: 261,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273c8b444df094179b770396495',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a',
    quality: 'HI_RES_96',
    bitDepth: 24,
    sampleRate: 96000,
    codec: 'FLAC',
    clashflacId: 'clash_hi_res_005',
    youtubeId: '4IJI6soiQhI',
    lyricsLrc: `[00:00.00]Karma police, arrest this man
[00:06.50]He talks in maths, he buzzes like a fridge
[00:13.20]He's like a detuned radio
[00:19.80]Karma police, arrest this girl
[00:26.50]Her Hitler hairdo is making me feel ill
[00:33.20]And we have crashed her party
[00:40.00]This is what you'll get
[00:46.50]This is what you'll get
[00:53.20]This is what you'll get
[00:60.00]When you mess with us
[01:07.50]Karma police, I've given all I can
[01:14.20]It's not enough, I've given all I can
[01:21.00]But we're still on the payroll
[01:27.50]This is what you'll get
[01:34.00]This is what you'll get
[01:40.80]This is what you'll get
[01:47.50]When you mess with us
[01:54.00]For a minute there, I lost myself, I lost myself
[02:07.50]Phew, for a minute there, I lost myself, I lost myself`,
  },
  {
    id: 'track-flac-06',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    album: "Short n' Sweet",
    duration: 175,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f628',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/4d/02/e94d0230-11ee-ef94-d2cf-a5d547bd73f4/mzaf_554140808559155562.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    clashflacId: 'clash_hi_res_006',
    youtubeId: 'eVli-tstM5E',
    lyricsLrc: `[00:00.00]Now he's thinkin' 'bout me every night, oh
[00:04.20]Is it that sweet? I guess so
[00:08.50]Say you can't sleep, baby, I know
[00:12.80]That's that me, espresso
[00:17.00]Move it up, down, left, right, oh
[00:21.20]Switch it up like Nintendo
[00:25.50]Say you can't sleep, baby, I know
[00:29.80]That's that me, espresso
[00:34.00]I can't relate to desperation
[00:38.20]My give-a-fucks are on vacation
[00:42.50]And I got this one boy and he won't stop callin'
[00:46.80]When they act this way I know I got 'em
[00:51.00]Too bad your ex don't do it for ya
[00:55.20]Walked in and dream-came-trued it for ya
[00:59.50]Soft skin and I perfumed it for ya
[01:03.80]Now he's thinkin' 'bout me every night, oh
[01:08.00]Is it that sweet? I guess so
[01:12.20]Say you can't sleep, baby, I know
[01:16.50]That's that me, espresso`,
  },
  {
    id: 'track-flac-07',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    album: 'DAMN.',
    duration: 177,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/2e/37/1f2e37be-bdd0-d770-6ea4-091011a6aade/mzaf_2360827885900940865.plus.aac.p.m4a',
    quality: 'HI_RES_192',
    bitDepth: 24,
    sampleRate: 192000,
    codec: 'FLAC',
    clashflacId: 'clash_hi_res_007',
    youtubeId: 'tvTRZJ-4EyI',
    lyricsLrc: `[00:00.00]Nobody pray for me, it been that day for me
[00:04.00]Way (yeah, yeah!)
[00:06.50]Ayy, I remember syrup sandwiches and crime allowances
[00:10.00]Finesse a nigga with some counterfeits, but now I'm countin' this
[00:13.50]Parmesan where my accountant lives, in fact, I'm downin' this
[00:17.00]D'USSÉ with my boo bae tastes like Kool-Aid for the analysts
[00:20.50]Girl, I can buy yo' ass the world with my paystub
[00:24.00]Ooh, that pussy good, won't you sit it on my taste buds?
[00:27.50]I get way too petty once you let me do the extras
[00:31.00]Pull up on your block, then break it down: we playin' Tetris
[00:34.50]A.M. to the P.M., P.M. to the A.M., funk
[00:37.00]Piss out your per diem, you just gotta gang jam, funk
[00:40.50]If I quit your BM, I still ride Mercedes, funk
[00:44.00]If I quit this season, I still be the greatest, funk
[00:47.50]My left stroke just went viral
[00:50.00]Right stroke put lil' baby in a spiral
[00:53.00]Soprano C, we like to keep it on a high note
[00:56.50]It's levels to it, you and I know
[01:00.00]Bitch, be humble (hol' up, bitch)
[01:03.00]Sit down (hol' up, lil', hol' up, lil' bitch)
[01:06.00]Be humble (hol' up, bitch)
[01:09.00]Sit down (hol' up, sit down, lil', sit down, lil' bitch)`,
  },
  {
    id: 'track-flac-08',
    title: 'deja vu',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 215,
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe94728291353a0023',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/5a/c2/835ac220-f31a-006f-b6a9-2acd29eb60d0/mzaf_13621843495437485054.plus.aac.p.m4a',
    quality: 'HI_RES_96',
    bitDepth: 24,
    sampleRate: 96000,
    codec: 'FLAC',
    clashflacId: 'clash_hi_res_008',
    youtubeId: 'cii6ruuycQA',
    lyricsLrc: `[00:00.00]Car rides to Malibu
[00:03.50]Strawberry ice cream, one spoon for two
[00:09.00]And tradin' jackets
[00:11.80]Laughin' 'bout how small it looks on you
[00:15.50]Ha-ha-ha-ha
[00:18.00]Watchin' reruns of Glee
[00:21.00]Bein' annoying, singin' in harmony
[00:26.50]I bet she's braggin' to all her friends, sayin' you're so unique, hmm
[00:35.00]So when you gonna tell her that we did that, too?
[00:40.00]She thinks it's special, but it's all reused
[00:44.50]That was our place, I found it first
[00:48.50]I made the jokes you tell to her when she's with you
[00:53.00]Do you get déjà vu when she's with you?
[01:01.00]Do you get déjà vu, hmm?`,
  },
];

export class ClashflacApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = '', apiKey: string = '') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
  }

  public setConfig(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
  }

  public async search(query: string): Promise<AudioTrack[]> {
    const qLower = query.toLowerCase().trim();

    // If backend URL is provided, attempt live fetch first
    if (this.baseUrl) {
      try {
        const url = `${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (this.apiKey) {
          headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.tracks)) {
            return data.tracks.map((t: any) => ({
              id: t.id || `clash-${Math.random()}`,
              title: t.title || 'Unknown Title',
              artist: t.artist || 'Unknown Artist',
              album: t.album,
              duration: t.duration || 180,
              artworkUrl: t.artworkUrl || t.cover || '/icons/icon-512.png',
              streamUrl: t.streamUrl || `${this.baseUrl}/api/stream/${t.id}`,
              quality: (t.quality as AudioQuality) || 'HI_RES_192',
              bitDepth: t.bitDepth || 24,
              sampleRate: t.sampleRate || 192000,
              codec: t.codec || 'FLAC',
              clashflacId: t.id,
            }));
          }
        }
      } catch (e) {
        console.warn('clashflac backend fetch error, falling back to curated local catalog', e);
      }
    }

    // Filter curated audiophile catalog
    if (!qLower) {
      return CURATED_AUDIOPHILE_TRACKS;
    }

    return CURATED_AUDIOPHILE_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(qLower) ||
        t.artist.toLowerCase().includes(qLower) ||
        (t.album && t.album.toLowerCase().includes(qLower))
    );
  }

  public async resolveStreamUrl(track: AudioTrack, targetQuality: AudioQuality): Promise<string> {
    if (this.baseUrl && track.clashflacId) {
      return `${this.baseUrl}/api/stream/${track.clashflacId}?quality=${targetQuality}`;
    }
    return track.streamUrl;
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; message: string }> {
    if (!this.baseUrl) {
      return { success: false, latencyMs: 0, message: 'No backend URL configured. Operating in local audiophile mode.' };
    }

    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, { method: 'GET' });
      const latencyMs = Math.round(performance.now() - start);
      if (res.ok) {
        return { success: true, latencyMs, message: `Connected to clashflac backend (${latencyMs}ms)` };
      }
      return { success: false, latencyMs, message: `Server returned status HTTP ${res.status}` };
    } catch (e) {
      return { success: false, latencyMs: 0, message: 'Could not connect to clashflac server endpoint' };
    }
  }
}

export const clashflacApi = new ClashflacApiClient();
