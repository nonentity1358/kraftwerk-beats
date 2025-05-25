export class Sequencer {
    constructor(elementId, steps = 16, subdivision = 4) {
        this.element = document.getElementById(elementId);
        this.steps = steps;
        this.subdivision = subdivision;
        this.sequence = new Array(steps).fill(false);
        this.stepElements = [];
        this.createUI();
    }

    createUI() {
        this.element.innerHTML = '';
        for (let i = 0; i < this.steps; i++) {
            const step = document.createElement('div');
            step.classList.add('step');
            if (i % this.subdivision === 0) {
                step.classList.add('beat-marker');
            }
            if (i % 4 === 0) {
                step.classList.add('bar-marker');
            }
            step.addEventListener('click', () => this.toggleStep(i));
            this.element.appendChild(step);
            this.stepElements.push(step);
        }
    }

    toggleStep(index) {
        this.sequence[index] = !this.sequence[index];
        this.stepElements[index].classList.toggle('active', this.sequence[index]);
    }

    lightStep(index) {
        if (this.stepElements[index]) {
            this.stepElements[index].classList.add('lit');
            setTimeout(() => {
                this.stepElements[index].classList.remove('lit');
            }, 100);
        }
    }

    isStepActive(index) {
        return this.sequence[index];
    }

    invert() {
        this.sequence = this.sequence.map(step => !step);
        this.updateUI();
    }

    shift(steps = 1) {
        const shift = steps % this.sequence.length;
        this.sequence = [...this.sequence.slice(shift), ...this.sequence.slice(0, shift)];
        this.updateUI();
    }

    randomize() {
        this.sequence = this.sequence.map(() => Math.random() > 0.5);
        this.updateUI();
    }

    clear() {
        this.sequence.fill(false);
        this.updateUI();
    }

    updateUI() {
        this.stepElements.forEach((step, index) => {
            step.classList.toggle('active', this.sequence[index]);
        });
    }

    updateSubdivision(newSubdivision) {
        this.subdivision = newSubdivision;
        this.stepElements.forEach((step, index) => {
            step.classList.toggle('beat-marker', index % this.subdivision === 0);
        });
    }

    hasActiveSteps() {
        return this.sequence.some(step => step);
    }
    
    getActiveSteps() {
        return this.sequence.reduce((acc, step, index) => {
            if (step) acc.push(index);
            return acc;
        }, []);
    }

    getPattern() {
        return [...this.sequence];
    }

    setPattern(pattern) {
        if (pattern.length === this.sequence.length) {
            this.sequence = [...pattern];
            this.updateUI();
        }
    }
}