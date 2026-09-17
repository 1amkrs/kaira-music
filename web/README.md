# LastWave Web / PWA (v4.1.0)

**High-Resolution Lossless Music Streaming & Web Audio Player with Web DSP, Bauer Binaural Crossfeed, LRCLIB Synced Lyrics, and Material 3 Expressive UI.**

---

## 🎧 Features

- **Lossless & Hi-Res Streaming:** Powered by the [clashflac](https://github.com/ajisth69/clashflac) backend API (up to 24-bit/192kHz FLAC) with instant local audiophile fallback catalog.
- **Web Audio DSP Engine:**
  - **15-Band Parametric Equalizer:** 32Hz, 45Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 3kHz, 4kHz, 6kHz, 8kHz, 10kHz, 12kHz, 16kHz with studio presets.
  - **Bauer-Style Binaural Crossfeed:** Simulates natural stereo loudspeaker acoustic crosstalk on headphones to reduce ear fatigue.
  - **Peak Limiter:** Dynamics compressor providing transparent anti-clipping protection.
  - **Bit-Perfect Direct Bypass:** Bypasses all DSP nodes for uncompromised bitstream transmission to external DACs.
- **Audiophile Signal Path Inspector:** Real-time visual inspector displaying source bit depth/sample rate, Web Audio decoding, DSP processing status, and hardware clock output.
- **LRCLIB Synced Lyrics:** Millisecond-accurate kinetic scrolling lyrics with interactive tap-to-seek and dynamic highlighting.
- **Last.fm Scrobbler (BYOK):** In-app configuration with automatic scrobbling at 50% / 4 minutes, Now Playing updates, and track loving.
- **Material 3 Expressive & Liquid Glass:** Translucent frosted glass panels, neon lime accents (`#C6F100`), ambient artwork glow, and responsive navigation (desktop sidebar + mobile floating pill).
- **PWA Ready:** Installable on desktop (Chrome/Edge) and mobile (iOS Safari Add-to-Home-Screen / Android PWA).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom Liquid Glass Design Tokens
- **Icons:** Lucide React
- **State Management:** Zustand
- **Audio:** HTML5 Audio + Web Audio API (`AudioContext`, `BiquadFilterNode`, `DynamicsCompressorNode`, `DelayNode`, `ChannelSplitterNode`, `ChannelMergerNode`)
- **Metadata:** `navigator.mediaSession`
