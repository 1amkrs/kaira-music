import { EQ_BAND_FREQUENCIES, DspSettings } from './types';
import { CrossfeedNode } from './CrossfeedNode';

export class DspChain {
  private ctx: AudioContext;
  public inputNode: GainNode;
  public outputNode: GainNode;

  // Preamp
  private preampGainNode: GainNode;

  // 15 EQ Biquad filters
  private eqFilters: BiquadFilterNode[] = [];

  // Crossfeed
  private crossfeedNode: CrossfeedNode;

  // Peak Limiter
  private limiterNode: DynamicsCompressorNode;

  // Analyser
  public analyserNode: AnalyserNode;

  // Bypass branch
  private dspActiveGain: GainNode;
  private bypassGain: GainNode;

  private currentSettings: DspSettings = {
    eqEnabled: true,
    eqGains: new Array(EQ_BAND_FREQUENCIES.length).fill(0),
    preampGainDb: 0,
    crossfeedEnabled: false,
    crossfeedLevel: 0.5,
    limiterEnabled: true,
    bypassAll: false,
  };

  constructor(ctx: AudioContext) {
    this.ctx = ctx;

    this.inputNode = ctx.createGain();
    this.outputNode = ctx.createGain();

    // Bypass switching nodes
    this.dspActiveGain = ctx.createGain();
    this.bypassGain = ctx.createGain();
    this.dspActiveGain.gain.value = 1.0;
    this.bypassGain.gain.value = 0.0;

    // Direct bypass path: input -> bypassGain -> output
    this.inputNode.connect(this.bypassGain);
    this.bypassGain.connect(this.outputNode);

    // Preamp
    this.preampGainNode = ctx.createGain();
    this.preampGainNode.gain.value = 1.0;

    // 15-Band EQ filters
    this.eqFilters = EQ_BAND_FREQUENCIES.map((band) => {
      const filter = ctx.createBiquadFilter();
      filter.type = band.type;
      filter.frequency.value = band.frequency;
      filter.Q.value = band.q;
      filter.gain.value = 0;
      return filter;
    });

    // Bauer Crossfeed
    this.crossfeedNode = new CrossfeedNode(ctx);

    // Peak Limiter (transparent brickwall protection)
    this.limiterNode = ctx.createDynamicsCompressor();
    this.limiterNode.threshold.value = -0.5; // dB
    this.limiterNode.knee.value = 0.0;
    this.limiterNode.ratio.value = 20.0;
    this.limiterNode.attack.value = 0.001; // 1ms fast attack
    this.limiterNode.release.value = 0.050; // 50ms smooth release

    // Analyser Node for audiophile visualization
    this.analyserNode = ctx.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.smoothingTimeConstant = 0.8;

    // Connect DSP chain:
    // input -> dspActiveGain -> preamp -> eq0 -> ... -> eq14 -> crossfeed -> limiter -> output -> analyser
    this.inputNode.connect(this.dspActiveGain);
    this.dspActiveGain.connect(this.preampGainNode);

    let lastNode: AudioNode = this.preampGainNode;
    for (const filter of this.eqFilters) {
      lastNode.connect(filter);
      lastNode = filter;
    }

    lastNode.connect(this.crossfeedNode.inputNode);
    this.crossfeedNode.outputNode.connect(this.limiterNode);
    this.limiterNode.connect(this.outputNode);
    this.outputNode.connect(this.analyserNode);
  }

  public setPreampGain(gainDb: number) {
    this.currentSettings.preampGainDb = gainDb;
    // convert dB to linear factor
    const linearGain = Math.pow(10, gainDb / 20);
    this.preampGainNode.gain.setTargetAtTime(linearGain, this.ctx.currentTime, 0.02);
  }

  public setEqGain(bandIndex: number, gainDb: number) {
    if (bandIndex >= 0 && bandIndex < this.eqFilters.length) {
      this.currentSettings.eqGains[bandIndex] = gainDb;
      const targetGain = this.currentSettings.eqEnabled ? gainDb : 0;
      this.eqFilters[bandIndex].gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.02);
    }
  }

  public setEqEnabled(enabled: boolean) {
    this.currentSettings.eqEnabled = enabled;
    const now = this.ctx.currentTime;
    for (let i = 0; i < this.eqFilters.length; i++) {
      const targetGain = enabled ? this.currentSettings.eqGains[i] : 0;
      this.eqFilters[i].gain.setTargetAtTime(targetGain, now, 0.02);
    }
  }

  public setCrossfeedEnabled(enabled: boolean) {
    this.currentSettings.crossfeedEnabled = enabled;
    this.crossfeedNode.setEnabled(enabled);
  }

  public setCrossfeedLevel(level: number) {
    this.currentSettings.crossfeedLevel = level;
    this.crossfeedNode.setLevel(level);
  }

  public setLimiterEnabled(enabled: boolean) {
    this.currentSettings.limiterEnabled = enabled;
    // When limiter is disabled, set threshold to 0dB and ratio to 1:1
    const now = this.ctx.currentTime;
    if (enabled) {
      this.limiterNode.threshold.setTargetAtTime(-0.5, now, 0.02);
      this.limiterNode.ratio.setTargetAtTime(20.0, now, 0.02);
    } else {
      this.limiterNode.threshold.setTargetAtTime(0, now, 0.02);
      this.limiterNode.ratio.setTargetAtTime(1.0, now, 0.02);
    }
  }

  public setBypassAll(bypass: boolean) {
    this.currentSettings.bypassAll = bypass;
    const now = this.ctx.currentTime;
    if (bypass) {
      // Bit-perfect direct mode
      this.dspActiveGain.gain.setTargetAtTime(0, now, 0.02);
      this.bypassGain.gain.setTargetAtTime(1, now, 0.02);
    } else {
      this.dspActiveGain.gain.setTargetAtTime(1, now, 0.02);
      this.bypassGain.gain.setTargetAtTime(0, now, 0.02);
    }
  }

  public applySettings(settings: Partial<DspSettings>) {
    if (settings.preampGainDb !== undefined) {
      this.setPreampGain(settings.preampGainDb);
    }
    if (settings.eqGains !== undefined) {
      settings.eqGains.forEach((gain, index) => this.setEqGain(index, gain));
    }
    if (settings.eqEnabled !== undefined) {
      this.setEqEnabled(settings.eqEnabled);
    }
    if (settings.crossfeedEnabled !== undefined) {
      this.setCrossfeedEnabled(settings.crossfeedEnabled);
    }
    if (settings.crossfeedLevel !== undefined) {
      this.setCrossfeedLevel(settings.crossfeedLevel);
    }
    if (settings.limiterEnabled !== undefined) {
      this.setLimiterEnabled(settings.limiterEnabled);
    }
    if (settings.bypassAll !== undefined) {
      this.setBypassAll(settings.bypassAll);
    }
  }

  public getSettings(): DspSettings {
    return { ...this.currentSettings, eqGains: [...this.currentSettings.eqGains] };
  }
}
