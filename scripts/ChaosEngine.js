export class ChaosEngine {
    constructor() {
        this.active = false;
        this.intensity = 0.5;
        this.mutationInterval = null;
        this.mutationRate = 500; // milliseconds
        this.callbacks = {};
    }

    activate(drumSeq, synth1Seq, synth2Seq) {
        this.active = true;
        this.drumSeq = drumSeq;
        this.synth1Seq = synth1Seq;
        this.synth2Seq = synth2Seq;
        
        this.startChaos();
        this.trigger('activated');
    }

    deactivate() {
        this.active = false;
        this.stopChaos();
        this.trigger('deactivated');
    }

    startChaos() {
        this.mutationInterval = setInterval(() => {
            if (Math.random() < this.intensity) {
                this.mutate();
            }
        }, this.mutationRate);
    }

    stopChaos() {
        if (this.mutationInterval) {
            clearInterval(this.mutationInterval);
            this.mutationInterval = null;
        }
    }

    mutate() {
        const mutationType = Math.floor(Math.random() * 10);
        
        switch(mutationType) {
            case 0:
                this.bitFlip();
                break;
            case 1:
                this.patternShift();
                break;
            case 2:
                this.probabilisticToggle();
                break;
            case 3:
                this.euclideanRhythm();
                break;
            case 4:
                this.conwayGameOfLife();
                break;
            case 5:
                this.quantumCollapse();
                break;
            case 6:
                this.fractalPattern();
                break;
            case 7:
                this.goldenRatio();
                break;
            case 8:
                this.cellularAutomaton();
                break;
            case 9:
                this.chaosButterfly();
                break;
        }
        
        this.trigger('mutated', mutationType);
    }

    bitFlip() {
        // Randomly flip a single bit in one of the sequences
        const sequences = [this.drumSeq, this.synth1Seq, this.synth2Seq];
        const seq = sequences[Math.floor(Math.random() * sequences.length)];
        const index = Math.floor(Math.random() * 16);
        
        seq.toggleStep(index);
    }

    patternShift() {
        // Shift patterns by random amounts
        const shifts = [1, -1, 2, -2, 4, -4];
        const shift = shifts[Math.floor(Math.random() * shifts.length)];
        
        if (Math.random() < 0.33) {
            this.drumSeq.shift(shift);
        } else if (Math.random() < 0.66) {
            this.synth1Seq.shift(shift);
        } else {
            this.synth2Seq.shift(shift);
        }
    }

    probabilisticToggle() {
        // Toggle steps based on probability
        const probability = Math.random() * 0.3;
        const sequences = [this.drumSeq, this.synth1Seq, this.synth2Seq];
        const seq = sequences[Math.floor(Math.random() * sequences.length)];
        
        for (let i = 0; i < 16; i++) {
            if (Math.random() < probability) {
                seq.toggleStep(i);
            }
        }
    }

    euclideanRhythm() {
        // Generate Euclidean rhythms
        const hits = Math.floor(Math.random() * 8) + 1;
        const steps = 16;
        const pattern = this.generateEuclidean(hits, steps);
        
        const sequences = [this.drumSeq, this.synth1Seq, this.synth2Seq];
        const seq = sequences[Math.floor(Math.random() * sequences.length)];
        
        seq.setPattern(pattern);
    }

    generateEuclidean(hits, steps) {
        const pattern = new Array(steps).fill(false);
        const interval = steps / hits;
        
        for (let i = 0; i < hits; i++) {
            const index = Math.floor(i * interval);
            pattern[index] = true;
        }
        
        return pattern;
    }

    conwayGameOfLife() {
        // Apply Conway's Game of Life rules to patterns
        const sequences = [this.drumSeq, this.synth1Seq, this.synth2Seq];
        const patterns = sequences.map(seq => seq.getPattern());
        
        // Treat the 3x16 grid as a cellular automaton
        const newPatterns = patterns.map((pattern, row) => {
            return pattern.map((cell, col) => {
                const neighbors = this.countNeighbors(patterns, row, col);
                
                if (cell) {
                    // Live cell rules
                    return neighbors === 2 || neighbors === 3;
                } else {
                    // Dead cell rules
                    return neighbors === 3;
                }
            });
        });
        
        sequences.forEach((seq, i) => seq.setPattern(newPatterns[i]));
    }

    countNeighbors(patterns, row, col) {
        let count = 0;
        
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue;
                
                const newRow = (row + r + 3) % 3;
                const newCol = (col + c + 16) % 16;
                
                if (patterns[newRow][newCol]) count++;
            }
        }
        
        return count;
    }

    quantumCollapse() {
        // Quantum-inspired pattern collapse
        const superposition = [];
        for (let i = 0; i < 16; i++) {
            superposition.push(Math.random());
        }
        
        const collapsed = superposition.map(prob => prob > 0.5);
        
        const sequences = [this.drumSeq, this.synth1Seq, this.synth2Seq];
        const seq = sequences[Math.floor(Math.random() * sequences.length)];
        
        // Blend with existing pattern
        const current = seq.getPattern();
        const blended = current.map((step, i) => {
            if (Math.random() < this.intensity) {
                return collapsed[i];
            }
            return step;
        });
        
        seq.setPattern(blended);
    }

    fractalPattern() {
        // Generate fractal-based patterns
        const pattern = new Array(16).fill(false);
        const fractalDepth = 4;
        
        const generateFractal = (start, end, depth) => {
            if (depth === 0) return;
            
            const mid = Math.floor((start + end) / 2);
            pattern[mid] = true;
            
            generateFractal(start, mid, depth - 1);
            generateFractal(mid, end, depth - 1);
        };
        
        generateFractal(0, 15, fractalDepth);
        
        const sequences = [this.drumSeq, this.synth1Seq, this.synth2Seq];
        const seq = sequences[Math.floor(Math.random() * sequences.length)];
        seq.setPattern(pattern);
    }

    goldenRatio() {
        // Use golden ratio for pattern generation
        const phi = 1.618033988749895;
        const pattern = new Array(16).fill(false);
        
        let position = 0;
        for (let i = 0; i < 6; i++) {
            position = (position + phi * 2) % 16;
            pattern[Math.floor(position)] = true;
        }
        
        const sequences = [this.drumSeq, this.synth1Seq, this.synth2Seq];
        const seq = sequences[Math.floor(Math.random() * sequences.length)];
        seq.setPattern(pattern);
    }

    cellularAutomaton() {
        // 1D cellular automaton (Rule 30, 90, 110, etc.)
        const rules = [30, 90, 110, 150, 184];
        const rule = rules[Math.floor(Math.random() * rules.length)];
        
        const pattern = this.drumSeq.getPattern();
        const newPattern = this.applyRule(pattern, rule);
        
        this.drumSeq.setPattern(newPattern);
    }

    applyRule(pattern, rule) {
        const newPattern = [];
        
        for (let i = 0; i < pattern.length; i++) {
            const left = pattern[(i - 1 + pattern.length) % pattern.length] ? 1 : 0;
            const center = pattern[i] ? 1 : 0;
            const right = pattern[(i + 1) % pattern.length] ? 1 : 0;
            
            const index = (left << 2) | (center << 1) | right;
            newPattern.push((rule >> index) & 1 ? true : false);
        }
        
        return newPattern;
    }

    chaosButterfly() {
        // Butterfly effect - small changes cascade
        const index = Math.floor(Math.random() * 16);
        this.drumSeq.toggleStep(index);
        
        // Cascade to other sequences
        setTimeout(() => {
            this.synth1Seq.toggleStep((index + 1) % 16);
        }, 100);
        
        setTimeout(() => {
            this.synth2Seq.toggleStep((index + 2) % 16);
        }, 200);
    }

    setIntensity(value) {
        this.intensity = Math.max(0, Math.min(1, value));
    }

    setMutationRate(ms) {
        this.mutationRate = Math.max(100, Math.min(5000, ms));
        if (this.active) {
            this.stopChaos();
            this.startChaos();
        }
    }

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    trigger(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(cb => cb(data));
        }
    }
}