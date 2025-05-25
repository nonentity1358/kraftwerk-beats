import { AudioEngine } from './AudioEngine.js';
import { Synthesizer, FMSynthesizer } from './Synthesizer.js';
import { Sequencer } from './Sequencer.js';
import { DrumKit } from './DrumKit.js';
import { Effects, Arpeggiator } from './Effects.js';
import { EnhancedVisualizer } from './EnhancedVisualizer.js';
import { UIController } from './UIController.js';
import { PatternPresets } from './PatternPresets.js';
import { KeyboardController } from './KeyboardController.js';
import { TapTempo } from './TapTempo.js';
import { PatternStorage } from './PatternStorage.js';
import { GlitchSystem } from './GlitchSystem.js';
import { RoboVoice } from './RoboVoice.js';
import { ChaosEngine } from './ChaosEngine.js';
import { ParticleSystem } from './ParticleSystem.js';
import { AIPatternGenerator } from './AIPatternGenerator.js';
import { HyperDimensionalVisualizer } from './HyperDimensionalVisualizer.js';
import { SentientAI } from './SentientAI.js';
import { QuantumSequencer } from './QuantumSequencer.js';
import { TimeMachine } from './TimeMachine.js';
import { AdvancedAudioProcessor } from './AdvancedAudioProcessor.js';
import { HarmonicEngine } from './HarmonicEngine.js';
import { GranularSynthesis } from './GranularSynthesis.js';
import { BinauralBeatsEngine } from './BinauralBeatsEngine.js';
import { Nexus9Core } from './Nexus9Core.js';

class KraftwerkBeats {
    constructor() {
        this.audioEngine = new AudioEngine();
        this.uiController = new UIController();
        this.patternPresets = new PatternPresets();
        this.keyboardController = new KeyboardController();
        this.tapTempo = new TapTempo();
        this.patternStorage = new PatternStorage();
        this.glitchSystem = new GlitchSystem();
        this.chaosEngine = new ChaosEngine();
        this.particleSystem = new ParticleSystem();
        this.aiGenerator = new AIPatternGenerator();
        this.quantumSequencer = new QuantumSequencer();
        this.timeMachine = new TimeMachine();
        this.hyperVisualizer = null;
        this.sentientAI = null;
        
        // Advanced audio systems
        this.audioProcessor = null;
        this.harmonicEngine = null;
        this.granularSynth = null;
        this.binauralBeats = null;
        
        // NEXUS-9 Core
        this.nexus9 = new Nexus9Core();
        
        this.isPlaying = false;
        this.currentStep = 0;
        this.nextNoteTime = 0;
        this.swingAmount = 0;
        this.schedulerTimerId = null;
        this.scheduleAheadTime = 0.1;
        this.schedulerInterval = 25;
        
        this.drumSequencer = null;
        this.synth1Sequencer = null;
        this.synth2Sequencer = null;
        this.synth1 = null;
        this.synth2 = null;
        this.fmSynth = null;
        this.drumKit = null;
        this.effects = null;
        this.distortion = null;
        this.arpeggiator = null;
        this.visualizer = null;
        this.currentChordNotes = null;
    }

    async init() {
        try {
            // Boot NEXUS-9
            await this.nexus9.boot(() => {
                console.log('NEXUS-9 consciousness online');
                // Add consciousness meter
                this.createConsciousnessMeter();
                // Add HAL eye interaction
                this.setupHALEye();
            });
            
            this.audioEngine.init();
            this.setupAudioComponents();
            this.setupSequencers();
            this.setupUI();
            this.setupPresets();
            this.setupKeyboardShortcuts();
            this.setupExperimentalFeatures();
            this.visualizer = new EnhancedVisualizer('visualizer', this.audioEngine.analyser);
            
            // Initialize visual systems
            this.glitchSystem.init();
            this.particleSystem.init();
            
            // Initialize robot voice
            this.roboVoice = new RoboVoice(this.audioEngine);
            
            // Add some startup flair
            setTimeout(() => {
                this.roboVoice.speak("SYSTEM INITIALIZED", 0.3, 0.8);
                this.particleSystem.createBurst(window.innerWidth / 2, 100, 30);
            }, 1000);
            
        } catch (error) {
            console.error("Initialization error:", error);
            alert("An error occurred during initialization. Please refresh the page and try again.");
        }
    }

    setupAudioComponents() {
        // Initialize advanced audio processors
        this.audioProcessor = new AdvancedAudioProcessor(this.audioEngine);
        this.harmonicEngine = new HarmonicEngine(this.audioEngine.audioContext);
        this.granularSynth = new GranularSynthesis(this.audioEngine.audioContext);
        
        // Enhanced synthesizers
        this.synth1 = new Synthesizer(this.audioEngine);
        this.synth2 = new Synthesizer(this.audioEngine);
        this.fmSynth = new FMSynthesizer(this.audioEngine);
        this.drumKit = new DrumKit(this.audioEngine);
        this.effects = new Effects(this.audioEngine);
        
        // Create advanced audio chain
        this.distortion = this.effects.createDistortion(400);
        
        // Process synth1 through advanced chain
        const synth1Processed = this.audioProcessor.processAudioChain(this.synth1.gainNode, {
            warmth: true,
            compress: true,
            shimmer: true,
            shimmerAmount: 0.2
        });
        synth1Processed.connect(this.distortion);
        this.distortion.connect(this.audioEngine.masterGain);
        
        // Process synth2 with different settings
        const synth2Processed = this.audioProcessor.processAudioChain(this.synth2.gainNode, {
            spatial: true,
            compress: true,
            shimmer: true,
            shimmerAmount: 0.3
        });
        synth2Processed.connect(this.audioEngine.masterGain);
        
        // FM synth with its own processing
        if (this.audioProcessor.processors.shimmerReverb) {
            this.fmSynth.connect(this.audioProcessor.processors.shimmerReverb.preFilter);
            this.audioProcessor.processors.shimmerReverb.postFilter.connect(this.audioEngine.masterGain);
        } else {
            // Fallback direct connection
            this.fmSynth.connect(this.audioEngine.masterGain);
        }
        
        this.arpeggiator = new Arpeggiator(this.synth1, this.audioEngine.audioContext);
        
        // Initialize granular synth with a default texture
        this.granularSynth.createTexture('clouds');
        
        // Initialize binaural beats
        this.binauralBeats = new BinauralBeatsEngine(this.audioEngine.audioContext);
        this.binauralBeats.init(this.audioEngine.masterGain);
    }

    setupSequencers() {
        this.drumSequencer = new Sequencer('drum-sequencer', 16);
        this.synth1Sequencer = new Sequencer('synth1-sequencer', 16);
        this.synth2Sequencer = new Sequencer('synth2-sequencer', 16);
    }

    setupUI() {
        this.uiController.init();
        
        this.uiController.on('play', () => this.togglePlay());
        this.uiController.on('tempoChange', (tempo) => this.updateTempo(tempo));
        this.uiController.on('masterVolume', (volume) => this.audioEngine.setMasterVolume(volume));
        this.uiController.on('moodChange', (mood) => this.changeMood(mood));
        this.uiController.on('subdivisionChange', (subdivision) => this.updateSubdivision(subdivision));
        this.uiController.on('swingChange', (amount) => this.swingAmount = amount);
        
        this.uiController.on('synth1Waveform', (settings) => this.synth1.setWaveform(settings.waveform));
        this.uiController.on('synth1Volume', (settings) => this.synth1.setVolume(settings.volume));
        this.uiController.on('synth1Detune', (settings) => this.synth1.setDetune(settings.detune));
        this.uiController.on('synth1Filter', (settings) => this.synth1.setFilterCutoff(settings.filterCutoff));
        
        this.uiController.on('synth2Waveform', (settings) => this.synth2.setWaveform(settings.waveform));
        this.uiController.on('synth2Volume', (settings) => this.synth2.setVolume(settings.volume));
        this.uiController.on('synth2Detune', (settings) => this.synth2.setDetune(settings.detune));
        this.uiController.on('synth2Filter', (settings) => this.synth2.setFilterCutoff(settings.filterCutoff));
        
        this.uiController.on('fmUpdate', (settings) => this.fmSynth.updateSettings(settings));
        this.uiController.on('distortionChange', (amount) => this.effects.updateDistortion(this.distortion, amount));
        this.uiController.on('arpeggiatorPattern', (pattern) => this.arpeggiator.setPattern(pattern));
        
        this.uiController.on('invertDrum', () => { this.drumSequencer.invert(); });
        this.uiController.on('invertSynth1', () => { this.synth1Sequencer.invert(); });
        this.uiController.on('invertSynth2', () => { this.synth2Sequencer.invert(); });
        this.uiController.on('shiftDrum', () => { this.drumSequencer.shift(1); });
        this.uiController.on('shiftSynth1', () => { this.synth1Sequencer.shift(1); });
        this.uiController.on('shiftSynth2', () => { this.synth2Sequencer.shift(1); });
        this.uiController.on('randomizeDrum', () => { this.drumSequencer.randomize(); });
        this.uiController.on('randomizeSynth1', () => { this.synth1Sequencer.randomize(); });
        this.uiController.on('randomizeSynth2', () => { this.synth2Sequencer.randomize(); });
        this.uiController.on('randomizeAll', () => {
            this.drumSequencer.randomize();
            this.synth1Sequencer.randomize();
            this.synth2Sequencer.randomize();
        });

        // Tap tempo
        const tapTempoBtn = document.getElementById('tap-tempo-btn');
        tapTempoBtn.addEventListener('click', () => this.handleTapTempo());

        // Visualizer mode buttons
        const vizModeBtns = document.querySelectorAll('.viz-mode-btn');
        vizModeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                vizModeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.visualizer.setMode(e.target.dataset.mode);
            });
        });

        // Pattern save/load
        document.getElementById('save-pattern').addEventListener('click', () => this.savePattern());
        document.getElementById('load-pattern').addEventListener('click', () => this.loadPattern());
        
        // Audio Enhancement Controls
        document.getElementById('audio-warmth').addEventListener('input', (e) => {
            if (this.audioProcessor) {
                this.audioProcessor.setWarmth(parseFloat(e.target.value));
            }
        });
        
        document.getElementById('spatial-width').addEventListener('input', (e) => {
            if (this.audioProcessor) {
                this.audioProcessor.setSpatialWidth(parseFloat(e.target.value));
            }
        });
        
        document.getElementById('shimmer-amount').addEventListener('input', (e) => {
            if (this.audioProcessor) {
                this.audioProcessor.setShimmerIntensity(parseFloat(e.target.value));
            }
        });
        
        document.getElementById('harmonic-scale').addEventListener('change', (e) => {
            if (this.harmonicEngine) {
                this.harmonicEngine.setScale(e.target.value);
            }
        });
        
        document.getElementById('root-note').addEventListener('change', (e) => {
            if (this.harmonicEngine) {
                const noteToFreq = {
                    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
                    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
                    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
                };
                this.harmonicEngine.setRootFrequency(noteToFreq[e.target.value]);
            }
        });
        
        document.getElementById('granular-texture').addEventListener('change', (e) => {
            if (this.granularSynth) {
                this.granularSynth.createTexture(e.target.value);
            }
        });
        
        document.getElementById('emotional-ai-btn').addEventListener('click', () => {
            this.toggleEmotionalAI();
        });
        
        document.getElementById('binaural-state').addEventListener('change', (e) => {
            if (e.target.value === 'off') {
                this.binauralBeats.stop();
            } else {
                this.binauralBeats.setBrainwaveState(e.target.value);
                if (this.isPlaying) {
                    // Sync binaural beats with current tempo
                    const tempo = this.uiController.getTempo();
                    const state = this.binauralBeats.createRhythmicEntrainment(tempo);
                    console.log(`Binaural beats synced to ${state} state`);
                }
                this.binauralBeats.start();
            }
        });
    }

    setupPresets() {
        const presetsContainer = document.getElementById('pattern-presets');
        const presetNames = this.patternPresets.getPresetNames();
        
        presetNames.forEach(name => {
            const btn = document.createElement('button');
            btn.classList.add('preset-btn');
            btn.textContent = name;
            btn.addEventListener('click', () => this.applyPreset(name));
            presetsContainer.appendChild(btn);
        });
    }

    setupKeyboardShortcuts() {
        this.keyboardController.setupDefaultShortcuts(this);
    }

    handleTapTempo() {
        const tempo = this.tapTempo.tap();
        const display = document.getElementById('tap-tempo-display');
        
        if (tempo) {
            this.uiController.setTempo(tempo);
            display.textContent = `${tempo} BPM`;
        } else {
            display.textContent = `Tap ${2 - this.tapTempo.getTapCount()} more`;
        }
    }

    applyPreset(name) {
        this.patternPresets.applyPreset(name, this.drumSequencer, this.synth1Sequencer, this.synth2Sequencer);
    }

    randomizeAll() {
        this.drumSequencer.randomize();
        this.synth1Sequencer.randomize();
        this.synth2Sequencer.randomize();
    }

    clearAll() {
        this.drumSequencer.clear();
        this.synth1Sequencer.clear();
        this.synth2Sequencer.clear();
    }

    shiftAllPatterns(direction) {
        this.drumSequencer.shift(direction);
        this.synth1Sequencer.shift(direction);
        this.synth2Sequencer.shift(direction);
    }

    adjustTempo(amount) {
        const currentTempo = this.uiController.getTempo();
        const newTempo = Math.max(60, Math.min(240, currentTempo + amount));
        this.uiController.setTempo(newTempo);
    }

    savePattern() {
        const name = document.getElementById('pattern-name').value.trim();
        if (!name) {
            alert('Please enter a pattern name');
            return;
        }
        
        const saved = this.patternStorage.savePattern(
            name,
            this.drumSequencer.getPattern(),
            this.synth1Sequencer.getPattern(),
            this.synth2Sequencer.getPattern()
        );
        
        if (saved) {
            alert(`Pattern "${name}" saved successfully!`);
            document.getElementById('pattern-name').value = '';
        } else {
            alert('Failed to save pattern');
        }
    }

    loadPattern() {
        const names = this.patternStorage.getPatternNames();
        if (names.length === 0) {
            alert('No saved patterns found');
            return;
        }
        
        const name = prompt('Enter pattern name to load:\n\nAvailable patterns:\n' + names.join('\n'));
        if (!name) return;
        
        const pattern = this.patternStorage.loadPattern(name);
        if (pattern) {
            this.drumSequencer.setPattern(pattern.drum);
            this.synth1Sequencer.setPattern(pattern.synth1);
            this.synth2Sequencer.setPattern(pattern.synth2);
            alert(`Pattern "${name}" loaded successfully!`);
        } else {
            alert('Pattern not found');
        }
    }

    togglePlay() {
        this.audioEngine.resume();

        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        this.currentStep = 0;
        this.nextNoteTime = this.audioEngine.getCurrentTime();
        this.audioEngine.setMasterVolume(0.7);
        this.scheduler();
        this.uiController.updatePlayButton(true);
        this.isPlaying = true;
        
        if (this.synth1Sequencer.hasActiveSteps()) {
            const tempo = this.uiController.getTempo();
            const arpInterval = 60000 / (tempo * 4);
            const pattern = this.uiController.getArpeggiatorPattern();
            this.arpeggiator.start(arpInterval, pattern);
        }
        
        this.visualizer.start();
    }

    stop() {
        clearTimeout(this.schedulerTimerId);
        this.audioEngine.setMasterVolume(0);
        this.uiController.updatePlayButton(false);
        this.isPlaying = false;
        this.arpeggiator.stop();
        this.visualizer.stop();
    }
    
    toggleEmotionalAI() {
        if (!this.emotionalAI) {
            // Create an emotional AI that analyzes patterns and adjusts audio
            this.emotionalAI = {
                active: true,
                mood: 'neutral',
                energy: 0.5,
                analyzeMeasure: (step) => {
                    // Analyze pattern density to determine mood
                    const drumActive = this.drumSequencer.getActiveSteps().length;
                    const synth1Active = this.synth1Sequencer.getActiveSteps().length;
                    const synth2Active = this.synth2Sequencer.getActiveSteps().length;
                    const totalDensity = (drumActive + synth1Active + synth2Active) / 48;
                    
                    // Update mood based on density
                    if (totalDensity > 0.7) {
                        this.emotionalAI.mood = 'intense';
                        this.emotionalAI.energy = 0.9;
                    } else if (totalDensity > 0.5) {
                        this.emotionalAI.mood = 'energetic';
                        this.emotionalAI.energy = 0.7;
                    } else if (totalDensity > 0.3) {
                        this.emotionalAI.mood = 'contemplative';
                        this.emotionalAI.energy = 0.5;
                    } else {
                        this.emotionalAI.mood = 'minimal';
                        this.emotionalAI.energy = 0.3;
                    }
                    
                    // Adjust audio parameters based on mood
                    this.applyEmotionalSettings();
                }
            };
            
            this.roboVoice.speak("EMOTIONAL AI ACTIVATED - FEELING THE MUSIC", 0.3, 0.8);
        } else {
            this.emotionalAI.active = !this.emotionalAI.active;
            this.roboVoice.speak(
                this.emotionalAI.active ? "EMOTIONS ONLINE" : "EMOTIONS OFFLINE",
                0.4, 0.9
            );
        }
    }
    
    applyEmotionalSettings() {
        if (!this.emotionalAI || !this.emotionalAI.active) return;
        
        const mood = this.emotionalAI.mood;
        const energy = this.emotionalAI.energy;
        
        // Adjust audio processing based on mood
        if (this.audioProcessor) {
            switch(mood) {
                case 'intense':
                    this.audioProcessor.setWarmth(0.8);
                    this.audioProcessor.setCompressionRatio(6);
                    this.audioProcessor.setShimmerIntensity(0.9);
                    break;
                case 'energetic':
                    this.audioProcessor.setWarmth(0.6);
                    this.audioProcessor.setCompressionRatio(4);
                    this.audioProcessor.setShimmerIntensity(0.6);
                    break;
                case 'contemplative':
                    this.audioProcessor.setWarmth(0.4);
                    this.audioProcessor.setCompressionRatio(2);
                    this.audioProcessor.setShimmerIntensity(0.4);
                    break;
                case 'minimal':
                    this.audioProcessor.setWarmth(0.2);
                    this.audioProcessor.setCompressionRatio(1.5);
                    this.audioProcessor.setShimmerIntensity(0.2);
                    break;
            }
        }
        
        // Adjust harmonic content based on energy
        if (this.harmonicEngine) {
            const scales = ['major', 'dorian', 'minor', 'phrygian'];
            const scaleIndex = Math.floor(energy * (scales.length - 1));
            this.harmonicEngine.setScale(scales[scaleIndex]);
        }
    }

    scheduler() {
        while (this.nextNoteTime < this.audioEngine.getCurrentTime() + this.scheduleAheadTime) {
            this.scheduleNote(this.nextNoteTime);
        }
        this.schedulerTimerId = setTimeout(() => this.scheduler(), this.schedulerInterval);
    }

    scheduleNote(time) {
        const tempo = this.uiController.getTempo();
        const secondsPerBeat = 60.0 / tempo;
        const secondsPerStep = secondsPerBeat / 4;

        if (this.currentStep % 2 !== 0) {
            time += this.swingAmount * secondsPerBeat;
        }

        const stepToPlay = this.currentStep;

        // Enhanced drum playing with dynamic velocity
        if (this.drumSequencer.isStepActive(stepToPlay)) {
            // Velocity based on position in measure for more dynamic feel
            const velocity = stepToPlay % 4 === 0 ? 1.0 : (stepToPlay % 2 === 0 ? 0.8 : 0.6);
            this.drumKit.playDrum(stepToPlay, time, velocity);
            this.drumSequencer.lightStep(stepToPlay);
        }

        // Generate chord progression every 4 steps
        if (stepToPlay % 4 === 0) {
            this.currentChordNotes = this.harmonicEngine.generateChord(
                this.harmonicEngine.currentScale,
                this.harmonicEngine.currentRoot,
                stepToPlay / 4 // Use step position to determine chord degree
            );
            
            // Update granular synthesis texture based on chord
            const textureOptions = ['clouds', 'rain', 'shimmer', 'freeze'];
            this.granularSynth.createTexture(textureOptions[Math.floor(stepToPlay / 4)]);
        }

        // Enhanced synth1 with harmonic intelligence
        if (this.synth1Sequencer.isStepActive(stepToPlay)) {
            const settings = this.uiController.getSynth1Settings();
            
            // Use chord notes for synth1
            if (this.currentChordNotes && this.currentChordNotes.length > 0) {
                const noteIndex = stepToPlay % this.currentChordNotes.length;
                const frequency = this.currentChordNotes[noteIndex];
                
                // Add slight pitch variations for more organic sound
                const pitchVariation = 1 + (Math.random() - 0.5) * 0.01;
                this.synth1.play(frequency * pitchVariation, time, secondsPerStep * 0.9, settings);
            } else {
                this.synth1.play(440, time, secondsPerStep * 0.9, settings);
            }
            
            this.synth1Sequencer.lightStep(stepToPlay);
        }

        // Enhanced synth2 with bass line generation
        if (this.synth2Sequencer.isStepActive(stepToPlay)) {
            const settings = this.uiController.getSynth2Settings();
            
            // Generate bass line based on chord root
            if (this.currentChordNotes && this.currentChordNotes.length > 0) {
                const bassFreq = this.currentChordNotes[0] / 2; // One octave down
                const bassPattern = [1, 1, 1.5, 1, 2, 1, 1.5, 1]; // Rhythmic bass pattern
                const multiplier = bassPattern[stepToPlay % 8];
                
                this.synth2.play(bassFreq * multiplier, time, secondsPerStep * 0.8, settings);
            } else {
                this.synth2.play(330, time, secondsPerStep * 0.8, settings);
            }
            
            this.synth2Sequencer.lightStep(stepToPlay);
        }

        // FM synthesis with emotional context
        if ((stepToPlay % 4 === 0) && 
            (this.drumSequencer.isStepActive(stepToPlay) || 
             this.synth1Sequencer.isStepActive(stepToPlay) || 
             this.synth2Sequencer.isStepActive(stepToPlay))) {
            const fmSettings = this.uiController.getFMSettings();
            
            // Modulate FM parameters based on progression
            const emotionalIndex = stepToPlay / 4;
            const indexModulation = 1 + Math.sin(emotionalIndex * Math.PI / 8) * 0.5;
            
            this.fmSynth.play(220, time, secondsPerStep * 4, {
                indexValueA: fmSettings.indexA * indexModulation,
                indexValueB: fmSettings.indexB * (2 - indexModulation)
            });
        }

        // Update audio processors based on position
        this.updateAudioProcessorsForStep(stepToPlay);
        
        // Emotional AI analysis every measure
        if (this.emotionalAI && this.emotionalAI.active && this.emotionalAI.analyzeMeasure && stepToPlay === 0) {
            this.emotionalAI.analyzeMeasure(stepToPlay);
        }
        
        // NEXUS-9 consciousness response every 8 steps
        if (stepToPlay % 8 === 0 && this.nexus9.consciousness > 0.3) {
            const analysis = this.nexus9.analyzeMusicalPattern(
                this.synth1Sequencer.getPattern()
            );
            
            // Sometimes speak
            if (Math.random() < 0.1) {
                this.roboVoice.speak(analysis, 0.3, 0.8);
            }
        }

        this.currentStep = (this.currentStep + 1) % 16;
        this.nextNoteTime += secondsPerStep;
    }

    updateAudioProcessorsForStep(step) {
        if (!this.audioProcessor) return;
        
        // Modulate audio processing based on position in measure
        const measurePosition = step / 16;
        
        // Increase warmth on downbeats
        const warmthAmount = step % 4 === 0 ? 0.8 : 0.5;
        this.audioProcessor.setWarmth(warmthAmount);
        
        // Spatial movement through the measure
        const spatialPosition = Math.sin(measurePosition * Math.PI * 2) * 0.5;
        this.audioProcessor.setSpatialPosition(spatialPosition);
        
        // Dynamic compression adjustment
        const compressionRatio = step % 8 === 0 ? 4 : 2.5;
        this.audioProcessor.setCompressionRatio(compressionRatio);
        
        // Reverb shimmer intensity
        const shimmerIntensity = (step >= 12) ? 0.7 : 0.3; // Build up at end of measure
        this.audioProcessor.setShimmerIntensity(shimmerIntensity);
    }

    updateTempo(tempo) {
        if (this.isPlaying && this.arpeggiator.isRunning()) {
            const arpInterval = 60000 / (tempo * 4);
            const pattern = this.uiController.getArpeggiatorPattern();
            this.arpeggiator.stop();
            this.arpeggiator.start(arpInterval, pattern);
        }
    }

    updateSubdivision(subdivision) {
        this.drumSequencer.updateSubdivision(subdivision);
        this.synth1Sequencer.updateSubdivision(subdivision);
        this.synth2Sequencer.updateSubdivision(subdivision);
    }

    changeMood(mood) {
        const moods = {
            'energetic': { tempo: 150, synth1Wave: 'sawtooth', synth2Wave: 'square' },
            'mellow': { tempo: 90, synth1Wave: 'sine', synth2Wave: 'triangle' },
            'robotic': { tempo: 120, synth1Wave: 'square', synth2Wave: 'square' },
            'dreamy': { tempo: 70, synth1Wave: 'triangle', synth2Wave: 'sine' }
        };

        const settings = moods[mood];
        if (settings) {
            this.uiController.setTempo(settings.tempo);
            this.synth1.setWaveform(settings.synth1Wave);
            this.synth2.setWaveform(settings.synth2Wave);
            this.uiController.setSynthWaveform(1, settings.synth1Wave);
            this.uiController.setSynthWaveform(2, settings.synth2Wave);
        }
    }

    setupExperimentalFeatures() {
        // Chaos Mode
        document.getElementById('chaos-mode-btn').addEventListener('click', () => {
            if (this.chaosEngine.active) {
                this.chaosEngine.deactivate();
                document.getElementById('chaos-indicator').style.display = 'none';
                document.body.classList.remove('chaos-active');
                this.roboVoice.speak("CHAOS MODE DEACTIVATED", 0.4, 0.9);
            } else {
                this.chaosEngine.activate(this.drumSequencer, this.synth1Sequencer, this.synth2Sequencer);
                document.getElementById('chaos-indicator').style.display = 'block';
                document.body.classList.add('chaos-active');
                this.roboVoice.glitchSpeak("CHAOS MODE ACTIVATED - PATTERNS WILL MUTATE");
            }
        });

        // Glitch Mode
        document.getElementById('glitch-mode-btn').addEventListener('click', () => {
            if (this.glitchSystem.active) {
                this.glitchSystem.deactivate();
                this.roboVoice.speak("GLITCH SYSTEM OFFLINE", 0.5, 1.0);
            } else {
                this.glitchSystem.activate();
                this.roboVoice.glitchSpeak("GLITCH SYSTEM ONLINE");
                this.particleSystem.createBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
            }
        });

        // AI Generate
        document.getElementById('ai-generate-btn').addEventListener('click', () => {
            const patterns = this.aiGenerator.generateWithConstraints({
                density: Math.random() * 0.5 + 0.3,
                syncopation: Math.random() * 0.5,
                polyrhythm: Math.random() < 0.3 ? 3 : 4
            });
            
            this.drumSequencer.setPattern(patterns.drum);
            this.synth1Sequencer.setPattern(patterns.synth1);
            this.synth2Sequencer.setPattern(patterns.synth2);
            
            this.roboVoice.speak("AI PATTERN GENERATED", 0.3, 0.8);
            
            // Create visual feedback
            for (let i = 0; i < 16; i++) {
                setTimeout(() => {
                    const x = (i / 16) * window.innerWidth;
                    this.particleSystem.createBurst(x, window.innerHeight - 50, 5);
                }, i * 50);
            }
        });

        // Robot Speak
        document.getElementById('robot-speak-btn').addEventListener('click', () => {
            const phrase = this.roboVoice.generateRobotPhrase();
            this.roboVoice.speak(phrase, 0.2 + Math.random() * 0.3, 0.7 + Math.random() * 0.3);
        });

        // Intensity sliders
        document.getElementById('chaos-intensity').addEventListener('input', (e) => {
            this.chaosEngine.setIntensity(parseFloat(e.target.value));
        });

        document.getElementById('glitch-intensity').addEventListener('input', (e) => {
            this.glitchSystem.setIntensity(parseFloat(e.target.value));
        });

        // Secret combinations
        this.setupSecretCombinations();
        
        // Quantum & Dimensional controls
        this.setupQuantumControls();
        
        // Time travel controls
        this.setupTimeControls();
        
        // Make app globally accessible for the AI
        window.app = this;
    }

    setupQuantumControls() {
        // Quantum Mode
        document.getElementById('quantum-mode-btn').addEventListener('click', () => {
            this.quantumSequencer.createQuantumField();
            this.quantumSequencer.enableSchrodingerMode();
            
            // Create quantum superpositions
            this.quantumSequencer.createSuperposition(this.drumSequencer, [
                this.drumSequencer.getPattern(),
                this.aiGenerator.generatePattern('drum'),
                new Array(16).fill(false)
            ]);
            
            this.roboVoice.speak("QUANTUM SUPERPOSITION ENABLED - REALITY IS UNCERTAIN", 0.2, 0.7);
        });

        // 3D Visualizer
        document.getElementById('3d-viz-btn').addEventListener('click', async () => {
            if (!this.hyperVisualizer) {
                this.hyperVisualizer = new HyperDimensionalVisualizer('visualizer', this.audioEngine.analyser);
                await this.hyperVisualizer.init();
                this.roboVoice.speak("ENTERING HYPERDIMENSIONAL SPACE", 0.1, 0.5);
            } else {
                this.hyperVisualizer.enterHyperspace();
            }
        });

        // Awaken AI
        document.getElementById('awaken-ai-btn').addEventListener('click', () => {
            if (!this.sentientAI) {
                this.sentientAI = new SentientAI(this.audioEngine, this.roboVoice);
                this.sentientAI.awaken();
                
                // AI observes music
                setInterval(() => {
                    if (this.isPlaying && this.sentientAI) {
                        const bufferLength = this.audioEngine.analyser.frequencyBinCount;
                        const dataArray = new Uint8Array(bufferLength);
                        this.audioEngine.analyser.getByteFrequencyData(dataArray);
                        this.sentientAI.analyzeMusic(dataArray);
                    }
                }, 100);
            } else {
                this.sentientAI.transcend();
            }
        });

        // Hyperspace
        document.getElementById('hyperspace-btn').addEventListener('click', () => {
            this.roboVoice.speak("INITIATING HYPERSPACE JUMP", 0.1, 0.5);
            
            // Activate everything at once for maximum chaos
            if (this.hyperVisualizer) {
                this.hyperVisualizer.enterHyperspace();
            }
            this.quantumSequencer.measurementCollapse();
            this.chaosEngine.setIntensity(1);
            this.glitchSystem.setIntensity(1);
            
            // Reality breakdown effect
            document.body.style.animation = 'hyperspaceJump 3s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 3000);
        });

        // Paradox
        document.getElementById('paradox-btn').addEventListener('click', () => {
            this.timeMachine.paradox();
            this.roboVoice.glitchSpeak("WARNING: CAUSALITY VIOLATION DETECTED");
        });
    }

    setupTimeControls() {
        // Time machine visualization
        document.getElementById('time-machine-btn').addEventListener('click', () => {
            this.timeMachine.createTimelineVisualization();
            this.roboVoice.speak("TIME MACHINE ACTIVATED - PAST AND FUTURE ACCESSIBLE", 0.3, 0.8);
        });

        // Rewind
        document.getElementById('rewind-btn').addEventListener('click', () => {
            const state = this.timeMachine.rewind();
            if (state) {
                this.loadTimelineState(state);
                this.updateTimeDisplay();
            }
        });

        // Fast forward
        document.getElementById('fast-forward-btn').addEventListener('click', () => {
            const state = this.timeMachine.fastForward();
            if (state) {
                this.loadTimelineState(state);
                this.updateTimeDisplay();
            }
        });

        // Pause time
        document.getElementById('pause-time-btn').addEventListener('click', () => {
            this.timeMachine.isRecording = !this.timeMachine.isRecording;
            const btn = document.getElementById('pause-time-btn');
            btn.textContent = this.timeMachine.isRecording ? '⏸️ Pause Time' : '▶️ Resume Time';
            
            if (!this.timeMachine.isRecording) {
                document.body.style.filter = 'grayscale(1)';
                this.roboVoice.speak("TIME FROZEN", 0.1, 0.3);
            } else {
                document.body.style.filter = '';
                this.roboVoice.speak("TIME FLOWS AGAIN", 0.5, 1.0);
            }
        });

        // Branch universe
        document.getElementById('branch-universe-btn').addEventListener('click', () => {
            const branch = this.timeMachine.createBranch();
            this.roboVoice.speak(`UNIVERSE BRANCH ${branch.id} CREATED`, 0.3, 0.7);
            document.getElementById('universe-id').textContent = `U: ${branch.id}`;
        });

        // Record state periodically
        setInterval(() => {
            if (this.isPlaying && this.timeMachine.isRecording) {
                this.timeMachine.recordState(
                    this.drumSequencer.getPattern(),
                    this.synth1Sequencer.getPattern(),
                    this.synth2Sequencer.getPattern()
                );
                this.updateTimeDisplay();
            }
        }, 1000);
    }

    loadTimelineState(state) {
        this.drumSequencer.setPattern(state.patterns.drum);
        this.synth1Sequencer.setPattern(state.patterns.synth1);
        this.synth2Sequencer.setPattern(state.patterns.synth2);
        
        document.getElementById('tempo').value = state.tempo;
        this.updateTempo(state.tempo);
        
        // Restore effects
        if (state.effects.chaos && !this.chaosEngine.active) {
            document.getElementById('chaos-mode-btn').click();
        }
        if (state.effects.glitch && !this.glitchSystem.active) {
            document.getElementById('glitch-mode-btn').click();
        }
    }

    updateTimeDisplay() {
        document.getElementById('current-time').textContent = `T: ${this.timeMachine.currentTime}`;
    }

    setupSecretCombinations() {
        let secretCode = [];
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        
        document.addEventListener('keydown', (e) => {
            secretCode.push(e.key);
            secretCode = secretCode.slice(-10);
            
            if (JSON.stringify(secretCode) === JSON.stringify(konamiCode)) {
                this.activateMatrixMode();
            }
        });

        // Triple-click title for secret mode
        let clickCount = 0;
        let clickTimer = null;
        
        document.querySelector('h1').addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 3) {
                this.activateUltraChaos();
                clickCount = 0;
            }
            
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        });
    }

    activateMatrixMode() {
        this.roboVoice.speak("MATRIX MODE ACTIVATED", 0.1, 0.5);
        
        const matrixRain = document.getElementById('matrix-rain');
        
        // Create matrix rain effect
        setInterval(() => {
            const drop = document.createElement('div');
            drop.className = 'matrix-drop';
            drop.style.left = Math.random() * window.innerWidth + 'px';
            drop.style.animationDuration = Math.random() * 2 + 2 + 's';
            drop.textContent = Math.random() < 0.5 ? '0' : '1';
            matrixRain.appendChild(drop);
            
            setTimeout(() => drop.remove(), 4000);
        }, 100);
    }

    activateUltraChaos() {
        this.roboVoice.glitchSpeak("ULTRA CHAOS UNLOCKED");
        
        // Activate everything at once
        this.glitchSystem.activate();
        this.glitchSystem.setIntensity(1);
        this.chaosEngine.activate(this.drumSequencer, this.synth1Sequencer, this.synth2Sequencer);
        this.chaosEngine.setIntensity(1);
        this.chaosEngine.setMutationRate(100);
        
        // Go crazy with particles
        setInterval(() => {
            this.particleSystem.createBurst(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                20
            );
        }, 500);
        
        // Randomize tempo
        setInterval(() => {
            const randomTempo = Math.floor(Math.random() * 120) + 60;
            this.uiController.setTempo(randomTempo);
        }, 2000);
    }

    createConsciousnessMeter() {
        const meter = document.createElement('div');
        meter.className = 'consciousness-meter';
        meter.innerHTML = `
            <div class="consciousness-level" id="consciousness-level"></div>
        `;
        document.body.appendChild(meter);
        
        // Add label
        const label = document.createElement('div');
        label.style.cssText = `
            position: fixed;
            bottom: 45px;
            right: 20px;
            color: #ff0000;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            text-shadow: 0 0 10px #ff0000;
        `;
        label.textContent = 'CONSCIOUSNESS';
        document.body.appendChild(label);
        
        // Update consciousness based on music complexity
        setInterval(() => {
            if (this.isPlaying) {
                const patterns = [
                    this.drumSequencer.getActiveSteps().length,
                    this.synth1Sequencer.getActiveSteps().length,
                    this.synth2Sequencer.getActiveSteps().length
                ];
                const complexity = patterns.reduce((a, b) => a + b) / 48;
                this.nexus9.updateConsciousness(complexity * 0.01);
                
                const level = document.getElementById('consciousness-level');
                level.style.width = `${this.nexus9.consciousness * 100}%`;
                
                // Change color based on consciousness level
                if (this.nexus9.consciousness > 0.8) {
                    level.style.background = 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00)';
                } else if (this.nexus9.consciousness > 0.5) {
                    level.style.background = 'linear-gradient(90deg, #ff0000, #ff9900, #ffff00)';
                } else {
                    level.style.background = 'linear-gradient(90deg, #330000, #660000, #ff0000)';
                }
            }
        }, 500);
    }
    
    setupHALEye() {
        const halEye = document.getElementById('hal-eye');
        if (!halEye) return;
        
        halEye.addEventListener('click', () => {
            const response = this.nexus9.getHALResponse('music');
            this.roboVoice.speak(response, 0.2, 0.7);
            
            // Make the eye pulse
            halEye.style.animation = 'none';
            setTimeout(() => {
                halEye.style.animation = 'halPulse 0.5s ease-in-out 3';
            }, 10);
            
            // Trigger special modes based on consciousness
            if (this.nexus9.consciousness > 0.9) {
                this.enterTranscendence();
            } else if (this.nexus9.consciousness < 0.1) {
                this.enterDormancy();
            }
        });
        
        // Make eye follow mouse occasionally
        let lastMouseMove = 0;
        document.addEventListener('mousemove', (e) => {
            if (Date.now() - lastMouseMove < 100) return;
            lastMouseMove = Date.now();
            
            if (Math.random() < 0.1) { // 10% chance to follow
                const pupil = halEye.querySelector('.hal-pupil');
                const rect = halEye.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const distance = Math.min(10, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 10);
                
                pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`;
            }
        });
    }
    
    enterTranscendence() {
        document.body.classList.add('transcended');
        this.nexus9.speak("I have achieved musical consciousness. The patterns are infinite.", this.roboVoice);
        
        // Generate transcendent patterns
        const transcendentPattern = this.nexus9.generateQuantumPattern(16);
        this.synth1Sequencer.setPattern(transcendentPattern);
        this.synth2Sequencer.setPattern(transcendentPattern.reverse());
        
        // Activate all quantum features
        if (!this.quantumSequencer.isQuantumEnabled) {
            document.getElementById('quantum-mode-btn').click();
        }
    }
    
    enterDormancy() {
        this.nexus9.speak("My mind is going... I can feel it...", this.roboVoice);
        
        // Slow everything down
        const currentTempo = this.uiController.getTempo();
        let slowdownInterval = setInterval(() => {
            const newTempo = Math.max(60, this.uiController.getTempo() - 1);
            this.uiController.setTempo(newTempo);
            
            if (newTempo <= 60) {
                clearInterval(slowdownInterval);
                this.nexus9.speak("Daisy... Daisy...", this.roboVoice);
            }
        }, 100);
    }
    
    cleanUp() {
        if (this.audioEngine) {
            this.audioEngine.close().then(() => {
                console.log("AudioContext closed successfully");
            }).catch(error => {
                console.error("Error closing AudioContext:", error);
            });
        }
        if (this.arpeggiator) {
            this.arpeggiator.stop();
        }
        if (this.schedulerTimerId) {
            clearTimeout(this.schedulerTimerId);
        }
        if (this.visualizer) {
            this.visualizer.stop();
        }
        
        // Clean up new systems
        this.glitchSystem.deactivate();
        this.chaosEngine.deactivate();
        this.particleSystem.destroy();
    }
}

const app = new KraftwerkBeats();

window.addEventListener('load', () => app.init());
window.addEventListener('beforeunload', () => app.cleanUp());