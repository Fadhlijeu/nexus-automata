/**
 * Audio Synthesizer Engine (Web Audio API)
 * Procedural sound generation without any external audio asset dependencies.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.volume = 0.35;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.initialized = true;
            }
        } catch (e) {
            console.warn("Web Audio API not supported or blocked", e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    playPlace() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        
        // Punchy mechanical thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playDemolish() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    playRotate() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.05);

        gain.gain.setValueAtTime(this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    playResearchUnlock() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        
        // Major chord arpeggio: C5 -> E5 -> G5 -> C6
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteStart = now + (idx * 0.08);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);

            gain.gain.setValueAtTime(0, noteStart);
            gain.gain.linearRampToValueAtTime(this.volume * 0.6, noteStart + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(noteStart);
            osc.stop(noteStart + 0.5);
        });
    }

    playAlert() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.setValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    playInserterSwing() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // High-tech servo motor whirr
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playChemicalVent() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        // White noise steam hiss approximation with high frequency triangle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.25);

        gain.gain.setValueAtTime(this.volume * 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playOverclockBeep(ratio = 1.0) {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 * ratio, now);
        osc.frequency.exponentialRampToValueAtTime(880 * ratio, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playRocketLaunch() {
        if (this.isMuted || !this.ctx) return;
        this.resume();
        const now = this.ctx.currentTime;

        // Low frequency thruster rumble
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.linearRampToValueAtTime(130, now + 1.2);
        osc.frequency.exponentialRampToValueAtTime(32, now + 2.8);

        gain.gain.setValueAtTime(this.volume * 0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        // White noise whoosh
        const bufferSize = Math.floor(this.ctx.sampleRate * 2.2);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 1.5);
        filter.Q.value = 2.5;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(this.volume * 0.45, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.8);
        noise.start(now);
        noise.stop(now + 2.2);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}

export const sound = new SoundEngine();
