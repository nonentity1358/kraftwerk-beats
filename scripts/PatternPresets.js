export class PatternPresets {
    constructor() {
        this.presets = {
            'Classic House': {
                drum: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                synth1: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                synth2: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]
            },
            'Kraftwerk': {
                drum: [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0],
                synth1: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0],
                synth2: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]
            },
            'Techno': {
                drum: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                synth1: [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
                synth2: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]
            },
            'Breakbeat': {
                drum: [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],
                synth1: [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
                synth2: [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1]
            },
            'Minimal': {
                drum: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                synth1: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
                synth2: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]
            },
            'Acid': {
                drum: [1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0],
                synth1: [1,1,0,1,1,0,1,0,1,1,0,1,1,0,1,0],
                synth2: [0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1]
            },
            'Robotic': {
                drum: [1,0,1,0,0,1,1,0,1,0,1,0,0,1,1,0],
                synth1: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                synth2: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]
            },
            'Clear All': {
                drum: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                synth1: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                synth2: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }
        };
    }

    getPreset(name) {
        return this.presets[name] || null;
    }

    getPresetNames() {
        return Object.keys(this.presets);
    }

    applyPreset(name, drumSequencer, synth1Sequencer, synth2Sequencer) {
        const preset = this.getPreset(name);
        if (!preset) return false;

        drumSequencer.setPattern(preset.drum);
        synth1Sequencer.setPattern(preset.synth1);
        synth2Sequencer.setPattern(preset.synth2);

        return true;
    }

    saveCustomPreset(name, drumPattern, synth1Pattern, synth2Pattern) {
        this.presets[name] = {
            drum: [...drumPattern],
            synth1: [...synth1Pattern],
            synth2: [...synth2Pattern]
        };
    }
}