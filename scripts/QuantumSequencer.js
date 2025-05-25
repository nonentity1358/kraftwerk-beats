export class QuantumSequencer {
    constructor() {
        this.superpositions = new Map();
        this.entanglements = [];
        this.observationHistory = [];
        this.quantumState = 'superposition';
        this.dimensions = 3; // drum, synth1, synth2
        this.probabilityWaves = [];
        this.schrodingerMode = false;
    }

    createSuperposition(sequencer, states) {
        // A sequencer step can exist in multiple states simultaneously
        const superposition = {
            sequencer: sequencer,
            states: states,
            probabilities: states.map(() => 1 / states.length),
            collapsed: false,
            entangledWith: []
        };
        
        this.superpositions.set(sequencer.element.id, superposition);
        this.visualizeSuperposition(sequencer);
        
        return superposition;
    }

    entangle(sequencer1, sequencer2) {
        // When one is observed, the other instantly changes
        const entanglement = {
            pair: [sequencer1, sequencer2],
            strength: Math.random(),
            type: this.getRandomEntanglementType()
        };
        
        this.entanglements.push(entanglement);
        
        // Update superposition records
        const super1 = this.superpositions.get(sequencer1.element.id);
        const super2 = this.superpositions.get(sequencer2.element.id);
        
        if (super1 && super2) {
            super1.entangledWith.push(sequencer2.element.id);
            super2.entangledWith.push(sequencer1.element.id);
        }
        
        return entanglement;
    }

    getRandomEntanglementType() {
        const types = [
            'inverse', // When one is on, the other is off
            'mirror', // Same state
            'phase_shift', // Offset by quantum phase
            'probability_swap' // Exchange probability distributions
        ];
        
        return types[Math.floor(Math.random() * types.length)];
    }

    observe(sequencer, stepIndex) {
        // Collapse the wave function for this step
        const superposition = this.superpositions.get(sequencer.element.id);
        if (!superposition || superposition.collapsed) return;
        
        // Calculate final state based on probabilities
        const random = Math.random();
        let cumulativeProbability = 0;
        let finalState = false;
        
        for (let i = 0; i < superposition.states.length; i++) {
            cumulativeProbability += superposition.probabilities[i];
            if (random < cumulativeProbability) {
                finalState = superposition.states[i][stepIndex];
                break;
            }
        }
        
        // Collapse the superposition
        sequencer.sequence[stepIndex] = finalState;
        sequencer.updateUI();
        
        // Record observation
        this.observationHistory.push({
            time: Date.now(),
            sequencer: sequencer.element.id,
            step: stepIndex,
            result: finalState
        });
        
        // Handle entanglements
        this.handleEntanglementCollapse(sequencer, stepIndex, finalState);
        
        // Quantum decoherence effect
        this.createDecoherenceEffect(sequencer.element, stepIndex);
    }

    handleEntanglementCollapse(sequencer, stepIndex, state) {
        this.entanglements.forEach(entanglement => {
            if (entanglement.pair.includes(sequencer)) {
                const other = entanglement.pair.find(s => s !== sequencer);
                
                switch (entanglement.type) {
                    case 'inverse':
                        other.sequence[stepIndex] = !state;
                        break;
                    case 'mirror':
                        other.sequence[stepIndex] = state;
                        break;
                    case 'phase_shift':
                        const shift = Math.floor(entanglement.strength * 4);
                        const shiftedIndex = (stepIndex + shift) % 16;
                        other.sequence[shiftedIndex] = state;
                        break;
                    case 'probability_swap':
                        // More complex - affects probability distribution
                        this.swapProbabilities(other, stepIndex);
                        break;
                }
                
                other.updateUI();
                this.createEntanglementVisual(sequencer, other);
            }
        });
    }

    createQuantumField() {
        // Create a visual quantum probability field overlay
        const field = document.createElement('canvas');
        field.id = 'quantum-field';
        field.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 998;
            opacity: 0.3;
            mix-blend-mode: screen;
        `;
        
        document.body.appendChild(field);
        
        const ctx = field.getContext('2d');
        field.width = window.innerWidth;
        field.height = window.innerHeight;
        
        // Animate quantum probability waves
        const animateField = () => {
            ctx.clearRect(0, 0, field.width, field.height);
            
            // Draw probability waves
            this.probabilityWaves.forEach((wave, index) => {
                ctx.strokeStyle = `hsla(${index * 60}, 100%, 50%, 0.5)`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                for (let x = 0; x < field.width; x += 5) {
                    const y = field.height / 2 + 
                        Math.sin((x + wave.phase) * wave.frequency) * wave.amplitude * 
                        Math.exp(-x / field.width * 2);
                    
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                
                ctx.stroke();
                
                // Update wave
                wave.phase += wave.speed;
                wave.amplitude = 50 + Math.sin(Date.now() * 0.001) * 30;
            });
            
            requestAnimationFrame(animateField);
        };
        
        // Initialize waves
        for (let i = 0; i < 5; i++) {
            this.probabilityWaves.push({
                frequency: 0.01 + Math.random() * 0.02,
                amplitude: 50,
                phase: Math.random() * Math.PI * 2,
                speed: 0.05 + Math.random() * 0.1
            });
        }
        
        animateField();
    }

    visualizeSuperposition(sequencer) {
        // Add quantum shimmer effect to superposed elements
        const steps = sequencer.element.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (Math.random() < 0.3) {
                step.style.animation = 'quantumShimmer 1s ease-in-out infinite';
                step.style.animationDelay = `${index * 0.1}s`;
            }
        });
        
        // Add CSS for quantum effects
        if (!document.getElementById('quantum-styles')) {
            const style = document.createElement('style');
            style.id = 'quantum-styles';
            style.textContent = `
                @keyframes quantumShimmer {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.1);
                        box-shadow: 0 0 20px rgba(255, 0, 255, 0.8);
                    }
                }
                
                .quantum-collapsed {
                    animation: quantumCollapse 0.5s ease-out !important;
                }
                
                @keyframes quantumCollapse {
                    0% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .quantum-entangled::before {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: -5px;
                    right: -5px;
                    bottom: -5px;
                    border: 2px solid rgba(255, 0, 255, 0.5);
                    border-radius: 50%;
                    animation: entanglementPulse 2s ease-in-out infinite;
                }
                
                @keyframes entanglementPulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createDecoherenceEffect(element, stepIndex) {
        const step = element.querySelectorAll('.step')[stepIndex];
        if (!step) return;
        
        step.classList.add('quantum-collapsed');
        
        // Create particle burst
        const rect = step.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(0, 255, 255, 1) 0%, transparent 70%);
                pointer-events: none;
                z-index: 9999;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 10) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { 
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }

    createEntanglementVisual(seq1, seq2) {
        // Draw a quantum connection line between entangled sequencers
        const elem1 = seq1.element;
        const elem2 = seq2.element;
        
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;
        
        // Create a curved path
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - 50;
        
        path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
        path.setAttribute('stroke', 'rgba(255, 0, 255, 0.8)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '5,5');
        
        svg.appendChild(path);
        document.body.appendChild(svg);
        
        // Animate the connection
        let dashOffset = 0;
        const animateConnection = () => {
            dashOffset += 1;
            path.setAttribute('stroke-dashoffset', dashOffset);
            
            if (dashOffset < 100) {
                requestAnimationFrame(animateConnection);
            } else {
                svg.remove();
            }
        };
        
        animateConnection();
    }

    enableSchrodingerMode() {
        // Pattern exists in both on and off states until observed
        this.schrodingerMode = true;
        
        document.body.classList.add('schrodinger-mode');
        
        // Add special style
        const style = document.createElement('style');
        style.textContent = `
            .schrodinger-mode .step {
                position: relative;
            }
            
            .schrodinger-mode .step::after {
                content: '?';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 20px;
                color: rgba(255, 255, 255, 0.5);
                animation: questionFloat 2s ease-in-out infinite;
            }
            
            @keyframes questionFloat {
                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    measurementCollapse() {
        // Collapse all superpositions at once
        this.superpositions.forEach((superposition, key) => {
            if (!superposition.collapsed) {
                // Dramatic collapse effect
                setTimeout(() => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.style.animation = 'realityCollapse 1s ease-out';
                    }
                }, Math.random() * 500);
            }
        });
        
        // Add collapse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes realityCollapse {
                0% {
                    transform: scale(2) rotate(180deg);
                    opacity: 0;
                    filter: blur(10px);
                }
                50% {
                    transform: scale(1.5) rotate(90deg);
                    opacity: 0.5;
                    filter: blur(5px);
                }
                100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                    filter: blur(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    generateQuantumPattern() {
        // Generate pattern based on quantum probability distributions
        const pattern = [];
        
        for (let i = 0; i < 16; i++) {
            // Quantum random walk
            let position = 0;
            for (let step = 0; step < 10; step++) {
                position += Math.random() < 0.5 ? 1 : -1;
            }
            
            // Normalize to boolean
            pattern.push(position > 0);
        }
        
        return pattern;
    }

    createQuantumInterference(pattern1, pattern2) {
        // Combine patterns using quantum interference
        const result = [];
        
        for (let i = 0; i < pattern1.length; i++) {
            // Wave interference
            const wave1 = pattern1[i] ? 1 : -1;
            const wave2 = pattern2[i] ? 1 : -1;
            const interference = wave1 + wave2;
            
            // Constructive interference
            if (interference > 0) {
                result.push(true);
            } 
            // Destructive interference
            else if (interference < 0) {
                result.push(false);
            } 
            // Quantum uncertainty
            else {
                result.push(Math.random() < 0.5);
            }
        }
        
        return result;
    }
}