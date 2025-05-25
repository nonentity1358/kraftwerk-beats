export class Synthesizer {
    constructor(audioEngine, type = 'sine', frequency = 440, detune = 0) {
        this.audioEngine = audioEngine;
        this.audioContext = audioEngine.audioContext;
        
        // Multiple oscillators for richer sound
        this.oscillators = [];
        this.gains = [];
        this.filters = [];
        
        // Create 3 oscillators for unison/detune
        for (let i = 0; i < 3; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            osc.detune.setValueAtTime(detune + (i - 1) * 7, this.audioContext.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.value = 2000;
            filter.Q.value = 2;
            
            osc.connect(filter);
            filter.connect(gain);
            
            this.oscillators.push(osc);
            this.gains.push(gain);
            this.filters.push(filter);
            
            osc.start();
        }
        
        // Master gain
        this.gainNode = this.audioContext.createGain();
        this.gains.forEach(g => g.connect(this.gainNode));
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        // Additional processing
        this.createEffectsChain();
    }
    
    createEffectsChain() {
        // Chorus effect
        this.chorus = this.createChorus();
        
        // Distortion
        this.distortion = this.audioContext.createWaveShaper();
        this.distortion.curve = this.makeDistortionCurve(50);
        this.distortion.oversample = '4x';
        
        // Additional filter for character
        this.characterFilter = this.audioContext.createBiquadFilter();
        this.characterFilter.type = 'peaking';
        this.characterFilter.frequency.value = 800;
        this.characterFilter.Q.value = 1;
        this.characterFilter.gain.value = 3;
    }
    
    createChorus() {
        const chorus = {
            input: this.audioContext.createGain(),
            output: this.audioContext.createGain(),
            delays: [],
            lfos: [],
            gains: []
        };
        
        // Create multiple delay lines for chorus
        for (let i = 0; i < 4; i++) {
            const delay = this.audioContext.createDelay();
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            const gain = this.audioContext.createGain();
            
            delay.delayTime.value = 0.02 + i * 0.005;
            
            lfo.frequency.value = 0.5 + i * 0.2;
            lfoGain.gain.value = 0.002;
            
            lfo.connect(lfoGain);
            lfoGain.connect(delay.delayTime);
            
            chorus.input.connect(delay);
            delay.connect(gain);
            gain.connect(chorus.output);
            
            gain.gain.value = 0.25;
            
            lfo.start();
            
            chorus.delays.push(delay);
            chorus.lfos.push(lfo);
            chorus.gains.push(gain);
        }
        
        // Dry signal
        chorus.input.connect(chorus.output);
        
        return chorus;
    }
    
    makeDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;
        
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        
        return curve;
    }

    connect(destination) {
        this.gainNode.connect(destination);
    }

    play(baseFrequency, time, duration, settings) {
        const { waveform, volume, detune, filterCutoff } = settings;
        
        // Update all oscillators
        this.oscillators.forEach((osc, i) => {
            osc.type = waveform;
            osc.frequency.setValueAtTime(baseFrequency, time);
            osc.detune.setValueAtTime(detune + (i - 1) * 7, time); // Spread detune
        });
        
        // Update all filters
        this.filters.forEach(filter => {
            filter.frequency.setValueAtTime(filterCutoff, time);
        });

        this.gainNode.gain.cancelScheduledValues(time);
        this.gainNode.gain.setValueAtTime(0, time);
        this.gainNode.gain.linearRampToValueAtTime(volume, time + 0.005);
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.005);
    }

    setWaveform(type) {
        this.oscillators.forEach(osc => {
            osc.type = type;
        });
    }

    setVolume(volume) {
        this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }

    setDetune(detune) {
        this.oscillators.forEach((osc, i) => {
            osc.detune.setValueAtTime(detune + (i - 1) * 7, this.audioContext.currentTime);
        });
    }

    setFilterCutoff(frequency) {
        this.filters.forEach(filter => {
            filter.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        });
    }
    
    cleanup() {
        // Stop and disconnect all oscillators
        this.oscillators.forEach(osc => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (e) {
                // Oscillator might already be stopped
            }
        });
        
        // Disconnect all nodes
        this.gains.forEach(gain => gain.disconnect());
        this.filters.forEach(filter => filter.disconnect());
        this.gainNode.disconnect();
        
        // Disconnect effects chain
        if (this.chorus) {
            this.chorus.delays.forEach(delay => delay.disconnect());
            this.chorus.lfos.forEach(lfo => {
                try { lfo.stop(); } catch (e) {}
                lfo.disconnect();
            });
            this.chorus.mix.disconnect();
        }
        
        if (this.distortion) this.distortion.disconnect();
        if (this.characterFilter) this.characterFilter.disconnect();
        
        // Clear arrays
        this.oscillators = [];
        this.gains = [];
        this.filters = [];
    }
}

export class FMSynthesizer {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.audioContext = audioEngine.audioContext;
        
        this.carrier = this.audioContext.createOscillator();
        this.modulatorA = this.audioContext.createOscillator();
        this.modulatorB = this.audioContext.createOscillator();
        this.modIndexA = this.audioContext.createGain();
        this.modIndexB = this.audioContext.createGain();
        this.gainNode = this.audioContext.createGain();

        this.modulatorA.connect(this.modIndexA);
        this.modulatorB.connect(this.modIndexB);
        this.modIndexA.connect(this.carrier.frequency);
        this.modIndexB.connect(this.carrier.frequency);
        this.carrier.connect(this.gainNode);

        this.carrier.start();
        this.modulatorA.start();
        this.modulatorB.start();
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    }

    connect(destination) {
        this.gainNode.connect(destination);
    }

    play(baseFrequency, time, duration, settings) {
        const { indexValueA, indexValueB } = settings;
        const carrierFreq = baseFrequency;
        const modulatorAFreq = baseFrequency * 2;
        const modulatorBFreq = baseFrequency * 3;

        this.carrier.frequency.setValueAtTime(carrierFreq, time);
        this.modulatorA.frequency.setValueAtTime(modulatorAFreq, time);
        this.modulatorB.frequency.setValueAtTime(modulatorBFreq, time);
        this.modIndexA.gain.setValueAtTime(indexValueA * modulatorAFreq, time);
        this.modIndexB.gain.setValueAtTime(indexValueB * modulatorBFreq, time);

        this.gainNode.gain.cancelScheduledValues(time);
        this.gainNode.gain.setValueAtTime(0, time);
        this.gainNode.gain.linearRampToValueAtTime(0.5, time + 0.005);
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.005);
    }

    updateSettings(settings) {
        const { carrierFreq, modAFreq, modBFreq, indexA, indexB } = settings;
        const currentTime = this.audioContext.currentTime;
        
        this.carrier.frequency.setValueAtTime(carrierFreq, currentTime);
        this.modulatorA.frequency.setValueAtTime(modAFreq, currentTime);
        this.modulatorB.frequency.setValueAtTime(modBFreq, currentTime);
        this.modIndexA.gain.setValueAtTime(indexA * modAFreq, currentTime);
        this.modIndexB.gain.setValueAtTime(indexB * modBFreq, currentTime);
    }
}