export class Effects {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.audioContext = audioEngine.audioContext;
        this.distortionCurveCache = new Map();
    }

    createDistortion(amount) {
        if (this.distortionCurveCache.has(amount)) {
            return this.distortionCurveCache.get(amount);
        }

        const distortion = this.audioContext.createWaveShaper();
        const k = typeof amount === 'number' ? amount : 50;
        const deg = Math.PI / 180;
        const curve = new Float32Array(44100);
        
        for (let i = 0; i < 44100; ++i) {
            const x = i * 2 / 44100 - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        
        distortion.curve = curve;
        this.distortionCurveCache.set(amount, distortion);
        return distortion;
    }

    updateDistortion(distortionNode, amount) {
        const newDistortion = this.createDistortion(amount);
        distortionNode.curve = newDistortion.curve;
    }
}

export class Arpeggiator {
    constructor(synth, audioContext) {
        this.synth = synth;
        this.audioContext = audioContext;
        this.intervalId = null;
        this.index = 0;
        this.notes = [440, 550, 660, 880];
        this.pattern = 'up';
    }

    start(interval = 125, pattern = 'up') {
        this.stop();
        this.pattern = pattern;
        this.index = 0;
        
        this.intervalId = setInterval(() => {
            const frequency = this.getNextFrequency();
            // Update all oscillators if using multi-oscillator synth
            if (this.synth.oscillators) {
                this.synth.oscillators.forEach((osc, i) => {
                    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                });
            } else if (this.synth.oscillator) {
                // Fallback for single oscillator
                this.synth.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            }
        }, interval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    getNextFrequency() {
        let frequency;
        switch (this.pattern) {
            case 'up':
                frequency = this.notes[this.index % this.notes.length];
                this.index++;
                break;
            case 'down':
                frequency = this.notes[this.notes.length - 1 - (this.index % this.notes.length)];
                this.index++;
                break;
            case 'updown':
                const updownSequence = [...this.notes, ...this.notes.slice(1, -1).reverse()];
                frequency = updownSequence[this.index % updownSequence.length];
                this.index++;
                break;
            case 'random':
                frequency = this.notes[Math.floor(Math.random() * this.notes.length)];
                break;
            default:
                frequency = this.notes[0];
        }
        return frequency;
    }

    setPattern(pattern) {
        this.pattern = pattern;
        this.index = 0;
    }

    setNotes(notes) {
        this.notes = notes;
    }

    isRunning() {
        return this.intervalId !== null;
    }
}