export class BinauralBeatsEngine {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.leftOsc = null;
        this.rightOsc = null;
        this.leftGain = null;
        this.rightGain = null;
        this.merger = null;
        this.isActive = false;
        
        // Brainwave frequency ranges
        this.brainwaveStates = {
            delta: { min: 0.5, max: 4, description: "Deep sleep, healing" },
            theta: { min: 4, max: 8, description: "Deep meditation, creativity" },
            alpha: { min: 8, max: 12, description: "Relaxation, flow state" },
            beta: { min: 12, max: 30, description: "Focus, alertness" },
            gamma: { min: 30, max: 50, description: "Peak awareness" }
        };
        
        this.currentState = 'alpha';
        this.baseFrequency = 200; // Carrier frequency
        this.beatFrequency = 10; // Difference between L/R channels
    }
    
    init(outputNode) {
        this.outputNode = outputNode;
        
        // Clean up any existing oscillators
        if (this.leftOsc) {
            try { this.leftOsc.stop(); } catch (e) {}
            this.leftOsc.disconnect();
        }
        if (this.rightOsc) {
            try { this.rightOsc.stop(); } catch (e) {}
            this.rightOsc.disconnect();
        }
        
        // Create stereo panner for true binaural separation
        this.merger = this.audioContext.createChannelMerger(2);
        
        // Left channel
        this.leftGain = this.audioContext.createGain();
        this.leftGain.connect(this.merger, 0, 0);
        
        // Right channel
        this.rightGain = this.audioContext.createGain();
        this.rightGain.connect(this.merger, 0, 1);
        
        // Connect to output
        this.merger.connect(this.outputNode);
        
        // Set initial gain parameters
        this.leftGain.gain.value = 0;
        this.rightGain.gain.value = 0;
        
        // Don't create oscillators here - create them in start()
        this.leftOsc = null;
        this.rightOsc = null;
    }
    
    setBrainwaveState(state) {
        if (!this.brainwaveStates[state]) return;
        
        this.currentState = state;
        const range = this.brainwaveStates[state];
        
        // Set beat frequency to middle of the range
        this.beatFrequency = (range.min + range.max) / 2;
        
        if (this.isActive) {
            this.updateFrequencies();
        }
    }
    
    setCarrierFrequency(freq) {
        this.baseFrequency = freq;
        if (this.isActive) {
            this.updateFrequencies();
        }
    }
    
    updateFrequencies() {
        if (!this.leftOsc || !this.rightOsc) return;
        
        const leftFreq = this.baseFrequency;
        const rightFreq = this.baseFrequency + this.beatFrequency;
        
        this.leftOsc.frequency.setValueAtTime(leftFreq, this.audioContext.currentTime);
        this.rightOsc.frequency.setValueAtTime(rightFreq, this.audioContext.currentTime);
    }
    
    start(fadeTime = 2) {
        if (this.isActive) return;
        
        // Create fresh oscillators
        this.leftOsc = this.audioContext.createOscillator();
        this.rightOsc = this.audioContext.createOscillator();
        
        this.leftOsc.type = 'sine';
        this.rightOsc.type = 'sine';
        
        this.leftOsc.connect(this.leftGain);
        this.rightOsc.connect(this.rightGain);
        
        this.updateFrequencies();
        
        this.leftOsc.start();
        this.rightOsc.start();
        
        // Fade in
        const now = this.audioContext.currentTime;
        this.leftGain.gain.setValueAtTime(0, now);
        this.rightGain.gain.setValueAtTime(0, now);
        this.leftGain.gain.linearRampToValueAtTime(0.1, now + fadeTime);
        this.rightGain.gain.linearRampToValueAtTime(0.1, now + fadeTime);
        
        this.isActive = true;
    }
    
    stop(fadeTime = 2) {
        if (!this.isActive) return;
        
        // Fade out
        const now = this.audioContext.currentTime;
        this.leftGain.gain.linearRampToValueAtTime(0, now + fadeTime);
        this.rightGain.gain.linearRampToValueAtTime(0, now + fadeTime);
        
        // Stop oscillators after fade
        setTimeout(() => {
            if (this.leftOsc) {
                this.leftOsc.stop();
                this.leftOsc.disconnect();
                this.leftOsc = null;
            }
            if (this.rightOsc) {
                this.rightOsc.stop();
                this.rightOsc.disconnect();
                this.rightOsc = null;
            }
            this.isActive = false;
        }, fadeTime * 1000);
    }
    
    modulateBeatFrequency(amount, time = 0.1) {
        // Modulate within the current brainwave state range
        const range = this.brainwaveStates[this.currentState];
        const modulated = this.beatFrequency + amount;
        
        // Clamp to range
        this.beatFrequency = Math.max(range.min, Math.min(range.max, modulated));
        
        if (this.isActive) {
            const now = this.audioContext.currentTime;
            const rightFreq = this.baseFrequency + this.beatFrequency;
            this.rightOsc.frequency.linearRampToValueAtTime(rightFreq, now + time);
        }
    }
    
    // Create entrainment patterns that sync with the music
    createRhythmicEntrainment(bpm) {
        // Convert BPM to Hz for rhythmic pulsing
        const beatHz = bpm / 60;
        
        // Find the closest brainwave frequency that's harmonically related
        const harmonics = [0.25, 0.5, 1, 2, 4, 8, 16];
        let bestHarmonic = 1;
        let minDiff = Infinity;
        
        for (const harmonic of harmonics) {
            const freq = beatHz * harmonic;
            // Check if this frequency falls within any brainwave range
            for (const [state, range] of Object.entries(this.brainwaveStates)) {
                if (freq >= range.min && freq <= range.max) {
                    const diff = Math.abs(freq - this.beatFrequency);
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestHarmonic = harmonic;
                        this.currentState = state;
                    }
                }
            }
        }
        
        this.beatFrequency = beatHz * bestHarmonic;
        if (this.isActive) {
            this.updateFrequencies();
        }
        
        return this.currentState;
    }
    
    setVolume(volume) {
        const gain = volume * 0.1; // Keep binaural beats subtle
        this.leftGain.gain.setValueAtTime(gain, this.audioContext.currentTime);
        this.rightGain.gain.setValueAtTime(gain, this.audioContext.currentTime);
    }
}