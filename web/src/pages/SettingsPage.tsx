import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  LogOut,
  Languages,
  ChevronRight,
  Youtube,
  RefreshCw,
  Download,
  Moon,
  Palette,
  Disc3,
  Type,
  LayoutGrid,
  Droplets,
  MessageSquare,
  Sliders,
  Waves,
  Sparkles,
  CloudDownload,
  SlidersHorizontal,
  GitCommit,
  FileText,
  Zap,
  Activity,
  Grid,
  Bell,
  Clock,
  RotateCcw,
  Trash2,
  CloudUpload,
  Send,
  Code2,
  X,
  CheckCircle2,
  AlertCircle,
  Server,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { useSettingsStore, AccentColor } from '../store/useSettingsStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { clashflacApi } from '../services/clashflacApi';
import { lastFmApi } from '../services/lastFmApi';
import { ytMusicApi } from '../services/ytMusicApi';
import { AudioQuality } from '../audio/types';
import { Material3Switch } from '../components/Material3Switch';

interface SettingsPageProps {
  onBack?: () => void;
  onOpenOnboarding?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onOpenOnboarding }) => {
  // Store subscriptions
  const amoledMode = useSettingsStore((s) => s.amoledMode);
  const dynamicColor = useSettingsStore((s) => s.dynamicColor);
  const dynamicNowPlaying = useSettingsStore((s) => s.dynamicNowPlaying);
  const useAppFont = useSettingsStore((s) => s.useAppFont);
  const accentTheme = useSettingsStore((s) => s.accentTheme);

  const liquidGlass = useSettingsStore((s) => s.liquidGlass);
  const lyricsAnimation = useSettingsStore((s) => s.lyricsAnimation);
  const wavySeekbar = useSettingsStore((s) => s.wavySeekbar);
  const studioClarity = useSettingsStore((s) => s.studioClarity);
  const crossfade = useSettingsStore((s) => s.crossfade);
  const downloadSyncedLyrics = useSettingsStore((s) => s.downloadSyncedLyrics);

  const preferredQuality = useSettingsStore((s) => s.preferredQuality);
  const downloadQuality = useSettingsStore((s) => s.downloadQuality);

  const scrobbleMusic = useSettingsStore((s) => s.scrobbleMusic);
  const submitNowPlaying = useSettingsStore((s) => s.submitNowPlaying);
  const scrobblePercent = useSettingsStore((s) => s.scrobblePercent);

  const isYtMusicConnected = useSettingsStore((s) => s.isYtMusicConnected);
  const ytMusicAccountName = useSettingsStore((s) => s.ytMusicAccountName);
  const ytMusicChannelHandle = useSettingsStore((s) => s.ytMusicChannelHandle);
  const ytMusicPhotoUrl = useSettingsStore((s) => s.ytMusicPhotoUrl);
  const ytMusicCookies = useSettingsStore((s) => s.ytMusicCookies);
  const ytMusicPlaylistsCount = useSettingsStore((s) => s.ytMusicPlaylistsCount);
  const twoWayPlaylistSync = useSettingsStore((s) => s.twoWayPlaylistSync);

  const lastFmUsername = useSettingsStore((s) => s.lastFmUsername);
  const lastFmApiKey = useSettingsStore((s) => s.lastFmApiKey);
  const lastFmSecret = useSettingsStore((s) => s.lastFmSecret);
  const lastFmSessionKey = useSettingsStore((s) => s.lastFmSessionKey);
  const lastFmAvatarUrl = useSettingsStore((s) => s.lastFmAvatarUrl);
  const lastFmPlayCount = useSettingsStore((s) => s.lastFmPlayCount);
  const isLastFmConnected = useSettingsStore((s) => s.isLastFmConnected);

  const clashflacUrl = useSettingsStore((s) => s.clashflacUrl);
  const clashflacApiKey = useSettingsStore((s) => s.clashflacApiKey);

  const dsp = useSettingsStore((s) => s.dsp);

  // Store actions
  const setAmoledMode = useSettingsStore((s) => s.setAmoledMode);
  const setDynamicColor = useSettingsStore((s) => s.setDynamicColor);
  const setDynamicNowPlaying = useSettingsStore((s) => s.setDynamicNowPlaying);
  const setUseAppFont = useSettingsStore((s) => s.setUseAppFont);
  const setAccentTheme = useSettingsStore((s) => s.setAccentTheme);

  const setLiquidGlass = useSettingsStore((s) => s.setLiquidGlass);
  const setWavySeekbar = useSettingsStore((s) => s.setWavySeekbar);
  const setStudioClarity = useSettingsStore((s) => s.setStudioClarity);
  const setCrossfade = useSettingsStore((s) => s.setCrossfade);
  const setDownloadSyncedLyrics = useSettingsStore((s) => s.setDownloadSyncedLyrics);

  const setPreferredQuality = useSettingsStore((s) => s.setPreferredQuality);
  const setDownloadQuality = useSettingsStore((s) => s.setDownloadQuality);

  const setScrobbleMusic = useSettingsStore((s) => s.setScrobbleMusic);
  const setSubmitNowPlaying = useSettingsStore((s) => s.setSubmitNowPlaying);
  const setScrobblePercent = useSettingsStore((s) => s.setScrobblePercent);

  const setYtMusicConnection = useSettingsStore((s) => s.setYtMusicConnection);
  const disconnectYtMusic = useSettingsStore((s) => s.disconnectYtMusic);
  const setTwoWayPlaylistSync = useSettingsStore((s) => s.setTwoWayPlaylistSync);
  const setHasCompletedOnboarding = useSettingsStore((s) => s.setHasCompletedOnboarding);

  const playlists = useLibraryStore((s) => s.playlists);
  const importYtMusicPlaylists = useLibraryStore((s) => s.importYtMusicPlaylists);

  const setLastFmConfig = useSettingsStore((s) => s.setLastFmConfig);
  const setLastFmProfile = useSettingsStore((s) => s.setLastFmProfile);
  const disconnectLastFm = useSettingsStore((s) => s.disconnectLastFm);

  const setClashflacUrl = useSettingsStore((s) => s.setClashflacUrl);
  const setClashflacApiKey = useSettingsStore((s) => s.setClashflacApiKey);

  const setDspSetting = useSettingsStore((s) => s.setDspSetting);

  // Modal / Sheet States
  const setEqOpen = usePlayerStore((s) => s.setEqOpen);

  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [qualityTargetType, setQualityTargetType] = useState<'streaming' | 'download'>('streaming');

  const [isClashflacModalOpen, setIsClashflacModalOpen] = useState(false);
  const [tempClashflacUrl, setTempClashflacUrl] = useState(clashflacUrl);
  const [tempClashflacKey, setTempClashflacKey] = useState(clashflacApiKey);
  const [clashflacTestResult, setClashflacTestResult] = useState<{ tested: boolean; success: boolean; message: string }>({
    tested: false,
    success: false,
    message: '',
  });

  const [isLastFmModalOpen, setIsLastFmModalOpen] = useState(false);
  const [lastFmTab, setLastFmTab] = useState<'web' | 'mobile' | 'byok'>('web');
  const [mobileUsername, setMobileUsername] = useState(lastFmUsername || '');
  const [mobilePassword, setMobilePassword] = useState('');
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileError, setMobileError] = useState('');

  const [tempUsername, setTempUsername] = useState(lastFmUsername);
  const [tempApiKey, setTempApiKey] = useState(lastFmApiKey);
  const [tempSecret, setTempSecret] = useState(lastFmSecret);
  const [tempSessionKey, setTempSessionKey] = useState(lastFmSessionKey);

  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // YouTube Music Modal States
  const [isYtMusicModalOpen, setIsYtMusicModalOpen] = useState(false);
  const [ytMusicTab, setYtMusicTab] = useState<'cookies' | 'demo' | 'account'>('cookies');
  const [ytCookieInput, setYtCookieInput] = useState(ytMusicCookies || '');
  const [ytConnecting, setYtConnecting] = useState(false);
  const [ytError, setYtError] = useState('');
  const [ytSuccess, setYtSuccess] = useState('');
  const [ytSyncing, setYtSyncing] = useState(false);

  // Swatch data for 8 Accent themes (2x2 color quadrants)
  const accentSwatches: { id: AccentColor; name: string; colors: string[] }[] = [
    { id: 'crimson', name: 'Crimson', colors: ['#B3261E', '#E06D67', '#F2B8B5', '#8C1D18'] },
    { id: 'violet', name: 'Violet', colors: ['#6750A4', '#9A82DB', '#CCC2DC', '#4F378B'] },
    { id: 'ocean', name: 'Ocean', colors: ['#00639B', '#4EA8DE', '#90E0EF', '#004A77'] },
    { id: 'sage', name: 'Sage', colors: ['#386A20', '#6BAE45', '#B6DF97', '#254E10'] },
    { id: 'amber', name: 'Amber', colors: ['#7A5900', '#D4A017', '#FFDF99', '#5B4300'] },
    { id: 'rose', name: 'Rose', colors: ['#8C384D', '#E2A9B0', '#F9D8DE', '#6A2335'] },
    { id: 'mono', name: 'Mono', colors: ['#2E2E2E', '#5C5C5C', '#A8A8A8', '#E6E6E6'] },
    { id: 'custom', name: 'Custom', colors: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4'] },
  ];

  const qualityLabels: Record<AudioQuality, string> = {
    HI_RES_192: 'Max (Up to 24-bit / 192 kHz) • YouTube Music fallback',
    HI_RES_96: 'Hi-Res (24-bit / 96 kHz) • YouTube Music fallback',
    LOSSLESS_CD: 'CD Lossless (16-bit / 44.1 kHz) • YouTube Music fallback',
    HIGH_320: 'High Efficiency 320 kbps • Opus',
  };

  const handleOpenYtMusicModal = () => {
    setYtCookieInput(ytMusicCookies || '');
    setYtMusicTab(isYtMusicConnected ? 'account' : 'cookies');
    setYtError('');
    setYtSuccess('');
    setIsYtMusicModalOpen(true);
  };

  const handleConnectWithCookies = async () => {
    if (!ytCookieInput.trim()) {
      setYtError('Please enter your YouTube Music session cookies.');
      return;
    }
    setYtConnecting(true);
    setYtError('');
    setYtSuccess('');
    try {
      const info = await ytMusicApi.connectWithCookies(ytCookieInput);
      setYtMusicConnection({
        accountName: info.accountName,
        channelHandle: info.channelHandle,
        photoUrl: info.photoUrl,
        cookies: ytCookieInput.trim(),
        playlistsCount: info.playlistsCount,
      });
      const plResult = await ytMusicApi.fetchPlaylists();
      importYtMusicPlaylists(plResult);
      setYtSuccess(`Connected as ${info.accountName}! ${plResult.length} playlists synchronized.`);
      setYtMusicTab('account');
    } catch (err: any) {
      setYtError(err.message || 'Failed to authenticate with session cookies.');
    } finally {
      setYtConnecting(false);
    }
  };

  const handleConnectDemo = async () => {
    setYtConnecting(true);
    setYtError('');
    setYtSuccess('');
    try {
      const info = await ytMusicApi.connectDemoAccount();
      setYtMusicConnection({
        accountName: info.accountName,
        channelHandle: info.channelHandle,
        photoUrl: info.photoUrl,
        cookies: 'demo_sapisid_token_lastwave_v4',
        playlistsCount: info.playlistsCount,
      });
      const plResult = await ytMusicApi.fetchPlaylists();
      importYtMusicPlaylists(plResult);
      setYtSuccess(`Demo account connected (${info.accountName})! ${plResult.length} playlists synchronized.`);
      setYtMusicTab('account');
    } catch (err: any) {
      setYtError(err.message || 'Failed to connect demo account.');
    } finally {
      setYtConnecting(false);
    }
  };

  const handleSyncYtMusicNow = async () => {
    setYtSyncing(true);
    setYtError('');
    setYtSuccess('');
    try {
      const res = await ytMusicApi.syncTwoWay(playlists);
      importYtMusicPlaylists(res.importedPlaylists);
      setYtSuccess(res.message);
    } catch (err: any) {
      setYtError(err.message || 'Failed to sync playlists.');
    } finally {
      setYtSyncing(false);
    }
  };

  const handleDisconnectYtMusic = () => {
    ytMusicApi.disconnect();
    disconnectYtMusic();
    setYtCookieInput('');
    setYtSuccess('');
    setYtError('');
    setYtMusicTab('cookies');
  };

  const handleOpenLastFmModal = () => {
    setTempUsername(lastFmUsername);
    setTempApiKey(lastFmApiKey);
    setTempSecret(lastFmSecret);
    setTempSessionKey(lastFmSessionKey);
    setMobileUsername(lastFmUsername || '');
    setMobilePassword('');
    setMobileError('');
    setIsLastFmModalOpen(true);
  };

  const handleMobileAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileUsername.trim() || !mobilePassword) {
      setMobileError('Please enter both your Last.fm username and password.');
      return;
    }
    setMobileLoading(true);
    setMobileError('');
    try {
      const { username, sessionKey } = await lastFmApi.obtainMobileSession(
        mobileUsername.trim(),
        mobilePassword
      );
      setLastFmConfig({ username, sessionKey });
      const profile = await lastFmApi.getUserInfo(username);
      if (profile) {
        setLastFmProfile({ avatarUrl: profile.image, playCount: profile.playcount });
      }
      setMobilePassword('');
      setIsLastFmModalOpen(false);
    } catch (err: any) {
      setMobileError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setMobileLoading(false);
    }
  };

  const handleTestClashflac = async () => {
    clashflacApi.setConfig(tempClashflacUrl, tempClashflacKey);
    const result = await clashflacApi.testConnection();
    setClashflacTestResult({
      tested: true,
      success: result.success,
      message: result.message,
    });
  };

  const handleSaveClashflac = () => {
    setClashflacUrl(tempClashflacUrl);
    setClashflacApiKey(tempClashflacKey);
    clashflacApi.setConfig(tempClashflacUrl, tempClashflacKey);
    setIsClashflacModalOpen(false);
  };

  const handleSaveLastFm = () => {
    setLastFmConfig({
      username: tempUsername,
      apiKey: tempApiKey,
      secret: tempSecret,
      sessionKey: tempSessionKey,
    });
    lastFmApi.setCredentials({
      username: tempUsername,
      apiKey: tempApiKey,
      sharedSecret: tempSecret,
      sessionKey: tempSessionKey,
    });
    setIsLastFmModalOpen(false);
  };

  const handleExportBackup = () => {
    const data = {
      version: '4.1.0-native',
      timestamp: Date.now(),
      settings: useSettingsStore.getState(),
      storage: { ...localStorage },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lastwave-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.storage) {
          Object.keys(json.storage).forEach((k) => {
            localStorage.setItem(k, json.storage[k]);
          });
          alert('Backup restored successfully. Refreshing application...');
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    localStorage.clear();
    alert('All saved Kaira Music data wiped. Reloading...');
    window.location.reload();
  };

  return (
    <div
      className={`min-h-full pb-28 pt-2 px-4 sm:px-6 max-w-2xl mx-auto font-sans transition-colors duration-300 select-none ${
        amoledMode ? 'bg-black text-[#EDE0E2]' : 'bg-[#120E11] text-[#EDE0E2]'
      }`}
    >
      {/* 1. Header Bar: ← Settings */}
      <div className="flex items-center gap-4 py-4 mb-2">
        <button
          onClick={() => (onBack ? onBack() : window.history.back())}
          className="p-2 -ml-2 rounded-full text-[#EDE0E2] hover:bg-white/5 active:scale-95 transition-all"
          title="Back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black font-sequel text-[#EDE0E2] tracking-tight">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* 2. Last.fm Account Card */}
        <div
          onClick={handleOpenLastFmModal}
          className="bg-[#231E22] rounded-[28px] p-4 flex items-center justify-between cursor-pointer hover:bg-[#2A2429] active:scale-[0.99] transition-all shadow-sm group"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar Circle */}
            {isLastFmConnected && lastFmAvatarUrl ? (
              <img
                src={lastFmAvatarUrl}
                alt={lastFmUsername}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E2A9B0]/40 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#5D383D] text-[#EDE0E2] flex items-center justify-center font-bold text-xl flex-shrink-0">
                {lastFmUsername ? lastFmUsername.charAt(0).toUpperCase() : 'L'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#9E9094] block">Last.fm Account</span>
                {isLastFmConnected && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Connected
                  </span>
                )}
              </div>
              <span className="text-base font-semibold text-white truncate block">
                {isLastFmConnected ? `@${lastFmUsername}` : 'Connect Last.fm'}
              </span>
              <span className="text-xs text-[#9E9094] block truncate">
                {isLastFmConnected
                  ? lastFmPlayCount && lastFmPlayCount > 0
                    ? `${lastFmPlayCount.toLocaleString()} scrobbles synced`
                    : 'Scrobbling active'
                  : 'Sync plays, love tracks & live statistics'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLastFmConnected ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  disconnectLastFm();
                }}
                className="p-2.5 rounded-full text-[#E2A9B0] hover:bg-white/10 active:scale-95 transition-all"
                title="Disconnect Account"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <div className="px-3.5 py-1.5 rounded-xl bg-[#E2A9B0]/15 text-[#E2A9B0] text-xs font-semibold group-hover:bg-[#E2A9B0] group-hover:text-[#4A2027] transition-all">
                Link
              </div>
            )}
          </div>
        </div>

        {/* 3. Language Card */}
        <div className="bg-[#211B1E] rounded-[28px] p-2 shadow-sm">
          <div
            onClick={() => alert('App language is set to System Default.')}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                <Languages size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-medium text-[#EDE0E2]">App Language</h4>
                <p className="text-xs text-[#9E9094]">System default</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#9E9094]" />
          </div>
        </div>

        {/* 4. YouTube Music Card */}
        <div className="bg-[#211B1E] rounded-[28px] p-2 divide-y divide-white/[0.04] shadow-sm">
          <div
            onClick={handleOpenYtMusicModal}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {isYtMusicConnected && ytMusicPhotoUrl ? (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <img
                    src={ytMusicPhotoUrl}
                    alt={ytMusicAccountName || 'YTM'}
                    className="w-10 h-10 rounded-2xl object-cover border border-white/10"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#211B1E]" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-[#FF0000]/15 text-[#FF0000] flex items-center justify-center flex-shrink-0">
                  <Youtube size={20} className="fill-[#FF0000]/20" />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-[15px] font-medium text-[#EDE0E2] truncate">
                  {isYtMusicConnected
                    ? ytMusicAccountName || 'YouTube Music Connected'
                    : 'Connect YouTube Music'}
                </h4>
                <p className="text-xs text-[#9E9094] truncate">
                  {isYtMusicConnected
                    ? `${ytMusicChannelHandle || '@ytmusic'} • ${ytMusicPlaylistsCount || 6} playlists available`
                    : 'Sign in to see and sync every playlist'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isYtMusicConnected ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#EDE0E2]">
                  Link
                </span>
              )}
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-medium text-[#EDE0E2]">Two-way Playlist Sync</h4>
                <p className="text-xs text-[#9E9094]">
                  {isYtMusicConnected ? 'Sync changes automatically' : 'Connect an account first'}
                </p>
              </div>
            </div>
            <Material3Switch
              checked={twoWayPlaylistSync}
              disabled={!isYtMusicConnected}
              onChange={setTwoWayPlaylistSync}
            />
          </div>
        </div>

        {/* 5. Downloads & Offline Music (Special Burgundy Banner Card) */}
        <div
          onClick={() => alert('Downloads & Offline Music: 0 songs downloaded. Connect Wi-Fi to batch cache.')}
          className="bg-[#45272D] rounded-[28px] p-4 flex items-center justify-between cursor-pointer hover:bg-[#522E35] active:scale-[0.99] transition-all shadow-md"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#FFD9DF] text-[#45272D] flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <Download size={22} className="stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-white truncate">Downloads & Offline Music</h3>
              <p className="text-xs text-[#D5BFC3] mt-0.5 truncate">No offline songs downloaded</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#D5BFC3]" />
        </div>

        {/* 6. Appearance Section */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            Appearance
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-2 divide-y divide-white/[0.04] shadow-sm">
            {/* AMOLED Mode */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Moon size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">AMOLED Mode</h4>
                  <p className="text-xs text-[#9E9094]">Pure black background</p>
                </div>
              </div>
              <Material3Switch checked={amoledMode} onChange={setAmoledMode} />
            </div>

            {/* Dynamic Color */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Palette size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Dynamic Color</h4>
                  <p className="text-xs text-[#9E9094]">Use your wallpaper's colors</p>
                </div>
              </div>
              <Material3Switch checked={dynamicColor} onChange={setDynamicColor} />
            </div>

            {/* Dynamic Now Playing */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Disc3 size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Dynamic Now Playing</h4>
                  <p className="text-xs text-[#9E9094]">Match player artwork</p>
                </div>
              </div>
              <Material3Switch checked={dynamicNowPlaying} onChange={setDynamicNowPlaying} />
            </div>

            {/* Use Application Font */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Type size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Use Application Font</h4>
                  <p className="text-xs text-[#9E9094]">A custom look across the whole app</p>
                </div>
              </div>
              <Material3Switch checked={useAppFont} onChange={setUseAppFont} />
            </div>

            {/* Home sections */}
            <div
              onClick={() => alert('All 15 discovery sections are currently active.')}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Home sections</h4>
                  <p className="text-xs text-[#9E9094]">15 of 15 sections visible</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>
          </div>
        </div>

        {/* 7. Accent Grid (8 Color Swatches) */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            Accent
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-4 shadow-sm">
            <div className="grid grid-cols-4 gap-3">
              {accentSwatches.map((swatch) => {
                const isSelected = accentTheme === swatch.id;
                return (
                  <div
                    key={swatch.id}
                    onClick={() => setAccentTheme(swatch.id)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      className={`relative w-full aspect-square rounded-[22px] overflow-hidden p-1.5 transition-all duration-200 ${
                        isSelected
                          ? 'ring-2 ring-[#E2A9B0] ring-offset-2 ring-offset-[#211B1E] scale-105 shadow-md'
                          : 'opacity-80 group-hover:opacity-100 group-hover:scale-102'
                      }`}
                    >
                      {swatch.id === 'custom' ? (
                        <div className="w-full h-full rounded-[16px] bg-[conic-gradient(at_center,#FF595E,#FFCA3A,#8AC926,#1982C4,#6A4C93,#FF595E)] flex items-center justify-center">
                          <Palette size={20} className="text-white drop-shadow-md" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-[16px] overflow-hidden grid grid-cols-2 grid-rows-2">
                          <div style={{ backgroundColor: swatch.colors[0] }} />
                          <div style={{ backgroundColor: swatch.colors[1] }} />
                          <div style={{ backgroundColor: swatch.colors[2] }} />
                          <div style={{ backgroundColor: swatch.colors[3] }} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-[#EDE0E2] font-medium mt-1.5 text-center">
                      {swatch.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 8. Experimental Section */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            Experimental
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-2 divide-y divide-white/[0.04] shadow-sm">
            {/* Liquid Glass */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Droplets size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Liquid Glass</h4>
                  <p className="text-xs text-[#9E9094]">iOS-style translucent materials across the app</p>
                </div>
              </div>
              <Material3Switch checked={liquidGlass} onChange={setLiquidGlass} />
            </div>

            {/* Lyrics Animation */}
            <div
              onClick={() => alert('Lyrics Animation style: New UI (Modern)')}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Lyrics Animation</h4>
                  <p className="text-xs text-[#9E9094]">{lyricsAnimation}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>

            {/* Equalizer */}
            <div
              onClick={() => setEqOpen(true)}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Sliders size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Equalizer</h4>
                  <p className="text-xs text-[#9E9094]">Shape your sound across 15 frequencies</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>

            {/* Wavy Seekbar */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Waves size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Wavy Seekbar</h4>
                  <p className="text-xs text-[#9E9094]">Multi-layer fluid wavy progress slider</p>
                </div>
              </div>
              <Material3Switch checked={wavySeekbar} onChange={setWavySeekbar} />
            </div>

            {/* Studio Master Clarity */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Studio Master Clarity</h4>
                  <p className="text-xs text-[#9E9094]">
                    Crystal-clear open sound • airy detail • deep clean separation
                  </p>
                </div>
              </div>
              <Material3Switch checked={studioClarity} onChange={setStudioClarity} />
            </div>
          </div>
        </div>

        {/* 9. Audio & Streaming Section */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            Audio & Streaming
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-2 divide-y divide-white/[0.04] shadow-sm">
            {/* Streaming Quality */}
            <div
              onClick={() => {
                setQualityTargetType('streaming');
                setIsQualityModalOpen(true);
              }}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Streaming Quality</h4>
                  <p className="text-xs text-[#9E9094] truncate">{qualityLabels[preferredQuality]}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094] flex-shrink-0" />
            </div>

            {/* Download Quality */}
            <div
              onClick={() => {
                setQualityTargetType('download');
                setIsQualityModalOpen(true);
              }}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <CloudDownload size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Download Quality</h4>
                  <p className="text-xs text-[#9E9094] truncate">
                    Max (24-bit / 192 kHz FLAC) • Lossless & YouTube
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094] flex-shrink-0" />
            </div>

            {/* Bit-Perfect Mode */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">
                    Bit-Perfect Mode (Direct Passthrough)
                  </h4>
                  <p className="text-xs text-[#9E9094]">
                    Bypass DSP and request supported bit-perfect USB output
                  </p>
                </div>
              </div>
              <Material3Switch
                checked={dsp.bypassAll}
                onChange={(checked) => setDspSetting('bypassAll', checked)}
              />
            </div>

            {/* Crossfade */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <GitCommit size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Crossfade</h4>
                  <p className="text-xs text-[#9E9094]">Blend the end of a track into the next one</p>
                </div>
              </div>
              <Material3Switch checked={crossfade} onChange={setCrossfade} />
            </div>

            {/* Download Synced Lyrics */}
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Download Synced Lyrics</h4>
                  <p className="text-xs text-[#9E9094]">
                    Save .lrc companion files & embed lyrics in downloads
                  </p>
                </div>
              </div>
              <Material3Switch
                checked={downloadSyncedLyrics}
                onChange={setDownloadSyncedLyrics}
              />
            </div>

            {/* Background Playback */}
            <div
              onClick={() => alert('Background playback is active with lockscreen media controls.')}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">
                    Background Playback (Battery Optimization)
                  </h4>
                  <p className="text-xs text-[#9E9094]">
                    Restricted • Tap to exempt from Samsung Device Care / sleeping apps
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>

            {/* Custom clashflac Lossless Server config row */}
            <div
              onClick={() => setIsClashflacModalOpen(true)}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Server size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">clashflac Audio Server</h4>
                  <p className="text-xs text-[#9E9094]">
                    {clashflacUrl ? clashflacUrl : 'Using built-in curated audiophile catalog'}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>
          </div>
        </div>

        {/* 10. Library & Playlist Imports */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            Library & Playlist Imports
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-2 shadow-sm">
            <div
              onClick={() => alert('Select a CSV, TSV, M3U/M3U8, or TXT file to import tracks.')}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Download size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Import Playlist from File</h4>
                  <p className="text-xs text-[#9E9094]">
                    CSV, TSV, M3U/M3U8, or TXT • uncertain tracks are skipped
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>
          </div>
        </div>

        {/* 11. Scrobbler Section */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            Scrobbler
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-4 space-y-4 shadow-sm">
            {/* Scrobble Music */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Scrobble Music</h4>
                  <p className="text-xs text-[#9E9094]">Detect and submit plays from other apps</p>
                </div>
              </div>
              <Material3Switch checked={scrobbleMusic} onChange={setScrobbleMusic} />
            </div>

            {/* Choose apps */}
            <div
              onClick={() => alert('All media players monitored.')}
              className="flex items-center justify-between pt-2 border-t border-white/[0.04] cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Grid size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Choose apps</h4>
                  <p className="text-xs text-[#9E9094]">None selected yet</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>

            {/* Submit Now Playing */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Submit Now Playing</h4>
                  <p className="text-xs text-[#9E9094]">
                    Show what's playing on your profile instantly
                  </p>
                </div>
              </div>
              <Material3Switch checked={submitNowPlaying} onChange={setSubmitNowPlaying} />
            </div>

            {/* Scrobble after */}
            <div className="pt-2 border-t border-white/[0.04] space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Scrobble after</h4>
                  <p className="text-xs text-[#9E9094]">
                    {scrobblePercent}% played (capped at 4 min)
                  </p>
                </div>
              </div>

              {/* Dot Track Slider: 10 discrete dot ticks with vertical rounded thumb bar */}
              <div className="px-3 pt-2 pb-1">
                <div className="relative flex items-center justify-between h-8">
                  {/* Background Track Line */}
                  <div className="absolute left-2 right-2 h-1 bg-[#3C3639] rounded-full pointer-events-none" />

                  {/* 10 Dots */}
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => {
                    const isPassed = val <= scrobblePercent;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setScrobblePercent(val)}
                        className={`relative z-10 w-2.5 h-2.5 rounded-full transition-all focus:outline-none ${
                          isPassed ? 'bg-[#E2A9B0]' : 'bg-[#5A5256]'
                        }`}
                        title={`${val}%`}
                      />
                    );
                  })}

                  {/* Active Thumb Bar Indicator */}
                  <div
                    className="absolute z-20 w-4 h-7 rounded-full bg-[#E2A9B0] text-[#4A2027] font-bold shadow-md pointer-events-none -ml-2 flex items-center justify-center transition-all duration-150"
                    style={{
                      left: `calc(${((scrobblePercent - 10) / 90) * 100}% + ${
                        8 - (((scrobblePercent - 10) / 90) * 16)
                      }px)`,
                    }}
                  >
                    <div className="w-1 h-3 rounded-full bg-[#4A2027]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 12. Data Management */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            Data Management
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-2 divide-y divide-white/[0.04] shadow-sm">
            {/* Excluded Songs */}
            <div
              onClick={() => alert('0 songs excluded from shuffle and recommendations.')}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Excluded Songs</h4>
                  <p className="text-xs text-[#9E9094]">0 songs excluded</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>

            {/* Clear All Saved Data */}
            <div
              onClick={() => setIsClearDataModalOpen(true)}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-rose-950/40 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-rose-300">Clear All Saved Data</h4>
                  <p className="text-xs text-[#9E9094]">Wipes all local data</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>
          </div>
        </div>

        {/* 13. Backup & Restore */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            Backup & Restore
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-2 divide-y divide-white/[0.04] shadow-sm">
            <div
              onClick={handleExportBackup}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <CloudUpload size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Backup</h4>
                  <p className="text-xs text-[#9E9094]">Save all your data to a file</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <CloudDownload size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Restore</h4>
                  <p className="text-xs text-[#9E9094]">Load a backup or playlist JSON</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportRestore}
            className="hidden"
          />
        </div>

        {/* 14. About Section */}
        <div>
          <h3 className="text-xs font-bold text-[#E5B6BD] px-4 pb-2 uppercase tracking-wider">
            About & Setup
          </h3>
          <div className="bg-[#211B1E] rounded-[28px] p-2 divide-y divide-white/[0.04] shadow-sm">
            <div
              onClick={() => {
                if (onOpenOnboarding) {
                  onOpenOnboarding();
                } else {
                  setHasCompletedOnboarding(false);
                }
              }}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Welcome Tour & Setup Guide</h4>
                  <p className="text-xs text-[#9E9094]">Replay onboarding walkthrough anytime</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>

            <a
              href="https://t.me/clashprojects"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Send size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Updates & Support</h4>
                  <p className="text-xs text-[#9E9094]">Join @clashprojects on Telegram</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </a>

            <a
              href="https://t.me/MaterialYouApp"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">More From Us</h4>
                  <p className="text-xs text-[#9E9094]">Join @MaterialYouApp on Telegram</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </a>

            <div
              onClick={() => {
                const diag = {
                  userAgent: navigator.userAgent,
                  screen: `${window.innerWidth}x${window.innerHeight}`,
                  audioContext: 'WebAudio active',
                  sampleRate: 48000,
                  quality: preferredQuality,
                };
                navigator.clipboard.writeText(JSON.stringify(diag, null, 2));
                alert('Diagnostics copied to clipboard!');
              }}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                  <Code2 size={20} />
                </div>
                <div>
                  <h4 className="text-[15px] font-medium text-[#EDE0E2]">Export diagnostics</h4>
                  <p className="text-xs text-[#9E9094]">Share logs for troubleshooting</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#9E9094]" />
            </div>
          </div>
        </div>

        {/* 15. Brand Hero Card */}
        <div className="bg-[#211B1E] rounded-[32px] py-9 px-6 flex flex-col items-center justify-center text-center shadow-sm mt-4">
          {/* Equalizer Logo - 4 vertical bars inside lime circle */}
          <div className="w-20 h-20 bg-[#C6F100] rounded-full flex items-center justify-center gap-1.5 px-4 shadow-lg">
            <span className="w-2 h-7 bg-[#120E11] rounded-full" />
            <span className="w-2 h-11 bg-[#120E11] rounded-full" />
            <span className="w-2 h-11 bg-[#120E11] rounded-full" />
            <span className="w-2 h-7 bg-[#120E11] rounded-full" />
          </div>

          <h2 className="text-3xl font-bold text-[#EDE0E2] tracking-tight mt-4">
            Kaira Music
          </h2>

          <div className="mt-2.5 px-5 py-1.5 rounded-full bg-[#543339] text-[#E8B8B8] text-sm font-semibold">
            Version 4.1.0
          </div>

          <p className="mt-3 text-sm text-[#9E9094]">
            Built with the Last.fm API
          </p>
        </div>

        {/* 16. Bottom Navigation Card */}
        <div className="bg-[#211B1E] rounded-[28px] p-2 divide-y divide-white/[0.04] shadow-sm mt-3">
          {/* Row 1: Check for Updates */}
          <div
            onClick={() => alert('Kaira Music is up to date (v4.1.0).')}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                <CloudDownload size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-medium text-[#EDE0E2]">Check for Updates</h4>
                <p className="text-xs text-[#9E9094]">Current version: 4.1.0</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#9E9094]" />
          </div>

          {/* Row 2: Source Code */}
          <a
            href="https://github.com/Clash-Projects/LastWave-native"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center flex-shrink-0">
                <Code2 size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-medium text-[#EDE0E2]">Source Code</h4>
                <p className="text-xs text-[#9E9094]">github.com/Clash-Projects/LastWave-native</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#9E9094]" />
          </a>
        </div>
      </div>

      {/* --- Quality Selector Sheet Modal --- */}
      {isQualityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#231E22] rounded-t-[32px] sm:rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {qualityTargetType === 'streaming' ? 'Streaming Quality' : 'Download Quality'}
              </h3>
              <button
                onClick={() => setIsQualityModalOpen(false)}
                className="p-1.5 rounded-full text-[#9E9094] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {(['HI_RES_192', 'HI_RES_96', 'LOSSLESS_CD', 'HIGH_320'] as AudioQuality[]).map(
                (q) => {
                  const current =
                    qualityTargetType === 'streaming' ? preferredQuality : downloadQuality;
                  const isSelected = current === q;
                  return (
                    <div
                      key={q}
                      onClick={() => {
                        if (qualityTargetType === 'streaming') {
                          setPreferredQuality(q);
                        } else {
                          setDownloadQuality(q);
                        }
                        setIsQualityModalOpen(false);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#E2A9B0] bg-[#E2A9B0]/10 text-[#E2A9B0]'
                          : 'border-white/5 bg-white/[0.02] text-[#EDE0E2] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="text-sm font-semibold">{qualityLabels[q]}</h4>
                      </div>
                      {isSelected && <CheckCircle2 size={18} className="flex-shrink-0" />}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- clashflac Audio Server Modal --- */}
      {isClashflacModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#231E22] rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server size={20} className="text-[#E2A9B0]" />
                clashflac Audio Server
              </h3>
              <button
                onClick={() => setIsClashflacModalOpen(false)}
                className="p-1.5 rounded-full text-[#9E9094] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-[#9E9094] leading-relaxed">
              Connect to your personal or hosted clashflac server for infinite lossless FLAC searches and bit-perfect streaming.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#9E9094] mb-1">
                  Server Endpoint URL
                </label>
                <input
                  type="url"
                  value={tempClashflacUrl}
                  onChange={(e) => setTempClashflacUrl(e.target.value)}
                  placeholder="e.g. http://localhost:8000 or https://clash.domain.com"
                  className="w-full bg-[#181316] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2A9B0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9E9094] mb-1">
                  API Token / Secret (Optional)
                </label>
                <input
                  type="password"
                  value={tempClashflacKey}
                  onChange={(e) => setTempClashflacKey(e.target.value)}
                  placeholder="Optional authorization token"
                  className="w-full bg-[#181316] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2A9B0]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTestClashflac}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/15"
              >
                Test Connection
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsClashflacModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#9E9094] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveClashflac}
                  className="px-4 py-2 rounded-xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform"
                >
                  Save
                </button>
              </div>
            </div>

            {clashflacTestResult.tested && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  clashflacTestResult.success
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}
              >
                {clashflacTestResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{clashflacTestResult.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Last.fm 3-Tab Linking Modal --- */}
      {isLastFmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#231E22] rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key size={20} className="text-[#E2A9B0]" />
                Link Last.fm Account
              </h3>
              <button
                onClick={() => setIsLastFmModalOpen(false)}
                className="p-1.5 rounded-full text-[#9E9094] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 3 Tabs Header */}
            <div className="grid grid-cols-3 gap-1 bg-[#181316] p-1 rounded-2xl border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => setLastFmTab('web')}
                className={`py-2 rounded-xl font-medium transition-all ${
                  lastFmTab === 'web'
                    ? 'bg-[#E2A9B0] text-[#4A2027] font-semibold shadow-sm'
                    : 'text-[#9E9094] hover:text-white'
                }`}
              >
                Web Auth
              </button>
              <button
                type="button"
                onClick={() => setLastFmTab('mobile')}
                className={`py-2 rounded-xl font-medium transition-all ${
                  lastFmTab === 'mobile'
                    ? 'bg-[#E2A9B0] text-[#4A2027] font-semibold shadow-sm'
                    : 'text-[#9E9094] hover:text-white'
                }`}
              >
                Quick Login
              </button>
              <button
                type="button"
                onClick={() => setLastFmTab('byok')}
                className={`py-2 rounded-xl font-medium transition-all ${
                  lastFmTab === 'byok'
                    ? 'bg-[#E2A9B0] text-[#4A2027] font-semibold shadow-sm'
                    : 'text-[#9E9094] hover:text-white'
                }`}
              >
                BYOK Keys
              </button>
            </div>

            {/* Tab 1: Web Auth */}
            {lastFmTab === 'web' && (
              <div className="space-y-4 pt-1">
                <p className="text-xs text-[#EDE0E2]/80 leading-relaxed">
                  Authorize Kaira Music securely on the official Last.fm website. You will be redirected to grant scrobbling permissions and automatically returned.
                </p>

                <div className="p-3.5 rounded-2xl bg-[#181316] border border-white/5 space-y-1.5 text-xs text-[#9E9094]">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Official OAuth 2.0 Flow</span>
                  </div>
                  <p>No passwords stored on device. Supports 2FA and all Last.fm Pro account tiers.</p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsLastFmModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs text-[#9E9094] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = lastFmApi.getAuthUrl();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
                  >
                    Authorize on Last.fm →
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Mobile Quick Login */}
            {lastFmTab === 'mobile' && (
              <form onSubmit={handleMobileAuth} className="space-y-3 pt-1">
                <p className="text-xs text-[#EDE0E2]/80 leading-relaxed">
                  Sign in directly with your Last.fm credentials. Kaira Music obtains a persistent scrobbling session and discards your password immediately.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#9E9094] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={mobileUsername}
                    onChange={(e) => setMobileUsername(e.target.value)}
                    placeholder="e.g. i4mkrs"
                    required
                    className="w-full bg-[#181316] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2A9B0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9E9094] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={mobilePassword}
                    onChange={(e) => setMobilePassword(e.target.value)}
                    placeholder="Last.fm account password"
                    required
                    className="w-full bg-[#181316] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2A9B0]"
                  />
                </div>

                {mobileError && (
                  <div className="p-3 rounded-xl text-xs flex items-center gap-2 bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{mobileError}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsLastFmModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs text-[#9E9094] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mobileLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {mobileLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: BYOK (Manual API Keys) */}
            {lastFmTab === 'byok' && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-[#EDE0E2]/80 leading-relaxed">
                  Bring Your Own Key: configure custom Last.fm API keys or session keys for developer testing and proxy setups.
                </p>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#9E9094] mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      placeholder="e.g. i4mkrs"
                      className="w-full bg-[#181316] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#E2A9B0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9E9094] mb-1">
                      API Key (Optional — default provided)
                    </label>
                    <input
                      type="text"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="Default Kaira Music key used if blank"
                      className="w-full bg-[#181316] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#E2A9B0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9E9094] mb-1">
                      Shared Secret (Optional — default provided)
                    </label>
                    <input
                      type="password"
                      value={tempSecret}
                      onChange={(e) => setTempSecret(e.target.value)}
                      placeholder="Default secret used if blank"
                      className="w-full bg-[#181316] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#E2A9B0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9E9094] mb-1">
                      Session Key
                    </label>
                    <input
                      type="password"
                      value={tempSessionKey}
                      onChange={(e) => setTempSessionKey(e.target.value)}
                      placeholder="Pre-existing session key"
                      className="w-full bg-[#181316] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#E2A9B0]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLastFmModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#9E9094] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveLastFm}
                    className="px-5 py-2.5 rounded-xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform"
                  >
                    Save Credentials
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Clear All Data Warning Modal --- */}
      {isClearDataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#231E22] rounded-[32px] p-6 border border-rose-500/20 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 size={26} />
            </div>
            <h3 className="text-lg font-bold text-white">Clear All Saved Data?</h3>
            <p className="text-xs text-[#9E9094] leading-relaxed">
              This will permanently delete your offline tracks, liked songs, custom playlists, and local preferences.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsClearDataModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9E9094] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
              >
                Wipe Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- YouTube Music Linking Modal --- */}
      {isYtMusicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#231E22] rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF0000]/15 text-[#FF0000] flex items-center justify-center">
                  <Youtube size={22} className="fill-[#FF0000]/20" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">YouTube Music Account</h3>
                  <p className="text-xs text-[#9E9094]">
                    InnerTube SAPISIDHASH Lossless Sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsYtMusicModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#EDE0E2] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Segmented Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#181316] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setYtMusicTab('cookies');
                  setYtError('');
                  setYtSuccess('');
                }}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  ytMusicTab === 'cookies'
                    ? 'bg-[#E2A9B0] text-[#4A2027] shadow-sm'
                    : 'text-[#EDE0E2]/70 hover:text-white'
                }`}
              >
                Session Cookies
              </button>
              <button
                type="button"
                onClick={() => {
                  setYtMusicTab('demo');
                  setYtError('');
                  setYtSuccess('');
                }}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  ytMusicTab === 'demo'
                    ? 'bg-[#E2A9B0] text-[#4A2027] shadow-sm'
                    : 'text-[#EDE0E2]/70 hover:text-white'
                }`}
              >
                Instant Demo
              </button>
              <button
                type="button"
                disabled={!isYtMusicConnected}
                onClick={() => {
                  setYtMusicTab('account');
                  setYtError('');
                  setYtSuccess('');
                }}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  !isYtMusicConnected
                    ? 'text-white/20 cursor-not-allowed'
                    : ytMusicTab === 'account'
                    ? 'bg-[#E2A9B0] text-[#4A2027] shadow-sm'
                    : 'text-[#EDE0E2]/70 hover:text-white'
                }`}
              >
                Account & Sync
              </button>
            </div>

            {/* Error / Success Banners */}
            {ytError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{ytError}</span>
              </div>
            )}
            {ytSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>{ytSuccess}</span>
              </div>
            )}

            {/* Tab 1: Session Cookies */}
            {ytMusicTab === 'cookies' && (
              <div className="space-y-3.5 pt-1">
                <div className="bg-[#181316] p-3.5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#E2A9B0]">
                    <ShieldCheck size={16} />
                    <span>How to link YouTube Music</span>
                  </div>
                  <ol className="text-xs text-[#9E9094] space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Sign in to <span className="text-white font-medium">music.youtube.com</span> in your browser.</li>
                    <li>Open Developer Tools (F12) &rarr; choose <span className="text-white font-medium">Network</span> tab.</li>
                    <li>Play any track or refresh, click any request to <span className="text-white font-medium">music.youtube.com</span>.</li>
                    <li>Under <span className="text-white font-medium">Request Headers</span>, copy the entire <span className="text-white font-medium">cookie</span> value and paste below.</li>
                  </ol>
                  <p className="text-[11px] text-[#9E9094]/80">
                    Kaira Music computes the RFC 3174 SHA-1 <span className="text-[#EDE0E2]">SAPISIDHASH</span> token locally in memory. Your cookies remain private on this device.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9E9094] mb-1.5">
                    Session Cookie Header
                  </label>
                  <textarea
                    rows={4}
                    value={ytCookieInput}
                    onChange={(e) => setYtCookieInput(e.target.value)}
                    placeholder="__Secure-3PAPISID=...; SAPISID=...; LOGIN_INFO=..."
                    className="w-full bg-[#181316] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E2A9B0] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsYtMusicModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#9E9094] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={ytConnecting}
                    onClick={handleConnectWithCookies}
                    className="px-5 py-2.5 rounded-xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {ytConnecting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      'Connect with Cookies'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Instant Demo */}
            {ytMusicTab === 'demo' && (
              <div className="space-y-4 pt-1">
                <div className="bg-[#181316] p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6"
                      alt="Demo Avatar"
                      className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Alex Rivera</h4>
                      <p className="text-xs text-[#9E9094]">@alexmusic • Audiophile Collector</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#EDE0E2]/80 leading-relaxed">
                    Instant demo mode connects a pre-authenticated YouTube Music profile loaded with 8 authentic playlists (*Liked Music*, *After Hours Lossless*, *BRAT & Club Classics*, *HIT ME HARD AND SOFT*, etc.) and synced lyrics.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 size={16} />
                    <span>Instant evaluation mode: no cookies required.</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsYtMusicModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#9E9094] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={ytConnecting}
                    onClick={handleConnectDemo}
                    className="px-5 py-2.5 rounded-xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 flex items-center gap-2"
                  >
                    {ytConnecting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect Demo Profile'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Account & Sync Overview */}
            {ytMusicTab === 'account' && isYtMusicConnected && (
              <div className="space-y-4 pt-1">
                <div className="bg-[#181316] p-4 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {ytMusicPhotoUrl ? (
                        <img
                          src={ytMusicPhotoUrl}
                          alt={ytMusicAccountName || 'Account'}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[#FF0000]/20 text-[#FF0000] flex items-center justify-center">
                          <Youtube size={24} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-white">{ytMusicAccountName || 'YouTube Music User'}</h4>
                        <p className="text-xs text-[#9E9094]">{ytMusicChannelHandle || '@ytmusic'}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9E9094]">Auth Protocol</span>
                      <span className="text-white font-medium">SAPISIDHASH (RFC 3174 SHA-1)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9E9094]">Two-Way Playlist Sync</span>
                      <span className={twoWayPlaylistSync ? 'text-emerald-400 font-medium' : 'text-[#9E9094]'}>
                        {twoWayPlaylistSync ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9E9094]">Playlists Available</span>
                      <span className="text-white font-medium">{ytMusicPlaylistsCount || 6} playlists</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={ytSyncing}
                    onClick={handleSyncYtMusicNow}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} className={ytSyncing ? 'animate-spin' : ''} />
                    {ytSyncing ? 'Synchronizing Playlists...' : 'Sync Playlists Now'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDisconnectYtMusic}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
