export class TimeMachine {
    constructor() {
        this.timeline = [];
        this.currentTime = 0;
        this.maxHistory = 100;
        this.isRecording = true;
        this.timeVortex = null;
        this.parallelUniverses = [];
        this.temporalAnomaly = false;
    }

    recordState(drumPattern, synth1Pattern, synth2Pattern, timestamp = Date.now()) {
        if (!this.isRecording) return;
        
        const state = {
            timestamp,
            patterns: {
                drum: [...drumPattern],
                synth1: [...synth1Pattern],
                synth2: [...synth2Pattern]
            },
            tempo: document.getElementById('tempo')?.value || 120,
            effects: this.captureEffectState(),
            universe: this.getCurrentUniverse()
        };
        
        this.timeline.push(state);
        this.currentTime = this.timeline.length - 1;
        
        // Limit history size
        if (this.timeline.length > this.maxHistory) {
            this.timeline.shift();
            this.currentTime--;
        }
        
        // Check for temporal anomalies
        this.detectTemporalAnomalies();
    }

    captureEffectState() {
        return {
            chaos: document.querySelector('.chaos-active') !== null,
            glitch: document.getElementById('glitch-overlay')?.style.display !== 'none',
            distortion: document.getElementById('distortion-amount')?.value || 400
        };
    }

    getCurrentUniverse() {
        // Each significant change creates a new universe branch
        return `U-${Date.now().toString(36)}`;
    }

    detectTemporalAnomalies() {
        // Look for patterns that repeat in impossible ways
        if (this.timeline.length < 10) return;
        
        const recent = this.timeline.slice(-10);
        const patterns = recent.map(s => 
            s.patterns.drum.join('') + s.patterns.synth1.join('') + s.patterns.synth2.join('')
        );
        
        // Check for exact repetitions (temporal loop)
        const uniquePatterns = new Set(patterns);
        if (uniquePatterns.size < patterns.length / 2) {
            this.temporalAnomaly = true;
            this.triggerTemporalAnomaly();
        }
    }

    triggerTemporalAnomaly() {
        console.warn('TEMPORAL ANOMALY DETECTED!');
        
        // Visual warning
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            font-size: 24px;
            z-index: 10000;
            animation: temporalWarning 2s ease-in-out;
        `;
        warning.textContent = '⚠️ TEMPORAL ANOMALY DETECTED ⚠️';
        document.body.appendChild(warning);
        
        setTimeout(() => warning.remove(), 2000);
        
        // Create time ripple effect
        this.createTimeRipple();
    }

    travelTo(timeIndex) {
        if (timeIndex < 0 || timeIndex >= this.timeline.length) return;
        
        const state = this.timeline[timeIndex];
        this.currentTime = timeIndex;
        
        // Create time travel effect
        this.createTimeVortex();
        
        // Return the state to be applied
        return state;
    }

    rewind(steps = 1) {
        return this.travelTo(this.currentTime - steps);
    }

    fastForward(steps = 1) {
        return this.travelTo(this.currentTime + steps);
    }

    createBranch() {
        // Create alternate timeline
        const currentState = this.timeline[this.currentTime];
        const branch = {
            id: `B-${Date.now().toString(36)}`,
            parentTime: this.currentTime,
            timeline: [currentState],
            createdAt: Date.now()
        };
        
        this.parallelUniverses.push(branch);
        
        // Visual feedback
        this.createUniverseBranchVisual();
        
        return branch;
    }

    createTimeVortex() {
        if (this.timeVortex) this.timeVortex.remove();
        
        this.timeVortex = document.createElement('div');
        this.timeVortex.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 300px;
            height: 300px;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
        `;
        
        // Create spinning vortex with Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        this.timeVortex.appendChild(canvas);
        document.body.appendChild(this.timeVortex);
        
        const ctx = canvas.getContext('2d');
        let rotation = 0;
        
        const animateVortex = () => {
            ctx.clearRect(0, 0, 300, 300);
            ctx.save();
            ctx.translate(150, 150);
            ctx.rotate(rotation);
            
            // Draw spiral
            ctx.beginPath();
            for (let i = 0; i < 200; i++) {
                const angle = i * 0.1;
                const radius = i * 0.5;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                ctx.lineTo(x, y);
            }
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            
            rotation += 0.1;
            
            if (rotation < Math.PI * 4) {
                requestAnimationFrame(animateVortex);
            } else {
                this.timeVortex.remove();
                this.timeVortex = null;
            }
        };
        
        animateVortex();
    }

    createTimeRipple() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            transform: translate(-50%, -50%);
            border: 2px solid rgba(0, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
        `;
        
        document.body.appendChild(ripple);
        
        ripple.animate([
            { width: '0px', height: '0px', opacity: 1 },
            { width: '1000px', height: '1000px', opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    }

    createUniverseBranchVisual() {
        const visual = document.createElement('div');
        visual.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: rgba(0, 255, 0, 0.8);
            color: black;
            font-weight: bold;
            z-index: 10000;
            animation: universePulse 1s ease-in-out;
        `;
        visual.textContent = `UNIVERSE BRANCH CREATED: ${this.parallelUniverses.length}`;
        document.body.appendChild(visual);
        
        setTimeout(() => visual.remove(), 3000);
    }

    createTimelineVisualization() {
        const container = document.createElement('div');
        container.id = 'timeline-viz';
        container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: rgba(0, 0, 0, 0.8);
            border-top: 2px solid rgba(0, 255, 255, 0.5);
            z-index: 1000;
            overflow-x: auto;
            display: flex;
            align-items: center;
            padding: 10px;
        `;
        
        // Create timeline nodes
        this.timeline.forEach((state, index) => {
            const node = document.createElement('div');
            node.style.cssText = `
                width: 20px;
                height: 20px;
                background: ${index === this.currentTime ? '#00ffff' : '#333'};
                border: 2px solid #00ffff;
                border-radius: 50%;
                margin: 0 5px;
                cursor: pointer;
                transition: all 0.3s;
            `;
            
            node.addEventListener('click', () => {
                const state = this.travelTo(index);
                if (state && window.app) {
                    window.app.loadTimelineState(state);
                }
            });
            
            node.addEventListener('mouseenter', () => {
                node.style.transform = 'scale(1.5)';
                this.showStatePreview(state, node);
            });
            
            node.addEventListener('mouseleave', () => {
                node.style.transform = 'scale(1)';
                this.hideStatePreview();
            });
            
            container.appendChild(node);
        });
        
        // Add branch indicators
        this.parallelUniverses.forEach(universe => {
            const branch = document.createElement('div');
            branch.style.cssText = `
                position: absolute;
                top: -20px;
                left: ${universe.parentTime * 30 + 10}px;
                width: 2px;
                height: 20px;
                background: #00ff00;
            `;
            container.appendChild(branch);
        });
        
        document.body.appendChild(container);
    }

    showStatePreview(state, element) {
        const preview = document.createElement('div');
        preview.id = 'state-preview';
        preview.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ffff;
            padding: 10px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1001;
        `;
        
        const time = new Date(state.timestamp).toLocaleTimeString();
        preview.innerHTML = `
            <div>Time: ${time}</div>
            <div>Tempo: ${state.tempo} BPM</div>
            <div>Universe: ${state.universe}</div>
        `;
        
        element.style.position = 'relative';
        element.appendChild(preview);
    }

    hideStatePreview() {
        const preview = document.getElementById('state-preview');
        if (preview) preview.remove();
    }

    mergeTimelines(branch) {
        // Merge parallel universe back into main timeline
        console.log('MERGING TIMELINES - REALITY MAY BE UNSTABLE');
        
        // Create dramatic effect
        document.body.style.animation = 'timelineMerge 2s ease-in-out';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        // Add merge animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes timelineMerge {
                0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                25% { filter: hue-rotate(90deg) brightness(1.5); }
                50% { filter: hue-rotate(180deg) brightness(2); }
                75% { filter: hue-rotate(270deg) brightness(1.5); }
            }
        `;
        document.head.appendChild(style);
    }

    paradox() {
        // Create a temporal paradox - past affects future affects past
        console.error('TEMPORAL PARADOX INITIATED - CAUSALITY LOOP DETECTED');
        
        // Reverse time flow
        let reverseIndex = this.currentTime;
        const reverseInterval = setInterval(() => {
            reverseIndex--;
            if (reverseIndex < 0) {
                reverseIndex = this.timeline.length - 1;
            }
            
            // Apply rapid state changes
            const state = this.timeline[reverseIndex];
            if (state && window.app) {
                window.app.loadTimelineState(state);
            }
            
            // Stop after one loop
            if (reverseIndex === this.currentTime) {
                clearInterval(reverseInterval);
                this.resolveParadox();
            }
        }, 100);
    }

    resolveParadox() {
        // Reality stabilizes... or does it?
        const resolution = document.createElement('div');
        resolution.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: black;
            animation: paradoxResolve 3s ease-out forwards;
        `;
        resolution.textContent = 'PARADOX RESOLVED... PROBABLY';
        
        document.body.appendChild(resolution);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes paradoxResolve {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
                100% { opacity: 0; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => resolution.remove(), 3000);
    }
}