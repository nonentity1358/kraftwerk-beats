export class GranularSynthesis {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.grains = [];
        this.activeGrains = new Set();
        this.sourceBuffer = null;
        this.isPlaying = false;
        
        // Granular parameters
        this.params = {
            grainSize: 0.05, // 50ms
            grainDensity: 20, // grains per second
            pitch: 1.0,
            pitchRandomness: 0.1,
            position: 0.5,
            positionRandomness: 0.1,
            reverse: 0, // probability of reverse grains
            envelope: 'gaussian',
            spread: 1.0, // stereo spread
            feedback: 0.0,
            freeze: false
        };
        
        this.grainPool = [];
        this.maxGrains = 100;
        this.initializeGrainPool();
    }

    initializeGrainPool() {
        // Pre-create grain objects for efficiency
        for (let i = 0; i < this.maxGrains; i++) {
            this.grainPool.push({
                source: null,
                gain: null,
                panner: null,
                inUse: false
            });
        }
    }

    loadBuffer(audioBuffer) {
        this.sourceBuffer = audioBuffer;
    }

    async loadFromFile(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.sourceBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }

    start() {
        if (!this.sourceBuffer) {
            console.error('No source buffer loaded');
            return;
        }
        
        this.isPlaying = true;
        this.scheduleGrains();
    }

    stop() {
        this.isPlaying = false;
        this.activeGrains.forEach(grain => {
            if (grain.source) {
                grain.source.stop();
            }
        });
        this.activeGrains.clear();
    }

    scheduleGrains() {
        if (!this.isPlaying) return;
        
        const interval = 1000 / this.params.grainDensity;
        
        // Schedule next grain
        setTimeout(() => {
            this.createGrain();
            this.scheduleGrains();
        }, interval + (Math.random() - 0.5) * interval * 0.5);
    }

    createGrain() {
        // Get an available grain from the pool
        const grain = this.grainPool.find(g => !g.inUse);
        if (!grain) return; // Pool exhausted
        
        grain.inUse = true;
        this.activeGrains.add(grain);
        
        // Create nodes
        grain.source = this.audioContext.createBufferSource();
        grain.gain = this.audioContext.createGain();
        grain.panner = this.audioContext.createStereoPanner();
        grain.filter = this.audioContext.createBiquadFilter();
        
        // Configure grain
        const grainSize = this.params.grainSize + (Math.random() - 0.5) * this.params.grainSize * 0.2;
        const startPosition = this.calculateStartPosition();
        const playbackRate = this.calculatePlaybackRate();
        
        // Set buffer
        grain.source.buffer = this.sourceBuffer;
        grain.source.playbackRate.value = playbackRate;
        
        // Reverse grain probability
        if (Math.random() < this.params.reverse) {
            grain.source.playbackRate.value *= -1;
        }
        
        // Apply envelope
        this.applyEnvelope(grain.gain, grainSize);
        
        // Stereo positioning
        grain.panner.pan.value = (Math.random() - 0.5) * this.params.spread;
        
        // Filter for texture
        grain.filter.type = 'bandpass';
        grain.filter.frequency.value = 1000 + Math.random() * 3000;
        grain.filter.Q.value = Math.random() * 5 + 1;
        
        // Connect nodes
        grain.source.connect(grain.filter);
        grain.filter.connect(grain.gain);
        grain.gain.connect(grain.panner);
        grain.panner.connect(this.audioContext.destination);
        
        // Add feedback if enabled
        let feedbackNodes = null;
        if (this.params.feedback > 0) {
            const feedback = this.audioContext.createGain();
            const delay = this.audioContext.createDelay();
            
            feedback.gain.value = this.params.feedback;
            delay.delayTime.value = grainSize * 2;
            
            grain.panner.connect(delay);
            delay.connect(feedback);
            feedback.connect(grain.filter);
            
            feedbackNodes = { feedback, delay };
        }
        
        // Start and stop grain
        const now = this.audioContext.currentTime;
        grain.source.start(now, startPosition, grainSize);
        
        // Clean up after grain finishes
        setTimeout(() => {
            grain.source.stop();
            grain.source.disconnect();
            grain.gain.disconnect();
            grain.panner.disconnect();
            grain.filter.disconnect();
            
            // Clean up feedback nodes if they exist
            if (feedbackNodes) {
                feedbackNodes.delay.disconnect();
                feedbackNodes.feedback.disconnect();
            }
            
            grain.inUse = false;
            this.activeGrains.delete(grain);
        }, grainSize * 1000);
    }

    calculateStartPosition() {
        if (this.params.freeze) {
            return this.params.position * this.sourceBuffer.duration;
        }
        
        const basePosition = this.params.position * this.sourceBuffer.duration;
        const randomOffset = (Math.random() - 0.5) * this.params.positionRandomness * this.sourceBuffer.duration;
        
        return Math.max(0, Math.min(this.sourceBuffer.duration - this.params.grainSize, basePosition + randomOffset));
    }

    calculatePlaybackRate() {
        const baseRate = this.params.pitch;
        const randomization = (Math.random() - 0.5) * this.params.pitchRandomness;
        return baseRate + randomization;
    }

    applyEnvelope(gainNode, duration) {
        const now = this.audioContext.currentTime;
        const attackTime = duration * 0.3;
        const releaseTime = duration * 0.3;
        const sustainTime = duration - attackTime - releaseTime;
        
        switch (this.params.envelope) {
            case 'gaussian':
                // Smooth bell curve envelope
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.exponentialRampToValueAtTime(0.8, now + attackTime);
                gainNode.gain.setValueAtTime(0.8, now + attackTime + sustainTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
                break;
                
            case 'rectangular':
                // Hard on/off
                gainNode.gain.setValueAtTime(0.8, now);
                gainNode.gain.setValueAtTime(0.8, now + duration - 0.001);
                gainNode.gain.setValueAtTime(0, now + duration);
                break;
                
            case 'triangular':
                // Linear fade in/out
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.8, now + duration / 2);
                gainNode.gain.linearRampToValueAtTime(0, now + duration);
                break;
                
            case 'exponential':
                // Percussive envelope
                gainNode.gain.setValueAtTime(0.8, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
                break;
        }
    }

    createTexture(type = 'clouds') {
        const textures = {
            clouds: {
                grainSize: 0.1,
                grainDensity: 30,
                pitchRandomness: 0.2,
                positionRandomness: 0.3,
                envelope: 'gaussian',
                spread: 1.0
            },
            rain: {
                grainSize: 0.01,
                grainDensity: 100,
                pitchRandomness: 0.5,
                positionRandomness: 0.8,
                envelope: 'exponential',
                spread: 1.0
            },
            shimmer: {
                grainSize: 0.02,
                grainDensity: 50,
                pitch: 2.0,
                pitchRandomness: 0.1,
                positionRandomness: 0.1,
                envelope: 'triangular',
                spread: 0.8
            },
            freeze: {
                grainSize: 0.05,
                grainDensity: 40,
                pitchRandomness: 0.01,
                positionRandomness: 0.01,
                freeze: true,
                envelope: 'gaussian',
                spread: 0.5
            },
            chaos: {
                grainSize: 0.03,
                grainDensity: 80,
                pitchRandomness: 1.0,
                positionRandomness: 1.0,
                reverse: 0.5,
                envelope: 'rectangular',
                spread: 1.0
            }
        };
        
        const texture = textures[type] || textures.clouds;
        Object.assign(this.params, texture);
    }

    modulateParameter(param, value, time = 0.1) {
        if (this.params.hasOwnProperty(param)) {
            const startTime = this.audioContext.currentTime;
            const startValue = this.params[param];
            const duration = time * 1000;
            const startTimestamp = performance.now();
            
            const animate = () => {
                const elapsed = performance.now() - startTimestamp;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth interpolation
                this.params[param] = startValue + (value - startValue) * this.easeInOutQuad(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        }
    }

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    createGranularPad(note, octave = 3) {
        // Use granular synthesis to create pad sounds
        const frequency = this.noteToFrequency(note, octave);
        
        // Create a synthetic source for the grain
        const duration = 2; // seconds
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        // Generate complex waveform
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                
                // Additive synthesis with multiple harmonics
                let sample = 0;
                for (let harmonic = 1; harmonic <= 8; harmonic++) {
                    const harmonicFreq = frequency * harmonic;
                    const harmonicAmp = 1 / harmonic;
                    sample += Math.sin(2 * Math.PI * harmonicFreq * t) * harmonicAmp;
                }
                
                // Add some noise for texture
                sample += (Math.random() - 0.5) * 0.02;
                
                // Apply envelope
                const envelope = Math.sin(Math.PI * i / data.length);
                data[i] = sample * envelope * 0.3;
            }
        }
        
        this.loadBuffer(buffer);
        // Don't auto-start - let the caller decide when to start
        // this.createTexture('clouds');
        // this.start();
    }

    noteToFrequency(note, octave) {
        const A4 = 440;
        const noteMap = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
        const semitones = noteMap[note] + (octave - 4) * 12;
        return A4 * Math.pow(2, semitones / 12);
    }

    createAmbientScape() {
        // Generate evolving ambient soundscape
        const scapeParams = {
            evolution: {
                grainSize: { min: 0.05, max: 0.2, speed: 0.1 },
                pitch: { min: 0.5, max: 1.5, speed: 0.05 },
                position: { min: 0, max: 1, speed: 0.02 },
                density: { min: 10, max: 40, speed: 0.08 }
            }
        };
        
        let time = 0;
        const evolve = () => {
            if (!this.isPlaying) return;
            
            Object.keys(scapeParams.evolution).forEach(param => {
                const config = scapeParams.evolution[param];
                const value = config.min + (Math.sin(time * config.speed) + 1) / 2 * (config.max - config.min);
                
                if (param === 'density') {
                    this.params.grainDensity = value;
                } else {
                    this.params[param] = value;
                }
            });
            
            time += 0.01;
            requestAnimationFrame(evolve);
        };
        
        evolve();
    }
}