export class HarmonicEngine {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.currentKey = 'C';
        this.currentScale = 'major';
        this.currentRoot = 261.63; // C4 frequency
        this.currentChord = [0, 4, 7]; // Major triad
        this.voiceLeading = true;
        
        // Musical constants
        this.scales = {
            major: [0, 2, 4, 5, 7, 9, 11],
            minor: [0, 2, 3, 5, 7, 8, 10],
            dorian: [0, 2, 3, 5, 7, 9, 10],
            phrygian: [0, 1, 3, 5, 7, 8, 10],
            lydian: [0, 2, 4, 6, 7, 9, 11],
            mixolydian: [0, 2, 4, 5, 7, 9, 10],
            aeolian: [0, 2, 3, 5, 7, 8, 10],
            locrian: [0, 1, 3, 5, 6, 8, 10],
            harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
            melodic_minor: [0, 2, 3, 5, 7, 9, 11],
            pentatonic: [0, 2, 4, 7, 9],
            blues: [0, 3, 5, 6, 7, 10],
            chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        };

        this.chordProgressions = {
            pop: ['I', 'V', 'vi', 'IV'],
            jazz: ['IIM7', 'V7', 'IM7', 'VIM7'],
            blues: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
            emotional: ['i', 'VI', 'III', 'VII'],
            epic: ['i', 'VII', 'VI', 'VII', 'i'],
            mysterious: ['i', 'bII', 'v', 'i'],
            uplifting: ['I', 'iii', 'IV', 'V', 'vi', 'IV', 'V', 'I'],
            dark: ['i', 'bII', 'v°', 'i'],
            tension: ['I', 'I+', 'vi', 'IV'],
            resolution: ['ii', 'V7', 'I']
        };

        this.chordTypes = {
            major: [0, 4, 7],
            minor: [0, 3, 7],
            diminished: [0, 3, 6],
            augmented: [0, 4, 8],
            sus2: [0, 2, 7],
            sus4: [0, 5, 7],
            maj7: [0, 4, 7, 11],
            min7: [0, 3, 7, 10],
            dom7: [0, 4, 7, 10],
            maj9: [0, 4, 7, 11, 14],
            min9: [0, 3, 7, 10, 14],
            add9: [0, 2, 4, 7],
            min11: [0, 3, 7, 10, 14, 17],
            maj13: [0, 4, 7, 11, 14, 17, 21]
        };

        this.noteFrequencies = this.generateNoteFrequencies();
    }

    generateNoteFrequencies() {
        const A4 = 440;
        const notes = {};
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        for (let octave = 0; octave < 9; octave++) {
            noteNames.forEach((note, index) => {
                const midiNumber = octave * 12 + index;
                notes[`${note}${octave}`] = A4 * Math.pow(2, (midiNumber - 69) / 12);
            });
        }
        
        return notes;
    }

    getScaleDegrees(key, scale) {
        const keyIndex = this.getNoteIndex(key);
        const scalePattern = this.scales[scale];
        
        return scalePattern.map(degree => (keyIndex + degree) % 12);
    }

    getNoteIndex(note) {
        const noteMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        let index = noteMap[note[0]];
        
        if (note.includes('#')) index++;
        if (note.includes('b')) index--;
        
        return index % 12;
    }

    parseChordSymbol(symbol, key) {
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
        const scaleDegrees = this.getScaleDegrees(key, this.currentScale);
        
        let root = 0;
        let chordType = 'major';
        let isMinor = false;
        
        // Parse roman numeral
        for (let i = 0; i < romanNumerals.length; i++) {
            if (symbol.toUpperCase().startsWith(romanNumerals[i])) {
                root = scaleDegrees[i];
                isMinor = symbol[0] === symbol[0].toLowerCase();
                break;
            }
        }
        
        // Parse chord type
        if (symbol.includes('M7') || symbol.includes('maj7')) chordType = 'maj7';
        else if (symbol.includes('m7')) chordType = 'min7';
        else if (symbol.includes('7')) chordType = 'dom7';
        else if (symbol.includes('°') || symbol.includes('dim')) chordType = 'diminished';
        else if (symbol.includes('+') || symbol.includes('aug')) chordType = 'augmented';
        else if (symbol.includes('sus2')) chordType = 'sus2';
        else if (symbol.includes('sus4')) chordType = 'sus4';
        else if (isMinor) chordType = 'minor';
        
        const intervals = this.chordTypes[chordType];
        return intervals.map(interval => (root + interval) % 12);
    }

    generateChord(scale, rootFreq, degree) {
        // Generate a chord based on scale degree (0-3 for a 4-chord progression)
        const scaleNotes = this.scales[scale] || this.scales.major;
        const chordRootIndex = (degree * 2) % scaleNotes.length; // Use thirds
        
        // Build triad from scale
        const chordNotes = [];
        for (let i = 0; i < 3; i++) {
            const noteIndex = (chordRootIndex + i * 2) % scaleNotes.length;
            const semitones = scaleNotes[noteIndex];
            const frequency = rootFreq * Math.pow(2, semitones / 12);
            chordNotes.push(frequency);
        }
        
        return chordNotes;
    }
    
    generateChordProgression(style = 'pop', bars = 4) {
        const progression = this.chordProgressions[style] || this.chordProgressions.pop;
        const chords = [];
        
        for (let i = 0; i < bars; i++) {
            const chordSymbol = progression[i % progression.length];
            const chord = this.parseChordSymbol(chordSymbol, this.currentKey);
            chords.push({
                symbol: chordSymbol,
                notes: chord,
                duration: 1 // bar
            });
        }
        
        return chords;
    }

    playChord(notes, baseOctave = 3, time, duration, destination, options = {}) {
        const voices = [];
        const spread = options.spread || 0;
        const roll = options.roll || 0;
        const inversion = options.inversion || 0;
        
        // Apply inversion
        let chordNotes = [...notes];
        for (let i = 0; i < inversion; i++) {
            chordNotes.push(chordNotes.shift() + 12);
        }
        
        chordNotes.forEach((note, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            // Rich waveform selection
            osc.type = options.waveform || 'sawtooth';
            
            // Calculate frequency
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const noteName = noteNames[note % 12];
            const octave = baseOctave + Math.floor(note / 12) + Math.floor(index * spread / 12);
            const frequency = this.noteFrequencies[`${noteName}${octave}`];
            
            osc.frequency.setValueAtTime(frequency, time + index * roll);
            
            // Detune for richness
            osc.detune.setValueAtTime(
                (Math.random() - 0.5) * (options.detune || 10) + index * 2,
                time
            );
            
            // Filter for warmth
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000 + index * 500, time);
            filter.Q.setValueAtTime(1, time);
            
            // ADSR envelope
            const attack = options.attack || 0.1;
            const decay = options.decay || 0.2;
            const sustain = options.sustain || 0.7;
            const release = options.release || 0.5;
            
            gain.gain.setValueAtTime(0, time + index * roll);
            gain.gain.linearRampToValueAtTime(0.8 / chordNotes.length, time + index * roll + attack);
            gain.gain.linearRampToValueAtTime(sustain * 0.8 / chordNotes.length, time + index * roll + attack + decay);
            gain.gain.setValueAtTime(sustain * 0.8 / chordNotes.length, time + duration - release);
            gain.gain.linearRampToValueAtTime(0, time + duration);
            
            // Connect
            osc.connect(filter);
            filter.connect(gain);
            if (destination) {
                gain.connect(destination);
            }
            
            osc.start(time + index * roll);
            osc.stop(time + duration);
            
            voices.push({ osc, gain, filter });
        });
        
        return voices;
    }

    createArpeggio(chord, pattern = 'up', noteLength = 0.125) {
        const patterns = {
            up: (notes) => notes,
            down: (notes) => [...notes].reverse(),
            updown: (notes) => [...notes, ...notes.slice(1, -1).reverse()],
            random: (notes) => notes.sort(() => Math.random() - 0.5),
            alberti: (notes) => [notes[0], notes[2], notes[1], notes[2]], // Classical pattern
            trance: (notes) => [notes[0], notes[0], notes[1], notes[0], notes[2], notes[0], notes[1], notes[0]]
        };
        
        const sequence = patterns[pattern] ? patterns[pattern](chord) : patterns.up(chord);
        return sequence.map((note, index) => ({
            note,
            time: index * noteLength,
            duration: noteLength * 0.9
        }));
    }

    generateMelody(scale, length = 16, options = {}) {
        const scaleNotes = this.getScaleDegrees(this.currentKey, scale);
        const melody = [];
        let lastNote = scaleNotes[0];
        
        for (let i = 0; i < length; i++) {
            let note;
            
            if (options.smooth && i > 0) {
                // Smooth melodic movement
                const interval = Math.floor(Math.random() * 5) - 2;
                const noteIndex = scaleNotes.indexOf(lastNote);
                const newIndex = Math.max(0, Math.min(scaleNotes.length - 1, noteIndex + interval));
                note = scaleNotes[newIndex];
            } else {
                // Random from scale
                note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
            }
            
            // Rhythm
            const duration = options.rhythm ? 
                options.rhythm[i % options.rhythm.length] : 
                0.25;
            
            melody.push({
                note,
                time: i * 0.25,
                duration,
                velocity: 0.5 + Math.random() * 0.5
            });
            
            lastNote = note;
        }
        
        return melody;
    }

    harmonize(melody, style = 'thirds') {
        const harmonies = {
            thirds: 4, // 3rd above in scale
            sixths: 9, // 6th above
            octaves: 12,
            power: 7, // Perfect 5th
            cluster: [1, 2] // Minor/major 2nd
        };
        
        return melody.map(note => {
            const harmony = harmonies[style];
            if (Array.isArray(harmony)) {
                return harmony.map(h => ({
                    ...note,
                    note: note.note + h
                }));
            }
            return [{
                ...note,
                note: note.note + harmony
            }];
        }).flat();
    }

    createEmotionalChordVoicing(emotion) {
        const voicings = {
            happy: {
                chords: ['maj7', 'add9', 'sus2'],
                inversions: [0, 1],
                spread: 0.3,
                brightness: 1.2
            },
            sad: {
                chords: ['min7', 'min9', 'min11'],
                inversions: [1, 2],
                spread: 0.5,
                brightness: 0.7
            },
            mysterious: {
                chords: ['dim', 'aug', 'min7b5'],
                inversions: [2],
                spread: 0.8,
                brightness: 0.8
            },
            powerful: {
                chords: ['major', 'sus4', 'add9'],
                inversions: [0],
                spread: 1.0,
                brightness: 1.5
            },
            ethereal: {
                chords: ['maj9', 'maj13', 'sus2'],
                inversions: [1, 2],
                spread: 1.5,
                brightness: 1.1
            }
        };
        
        return voicings[emotion] || voicings.happy;
    }

    generateBassline(chordProgression, style = 'walking') {
        const basslines = {
            walking: (chord) => {
                // Jazz walking bass
                const notes = [chord[0], chord[0] + 2, chord[0] + 4, chord[0] + 5];
                return notes.map((note, i) => ({
                    note: note - 12, // Bass octave
                    time: i * 0.25,
                    duration: 0.24
                }));
            },
            root: (chord) => {
                // Simple root notes
                return [{
                    note: chord[0] - 12,
                    time: 0,
                    duration: 1
                }];
            },
            octave: (chord) => {
                // Octave jumps
                return [
                    { note: chord[0] - 24, time: 0, duration: 0.5 },
                    { note: chord[0] - 12, time: 0.5, duration: 0.5 }
                ];
            },
            synth: (chord) => {
                // Synth bass pattern
                const pattern = [0, 0, 12, 0, 0, 0, 12, 0];
                return pattern.map((offset, i) => ({
                    note: chord[0] - 12 + offset,
                    time: i * 0.125,
                    duration: 0.1
                }));
            }
        };
        
        const basslineGenerator = basslines[style] || basslines.root;
        return chordProgression.flatMap(chord => basslineGenerator(chord.notes));
    }

    createCountermelody(mainMelody, style = 'contrary') {
        const styles = {
            contrary: (note, index) => {
                // Move in opposite direction
                return mainMelody[0].note + (mainMelody[0].note - note.note);
            },
            parallel: (note) => {
                // Move in same direction at fixed interval
                return note.note + 7; // Perfect 5th
            },
            oblique: (note, index) => {
                // One voice stays same while other moves
                return index % 4 === 0 ? note.note : mainMelody[0].note;
            },
            canon: (note, index) => {
                // Delayed exact copy
                const delayedIndex = Math.max(0, index - 4);
                return mainMelody[delayedIndex].note;
            }
        };
        
        const countermelodyStyle = styles[style] || styles.contrary;
        
        return mainMelody.map((note, index) => ({
            ...note,
            note: countermelodyStyle(note, index)
        }));
    }
    
    setScale(scaleName) {
        if (this.scales[scaleName]) {
            this.currentScale = scaleName;
        }
    }
    
    setRootFrequency(frequency) {
        this.currentRoot = frequency;
    }
}