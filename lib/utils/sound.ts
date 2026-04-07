/**
 * sound.ts
 * Lightweight audio utility using Web Audio API for zero-latency trading sounds.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private createOscillator(freq: number, type: OscillatorType = "sine", duration: number = 0.1, volume: number = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // BUY: Soft click + pop (high pitch)
  playBuy() {
    this.createOscillator(880, "sine", 0.05, 0.1); // High A
    setTimeout(() => this.createOscillator(1320, "sine", 0.08, 0.05), 30); // Pop
  }

  // SELL: Lower pitch click
  playSell() {
    this.createOscillator(440, "sine", 0.05, 0.1); // Middle A
    setTimeout(() => this.createOscillator(330, "sine", 0.12, 0.05), 40); // Drop
  }

  // PROFIT: Subtle high-pitched "tick"
  playProfit() {
    this.createOscillator(1760, "sine", 0.03, 0.03); // Very high tick
  }

  // LOSS: Subtle "drop"
  playLoss() {
    this.createOscillator(220, "sine", 0.15, 0.05); // Low drop
  }
}

export const sound = new SoundEngine();
