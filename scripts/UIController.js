export class UIController {
    constructor() {
        this.elements = {};
        this.callbacks = {};
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
    }

    cacheElements() {
        this.elements = {
            playButton: document.getElementById('play-button'),
            tempo: document.getElementById('tempo'),
            tempoValue: document.getElementById('tempo-value'),
            masterVolume: document.getElementById('master-volume'),
            moodSelect: document.getElementById('mood-select'),
            subdivisionSelect: document.getElementById('subdivision-select'),
            swing: document.getElementById('swing'),
            
            synth1Waveform: document.getElementById('synth1-waveform'),
            synth1Volume: document.getElementById('synth1-volume'),
            synth1Detune: document.getElementById('synth1-detune'),
            synth1Filter: document.getElementById('synth1-filter'),
            
            synth2Waveform: document.getElementById('synth2-waveform'),
            synth2Volume: document.getElementById('synth2-volume'),
            synth2Detune: document.getElementById('synth2-detune'),
            synth2Filter: document.getElementById('synth2-filter'),
            
            fmCarrierFreq: document.getElementById('fm-carrier-freq'),
            fmModulatorAFreq: document.getElementById('fm-modulator-a-freq'),
            fmModulatorBFreq: document.getElementById('fm-modulator-b-freq'),
            fmIndexA: document.getElementById('fm-index-a'),
            fmIndexB: document.getElementById('fm-index-b'),
            
            distortionAmount: document.getElementById('distortion-amount'),
            arpeggiatorPattern: document.getElementById('arpeggiator-pattern'),
            
            invertDrum: document.getElementById('invert-drum'),
            invertSynth1: document.getElementById('invert-synth1'),
            invertSynth2: document.getElementById('invert-synth2'),
            shiftDrum: document.getElementById('shift-drum'),
            shiftSynth1: document.getElementById('shift-synth1'),
            shiftSynth2: document.getElementById('shift-synth2'),
            randomizeDrum: document.getElementById('randomize-drum'),
            randomizeSynth1: document.getElementById('randomize-synth1'),
            randomizeSynth2: document.getElementById('randomize-synth2'),
            randomizeAll: document.getElementById('randomize-all')
        };
    }

    setupEventListeners() {
        this.elements.playButton.addEventListener('click', () => this.trigger('play'));
        this.elements.tempo.addEventListener('input', () => this.updateTempoDisplay());
        this.elements.masterVolume.addEventListener('input', () => this.trigger('masterVolume', this.getMasterVolume()));
        this.elements.moodSelect.addEventListener('change', () => this.trigger('moodChange', this.getMood()));
        this.elements.subdivisionSelect.addEventListener('change', () => this.trigger('subdivisionChange', this.getSubdivision()));
        this.elements.swing.addEventListener('input', () => this.trigger('swingChange', this.getSwing()));
        
        this.elements.synth1Waveform.addEventListener('change', () => this.trigger('synth1Waveform', this.getSynth1Settings()));
        this.elements.synth1Volume.addEventListener('input', () => this.trigger('synth1Volume', this.getSynth1Settings()));
        this.elements.synth1Detune.addEventListener('input', () => this.trigger('synth1Detune', this.getSynth1Settings()));
        this.elements.synth1Filter.addEventListener('input', () => this.trigger('synth1Filter', this.getSynth1Settings()));
        
        this.elements.synth2Waveform.addEventListener('change', () => this.trigger('synth2Waveform', this.getSynth2Settings()));
        this.elements.synth2Volume.addEventListener('input', () => this.trigger('synth2Volume', this.getSynth2Settings()));
        this.elements.synth2Detune.addEventListener('input', () => this.trigger('synth2Detune', this.getSynth2Settings()));
        this.elements.synth2Filter.addEventListener('input', () => this.trigger('synth2Filter', this.getSynth2Settings()));
        
        this.elements.fmCarrierFreq.addEventListener('input', () => this.trigger('fmUpdate', this.getFMSettings()));
        this.elements.fmModulatorAFreq.addEventListener('input', () => this.trigger('fmUpdate', this.getFMSettings()));
        this.elements.fmModulatorBFreq.addEventListener('input', () => this.trigger('fmUpdate', this.getFMSettings()));
        this.elements.fmIndexA.addEventListener('input', () => this.trigger('fmUpdate', this.getFMSettings()));
        this.elements.fmIndexB.addEventListener('input', () => this.trigger('fmUpdate', this.getFMSettings()));
        
        this.elements.distortionAmount.addEventListener('input', () => this.trigger('distortionChange', this.getDistortionAmount()));
        this.elements.arpeggiatorPattern.addEventListener('change', () => this.trigger('arpeggiatorPattern', this.getArpeggiatorPattern()));
        
        this.elements.invertDrum.addEventListener('click', () => this.trigger('invertDrum'));
        this.elements.invertSynth1.addEventListener('click', () => this.trigger('invertSynth1'));
        this.elements.invertSynth2.addEventListener('click', () => this.trigger('invertSynth2'));
        this.elements.shiftDrum.addEventListener('click', () => this.trigger('shiftDrum'));
        this.elements.shiftSynth1.addEventListener('click', () => this.trigger('shiftSynth1'));
        this.elements.shiftSynth2.addEventListener('click', () => this.trigger('shiftSynth2'));
        this.elements.randomizeDrum.addEventListener('click', () => this.trigger('randomizeDrum'));
        this.elements.randomizeSynth1.addEventListener('click', () => this.trigger('randomizeSynth1'));
        this.elements.randomizeSynth2.addEventListener('click', () => this.trigger('randomizeSynth2'));
        this.elements.randomizeAll.addEventListener('click', () => this.trigger('randomizeAll'));
    }

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    trigger(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => callback(data));
        }
    }

    updateTempoDisplay() {
        const tempo = this.getTempo();
        this.elements.tempoValue.textContent = tempo;
        this.trigger('tempoChange', tempo);
    }

    updatePlayButton(isPlaying) {
        this.elements.playButton.textContent = isPlaying ? 'Stop' : 'Play';
    }

    getTempo() {
        let tempo = parseInt(this.elements.tempo.value);
        if (isNaN(tempo) || tempo < 60 || tempo > 240) {
            tempo = 120;
            this.elements.tempo.value = tempo;
        }
        return tempo;
    }

    setTempo(tempo) {
        this.elements.tempo.value = tempo;
        this.updateTempoDisplay();
    }

    getMasterVolume() {
        return parseFloat(this.elements.masterVolume.value);
    }

    getMood() {
        return this.elements.moodSelect.value;
    }

    getSubdivision() {
        return parseInt(this.elements.subdivisionSelect.value);
    }

    getSwing() {
        return parseFloat(this.elements.swing.value);
    }

    getSynth1Settings() {
        return {
            waveform: this.elements.synth1Waveform.value,
            volume: parseFloat(this.elements.synth1Volume.value),
            detune: parseFloat(this.elements.synth1Detune.value),
            filterCutoff: parseFloat(this.elements.synth1Filter.value)
        };
    }

    getSynth2Settings() {
        return {
            waveform: this.elements.synth2Waveform.value,
            volume: parseFloat(this.elements.synth2Volume.value),
            detune: parseFloat(this.elements.synth2Detune.value),
            filterCutoff: parseFloat(this.elements.synth2Filter.value)
        };
    }

    getFMSettings() {
        return {
            carrierFreq: parseFloat(this.elements.fmCarrierFreq.value),
            modAFreq: parseFloat(this.elements.fmModulatorAFreq.value),
            modBFreq: parseFloat(this.elements.fmModulatorBFreq.value),
            indexA: parseFloat(this.elements.fmIndexA.value),
            indexB: parseFloat(this.elements.fmIndexB.value)
        };
    }

    getDistortionAmount() {
        return parseFloat(this.elements.distortionAmount.value);
    }

    getArpeggiatorPattern() {
        return this.elements.arpeggiatorPattern.value;
    }

    setSynthWaveform(synthNumber, waveform) {
        if (synthNumber === 1) {
            this.elements.synth1Waveform.value = waveform;
        } else {
            this.elements.synth2Waveform.value = waveform;
        }
    }
}