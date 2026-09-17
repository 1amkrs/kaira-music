import React from 'react';
import { X, Sliders, RotateCcw, Headphones, Shield, Check } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSettingsStore, EQ_PRESETS } from '../store/useSettingsStore';
import { EQ_BAND_FREQUENCIES } from '../audio/types';

export const EqualizerModal: React.FC = () => {
  const isEqOpen = usePlayerStore((s) => s.isEqOpen);
  const setEqOpen = usePlayerStore((s) => s.setEqOpen);

  const dsp = useSettingsStore((s) => s.dsp);
  const activePresetId = useSettingsStore((s) => s.activePresetId);
  const setDspSetting = useSettingsStore((s) => s.setDspSetting);
  const setEqBandGain = useSettingsStore((s) => s.setEqBandGain);
  const applyPreset = useSettingsStore((s) => s.applyPreset);

  if (!isEqOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl glass-panel p-5 sm:p-7 border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-lime/10 border border-brand-lime/25 text-brand-lime">
              <Sliders size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                15-Band Studio Equalizer
                {dsp.bypassAll && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Bypassed
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Parametric Biquad filter network with Bauer binaural crossfeed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Master Bypass Toggle */}
            <button
              onClick={() => setDspSetting('bypassAll', !dsp.bypassAll)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                dsp.bypassAll
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {dsp.bypassAll ? 'DSP Bypassed' : 'Bypass All'}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setEqOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Acoustic Presets
            </span>
            <button
              onClick={() => applyPreset('flat')}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-brand-lime transition-colors font-medium"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {EQ_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-brand-lime text-brand-dark border-brand-lime font-bold shadow-glow-lime'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {isSelected && <Check size={13} className="stroke-[3]" />}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 15-Band Slider Array */}
        <div className="py-6 flex-1 overflow-x-auto flex flex-col justify-center min-h-[220px]">
          <div className="flex items-end justify-between gap-2 sm:gap-4 min-w-[700px] px-2 h-full">
            {EQ_BAND_FREQUENCIES.map((band, idx) => {
              const gain = dsp.eqGains[idx] || 0;
              return (
                <div key={band.frequency} className="flex flex-col items-center flex-1 h-full">
                  {/* Gain Value in dB */}
                  <span
                    className={`text-[10px] font-sans tabular-nums mb-2 ${
                      gain > 0
                        ? 'text-brand-lime font-semibold'
                        : gain < 0
                        ? 'text-brand-cyan font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {gain > 0 ? `+${gain.toFixed(1)}` : gain.toFixed(1)}
                  </span>

                  {/* Vertical Slider Track */}
                  <div className="relative flex-1 flex items-center justify-center py-2">
                    {/* Zero dB Center Reference Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 pointer-events-none" />

                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.5"
                      disabled={dsp.bypassAll}
                      value={gain}
                      onChange={(e) => setEqBandGain(idx, parseFloat(e.target.value))}
                      className="slider-vertical"
                    />
                  </div>

                  {/* Frequency Label */}
                  <span className="text-[10px] sm:text-xs font-sans tabular-nums text-slate-400 mt-2 font-medium">
                    {band.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DSP Enhancements Panel (Preamp, Bauer Crossfeed, Peak Limiter) */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
          {/* Preamp */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">Preamp Gain</span>
              <span className="font-sans tabular-nums font-semibold text-brand-lime">{dsp.preampGainDb > 0 ? `+${dsp.preampGainDb} dB` : `${dsp.preampGainDb} dB`}</span>
            </div>
            <input
              type="range"
              min="-12"
              max="6"
              step="0.5"
              disabled={dsp.bypassAll}
              value={dsp.preampGainDb}
              onChange={(e) => setDspSetting('preampGainDb', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Bauer Binaural Crossfeed */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5">
                <Headphones size={14} className="text-brand-cyan" />
                <span className="font-semibold text-slate-200">Bauer Crossfeed</span>
              </div>
              <button
                onClick={() => setDspSetting('crossfeedEnabled', !dsp.crossfeedEnabled)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  dsp.crossfeedEnabled ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40' : 'bg-white/10 text-slate-400'
                }`}
              >
                {dsp.crossfeedEnabled ? 'Active' : 'Off'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={!dsp.crossfeedEnabled || dsp.bypassAll}
              value={dsp.crossfeedLevel}
              onChange={(e) => setDspSetting('crossfeedLevel', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Peak Limiter */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={18} className={dsp.limiterEnabled ? 'text-brand-lime' : 'text-slate-500'} />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Peak Limiter</span>
                <span className="text-[10px] text-slate-400">Anti-clipping protection</span>
              </div>
            </div>
            <button
              onClick={() => setDspSetting('limiterEnabled', !dsp.limiterEnabled)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                dsp.limiterEnabled
                  ? 'bg-brand-lime/15 border-brand-lime/40 text-brand-lime'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              {dsp.limiterEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
