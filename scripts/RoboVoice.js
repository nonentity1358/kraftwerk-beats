export class RoboVoice {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.audioContext = audioEngine.audioContext;
        this.voices = [];
        this.currentVoice = null;
        this.setupSpeechSynthesis();
    }

    setupSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            speechSynthesis.onvoiceschanged = () => {
                this.voices = speechSynthesis.getVoices();
                // Prefer robotic-sounding voices
                this.currentVoice = this.voices.find(voice => 
                    voice.name.includes('Robot') || 
                    voice.name.includes('Computer') ||
                    voice.name.includes('Zarvox')
                ) || this.voices[0];
            };
        }
    }

    speak(text, pitch = 0.5, rate = 0.8) {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.currentVoice;
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = 0.8;

        // Process through Web Audio API for extra effects
        if (this.audioContext && this.audioEngine.masterGain) {
            this.addRoboticEffects(utterance);
        }

        speechSynthesis.speak(utterance);
    }

    addRoboticEffects(utterance) {
        // This is a placeholder for future Web Audio API integration
        // In a real implementation, we'd route the speech through effects
    }

    generateRobotPhrase() {
        const phrases = [
            "SYSTEM INITIALIZED",
            "BEATS ACTIVATED",
            "SYNCHRONIZATION COMPLETE",
            "RHYTHM MATRIX ONLINE",
            "AUDIO PROTOCOL ENGAGED",
            "PATTERN RECOGNITION ACTIVE",
            "SONIC INTERFACE READY",
            "ELECTRONIC MUSIC GENERATED",
            "KRAFTWERK MODE ENABLED",
            "ROBOTIC SEQUENCE INITIATED",
            "DIGITAL HARMONY ACHIEVED",
            "SYNTHESIZER CALIBRATED"
        ];
        
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    announcePattern(patternName) {
        this.speak(`Loading pattern: ${patternName}`, 0.3, 0.9);
    }

    announceTempo(bpm) {
        this.speak(`Tempo set to ${bpm} beats per minute`, 0.4, 1.0);
    }

    announceMode(mode) {
        this.speak(`${mode} mode activated`, 0.3, 0.8);
    }

    glitchSpeak(text) {
        // Speak with random glitches
        let glitchedText = '';
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < 0.1) {
                glitchedText += text[i].repeat(Math.floor(Math.random() * 3) + 1);
            } else if (Math.random() < 0.05) {
                glitchedText += ' ';
            } else {
                glitchedText += text[i];
            }
        }
        
        this.speak(glitchedText, Math.random() * 0.5 + 0.2, Math.random() * 0.5 + 0.5);
    }

    countdown(callback) {
        const numbers = ['THREE', 'TWO', 'ONE', 'GO'];
        let index = 0;
        
        const speakNext = () => {
            if (index < numbers.length) {
                this.speak(numbers[index], 0.3, 0.7);
                index++;
                setTimeout(speakNext, 1000);
            } else {
                if (callback) callback();
            }
        };
        
        speakNext();
    }

    speakBinary(decimalNumber) {
        const binary = decimalNumber.toString(2);
        const spokenBinary = binary.split('').join(' ');
        this.speak(`Binary: ${spokenBinary}`, 0.2, 1.2);
    }

    createVocalSynth() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 10;
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioEngine.masterGain);
        
        return {
            oscillator,
            gainNode,
            filter,
            playNote: (frequency, time, duration) => {
                oscillator.frequency.setValueAtTime(frequency, time);
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.3, time + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);
            },
            start: () => oscillator.start(),
            stop: (time) => oscillator.stop(time)
        };
    }
}