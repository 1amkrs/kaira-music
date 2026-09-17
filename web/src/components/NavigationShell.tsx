import React, { useState } from 'react';
import { Home, ListMusic, BarChart2, Search, Settings, Disc3, ShieldCheck, Sparkles } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { AiMixGeneratorModal } from './AiMixGeneratorModal';

export type NavTab = 'feed' | 'stats' | 'library' | 'search' | 'settings';

interface NavigationShellProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  hideBottomNav?: boolean;
  onOpenPlaylist?: (id: string) => void;
  children: React.ReactNode;
}

export const NavigationShell: React.FC<NavigationShellProps> = ({
  activeTab,
  onTabChange,
  hideBottomNav = false,
  onOpenPlaylist,
  children,
}) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const dsp = useSettingsStore((s) => s.dsp);

  const desktopNavItems = [
    { id: 'feed' as NavTab, label: 'Feed', icon: Home },
    { id: 'stats' as NavTab, label: 'Stats', icon: BarChart2 },
    { id: 'library' as NavTab, label: 'Library', icon: ListMusic },
    { id: 'search' as NavTab, label: 'Search', icon: Search },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#120E11] text-[#EDE0E2] font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.06] bg-[#181316] p-5 z-20 select-none">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#C6F100] flex items-center justify-center gap-0.5 px-2 shadow-glow-lime">
            <span className="w-1 h-3 bg-[#080C12] rounded-full" />
            <span className="w-1 h-5 bg-[#080C12] rounded-full" />
            <span className="w-1 h-6 bg-[#080C12] rounded-full" />
            <span className="w-1 h-4 bg-[#080C12] rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-black font-sequel tracking-tight text-white">Kaira Music</h1>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-[#9E9094]">
              Lossless Web Audio
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#3B4657] text-white font-semibold shadow-md'
                    : 'text-[#9E9094] hover:text-[#EDE0E2] hover:bg-white/5'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-[#9E9094] group-hover:text-[#EDE0E2]'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C6F100] shadow-glow-lime animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Audiophile Status Badge */}
        <div className="mt-auto p-3.5 rounded-2xl border border-white/[0.06] bg-[#211B1E]/60 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1.5">
            <Disc3 size={16} className={dsp.bypassAll ? 'text-emerald-400 animate-spin-slow' : 'text-[#C6F100]'} />
            <span className="text-xs font-semibold text-slate-200">
              {dsp.bypassAll ? 'Bit-Perfect Direct' : 'Web Audio DSP'}
            </span>
          </div>
          <p className="text-[11px] text-[#9E9094] leading-relaxed">
            {dsp.bypassAll
              ? 'DSP bypassed. Direct bitstream output.'
              : `${dsp.eqEnabled ? '15-Band EQ' : ''}${dsp.crossfeedEnabled ? ' • Bauer Crossfeed' : ''}${dsp.limiterEnabled ? ' • Limiter' : ''}`}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-brand-cyan/80 font-semibold">
            <ShieldCheck size={12} />
            <span>Lossless Engine 4.1</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-36 md:pb-28">
          {children}
        </div>
      </main>

      {/* Mobile Floating Pill Bottom Navigation & Companion AI Sparkles FAB */}
      {!hideBottomNav && (
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-40 px-4 flex items-center justify-center gap-3 pointer-events-none">
          <nav className="pointer-events-auto bg-[#211B1E]/95 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-1.5 flex items-center gap-1.5 shadow-2xl">
            {/* Feed Tab */}
            {activeTab === 'feed' ? (
              <button
                onClick={() => onTabChange('feed')}
                className="bg-[#3B4657] text-white px-5 py-2.5 rounded-full flex items-center gap-2.5 font-bold text-sm shadow-md transition-all"
              >
                <Home size={18} className="fill-white stroke-[2.5]" />
                <span>Feed</span>
              </button>
            ) : (
              <button
                onClick={() => onTabChange('feed')}
                className="p-2.5 text-[#8E8088] hover:text-white rounded-full transition-colors active:scale-90"
                title="Feed"
              >
                <Home size={20} />
              </button>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' ? (
              <button
                onClick={() => onTabChange('stats')}
                className="bg-accent-border text-white px-5 py-2.5 rounded-full flex items-center gap-2.5 font-bold text-sm shadow-md transition-all"
              >
                <BarChart2 size={18} className="stroke-[2.5]" />
                <span>Stats</span>
              </button>
            ) : (
              <button
                onClick={() => onTabChange('stats')}
                className="p-2.5 text-[#8E8088] hover:text-white rounded-full transition-colors active:scale-90"
                title="Stats"
              >
                <BarChart2 size={20} />
              </button>
            )}

            {/* Playlists (Library) Tab */}
            {activeTab === 'library' ? (
              <button
                onClick={() => onTabChange('library')}
                className="bg-accent-border text-white px-5 py-2.5 rounded-full flex items-center gap-2.5 font-bold text-sm shadow-md transition-all"
              >
                <ListMusic size={18} className="stroke-[2.5]" />
                <span>Playlists</span>
              </button>
            ) : (
              <button
                onClick={() => onTabChange('library')}
                className="p-2.5 text-[#8E8088] hover:text-white rounded-full transition-colors active:scale-90"
                title="Playlists"
              >
                <ListMusic size={20} />
              </button>
            )}
          </nav>

          {/* Companion Circular AI Generator FAB (Only shown on Playlists tab) */}
          {activeTab === 'library' && (
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="pointer-events-auto w-14 h-14 rounded-full bg-accent-border text-accent flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all flex-shrink-0 border border-white/10 animate-in zoom-in-95 duration-200"
              title="AI Smart Mix Generator"
            >
              <Sparkles size={24} className="fill-accent/20" />
            </button>
          )}
        </div>
      )}

      {/* AI Smart Mix Generator Modal */}
      <AiMixGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onOpenPlaylist={onOpenPlaylist}
      />
    </div>
  );
};
