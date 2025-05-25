export class TapTempo {
    constructor() {
        this.taps = [];
        this.maxTaps = 8;
        this.timeout = 2000; // Reset after 2 seconds of no taps
        this.lastTapTime = 0;
    }

    tap() {
        const now = Date.now();
        
        // Reset if too much time has passed
        if (now - this.lastTapTime > this.timeout) {
            this.taps = [];
        }
        
        this.taps.push(now);
        this.lastTapTime = now;
        
        // Keep only the last maxTaps
        if (this.taps.length > this.maxTaps) {
            this.taps.shift();
        }
        
        // Need at least 2 taps to calculate tempo
        if (this.taps.length < 2) {
            return null;
        }
        
        return this.calculateTempo();
    }

    calculateTempo() {
        if (this.taps.length < 2) return null;
        
        let totalInterval = 0;
        for (let i = 1; i < this.taps.length; i++) {
            totalInterval += this.taps[i] - this.taps[i - 1];
        }
        
        const averageInterval = totalInterval / (this.taps.length - 1);
        const bpm = Math.round(60000 / averageInterval);
        
        // Clamp to reasonable range
        return Math.max(60, Math.min(240, bpm));
    }

    reset() {
        this.taps = [];
        this.lastTapTime = 0;
    }

    getTapCount() {
        return this.taps.length;
    }
}