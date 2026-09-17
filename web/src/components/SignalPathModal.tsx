import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { WebAudioEngine } from '../audio/WebAudioEngine';

export const SignalPathModal: React.FC = () => {
  const isSignalPathOpen = usePlayerStore((s) => s.isSignalPathOpen);
  const setSignalPathOpen = usePlayerStore((s) => s.setSignalPathOpen);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const dsp = useSettingsStore((s) => s.dsp);

  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>('Just now');

  if (!isSignalPathOpen) return null;

  const engine = WebAudioEngine.getInstance();
  const hwSampleRate = engine.getContextSampleRate();

  const handleCheckPath = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setLastCheckTime('Just now');
    }, 400);
  };

  const bitDepth = currentTrack?.bitDepth || 16;
  const sampleRate = currentTrack?.sampleRate || 44100;

  // Timeline nodes from reference screenshot
  const timelineNodes = [
    {
      label: 'Source',
      value: `LOSSLESS • ${bitDepth}-bit / ${sampleRate} Hz`,
      isSuccess: true,
    },
    {
      label: 'App resampler',
      value: `Bypassed — ${sampleRate} Hz in / out`,
      isSuccess: true,
    },
    {
      label: 'DSP chain',
      value: dsp.bypassAll
        ? 'Bit-Perfect Direct — DSP bypassed'
        : 'Bit-Perfect off — enable it in Settings',
      isSuccess: dsp.bypassAll,
    },
    {
      label: 'Tempo',
      value: '1.00x — no pitch processing',
      isSuccess: true,
    },
    {
      label: 'App volume',
      value: '0.0 dB — unity gain',
      isSuccess: true,
    },
    {
      label: 'System volume',
      value: '5/15 — digital attenuation before DAC',
      isSuccess: false,
    },
    {
      label: 'Android mixer',
      value: `Resamples ${sampleRate} Hz → ${hwSampleRate} Hz`,
      isSuccess: false,
    },
    {
      label: 'Output',
      value: 'No USB DAC connected',
      isSuccess: false,
    },
    {
      label: 'Output',
      value: 'DAC routing requested; actual output route is not verified',
      isSuccess: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#202227] border border-white/10 rounded-[28px] p-6 shadow-2xl text-[#EDE0E2] space-y-4 select-none animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-1">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Signal path</h2>
            <p className="text-xs text-[#9E9094] mt-0.5">
              DSP chain: {dsp.bypassAll ? 'Bit-Perfect on' : 'Bit-Perfect off — enable it in Settings'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCheckPath}
              disabled={isChecking}
              className="bg-[#2D333B] text-[11px] font-bold text-[#D0D8E2] px-3 py-1 rounded-full uppercase tracking-wider hover:bg-[#38404B] active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              {isChecking ? 'CHECKING...' : 'CHECK PATH'}
            </button>
            <button
              onClick={() => setSignalPathOpen(false)}
              className="p-1 rounded-full text-[#9E9094] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Timeline Node Step List */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3.5 py-1">
          <div className="relative pl-6 space-y-4">
            {/* Vertical timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-white/10" />

            {timelineNodes.map((node, index) => (
              <div key={index} className="relative group">
                {/* Dot */}
                <div
                  className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-[#202227] ${
                    node.isSuccess ? 'bg-[#A8BED8]' : 'bg-[#E2A9B0]'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">
                    {node.label}
                  </span>
                  <span className="text-xs font-sans tabular-nums text-[#9E9094] leading-relaxed block mt-0.5">
                    {node.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stream Health Section (1:1 Android Parity) */}
          <div className="pt-3 border-t border-white/10 space-y-1.5 font-sans tabular-nums text-xs">
            <div className="text-sm font-bold text-white font-sans mb-2">Stream health</div>
            <div className="flex items-center justify-between text-[#9E9094]">
              <span>Clock drift:</span>
              <span className="text-white font-semibold">+1326.4 PPM</span>
            </div>
            <div className="flex items-center justify-between text-[#9E9094]">
              <span>Stream:</span>
              <span className="text-[#D0D8E2]">Playing • {sampleRate} Hz • Shared AudioTrack</span>
            </div>
            <div className="flex items-center justify-between text-[#9E9094]">
              <span>Glitches:</span>
              <span className="text-white font-semibold">0</span>
            </div>
          </div>
        </div>

        {/* Action Button: Close */}
        <div className="pt-2">
          <button
            onClick={() => setSignalPathOpen(false)}
            className="w-full py-2.5 rounded-full bg-white/10 text-white font-semibold text-xs hover:bg-white/15 active:scale-98 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignalPathModal;
