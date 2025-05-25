export class GlitchSystem {
    constructor() {
        this.active = false;
        this.intensity = 0.5;
        this.glitchElements = [];
        this.glitchInterval = null;
        this.originalStyles = new Map();
    }

    init() {
        this.createGlitchOverlay();
        this.setupGlitchableElements();
    }

    createGlitchOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'glitch-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            display: none;
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    setupGlitchableElements() {
        this.glitchElements = [
            ...document.querySelectorAll('h1, h2, button, .step, .control-group')
        ];
    }

    activate() {
        this.active = true;
        this.overlay.style.display = 'block';
        this.startGlitching();
    }

    deactivate() {
        this.active = false;
        this.overlay.style.display = 'none';
        this.stopGlitching();
        this.restoreElements();
    }

    startGlitching() {
        this.glitchInterval = setInterval(() => {
            if (Math.random() < this.intensity) {
                this.triggerGlitch();
            }
        }, 100);
    }

    stopGlitching() {
        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
            this.glitchInterval = null;
        }
    }

    triggerGlitch() {
        const glitchType = Math.floor(Math.random() * 6);
        
        switch(glitchType) {
            case 0:
                this.pixelShift();
                break;
            case 1:
                this.colorChannel();
                break;
            case 2:
                this.textScramble();
                break;
            case 3:
                this.geometricDistortion();
                break;
            case 4:
                this.dataMosh();
                break;
            case 5:
                this.scanlines();
                break;
        }
    }

    pixelShift() {
        const element = this.getRandomElement();
        if (!element) return;

        const shifts = ['translateX(2px)', 'translateX(-2px)', 'translateY(2px)', 'translateY(-2px)'];
        const randomShift = shifts[Math.floor(Math.random() * shifts.length)];
        
        element.style.transform = randomShift;
        element.style.filter = 'hue-rotate(180deg)';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.filter = '';
        }, 50);
    }

    colorChannel() {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        `;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = `rgba(${Math.random() * 255}, 0, ${Math.random() * 255}, 0.1)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.overlay.appendChild(canvas);
        
        setTimeout(() => {
            canvas.remove();
        }, 100);
    }

    textScramble() {
        const element = this.getRandomElement();
        if (!element || !element.textContent) return;

        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        let scrambled = '';
        
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.3) {
                scrambled += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                scrambled += originalText[i];
            }
        }
        
        element.textContent = scrambled;
        
        setTimeout(() => {
            element.textContent = originalText;
        }, 150);
    }

    geometricDistortion() {
        const element = this.getRandomElement();
        if (!element) return;

        const skewX = (Math.random() - 0.5) * 20;
        const skewY = (Math.random() - 0.5) * 20;
        
        element.style.transform = `skew(${skewX}deg, ${skewY}deg)`;
        element.style.filter = 'contrast(200%) brightness(150%)';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.filter = '';
        }, 100);
    }

    dataMosh() {
        const slice = document.createElement('div');
        const height = Math.random() * 50 + 10;
        const top = Math.random() * window.innerHeight;
        
        slice.style.cssText = `
            position: absolute;
            top: ${top}px;
            left: 0;
            width: 100%;
            height: ${height}px;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 0, 255, 0.8), 
                transparent
            );
            animation: dataMoshSlide 0.2s linear;
        `;
        
        this.overlay.appendChild(slice);
        
        setTimeout(() => {
            slice.remove();
        }, 200);
    }

    scanlines() {
        const scanlines = document.createElement('div');
        scanlines.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 255, 0.1) 2px,
                rgba(0, 255, 255, 0.1) 4px
            );
            animation: scanlineMove 0.5s linear;
        `;
        
        this.overlay.appendChild(scanlines);
        
        setTimeout(() => {
            scanlines.remove();
        }, 500);
    }

    getRandomElement() {
        if (this.glitchElements.length === 0) return null;
        return this.glitchElements[Math.floor(Math.random() * this.glitchElements.length)];
    }

    restoreElements() {
        this.glitchElements.forEach(element => {
            element.style.transform = '';
            element.style.filter = '';
        });
    }

    setIntensity(value) {
        this.intensity = Math.max(0, Math.min(1, value));
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes dataMoshSlide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes scanlineMove {
        0% { transform: translateY(0); }
        100% { transform: translateY(10px); }
    }
`;
document.head.appendChild(style);