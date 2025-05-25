export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.delayNode = null;
        this.delayFeedback = null;
        this.reverbNode = null;
        this.analyser = null;
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.delayNode = this.audioContext.createDelay();
            this.delayFeedback = this.audioContext.createGain();
            this.reverbNode = this.audioContext.createConvolver();
            this.analyser = this.audioContext.createAnalyser();

            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.connect(this.delayNode);
            this.delayNode.connect(this.delayFeedback);
            this.delayFeedback.connect(this.delayNode);
            this.delayNode.connect(this.reverbNode);
            this.reverbNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.delayNode.delayTime.setValueAtTime(0.3, this.audioContext.currentTime);
            this.delayFeedback.gain.setValueAtTime(0.4, this.audioContext.currentTime);
            this.masterGain.gain.setValueAtTime(0.7, this.audioContext.currentTime);

            this.createReverbImpulse();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser", e);
            throw new Error("Web Audio API is not supported in this browser");
        }
    }

    createReverbImpulse() {
        const length = 2 * this.audioContext.sampleRate;
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            left[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            right[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
        }

        this.reverbNode.buffer = impulse;
    }

    setMasterVolume(volume) {
        this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }

    resume() {
        if (this.audioContext.state === 'suspended') {
            return this.audioContext.resume();
        }
    }

    getCurrentTime() {
        return this.audioContext.currentTime;
    }

    close() {
        if (this.audioContext) {
            return this.audioContext.close();
        }
    }
}