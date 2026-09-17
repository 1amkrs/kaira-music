/**
 * Bauer-style Binaural Headphone Crossfeed Filter
 *
 * Simulates natural stereo loudspeaker acoustic crosstalk on headphones
 * by routing delayed (~0.32ms) and frequency-attenuated (lowpass ~700Hz)
 * signals to opposite ear channels, drastically reducing listening fatigue.
 */
export class CrossfeedNode {
  private ctx: AudioContext;
  public inputNode: GainNode;
  public outputNode: GainNode;

  private dryGain: GainNode;
  private wetGain: GainNode;

  private splitter: ChannelSplitterNode;
  private merger: ChannelMergerNode;

  private leftDirectGain: GainNode;
  private rightDirectGain: GainNode;

  private leftCrossDelay: DelayNode;
  private rightCrossDelay: DelayNode;

  private leftCrossFilter: BiquadFilterNode;
  private rightCrossFilter: BiquadFilterNode;

  private leftCrossGain: GainNode;
  private rightCrossGain: GainNode;

  private isEnabled: boolean = false;
  private level: number = 0.5; // 0.0 to 1.0

  constructor(ctx: AudioContext) {
    this.ctx = ctx;

    this.inputNode = ctx.createGain();
    this.outputNode = ctx.createGain();

    // Dry (direct bypass) branch
    this.dryGain = ctx.createGain();
    this.dryGain.gain.value = 1.0;

    // Wet (crossfeed processed) branch
    this.wetGain = ctx.createGain();
    this.wetGain.gain.value = 0.0;

    // Stereo channel splitter and merger
    this.splitter = ctx.createChannelSplitter(2);
    this.merger = ctx.createChannelMerger(2);

    // Direct channel gains
    this.leftDirectGain = ctx.createGain();
    this.rightDirectGain = ctx.createGain();
    this.leftDirectGain.gain.value = 1.0;
    this.rightDirectGain.gain.value = 1.0;

    // Interaural Time Delay (~320 microseconds = 0.00032s)
    this.leftCrossDelay = ctx.createDelay();
    this.rightCrossDelay = ctx.createDelay();
    this.leftCrossDelay.delayTime.value = 0.00032;
    this.rightCrossDelay.delayTime.value = 0.00032;

    // Head-shadowing lowpass filters (~700Hz cutoff)
    this.leftCrossFilter = ctx.createBiquadFilter();
    this.rightCrossFilter = ctx.createBiquadFilter();
    this.leftCrossFilter.type = 'lowpass';
    this.rightCrossFilter.type = 'lowpass';
    this.leftCrossFilter.frequency.value = 700;
    this.rightCrossFilter.frequency.value = 700;
    this.leftCrossFilter.Q.value = 0.707;
    this.rightCrossFilter.Q.value = 0.707;

    // Cross-channel attenuation gains (approx -6dB to -10dB)
    this.leftCrossGain = ctx.createGain();
    this.rightCrossGain = ctx.createGain();
    this.updateCrossfeedGains();

    // --- Graph Routing ---
    // 1. Dry path
    this.inputNode.connect(this.dryGain);
    this.dryGain.connect(this.outputNode);

    // 2. Wet path entry
    this.inputNode.connect(this.splitter);

    // Left channel (index 0) direct -> merger left (index 0)
    this.splitter.connect(this.leftDirectGain, 0);
    this.leftDirectGain.connect(this.merger, 0, 0);

    // Right channel (index 1) direct -> merger right (index 1)
    this.splitter.connect(this.rightDirectGain, 1);
    this.rightDirectGain.connect(this.merger, 0, 1);

    // Left channel -> delay -> lowpass -> cross gain -> merger right (index 1)
    this.splitter.connect(this.leftCrossDelay, 0);
    this.leftCrossDelay.connect(this.leftCrossFilter);
    this.leftCrossFilter.connect(this.leftCrossGain);
    this.leftCrossGain.connect(this.merger, 0, 1);

    // Right channel -> delay -> lowpass -> cross gain -> merger left (index 0)
    this.splitter.connect(this.rightCrossDelay, 1);
    this.rightCrossDelay.connect(this.rightCrossFilter);
    this.rightCrossFilter.connect(this.rightCrossGain);
    this.rightCrossGain.connect(this.merger, 0, 0);

    // Merger connects into wetGain -> outputNode
    this.merger.connect(this.wetGain);
    this.wetGain.connect(this.outputNode);
  }

  private updateCrossfeedGains() {
    // Level scales cross-feed coefficient from ~0.15 (-16dB) to ~0.50 (-6dB)
    const factor = 0.15 + this.level * 0.35;
    const now = this.ctx.currentTime;
    this.leftCrossGain.gain.setTargetAtTime(factor, now, 0.02);
    this.rightCrossGain.gain.setTargetAtTime(factor, now, 0.02);
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    const now = this.ctx.currentTime;
    if (enabled) {
      this.dryGain.gain.setTargetAtTime(0, now, 0.02);
      this.wetGain.gain.setTargetAtTime(1, now, 0.02);
    } else {
      this.dryGain.gain.setTargetAtTime(1, now, 0.02);
      this.wetGain.gain.setTargetAtTime(0, now, 0.02);
    }
  }

  public setLevel(level: number) {
    this.level = Math.max(0, Math.min(1, level));
    this.updateCrossfeedGains();
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public getLevel(): number {
    return this.level;
  }
}
