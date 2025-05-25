export class AIPatternGenerator {
    constructor() {
        this.markovChains = {
            drum: new MarkovChain(),
            synth1: new MarkovChain(),
            synth2: new MarkovChain()
        };
        this.trainingData = [];
        this.initializeWithClassicPatterns();
    }

    initializeWithClassicPatterns() {
        // Classic electronic music patterns for training
        const trainingPatterns = {
            drum: [
                [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // Four on the floor
                [1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0], // Breakbeat
                [1,0,1,0,0,1,1,0,1,0,1,0,0,1,1,0], // Techno
                [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], // Minimal
                [1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0], // Jungle
            ],
            synth1: [
                [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0], // Kraftwerk-style
                [0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1], // Acid
                [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], // Minimal bass
                [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], // Arpeggiated
            ],
            synth2: [
                [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], // Sparse
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], // Continuous
                [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1], // Off-beat
            ]
        };

        // Train the Markov chains
        Object.keys(trainingPatterns).forEach(key => {
            trainingPatterns[key].forEach(pattern => {
                this.markovChains[key].train(pattern);
            });
        });
    }

    generatePattern(type = 'all') {
        if (type === 'all') {
            return {
                drum: this.markovChains.drum.generate(),
                synth1: this.markovChains.synth1.generate(),
                synth2: this.markovChains.synth2.generate()
            };
        } else if (this.markovChains[type]) {
            return this.markovChains[type].generate();
        }
        return null;
    }

    generateWithConstraints(constraints = {}) {
        const patterns = this.generatePattern('all');
        
        // Apply constraints
        if (constraints.density) {
            Object.keys(patterns).forEach(key => {
                patterns[key] = this.adjustDensity(patterns[key], constraints.density);
            });
        }
        
        if (constraints.syncopation) {
            patterns.drum = this.addSyncopation(patterns.drum, constraints.syncopation);
        }
        
        if (constraints.polyrhythm) {
            patterns.synth2 = this.createPolyrhythm(patterns.synth2, constraints.polyrhythm);
        }
        
        return patterns;
    }

    adjustDensity(pattern, targetDensity) {
        const currentDensity = pattern.filter(x => x).length / pattern.length;
        const newPattern = [...pattern];
        
        if (currentDensity < targetDensity) {
            // Add more hits
            const emptyIndices = newPattern
                .map((val, idx) => val ? -1 : idx)
                .filter(idx => idx >= 0);
            
            const hitsToAdd = Math.floor((targetDensity - currentDensity) * pattern.length);
            
            for (let i = 0; i < hitsToAdd && emptyIndices.length > 0; i++) {
                const randomIdx = Math.floor(Math.random() * emptyIndices.length);
                newPattern[emptyIndices[randomIdx]] = true;
                emptyIndices.splice(randomIdx, 1);
            }
        } else if (currentDensity > targetDensity) {
            // Remove hits
            const hitIndices = newPattern
                .map((val, idx) => val ? idx : -1)
                .filter(idx => idx >= 0);
            
            const hitsToRemove = Math.floor((currentDensity - targetDensity) * pattern.length);
            
            for (let i = 0; i < hitsToRemove && hitIndices.length > 0; i++) {
                const randomIdx = Math.floor(Math.random() * hitIndices.length);
                newPattern[hitIndices[randomIdx]] = false;
                hitIndices.splice(randomIdx, 1);
            }
        }
        
        return newPattern;
    }

    addSyncopation(pattern, amount) {
        const newPattern = [...pattern];
        const strongBeats = [0, 4, 8, 12];
        
        for (let i = 0; i < pattern.length; i++) {
            if (!strongBeats.includes(i) && Math.random() < amount) {
                newPattern[i] = !newPattern[i];
            }
        }
        
        return newPattern;
    }

    createPolyrhythm(pattern, ratio) {
        const newPattern = new Array(16).fill(false);
        const steps = Math.floor(16 / ratio);
        
        for (let i = 0; i < 16; i += steps) {
            if (i < 16) {
                newPattern[i] = true;
            }
        }
        
        return newPattern;
    }

    mutate(pattern, mutationRate = 0.1) {
        return pattern.map(step => 
            Math.random() < mutationRate ? !step : step
        );
    }

    crossover(pattern1, pattern2) {
        const crossoverPoint = Math.floor(Math.random() * pattern1.length);
        return [
            ...pattern1.slice(0, crossoverPoint),
            ...pattern2.slice(crossoverPoint)
        ];
    }

    evolvePatterns(patterns, generations = 10) {
        let currentPatterns = patterns;
        
        for (let gen = 0; gen < generations; gen++) {
            // Create variations
            const variations = [];
            
            Object.keys(currentPatterns).forEach(key => {
                // Mutation
                variations.push({
                    [key]: this.mutate(currentPatterns[key])
                });
                
                // Crossover with training data
                const randomTraining = this.markovChains[key].getRandomTrainingPattern();
                if (randomTraining) {
                    variations.push({
                        [key]: this.crossover(currentPatterns[key], randomTraining)
                    });
                }
            });
            
            // Select best variation (in this case, random selection)
            if (variations.length > 0) {
                const selected = variations[Math.floor(Math.random() * variations.length)];
                currentPatterns = { ...currentPatterns, ...selected };
            }
        }
        
        return currentPatterns;
    }

    generateComplementaryPattern(existingPattern) {
        // Generate a pattern that complements the existing one
        const complement = new Array(16).fill(false);
        
        existingPattern.forEach((step, i) => {
            if (!step && Math.random() < 0.3) {
                complement[i] = true;
            } else if (step && Math.random() < 0.1) {
                // Occasionally overlap for emphasis
                complement[i] = true;
            }
        });
        
        return complement;
    }
}

class MarkovChain {
    constructor(order = 2) {
        this.order = order;
        this.transitions = {};
        this.trainingPatterns = [];
    }

    train(pattern) {
        this.trainingPatterns.push(pattern);
        
        // Convert boolean array to string for easier processing
        const patternStr = pattern.map(x => x ? '1' : '0').join('');
        
        for (let i = 0; i <= patternStr.length - this.order; i++) {
            const current = patternStr.substr(i, this.order);
            const next = patternStr[i + this.order] || patternStr[0]; // Wrap around
            
            if (!this.transitions[current]) {
                this.transitions[current] = {};
            }
            
            this.transitions[current][next] = (this.transitions[current][next] || 0) + 1;
        }
    }

    generate() {
        if (Object.keys(this.transitions).length === 0) {
            return new Array(16).fill(false);
        }
        
        // Start with a random state
        let current = this.getRandomState();
        let pattern = current;
        
        // Generate the rest of the pattern
        while (pattern.length < 16) {
            const nextChar = this.getNextState(current);
            pattern += nextChar;
            current = current.slice(1) + nextChar;
        }
        
        // Convert back to boolean array
        return pattern.slice(0, 16).split('').map(x => x === '1');
    }

    getRandomState() {
        const states = Object.keys(this.transitions);
        return states[Math.floor(Math.random() * states.length)];
    }

    getNextState(current) {
        const possibleNext = this.transitions[current];
        if (!possibleNext) {
            return Math.random() < 0.5 ? '1' : '0';
        }
        
        // Calculate probabilities
        const total = Object.values(possibleNext).reduce((a, b) => a + b, 0);
        let random = Math.random() * total;
        
        for (const [next, count] of Object.entries(possibleNext)) {
            random -= count;
            if (random <= 0) {
                return next;
            }
        }
        
        return '0'; // Fallback
    }

    getRandomTrainingPattern() {
        if (this.trainingPatterns.length === 0) return null;
        return this.trainingPatterns[Math.floor(Math.random() * this.trainingPatterns.length)];
    }
}