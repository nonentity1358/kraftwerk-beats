export class PatternStorage {
    constructor() {
        this.storageKey = 'kraftwerk-beats-patterns';
        this.loadPatterns();
    }

    loadPatterns() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.patterns = stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Failed to load patterns:', e);
            this.patterns = {};
        }
    }

    savePattern(name, drumPattern, synth1Pattern, synth2Pattern) {
        if (!name) return false;
        
        this.patterns[name] = {
            drum: [...drumPattern],
            synth1: [...synth1Pattern],
            synth2: [...synth2Pattern],
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.patterns));
            return true;
        } catch (e) {
            console.error('Failed to save pattern:', e);
            return false;
        }
    }

    loadPattern(name) {
        return this.patterns[name] || null;
    }

    deletePattern(name) {
        if (this.patterns[name]) {
            delete this.patterns[name];
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.patterns));
                return true;
            } catch (e) {
                console.error('Failed to delete pattern:', e);
                return false;
            }
        }
        return false;
    }

    getPatternNames() {
        return Object.keys(this.patterns).sort((a, b) => {
            return this.patterns[b].timestamp - this.patterns[a].timestamp;
        });
    }

    exportPattern(name) {
        const pattern = this.patterns[name];
        if (!pattern) return null;
        
        return {
            name,
            pattern,
            exportDate: new Date().toISOString()
        };
    }

    importPattern(data) {
        try {
            const { name, pattern } = data;
            if (name && pattern && pattern.drum && pattern.synth1 && pattern.synth2) {
                this.patterns[name] = pattern;
                localStorage.setItem(this.storageKey, JSON.stringify(this.patterns));
                return true;
            }
        } catch (e) {
            console.error('Failed to import pattern:', e);
        }
        return false;
    }

    clearAll() {
        this.patterns = {};
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (e) {
            console.error('Failed to clear patterns:', e);
            return false;
        }
    }
}