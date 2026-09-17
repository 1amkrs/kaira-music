import React, { useState, useRef } from 'react';
import {
  Waves,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Youtube,
  Radio,
  Volume2,
  Palette,
  Moon,
  Headphones,
  Disc3,
  CloudUpload,
  ArrowRight,
  Check,
  Zap,
} from 'lucide-react';
import { useSettingsStore, AccentColor } from '../store/useSettingsStore';
import { getAccentSwatches } from '../theme/accentThemes';
import { useLibraryStore } from '../store/useLibraryStore';
import { AudioQuality } from '../audio/types';
import { Material3Switch } from './Material3Switch';
import { ytMusicApi } from '../services/ytMusicApi';
import { lastFmApi } from '../services/lastFmApi';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  // Settings Store hooks
  const setHasCompletedOnboarding = useSettingsStore((s) => s.setHasCompletedOnboarding);
  const preferredQuality = useSettingsStore((s) => s.preferredQuality);
  const setPreferredQuality = useSettingsStore((s) => s.setPreferredQuality);
  const accentTheme = useSettingsStore((s) => s.accentTheme);
  const setAccentTheme = useSettingsStore((s) => s.setAccentTheme);
  const customAccentColor = useSettingsStore((s) => s.customAccentColor);
  const setCustomAccentColor = useSettingsStore((s) => s.setCustomAccentColor);
  const amoledMode = useSettingsStore((s) => s.amoledMode);
  const setAmoledMode = useSettingsStore((s) => s.setAmoledMode);
  const wavySeekbar = useSettingsStore((s) => s.wavySeekbar);
  const setWavySeekbar = useSettingsStore((s) => s.setWavySeekbar);

  // Integrations state
  const isYtMusicConnected = useSettingsStore((s) => s.isYtMusicConnected);
  const ytMusicAccountName = useSettingsStore((s) => s.ytMusicAccountName);
  const ytMusicPhotoUrl = useSettingsStore((s) => s.ytMusicPhotoUrl);
  const setYtMusicConnection = useSettingsStore((s) => s.setYtMusicConnection);

  const isLastFmConnected = useSettingsStore((s) => s.isLastFmConnected);
  const lastFmUsername = useSettingsStore((s) => s.lastFmUsername);
  const setLastFmConfig = useSettingsStore((s) => s.setLastFmConfig);
  const setLastFmProfile = useSettingsStore((s) => s.setLastFmProfile);

  // Library store
  const importYtMusicPlaylists = useLibraryStore((s) => s.importYtMusicPlaylists);

  // Local state for interactive actions
  const [isConnectingYtm, setIsConnectingYtm] = useState(false);
  const [isConnectingLastFm, setIsConnectingLastFm] = useState(false);
  const [restoreFeedback, setRestoreFeedback] = useState<string>('');
  const backupInputRef = useRef<HTMLInputElement>(null);
  const customColorInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFinish = () => {
    setHasCompletedOnboarding(true);
    onClose();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleConnectDemoYtm = async () => {
    setIsConnectingYtm(true);
    try {
      const info = await ytMusicApi.connectDemoAccount();
      setYtMusicConnection({
        accountName: info.accountName,
        channelHandle: info.channelHandle,
        photoUrl: info.photoUrl,
        cookies: 'demo_sapisid_token_lastwave_v4',
        playlistsCount: info.playlistsCount,
      });
      const playlists = await ytMusicApi.fetchPlaylists();
      importYtMusicPlaylists(playlists);
    } catch (e) {
      console.warn('Failed to connect demo YTM account', e);
    } finally {
      setIsConnectingYtm(false);
    }
  };

  const handleConnectDemoLastFm = async () => {
    setIsConnectingLastFm(true);
    try {
      setLastFmConfig({
        username: 'i4mkrs',
        sessionKey: 'demo_lastfm_session_key_audiophile',
      });
      lastFmApi.setCredentials({
        username: 'i4mkrs',
        apiKey: 'demo_key',
        sharedSecret: 'demo_secret',
        sessionKey: 'demo_lastfm_session_key_audiophile',
      });
      setLastFmProfile({
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eba4f31c03bf4788c03e8ff6e6',
        playCount: 14280,
      });
    } finally {
      setIsConnectingLastFm(false);
    }
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        if (parsed.storage) {
          Object.keys(parsed.storage).forEach((key) => {
            localStorage.setItem(key, parsed.storage[key]);
          });
          setRestoreFeedback('Backup restored successfully! Audio settings applied.');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setRestoreFeedback('Invalid backup schema format.');
        }
      } catch {
        setRestoreFeedback('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Swatch data for 8 Accent themes
  const accentSwatches = getAccentSwatches(customAccentColor);

  const qualityTiers: { id: AudioQuality; title: string; desc: string; badge: string }[] = [
    { id: 'HI_RES_192', title: 'Max 192 kHz', desc: 'Up to 24-bit / 192 kHz FLAC master', badge: 'Audiophile' },
    { id: 'HI_RES_96', title: 'Hi-Res 96 kHz', desc: '24-bit / 96 kHz studio master', badge: 'Studio' },
    { id: 'LOSSLESS_CD', title: 'CD Lossless', desc: '16-bit / 44.1 kHz bit-perfect FLAC', badge: 'Hi-Fi' },
    { id: 'HIGH_320', title: 'High 320k', desc: 'Opus 320 kbps efficiency mode', badge: 'Standard' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="max-w-2xl w-full bg-[#1C161A]/95 border border-white/10 rounded-[36px] shadow-2xl p-6 sm:p-8 overflow-hidden relative flex flex-col justify-between max-h-[92vh]">
        
        {/* Ambient background glow matching accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#E2A9B0]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#9A82DB]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between relative z-10 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#34272C] text-[#E2A9B0] flex items-center justify-center shadow-md">
              <Waves size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#E2A9B0] uppercase tracking-wider">Kaira Music</span>
              <p className="text-[11px] text-[#9E9094]">High-Fidelity Audio Experience</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="text-xs font-semibold text-[#9E9094] hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
          >
            Skip to App
          </button>
        </div>

        {/* Dynamic Carousel Body */}
        <div className="py-6 relative z-10 overflow-y-auto flex-1 my-2 pr-1">
          
          {/* STEP 1: Uncompromised Audio */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34272C] text-[#E2A9B0] text-[11px] font-bold tracking-wider">
                  <Sparkles size={13} />
                  <span>LOSSLESS 24-BIT / 192 KHZ</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-sequel text-white tracking-tight leading-tight">
                  Lossless Sound. No Compromise.
                </h1>
                <p className="text-xs sm:text-sm text-[#9E9094] leading-relaxed">
                  Experience studio master fidelity with Web Audio DSP, 15-band equalizer, and Bauer binaural crossfeed.
                </p>
              </div>

              {/* 3 Glass Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="bg-[#261E23]/90 border border-white/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#3A2A31] text-[#E2A9B0] flex items-center justify-center">
                    <Headphones size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white">Max 192 kHz FLAC</h4>
                  <p className="text-[11px] text-[#9E9094] leading-snug">
                    Bit-perfect streaming with zero loss and instant fallback.
                  </p>
                </div>

                <div className="bg-[#261E23]/90 border border-white/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#3A2A31] text-[#E2A9B0] flex items-center justify-center">
                    <Waves size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white">Bauer Crossfeed</h4>
                  <p className="text-[11px] text-[#9E9094] leading-snug">
                    Expansive speaker-like binaural soundstage on headphones.
                  </p>
                </div>

                <div className="bg-[#261E23]/90 border border-white/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#3A2A31] text-[#E2A9B0] flex items-center justify-center">
                    <Disc3 size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white">Kinetic Lyrics</h4>
                  <p className="text-[11px] text-[#9E9094] leading-snug">
                    Word-by-word synced scrolling with Kugou KRC & LRCLIB.
                  </p>
                </div>
              </div>

              {/* Mini 3D Floating Stack of Authentic Albums */}
              <div className="bg-gradient-to-b from-white/[0.03] to-transparent p-5 rounded-3xl border border-white/5 flex items-center justify-center gap-4 sm:gap-6 overflow-hidden">
                {/* Left Album: Olivia Rodrigo - GUTS */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/15 shadow-xl -rotate-6 transform hover:rotate-0 transition-transform flex-shrink-0">
                  <img
                    src="https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d"
                    alt="Olivia Rodrigo - GUTS"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Center Album: Billie Eilish - HIT ME HARD AND SOFT */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/25 shadow-2xl scale-110 z-10 flex-shrink-0">
                  <img
                    src="https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62"
                    alt="Billie Eilish - HIT ME HARD AND SOFT"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Album: Charli xcx - BRAT */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/15 shadow-xl rotate-6 transform hover:rotate-0 transition-transform flex-shrink-0">
                  <img
                    src="https://i.scdn.co/image/ab67616d0000b2738202b8d00977462c16118d09"
                    alt="Charli xcx - BRAT"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Connect Your Universe */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34272C] text-[#E2A9B0] text-[11px] font-bold tracking-wider">
                  <Radio size={13} />
                  <span>SEAMLESS INTEGRATIONS</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-sequel text-white tracking-tight leading-tight">
                  All Your Music, Unified.
                </h1>
                <p className="text-xs sm:text-sm text-[#9E9094] leading-relaxed">
                  Sync your playlists from YouTube Music and scrobble every track in real-time to Last.fm.
                </p>
              </div>

              {/* YouTube Music Integration Card */}
              <div className="bg-[#261E23]/90 border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    {isYtMusicConnected && ytMusicPhotoUrl ? (
                      <img
                        src={ytMusicPhotoUrl}
                        alt="YTM Avatar"
                        className="w-11 h-11 rounded-2xl object-cover border border-white/15"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-[#FF0000]/15 text-[#FF0000] flex items-center justify-center">
                        <Youtube size={22} className="fill-[#FF0000]/20" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {isYtMusicConnected ? ytMusicAccountName : 'YouTube Music'}
                      </h4>
                      <p className="text-xs text-[#9E9094]">
                        {isYtMusicConnected
                          ? 'Synchronized with InnerTube SAPISIDHASH'
                          : 'Two-way playlist synchronization'}
                      </p>
                    </div>
                  </div>

                  {isYtMusicConnected ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Connected
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isConnectingYtm}
                      onClick={handleConnectDemoYtm}
                      className="px-4 py-2 rounded-xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                    >
                      {isConnectingYtm ? 'Connecting...' : 'Connect Demo'}
                    </button>
                  )}
                </div>
              </div>

              {/* Last.fm Integration Card */}
              <div className="bg-[#261E23]/90 border border-white/5 rounded-3xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#D51007]/15 text-[#D51007] flex items-center justify-center">
                      <Radio size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {isLastFmConnected ? `Last.fm (${lastFmUsername})` : 'Last.fm Scrobbler'}
                      </h4>
                      <p className="text-xs text-[#9E9094]">
                        {isLastFmConnected
                          ? 'Scrobbling active & charts synced'
                          : 'Real-time scrobbling & listening statistics'}
                      </p>
                    </div>
                  </div>

                  {isLastFmConnected ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isConnectingLastFm}
                      onClick={handleConnectDemoLastFm}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold active:scale-95 transition-all"
                    >
                      {isConnectingLastFm ? 'Connecting...' : 'Connect Demo'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Personalize Your Atmosphere */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34272C] text-[#E2A9B0] text-[11px] font-bold tracking-wider">
                  <Palette size={13} />
                  <span>CUSTOMIZATION</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-sequel text-white tracking-tight leading-tight">
                  Craft Your Atmosphere.
                </h1>
                <p className="text-xs sm:text-sm text-[#9E9094] leading-relaxed">
                  Choose your default audio quality tier and signature accent theme.
                </p>
              </div>

              {/* Quality Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#E2A9B0] uppercase tracking-wider">
                  Default Quality Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {qualityTiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setPreferredQuality(tier.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        preferredQuality === tier.id
                          ? 'bg-[#E2A9B0]/15 border-[#E2A9B0] text-white shadow-sm'
                          : 'bg-[#261E23]/80 border-white/5 text-[#9E9094] hover:border-white/15'
                      }`}
                    >
                      <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/10 inline-block mb-1 text-[#EDE0E2]">
                        {tier.badge}
                      </div>
                      <h5 className="text-xs font-bold text-white">{tier.title}</h5>
                      <p className="text-[10px] text-[#9E9094] truncate">{tier.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 8-Theme Swatch Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-accent uppercase tracking-wider">
                  Accent Color Theme ({accentTheme})
                </label>
                {/* Hidden native color input */}
                <input
                  ref={customColorInputRef}
                  type="color"
                  value={customAccentColor}
                  onChange={(e) => {
                    setCustomAccentColor(e.target.value);
                    setAccentTheme('custom');
                  }}
                  className="sr-only opacity-0 pointer-events-none absolute"
                  aria-label="Custom accent color picker"
                />
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {accentSwatches.map((swatch) => {
                    const isSelected = accentTheme === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => {
                          setAccentTheme(swatch.id);
                          if (swatch.id === 'custom') {
                            customColorInputRef.current?.click();
                          }
                        }}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-white/10 border-accent shadow-sm scale-105 ring-2 ring-accent'
                            : 'bg-[#261E23]/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {swatch.id === 'custom' ? (
                          <div
                            className="w-8 h-8 rounded-xl overflow-hidden shadow-sm border border-white/10 relative flex items-center justify-center"
                            style={{
                              background:
                                'conic-gradient(from 180deg at 50% 50%, #FF595E 0deg, #FFCA3A 72deg, #8AC926 144deg, #1982C4 216deg, #6A4C93 288deg, #FF595E 360deg)',
                            }}
                          >
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-white/90 shadow flex items-center justify-center"
                              style={{ backgroundColor: customAccentColor }}
                            >
                              <Palette size={8} className="text-white drop-shadow-sm" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl overflow-hidden grid grid-cols-2 grid-rows-2 shadow-sm border border-white/10">
                            <div style={{ backgroundColor: swatch.colors[0] }} />
                            <div style={{ backgroundColor: swatch.colors[1] }} />
                            <div style={{ backgroundColor: swatch.colors[2] }} />
                            <div style={{ backgroundColor: swatch.colors[3] }} />
                          </div>
                        )}
                        <span className="text-[10px] font-semibold text-[#EDE0E2] truncate">{swatch.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Hex Preview Bar */}
                {accentTheme === 'custom' && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: customAccentColor }}
                      />
                      <span className="text-[11px] font-semibold text-[#EDE0E2]">
                        Hex: <span className="text-accent font-bold uppercase">{customAccentColor}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => customColorInputRef.current?.click()}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#EDE0E2] transition-colors"
                    >
                      Choose Color
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Feature Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#261E23]/80 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon size={18} className="text-accent" />
                    <div>
                      <h5 className="text-xs font-bold text-white">AMOLED Mode</h5>
                      <p className="text-[10px] text-[#9E9094]">Pure pitch black canvas</p>
                    </div>
                  </div>
                  <Material3Switch checked={amoledMode} onChange={setAmoledMode} />
                </div>

                <div className="bg-[#261E23]/80 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Waves size={18} className="text-accent" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Wavy Seekbar</h5>
                      <p className="text-[10px] text-[#9E9094]">Animated audio waveform</p>
                    </div>
                  </div>
                  <Material3Switch checked={wavySeekbar} onChange={setWavySeekbar} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Your Wave Begins */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wider border border-emerald-500/20">
                  <CheckCircle2 size={13} />
                  <span>READY FOR AUDIO</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-sequel text-white tracking-tight leading-tight">
                  Your Wave Begins.
                </h1>
                <p className="text-xs sm:text-sm text-[#9E9094] leading-relaxed">
                  Your personalized audio sanctuary is configured and ready. Dive into infinite discovery.
                </p>
              </div>

              {/* Active Configuration Checklist */}
              <div className="bg-[#261E23]/90 border border-white/5 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#EDE0E2]">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>24-bit bit-perfect Web Audio DSP pipeline initialized</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#EDE0E2]">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="capitalize">
                    Dynamic Material 3 Expressive theme active ({accentTheme})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#EDE0E2]">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>Real-time synced lyrics engine armed (LRCLIB + Kugou KRC)</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#EDE0E2]">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>
                    {isYtMusicConnected
                      ? 'YouTube Music linked with 2-way playlist sync'
                      : 'ClashFLAC high-res streaming & offline caching active'}
                  </span>
                </div>
              </div>

              {/* Feedback banner if restored */}
              {restoreFeedback && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  <span>{restoreFeedback}</span>
                </div>
              )}

              {/* Restore from Backup Secondary Action */}
              <div className="flex items-center justify-between px-2 pt-1">
                <input
                  type="file"
                  ref={backupInputRef}
                  onChange={handleRestoreBackup}
                  accept=".json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => backupInputRef.current?.click()}
                  className="text-xs text-[#9E9094] hover:text-white flex items-center gap-2 transition-colors py-1 px-2 rounded-lg hover:bg-white/5"
                >
                  <CloudUpload size={14} />
                  <span>Restore from Backup (JSON)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Controls */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
          {/* Stepper Pagination Pills */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setCurrentStep(step)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === step ? 'w-7 bg-[#E2A9B0]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to step ${step}`}
              />
            ))}
            <span className="text-[11px] text-[#9E9094] ml-2 font-medium">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-2xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-transform"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-7 py-2.5 rounded-2xl bg-[#E2A9B0] text-[#4A2027] text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                <span>Start Listening</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
