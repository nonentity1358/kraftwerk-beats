export class DrumKit {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.audioContext = audioEngine.audioContext;
        this.volume = 1.0; // Initialize volume property
        this.initializeImpulseResponses();
    }

    initializeImpulseResponses() {
        // Create impulse responses for different drum types
        this.impulses = {
            snare: this.createSnareImpulse(),
            reverb: this.createReverbImpulse()
        };
    }

    createSnareImpulse() {
        const length = 0.1 * this.audioContext.sampleRate;
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Snare rattle simulation
                data[i] = (Math.random() - 0.5) * Math.pow(1 - i / length, 0.5);
                if (i % 100 < 10) {
                    data[i] *= 2; // Snare wire resonance
                }
            }
        }
        
        return impulse;
    }

    createReverbImpulse() {
        const length = 0.5 * this.audioContext.sampleRate;
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() - 0.5) * Math.pow(1 - i / length, 2);
            }
        }
        
        return impulse;
    }

    createKick() {
        return (time) => {
            // Layer 1: Sub bass punch
            const osc1 = this.audioContext.createOscillator();
            const gain1 = this.audioContext.createGain();
            const filter1 = this.audioContext.createBiquadFilter();
            
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(60, time);
            osc1.frequency.exponentialRampToValueAtTime(30, time + 0.1);
            
            filter1.type = 'lowpass';
            filter1.frequency.value = 200;
            filter1.Q.value = 2;
            
            gain1.gain.setValueAtTime(1, time);
            gain1.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            
            // Layer 2: Click transient
            const osc2 = this.audioContext.createOscillator();
            const gain2 = this.audioContext.createGain();
            
            osc2.type = 'square';
            osc2.frequency.value = 1500;
            
            gain2.gain.setValueAtTime(0.5, time);
            gain2.gain.exponentialRampToValueAtTime(0.01, time + 0.02);
            
            // Layer 3: Noise transient
            const noise = this.createNoise();
            const noiseGain = this.audioContext.createGain();
            const noiseFilter = this.audioContext.createBiquadFilter();
            
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = 500;
            noiseFilter.Q.value = 2;
            
            noiseGain.gain.setValueAtTime(0.3, time);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.01);
            
            // Compression
            const compressor = this.audioContext.createDynamicsCompressor();
            compressor.threshold.value = -20;
            compressor.knee.value = 10;
            compressor.ratio.value = 5;
            compressor.attack.value = 0.001;
            compressor.release.value = 0.1;
            
            // Connect everything
            osc1.connect(filter1);
            filter1.connect(gain1);
            gain1.connect(compressor);
            
            osc2.connect(gain2);
            gain2.connect(compressor);
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(compressor);
            
            compressor.connect(this.audioEngine.masterGain);
            
            // Start and stop
            osc1.start(time);
            osc1.stop(time + 0.5);
            osc2.start(time);
            osc2.stop(time + 0.02);
            noise.start(time);
            noise.stop(time + 0.01);
        };
    }

    createSnare() {
        return (time) => {
            // Layer 1: Tonal component
            const osc = this.audioContext.createOscillator();
            const oscGain = this.audioContext.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, time);
            osc.frequency.exponentialRampToValueAtTime(100, time + 0.1);
            
            oscGain.gain.setValueAtTime(0.7, time);
            oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            
            // Layer 2: Noise component
            const noise = this.createNoise();
            const noiseGain = this.audioContext.createGain();
            const noiseFilter = this.audioContext.createBiquadFilter();
            
            noiseFilter.type = 'highpass';
            noiseFilter.frequency.value = 2000;
            noiseFilter.Q.value = 0.5;
            
            noiseGain.gain.setValueAtTime(0.8, time);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
            
            // Snare rattle convolution
            const convolver = this.audioContext.createConvolver();
            convolver.buffer = this.impulses.snare;
            
            // Mix
            const mixer = this.audioContext.createGain();
            mixer.gain.value = 0.8;
            
            // Connect
            osc.connect(oscGain);
            oscGain.connect(mixer);
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(convolver);
            convolver.connect(mixer);
            
            mixer.connect(this.audioEngine.masterGain);
            
            // Start and stop
            osc.start(time);
            osc.stop(time + 0.1);
            noise.start(time);
            noise.stop(time + 0.15);
        };
    }

    createHihat() {
        return (time, isOpen = false) => {
            // Multiple high frequency oscillators for metallic sound
            const oscs = [];
            const gains = [];
            const frequencies = [4000, 5500, 7000, 9000, 11000];
            
            frequencies.forEach(freq => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.type = 'square';
                osc.frequency.value = freq + Math.random() * 200;
                
                const duration = isOpen ? 0.3 : 0.05;
                gain.gain.setValueAtTime(0.1, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
                
                osc.connect(gain);
                oscs.push(osc);
                gains.push(gain);
            });
            
            // Bandpass filter for character
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 8000;
            filter.Q.value = 1;
            
            // Mix all oscillators
            const mixer = this.audioContext.createGain();
            gains.forEach(g => g.connect(filter));
            filter.connect(mixer);
            
            mixer.connect(this.audioEngine.masterGain);
            
            // Start and stop
            const duration = isOpen ? 0.3 : 0.05;
            oscs.forEach(osc => {
                osc.start(time);
                osc.stop(time + duration);
            });
        };
    }

    createNoise() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = this.audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        
        return whiteNoise;
    }

    playDrum(step, time, velocity = 1.0) {
        // Apply velocity to overall volume
        const originalVolume = this.volume;
        this.volume = originalVolume * velocity;
        
        if (step % 4 === 0) {
            this.createKick()(time);
        } else if (step % 2 === 0) {
            this.createSnare()(time);
        } else {
            this.createHihat()(time, Math.random() > 0.8); // Occasionally open hihat
        }
        
        // Restore original volume
        this.volume = originalVolume;
    }

    createPercussion(type) {
        const percussion = {
            clap: () => (time) => {
                // Multiple short bursts for clap
                for (let i = 0; i < 3; i++) {
                    const noise = this.createNoise();
                    const gain = this.audioContext.createGain();
                    const filter = this.audioContext.createBiquadFilter();
                    
                    filter.type = 'bandpass';
                    filter.frequency.value = 1500 + Math.random() * 500;
                    filter.Q.value = 10;
                    
                    gain.gain.setValueAtTime(0.3, time + i * 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.01 + 0.02);
                    
                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.audioEngine.masterGain);
                    
                    noise.start(time + i * 0.01);
                    noise.stop(time + i * 0.01 + 0.02);
                }
            },
            
            cowbell: () => (time) => {
                const osc1 = this.audioContext.createOscillator();
                const osc2 = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();
                
                // Two detuned oscillators for metallic sound
                osc1.frequency.value = 800;
                osc2.frequency.value = 540;
                
                filter.type = 'bandpass';
                filter.frequency.value = 700;
                filter.Q.value = 15;
                
                gain.gain.setValueAtTime(0.5, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
                
                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gain);
                gain.connect(this.audioEngine.masterGain);
                
                osc1.start(time);
                osc1.stop(time + 0.1);
                osc2.start(time);
                osc2.stop(time + 0.1);
            }
        };
        
        return percussion[type] || percussion.clap;
    }
}