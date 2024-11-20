export class SoundManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  createSquishSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const now = this.audioContext.currentTime;

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set initial values
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  createPopSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const now = this.audioContext.currentTime;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.05);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  createClearSound() {
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const now = this.audioContext.currentTime;

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';

    oscillator1.frequency.setValueAtTime(880, now);
    oscillator1.frequency.linearRampToValueAtTime(1760, now + 0.1);

    oscillator2.frequency.setValueAtTime(440, now);
    oscillator2.frequency.linearRampToValueAtTime(880, now + 0.1);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 0.1);
    oscillator2.stop(now + 0.1);
  }
}
