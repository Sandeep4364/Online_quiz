export class SoundService {
  private static audioContext: AudioContext | null = null;
  private static enabled = true;

  static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private static playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  static playCorrect(): void {
    this.playTone(523.25, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.2), 100); // E5
  }

  static playIncorrect(): void {
    this.playTone(220, 0.3, 'sawtooth'); // A3
  }

  static playTick(): void {
    this.playTone(800, 0.1, 'square');
  }

  static playWarning(): void {
    this.playTone(440, 0.1, 'triangle'); // A4
  }

  static playComplete(): void {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 0.3), index * 150);
    });
  }
}