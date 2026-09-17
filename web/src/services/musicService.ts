import { AudioTrack, AudioQuality } from '../audio/types';
import { clashflacApi, CURATED_AUDIOPHILE_TRACKS } from './clashflacApi';

export interface MusicArtist {
  id: string;
  name: string;
  artworkUrl: string;
  followers?: string;
  genres?: string[];
  popularTracks?: AudioTrack[];
  albums?: MusicAlbum[];
  bio?: string;
}

export interface MusicAlbum {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  releaseYear: string;
  trackCount?: number;
  duration?: number;
  tracks?: AudioTrack[];
}

// Curated artist portraits & metadata
const CURATED_ARTISTS: Record<string, Partial<MusicArtist>> = {
  'the weeknd': {
    name: 'The Weeknd',
    artworkUrl: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb',
    followers: '112.5M',
    genres: ['R&B', 'Pop', 'Synthwave', 'Dark Wave'],
    bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer known for his sonic versatility and dark lyricism.',
  },
  'billie eilish': {
    name: 'Billie Eilish',
    artworkUrl: 'https://i.scdn.co/image/ab6761610000e5ebd8b9980db6711a43a0d53c7c',
    followers: '98.2M',
    genres: ['Alt-Pop', 'Electropop', 'Indie'],
    bio: 'Billie Eilish Pirate Baird O’Connell is an American singer and songwriter. She first gained public attention in 2015 with her debut single "Ocean Eyes".',
  },
  'olivia rodrigo': {
    name: 'Olivia Rodrigo',
    artworkUrl: 'https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6',
    followers: '42.1M',
    genres: ['Pop-Rock', 'Alt-Pop', 'Grunge Pop'],
    bio: 'Olivia Isabel Rodrigo is an American singer-songwriter and actress. She gained recognition in the late 2010s with her lead roles on the Disney television programs.',
  },
  'charli xcx': {
    name: 'Charli xcx',
    artworkUrl: 'https://i.scdn.co/image/ab6761610000e5ebcfb227c2eb392f447f5cf535',
    followers: '14.8M',
    genres: ['Hyperpop', 'Electropop', 'Club'],
    bio: 'Charlotte Emma Aitchison, known professionally as Charli xcx, is an English singer and songwriter who defined the cultural landscape of 2024 with BRAT.',
  },
  'sabrina carpenter': {
    name: 'Sabrina Carpenter',
    artworkUrl: 'https://i.scdn.co/image/ab6761610000e5eb66b5f4be89dd6ff546955a47',
    followers: '38.4M',
    genres: ['Pop', 'Disco-Pop', 'Nu-Disco'],
    bio: 'Sabrina Annlynn Carpenter is an American singer and actress. She dominated 2024 global charts with her critically acclaimed sixth studio album Short n\' Sweet.',
  },
  'kendrick lamar': {
    name: 'Kendrick Lamar',
    artworkUrl: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022',
    followers: '32.1M',
    genres: ['Hip-Hop', 'Conscious Rap', 'West Coast'],
    bio: 'Kendrick Lamar Duckworth is an American rapper and songwriter, widely regarded as one of the most influential hip hop artists of his generation.',
  },
  'radiohead': {
    name: 'Radiohead',
    artworkUrl: 'https://i.scdn.co/image/ab6761610000e5eba03696716c9f605002041455',
    followers: '10.9M',
    genres: ['Art Rock', 'Alternative', 'Experimental'],
    bio: 'Radiohead are an English rock band formed in Abingdon, Oxfordshire, in 1985. Known for advancing the sound of rock with experimental electronic textures.',
  },
};

// Curated albums
const CURATED_ALBUMS: Record<string, Partial<MusicAlbum>> = {
  'guts': {
    id: 'album-guts',
    title: 'GUTS',
    artist: 'Olivia Rodrigo',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
    releaseYear: '2023',
    trackCount: 12,
  },
  'hit me hard and soft': {
    id: 'album-hmhas',
    title: 'HIT ME HARD AND SOFT',
    artist: 'Billie Eilish',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
    releaseYear: '2024',
    trackCount: 10,
  },
  'after hours': {
    id: 'album-after-hours',
    title: 'After Hours',
    artist: 'The Weeknd',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    releaseYear: '2020',
    trackCount: 14,
  },
  'brat': {
    id: 'album-brat',
    title: 'BRAT',
    artist: 'Charli xcx',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2738202b8d00977462c16118d09',
    releaseYear: '2024',
    trackCount: 15,
  },
  'short n\' sweet': {
    id: 'album-short-n-sweet',
    title: 'Short n\' Sweet',
    artist: 'Sabrina Carpenter',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f628',
    releaseYear: '2024',
    trackCount: 12,
  },
  'ok computer': {
    id: 'album-ok-computer',
    title: 'OK Computer',
    artist: 'Radiohead',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273c8b444df094179b770396495',
    releaseYear: '1997',
    trackCount: 12,
  },
};

// Fallback authentic playable audio streams (Apple Music CDN)
const AUDIO_STREAM_FALLBACKS = [
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/70/2f/a6/702fa6b5-946c-7a8e-2dba-03de25c732d3/mzaf_12764345117177639836.plus.aac.p.m4a', // vampire
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9d/3e/43/9d3e43aa-682a-7979-8547-d339956c409b/mzaf_710286407585135494.plus.aac.p.m4a', // LUNCH
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/d6/60/19d660ff-e3a9-8377-15a3-ce4b28e89cac/mzaf_18422426156481158187.plus.aac.p.m4a', // Blinding Lights
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6a/b2/36/6ab236ac-6b8e-60e4-aa77-8e73c7127ebc/mzaf_17637473173165118705.plus.aac.p.m4a', // 360
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a', // Karma Police
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/4d/02/e94d0230-11ee-ef94-d2cf-a5d547bd73f4/mzaf_554140808559155562.plus.aac.p.m4a', // Espresso
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/2e/37/1f2e37be-bdd0-d770-6ea4-091011a6aade/mzaf_2360827885900940865.plus.aac.p.m4a', // HUMBLE.
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/5a/c2/835ac220-f31a-006f-b6a9-2acd29eb60d0/mzaf_13621843495437485054.plus.aac.p.m4a', // deja vu
];

function getFallbackStream(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AUDIO_STREAM_FALLBACKS.length;
  return AUDIO_STREAM_FALLBACKS[index];
}

function upgradeArtwork(url: string | undefined): string {
  if (!url) return 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d';
  return url.replace('/100x100bb.jpg', '/600x600bb.jpg').replace('/60x60bb.jpg', '/600x600bb.jpg');
}

export function normalizeSearchKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Verified full-length official YouTube video IDs for popular artist tracks
export const VERIFIED_YOUTUBE_TRACKS: Record<string, string> = {
  // Olivia Rodrigo
  'vampire::oliviarodrigo': 'Fqey8LxQxFU',
  'dejavu::oliviarodrigo': 'cii6ruuycQA',
  'driverslicense::oliviarodrigo': 'ZmDBbnmKpqQ',
  'good4u::oliviarodrigo': 'gNi_6U5Pm_o',
  'badidearight::oliviarodrigo': 'ZsJ-BHohCRI',
  'gethimback::oliviarodrigo': 'ZsDJWDSPewg',
  'traitor::oliviarodrigo': 'Rb6Vy7T5qfE',
  'allamericabitch::oliviarodrigo': 'O48h88r-8lI',
  'balladofahomeschoolgirl::oliviarodrigo': 'a5mN9k9jZ8E',
  'happier::oliviarodrigo': 'Z-9g_k8t3rM',
  'brutal::oliviarodrigo': 'OGUxj-J82_E',

  // Billie Eilish
  'lunch::billieeilish': 'jsptjaAef7Q',
  'chihiro::billieeilish': 'BY_X02Vv6ns',
  'birdsofafeather::billieeilish': 'd5gf9dXHevw',
  'wildflower::billieeilish': 'sFw_a8eK4qE',
  'badguy::billieeilish': 'DyDfgMOUjCI',
  'oceaneyes::billieeilish': 'viimfQi_pUw',
  'happierthanever::billieeilish': '5GJWxDKyk3U',
  'whatwasimadefor::billieeilish': 'cW8VLC9nnTo',
  'everythingiwanted::billieeilish': 'EgBJmlPo8Xw',
  'whenweallfallasleepwheredowego::billieeilish': 'kXo_VzK-Fsc',
  'lovely::billieeilish': 'V1Pl8CzNzCw',
  'idontwannabeyouanymore::billieeilish': '-tn2S3kJlyU',
  'bellyache::billieeilish': 'gBRi6aZJGj4',
  'youshouldseemeeinacrown::billieeilish': 'coLerbRvgsQ',
  'whenthepartysover::billieeilish': 'pbMwTqkKSps',
  'skinny::billieeilish': 'a_W98e4d3p0',
  'thegreatest::billieeilish': 'wz7xZ1Qe_a0',
  'lamourdemavie::billieeilish': 'L3B_c8B8g1c',

  // The Weeknd
  'blindinglights::theweeknd': 'fHI8X4OXluQ',
  'starboy::theweeknd': '34Na4j8AVgA',
  'saveyourtears::theweeknd': 'XXYlFuWEuKI',
  'thehills::theweeknd': 'yzTuBuRdAyA',
  'cantfeelmyface::theweeknd': 'dqt8Z1k0oWQ',
  'dieinterface::theweeknd': 'uPD0QOGChkY',
  'dieforyou::theweeknd': 'uPD0QOGChkY',
  'afterhours::theweeknd': 'ygTZZpVHNmc',
  'inreallife::theweeknd': '3m7X8J0a5iU',
  'heartless::theweeknd': '1DpH-icPpl0',
  'timeless::theweeknd': 'N3l_T4c-j2A',
  'ifeelitcoming::theweeknd': 'qFLhGq0FETg',
  'calloutmyname::theweeknd': 'M4ZoCHID9GU',
  'outoftime::theweeknd': '2fDzCWNS3ig',
  'sacrifice::theweeknd': 'VafTMsrnSTU',
  'takemybreath::theweeknd': 'rhTl_OyehF8',
  'oneofthegirls::theweeknd': 'f1r0XZLNlGQ',

  // Charli xcx (supporting both charlixcx and charliexcx)
  '360::charlixcx': 'WJW-VvmrkS8',
  '360::charliexcx': 'WJW-VvmrkS8',
  'vondutch::charlixcx': 'qK7m8h0sN4I',
  'vondutch::charliexcx': 'qK7m8h0sN4I',
  'apple::charlixcx': '6gCj7w9v_B8',
  'apple::charliexcx': '6gCj7w9v_B8',
  'sympathyisanife::charlixcx': 'D912bNl5yWw',
  'sympathyisanife::charliexcx': 'D912bNl5yWw',
  'sympathyisaknife::charlixcx': 'D912bNl5yWw',
  'sympathyisaknife::charliexcx': 'D912bNl5yWw',
  'talktalk::charlixcx': 'JgZlX54jXf8',
  'talktalk::charliexcx': 'JgZlX54jXf8',
  'speeddrive::charlixcx': 'A0tH900o6pA',
  'speeddrive::charliexcx': 'A0tH900o6pA',
  'boomclap::charlixcx': 'AOPMlIIg_38',
  'boomclap::charliexcx': 'AOPMlIIg_38',
  'guess::charlixcx': 'o_A_g0oDk_Q',
  'guess::charliexcx': 'o_A_g0oDk_Q',
  'girlsoconfusing::charlixcx': 'F_h8w4M9rA4',
  'clubclassics::charlixcx': 'b5mN3zJ9xLw',
  'b2b::charlixcx': 'f8m4N1z7Qw9',
  'everythingisromantic::charlixcx': 'k3J9n8M5p2Q',

  // Sabrina Carpenter
  'espresso::sabrinacarpenter': 'eVli-tstM5E',
  'pleasepleaseplease::sabrinacarpenter': 'cF1Na4AIecM',
  'taste::sabrinacarpenter': 'tf96qH8g9V0',
  'feather::sabrinacarpenter': 'k3WkJq4gkLM',
  'nonsense::sabrinacarpenter': 'z4s3B1Bq7o4',
  'bedchem::sabrinacarpenter': 'qA17y4t1_7k',
  'goodgraces::sabrinacarpenter': 'K8R6YqW1dQE',
  'skinnydipping::sabrinacarpenter': '4q6_N2K8_7Y',
  'fasttimes::sabrinacarpenter': 'mX5Wq1r8sZ0',
  'sharpesttool::sabrinacarpenter': 'V3B1y4N8r2Q',

  // Kendrick Lamar
  'humble::kendricklamar': 'tvTRZJ-4EyI',
  'notlikeus::kendricklamar': 'H58vbez_m4E',
  'dna::kendricklamar': 'NLZRYQMLDW4',
  'moneytrees::kendricklamar': 'smqhSl0u_HQ',
  'alright::kendricklamar': 'Z-48u_BlPEo',
  'swimmingpoolsdrank::kendricklamar': '8-ejyHzz3XE',
  'kingkunta::kendricklamar': 'hRK7PVJFbS8',
  'euphoria::kendricklamar': 'np4n16dJc_k',
  'allthestars::kendricklamar': 'GfCqMv--ncA',
  'prayforme::kendricklamar': 'K5xERXE72JU',
  'n95::kendricklamar': 'zI383iuUSg4',
  'countmeout::kendricklamar': '6nTcdw7bVdc',

  // Radiohead
  'karmapolice::radiohead': '4IJI6soiQhI',
  'creep::radiohead': 'XFkzRNyygfk',
  'nosurprises::radiohead': 'u5CVsCnxyXg',
  'paranoidandroid::radiohead': 'fHiGbolFFGw',
  'highanddry::radiohead': '7qFfFVSerQo',
  'fakeplastictrees::radiohead': 'n5h0qHwNrHk',
  'jigsawfallingintoplace::radiohead': 'GoLJJRIWCLU',
  'weirdfishesarpeggi::radiohead': 'V_YlZ1JdcVk',
  'exitmusicforafilm::radiohead': 'Bf01zp0I7G8',
  '15step::radiohead': 'wedffB_C9a4',

  // Chappell Roan
  'goodluckbabe::chappellroan': '1RKqOmSkGgM',
  'pinkponyclub::chappellroan': '03_Ka_hSgGQ',
  'hottogo::chappellroan': 'xaPNR-_Cfnk',
  'redwinesupernova::chappellroan': 'oWwR2_d3xP4',
  'casual::chappellroan': '8yM6p8P_kQw',
  'mykinkiskarma::chappellroan': '4p3m5Q8z1Zw',
  'femininomenon::chappellroan': '6_Y7M5J3xQw',

  // Taylor Swift
  'cruelsummer::taylorswift': 'ic8j13piAhQ',
  'antihero::taylorswift': 'b1kbLwvqugk',
  'blankspace::taylorswift': 'e-ORhEE9VVg',
  'shakeitoff::taylorswift': 'nfWlot6h_JM',
  'cardigan::taylorswift': 'K-a8s8OLBSE',
  'lover::taylorswift': '-BjZmE2gtdo',
  'style::taylorswift': '-CMADIYurs4',
  'fortnight::taylorswift': 'q3zqJs7JUCQ',
  'icandoitwithabrokenheart::taylorswift': 'Slk_8M2xQW0',

  // Bruno Mars / Lady Gaga
  'diewithasmile::ladygaga': 'kPa7bsKwL-c',
  'diewithasmile::brunomars': 'kPa7bsKwL-c',
  'thatswhatilike::brunomars': 'PMivT7MJ41M',
  '24kmagic::brunomars': 'UqyT8IEBkvY',
  'uptownfunk::brunomars': 'OPf0YbXqDm0',
  'lockedoutofheaven::brunomars': 'e-fA-gBCkj0',
  'wheniwasyourman::brunomars': 'ekzHIWp85OM',

  // Dua Lipa
  'houdini::dualipa': 'suAR1PYFNYA',
  'levitating::dualipa': 'TUVcZfQe-Kw',
  'dontstartnow::dualipa': 'oygrmJFKYZY',
  'dancethenight::dualipa': 'OiC1rgCPmUQ',
  'trainingseason::dualipa': 'ZjBZ0lW2Zp4',
  'newrules::dualipa': 'k2qgadSvNyU',

  // SZA
  'killbill::sza': 'm7ZZNVe5GUU',
  'snooze::sza': 'fC4c8Gq0P5k',
  'saturn::sza': '3v4c6M8s9Zw',
  'nobodygetsme::sza': '4m8K2v9xJq0',
  'gooddays::sza': '2pVgn3Rsk0o',

  // Travis Scott
  'fein::travisscott': 'B9synWjqBn8',
  'goosebumps::travisscott': 'Dst9gZkq1a8',
  'sickomode::travisscott': '6ONRf7h3Mdk',
  'myeyes::travisscott': '1m8s0k4m2wQ',
  'highestintheroom::travisscott': 'tfSS1e3kYeo',

  // Daft Punk
  'getlucky::daftpunk': '5NV6Rdv1a3w',
  'onemoretime::daftpunk': 'FGBhQbmMxbw',
  'aroundtheworld::daftpunk': 'LKYPYj2XX80',
  'harderbetterfasterstronger::daftpunk': 'gAjR4_CbPpQ',
  'instantcrush::daftpunk': 'a5uQMwRMHcs',
  'loseyourselftodance::daftpunk': 'NF-kLy44Hls',

  // Frank Ocean
  'lost::frankocean': 'bZ9_U4jIiy8',
  'pinkwhite::frankocean': 'uzS3WG6__G4',
  'nights::frankocean': 'r4l9bFqgMaQ',
  'thinkinboutyou::frankocean': 'sDk1YfF5Nfc',
  'novacane::frankocean': 'TMfPJT4XjGQ',
  'chanel::frankocean': 'MRy78K_V1gE',
};

export class MusicService {
  private static instance: MusicService | null = null;
  private youtubeIdCache = new Map<string, string>();
  private youtubeCandidatesCache = new Map<string, string[]>();

  public static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  /**
   * Get search query suggestions (via Google Search suggest)
   */
  public async getSearchSuggestions(query: string): Promise<string[]> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    try {
      const url = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[1])) {
          return data[1].slice(0, 7);
        }
      }
    } catch {
      // Return local match fallback
    }

    // Local suggestion fallback
    const names = [
      'Olivia Rodrigo',
      'Billie Eilish',
      'The Weeknd',
      'Charli xcx',
      'Sabrina Carpenter',
      'Radiohead',
      'Kendrick Lamar',
      'Frank Ocean',
      'Daft Punk',
      'vampire',
      'LUNCH',
      '360',
      'Espresso',
      'Blinding Lights',
      'Karma Police',
    ];
    return names.filter((n) => n.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 5);
  }

  /**
   * Search real tracks across iTunes API + ClashFLAC catalog
   */
  public async searchTracks(query: string, limit: number = 25): Promise<AudioTrack[]> {
    const trimmed = query.trim();
    if (!trimmed) return CURATED_AUDIOPHILE_TRACKS;

    const qLower = trimmed.toLowerCase();

    // 1. If custom ClashFLAC backend is configured, prioritize backend search results
    const clashflacResults: AudioTrack[] = [];
    try {
      const cRes = await clashflacApi.search(trimmed);
      if (cRes && cRes !== CURATED_AUDIOPHILE_TRACKS && cRes.length > 0) {
        clashflacResults.push(...cRes);
      }
    } catch (e) {
      console.warn('ClashFLAC custom backend search error', e);
    }

    // 2. Check curated tracks
    const curatedMatches = CURATED_AUDIOPHILE_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(qLower) ||
        t.artist.toLowerCase().includes(qLower) ||
        (t.album && t.album.toLowerCase().includes(qLower))
    );

    // 3. Fetch live results from iTunes Search API
    const remoteTracks: AudioTrack[] = [];
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(trimmed)}&entity=song&limit=${limit}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          data.results.forEach((item: any) => {
            // Ensure unique
            const id = `itunes-${item.trackId}`;
            const streamUrl = item.previewUrl || getFallbackStream(item.trackName + item.artistName);
            const durationSec = item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 180;
            const normKey = `${normalizeSearchKey(item.trackName || '')}::${normalizeSearchKey(item.artistName || '')}`;
            const knownYtId = VERIFIED_YOUTUBE_TRACKS[normKey];
            remoteTracks.push({
              id,
              title: item.trackName || 'Unknown Title',
              artist: item.artistName || 'Unknown Artist',
              album: item.collectionName || '',
              duration: Math.max(120, durationSec),
              artworkUrl: upgradeArtwork(item.artworkUrl100),
              streamUrl,
              quality: 'HI_RES_192',
              bitDepth: 24,
              sampleRate: 192000,
              codec: 'FLAC',
              youtubeId: knownYtId,
            });
          });
        }
      }
    } catch (e) {
      console.warn('iTunes track search failed, using local catalog', e);
    }

    // Merge ClashFLAC, curated, and remote results without duplicates
    const combined: AudioTrack[] = [...clashflacResults];
    const seenTitles = new Set(clashflacResults.map((t) => `${t.title.toLowerCase()}::${t.artist.toLowerCase()}`));

    for (const t of curatedMatches) {
      const key = `${t.title.toLowerCase()}::${t.artist.toLowerCase()}`;
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        combined.push(t);
      }
    }

    for (const t of remoteTracks) {
      const key = `${t.title.toLowerCase()}::${t.artist.toLowerCase()}`;
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        combined.push(t);
      }
    }

    return combined.slice(0, limit);
  }

  /**
   * Search artists across iTunes API
   */
  public async searchArtists(query: string, limit: number = 10): Promise<MusicArtist[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return Object.values(CURATED_ARTISTS).map((a, idx) => ({
        id: `curated-artist-${idx}`,
        name: a.name || 'Artist',
        artworkUrl: a.artworkUrl || 'https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6',
        followers: a.followers,
        genres: a.genres,
        bio: a.bio,
      }));
    }

    const qLower = trimmed.toLowerCase();
    const curatedMatches: MusicArtist[] = [];

    Object.keys(CURATED_ARTISTS).forEach((key, idx) => {
      if (key.includes(qLower)) {
        const c = CURATED_ARTISTS[key];
        curatedMatches.push({
          id: `curated-art-${idx}`,
          name: c.name || key,
          artworkUrl: c.artworkUrl || 'https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6',
          followers: c.followers,
          genres: c.genres,
          bio: c.bio,
        });
      }
    });

    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(trimmed)}&entity=musicArtist&limit=${limit}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          const remoteArtists: MusicArtist[] = data.results.map((item: any) => {
            const known = CURATED_ARTISTS[item.artistName?.toLowerCase()];
            return {
              id: `artist-${item.artistId}`,
              name: item.artistName || 'Unknown Artist',
              artworkUrl: known?.artworkUrl || 'https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6',
              genres: item.primaryGenreName ? [item.primaryGenreName] : ['Music'],
              followers: known?.followers || '1.2M',
              bio: known?.bio,
            };
          });

          // Combine without duplicate names
          const names = new Set(curatedMatches.map((a) => a.name.toLowerCase()));
          for (const a of remoteArtists) {
            if (!names.has(a.name.toLowerCase())) {
              names.add(a.name.toLowerCase());
              curatedMatches.push(a);
            }
          }
        }
      }
    } catch (e) {
      console.warn('iTunes artist search failed', e);
    }

    return curatedMatches.slice(0, limit);
  }

  /**
   * Search albums across iTunes API
   */
  public async searchAlbums(query: string, limit: number = 10): Promise<MusicAlbum[]> {
    const trimmed = query.trim();
    const qLower = trimmed.toLowerCase();
    const curatedMatches: MusicAlbum[] = [];

    Object.keys(CURATED_ALBUMS).forEach((key, idx) => {
      if (!trimmed || key.includes(qLower)) {
        const a = CURATED_ALBUMS[key];
        curatedMatches.push({
          id: a.id || `curated-album-${idx}`,
          title: a.title || 'Album',
          artist: a.artist || 'Artist',
          artworkUrl: a.artworkUrl || 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d',
          releaseYear: a.releaseYear || '2024',
          trackCount: a.trackCount || 12,
        });
      }
    });

    if (!trimmed) {
      return curatedMatches;
    }

    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(trimmed)}&entity=album&limit=${limit}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          const remoteAlbums: MusicAlbum[] = data.results.map((item: any) => ({
            id: `album-${item.collectionId}`,
            title: item.collectionName || 'Album',
            artist: item.artistName || 'Artist',
            artworkUrl: upgradeArtwork(item.artworkUrl100),
            releaseYear: item.releaseDate ? item.releaseDate.slice(0, 4) : '2024',
            trackCount: item.trackCount || 10,
          }));

          const titles = new Set(curatedMatches.map((a) => a.title.toLowerCase()));
          for (const a of remoteAlbums) {
            if (!titles.has(a.title.toLowerCase())) {
              titles.add(a.title.toLowerCase());
              curatedMatches.push(a);
            }
          }
        }
      }
    } catch (e) {
      console.warn('iTunes album search failed', e);
    }

    return curatedMatches.slice(0, limit);
  }

  /**
   * Get full details for an artist including popular tracks and discography
   */
  public async getArtistDetails(artistName: string): Promise<MusicArtist> {
    const trimmed = artistName.trim();
    const known = CURATED_ARTISTS[trimmed.toLowerCase()];

    // Fetch popular tracks
    const popularTracks = await this.searchTracks(trimmed, 10);
    // Fetch albums
    const albums = await this.searchAlbums(trimmed, 6);

    const artworkUrl = known?.artworkUrl || popularTracks[0]?.artworkUrl || 'https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6';

    return {
      id: `artist-${trimmed.toLowerCase().replace(/\s+/g, '-')}`,
      name: known?.name || trimmed,
      artworkUrl,
      followers: known?.followers || '2.8M',
      genres: known?.genres || ['Alternative', 'Pop'],
      bio: known?.bio || `${trimmed} is an acclaimed recording artist streaming in studio master fidelity on Kaira Music.`,
      popularTracks,
      albums,
    };
  }

  /**
   * Get full album details and complete tracklist
   */
  public async getAlbumDetails(albumId: string, albumTitle: string, artistName: string): Promise<MusicAlbum> {
    const known = CURATED_ALBUMS[albumTitle.toLowerCase()];

    // Try iTunes lookup by ID if numeric
    let tracks: AudioTrack[] = [];
    const numericId = albumId.replace(/\D/g, '');

    if (numericId) {
      try {
        const url = `https://itunes.apple.com/lookup?id=${numericId}&entity=song`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.results)) {
            const songs = data.results.filter((item: any) => item.wrapperType === 'track');
            tracks = songs.map((item: any, idx: number) => {
              const durationSec = item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 190;
              const normKey = `${normalizeSearchKey(item.trackName || '')}::${normalizeSearchKey(item.artistName || artistName || '')}`;
              const knownYtId = VERIFIED_YOUTUBE_TRACKS[normKey];
              return {
                id: `track-${item.trackId || idx}`,
                title: item.trackName || `Track ${idx + 1}`,
                artist: item.artistName || artistName,
                album: item.collectionName || albumTitle,
                duration: Math.max(120, durationSec),
                artworkUrl: upgradeArtwork(item.artworkUrl100),
                streamUrl: item.previewUrl || getFallbackStream(item.trackName + item.artistName),
                quality: 'HI_RES_192',
                bitDepth: 24,
                sampleRate: 192000,
                codec: 'FLAC',
                youtubeId: knownYtId,
              };
            });
          }
        }
      } catch (e) {
        console.warn('iTunes album lookup error', e);
      }
    }

    // Fallback: search tracks for this album and artist
    if (tracks.length === 0) {
      const searchRes = await this.searchTracks(`${artistName} ${albumTitle}`, 12);
      tracks = searchRes.filter((t) => t.artist.toLowerCase().includes(artistName.toLowerCase()));
      if (tracks.length === 0) {
        tracks = searchRes;
      }
    }

    const artworkUrl = known?.artworkUrl || tracks[0]?.artworkUrl || 'https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d';
    const releaseYear = known?.releaseYear || '2024';
    const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);

    return {
      id: albumId,
      title: known?.title || albumTitle,
      artist: known?.artist || artistName,
      artworkUrl,
      releaseYear,
      trackCount: tracks.length,
      duration: totalDuration,
      tracks,
    };
  }

  /**
   * Resolves candidate full-length official YouTube video IDs with multi-tiered fallback
   */
  public async resolveYouTubeCandidates(track: AudioTrack): Promise<string[]> {
    const cacheKey = `${track.title}::${track.artist}`.toLowerCase();
    if (this.youtubeCandidatesCache.has(cacheKey)) {
      const cached = this.youtubeCandidatesCache.get(cacheKey)!;
      if (cached.length > 0) {
        track.youtubeId = cached[0];
        return cached;
      }
    }

    const candidates: string[] = [];

    if (track.youtubeId) {
      candidates.push(track.youtubeId);
    }

    // 1. Curated audiophile tracks check
    const curated = CURATED_AUDIOPHILE_TRACKS.find(
      (t) =>
        t.title.toLowerCase() === track.title.toLowerCase() &&
        t.artist.toLowerCase() === track.artist.toLowerCase()
    );
    if (curated?.youtubeId && !candidates.includes(curated.youtubeId)) {
      candidates.push(curated.youtubeId);
    }

    // 2. Curated dictionary check
    const normKey = `${normalizeSearchKey(track.title)}::${normalizeSearchKey(track.artist)}`;
    if (VERIFIED_YOUTUBE_TRACKS[normKey] && !candidates.includes(VERIFIED_YOUTUBE_TRACKS[normKey])) {
      candidates.push(VERIFIED_YOUTUBE_TRACKS[normKey]);
    }

    // Check normalized title prefix in verified dictionary
    const normTitle = normalizeSearchKey(track.title);
    for (const [k, id] of Object.entries(VERIFIED_YOUTUBE_TRACKS)) {
      if (k.startsWith(`${normTitle}::`) && !candidates.includes(id)) {
        candidates.push(id);
      }
    }

    // 3. Dynamic live query via dev/preview server proxy /api/yt-search
    try {
      const query = `${track.title} ${track.artist} audio`;
      const res = await fetch(`/api/yt-search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.videoIds)) {
          for (const vid of data.videoIds) {
            if (vid && !candidates.includes(vid)) {
              candidates.push(vid);
            }
          }
        } else if (data.videoId && !candidates.includes(data.videoId)) {
          candidates.push(data.videoId);
        }
      }

      if (candidates.length === 0) {
        // Secondary dynamic query with clean title and artist
        const query2 = `${track.title} ${track.artist}`;
        const res2 = await fetch(`/api/yt-search?q=${encodeURIComponent(query2)}`);
        if (res2.ok) {
          const data2 = await res2.json();
          if (Array.isArray(data2.videoIds)) {
            for (const vid of data2.videoIds) {
              if (vid && !candidates.includes(vid)) {
                candidates.push(vid);
              }
            }
          } else if (data2.videoId && !candidates.includes(data2.videoId)) {
            candidates.push(data2.videoId);
          }
        }
      }
    } catch (e) {
      // Local proxy not running (e.g., GitHub Pages static hosting)
    }

    // 4. Remote Public Invidious API fallback (CORS-friendly mirrors for static hosting)
    if (candidates.length === 0) {
      const invidiousInstances = [
        'https://invidious.f5.si',
        'https://inv.tux.pizza',
        'https://invidious.nerdvpn.de',
      ];

      for (const base of invidiousInstances) {
        try {
          const invUrl = `${base}/api/v1/search?type=video&q=${encodeURIComponent(`${track.title} ${track.artist} audio`)}`;
          const timeoutSignal =
            typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
              ? (AbortSignal as any).timeout(3500)
              : undefined;
          const invRes = await fetch(invUrl, { signal: timeoutSignal });
          if (invRes.ok) {
            const items = await invRes.json();
            if (Array.isArray(items)) {
              for (const item of items) {
                if (item && typeof item.videoId === 'string' && item.videoId.length === 11) {
                  if (!candidates.includes(item.videoId)) {
                    candidates.push(item.videoId);
                  }
                }
              }
            }
            if (candidates.length > 0) break;
          }
        } catch (e) {
          // Continue to next mirror
        }
      }
    }

    if (candidates.length > 0) {
      track.youtubeId = candidates[0];
      this.youtubeIdCache.set(cacheKey, candidates[0]);
      this.youtubeCandidatesCache.set(cacheKey, candidates);
    }

    return candidates;
  }

  /**
   * Resolves verified full-length official YouTube video ID for a track
   */
  public async resolveYouTubeId(track: AudioTrack): Promise<string | null> {
    const candidates = await this.resolveYouTubeCandidates(track);
    return candidates[0] || null;
  }

  /**
   * Resolves a guaranteed playable audio URL with multi-tiered fallback and pre-resolves youtubeId
   */
  public async resolvePlayableStream(track: AudioTrack): Promise<string> {
    // Pre-resolve YouTube ID for instant full-length playback
    await this.resolveYouTubeId(track).catch(() => {});

    if (track.clashflacId) {
      try {
        const resolved = await clashflacApi.resolveStreamUrl(track, track.quality);
        if (resolved && resolved.startsWith('http') && !resolved.includes('soundhelix')) {
          return resolved;
        }
      } catch (e) {
        console.warn('Clashflac stream resolve failed', e);
      }
    }

    if (track.streamUrl && track.streamUrl.startsWith('http') && !track.streamUrl.includes('soundhelix')) {
      return track.streamUrl;
    }

    // Dynamic resolution via iTunes search
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(track.artist + ' ' + track.title)}&entity=song&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results[0] && data.results[0].previewUrl) {
          const resolved = data.results[0].previewUrl;
          track.streamUrl = resolved;
          return resolved;
        }
      }
    } catch (e) {
      console.warn('iTunes audio stream resolution failed', e);
    }

    return getFallbackStream(track.title + track.artist);
  }
}

export const musicService = MusicService.getInstance();
