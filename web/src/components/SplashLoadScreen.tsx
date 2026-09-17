import React, { useState, useEffect } from 'react';
import { WebAudioEngine } from '../audio/WebAudioEngine';

export const SplashLoadScreen: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Initializing Audiophile Master Clock...');

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      // 1. Dynamic fonts readiness check
      setLoadingStatus('Loading typography and expressive styling...');
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready.catch(() => {});
      }

      // 2. Audio engine and hardware decoder readiness check
      setLoadingStatus('Calibrating hardware audio engine...');
      try {
        WebAudioEngine.getInstance();
      } catch (e) {
        console.warn('Audio engine calibration', e);
      }

      // 3. Smooth aesthetic pacing so transitions feel fluid and non-snappy
      setLoadingStatus('Ready to stream in studio fidelity...');
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (active) {
        setIsReady(true);
        // Wait for fade-out animation to complete (500ms) before unmounting
        setTimeout(() => {
          if (active) setShouldUnmount(true);
        }, 500);
      }
    };

    initialize();

    return () => {
      active = false;
    };
  }, []);

  if (shouldUnmount) return null;

  return (
    <div
      aria-label="Application Loading"
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#120E11] transition-opacity duration-500 ease-out select-none ${
        isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#E2A9B0]/20 via-[#BAC6D7]/15 to-transparent blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6 px-6 text-center">
        {/* Animated App Icon / Wave Aura */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-[#E2A9B0]/20 blur-xl animate-ping" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#2D2228] to-[#1C161A] border border-white/10 shadow-2xl flex items-center justify-center relative z-10">
            {/* LastWave Dynamic Animated Audio Bars */}
            <div className="flex items-end gap-1.5 h-8">
              <span className="w-1.5 bg-[#E2A9B0] rounded-full animate-[bounce_1s_infinite_100ms] h-4" />
              <span className="w-1.5 bg-[#BAC6D7] rounded-full animate-[bounce_1s_infinite_250ms] h-8" />
              <span className="w-1.5 bg-[#E2A9B0] rounded-full animate-[bounce_1s_infinite_400ms] h-6" />
              <span className="w-1.5 bg-[#DDE2EB] rounded-full animate-[bounce_1s_infinite_150ms] h-5" />
            </div>
          </div>
        </div>

        {/* Brand Heading strictly in font-bold font-sequel */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-bold font-sequel tracking-tight text-[#EDE0E2]">
            LastWave
          </h1>
          <p className="text-xs tracking-widest text-[#E5B6BD] uppercase font-semibold">
            Studio Master High-Fidelity
          </p>
        </div>

        {/* Dynamic Status Indicator */}
        <div className="flex items-center gap-2.5 pt-4 text-xs font-medium text-[#9E9094]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E2A9B0] animate-ping" />
          <span>{loadingStatus}</span>
        </div>
      </div>
    </div>
  );
};
