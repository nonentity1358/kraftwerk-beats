export class KeyboardController {
    constructor() {
        this.callbacks = {};
        this.enabled = true;
        this.setupKeyboardListeners();
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.enabled) return;
            
            // Prevent default for space to avoid page scroll
            if (e.code === 'Space') {
                e.preventDefault();
            }

            const key = this.normalizeKey(e);
            if (this.callbacks[key]) {
                this.callbacks[key](e);
            }
        });
    }

    normalizeKey(event) {
        let key = event.code;
        
        // Handle number keys
        if (key.startsWith('Digit')) {
            key = key.replace('Digit', '');
        }
        
        // Handle special keys
        if (key === 'Space') return 'space';
        
        return key.toLowerCase();
    }

    on(key, callback) {
        this.callbacks[key.toLowerCase()] = callback;
    }

    off(key) {
        delete this.callbacks[key.toLowerCase()];
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    setupDefaultShortcuts(app) {
        // Play/Stop with spacebar
        this.on('space', () => {
            app.togglePlay();
        });

        // Randomize all with R
        this.on('keyr', () => {
            app.randomizeAll();
        });

        // Clear all with C
        this.on('keyc', () => {
            app.clearAll();
        });

        // Preset shortcuts (1-8)
        const presetNames = app.patternPresets.getPresetNames();
        for (let i = 0; i < Math.min(8, presetNames.length); i++) {
            this.on(`${i + 1}`, () => {
                app.applyPreset(presetNames[i]);
            });
        }

        // Tempo control with +/-
        this.on('numpadadd', () => {
            app.adjustTempo(5);
        });

        this.on('numpadsubtract', () => {
            app.adjustTempo(-5);
        });

        // Pattern navigation with arrow keys
        this.on('arrowleft', () => {
            app.shiftAllPatterns(-1);
        });

        this.on('arrowright', () => {
            app.shiftAllPatterns(1);
        });
    }
}