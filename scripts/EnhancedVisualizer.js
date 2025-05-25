export class EnhancedVisualizer {
    constructor(canvasId, analyser) {
        this.canvas = document.getElementById(canvasId);
        this.canvasCtx = this.canvas.getContext('2d');
        this.analyser = analyser;
        this.animationId = null;
        this.mode = 'bars';
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        });
    }

    setMode(mode) {
        this.mode = mode;
    }

    start() {
        if (!this.animationId) {
            this.draw();
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            this.clear();
        }
    }

    clear() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.animationId = requestAnimationFrame(() => this.draw());

        switch (this.mode) {
            case 'bars':
                this.drawBars();
                break;
            case 'waveform':
                this.drawWaveform();
                break;
            case 'circular':
                this.drawCircular();
                break;
            case 'matrix':
                this.drawMatrix();
                break;
            default:
                this.drawBars();
        }
    }

    drawBars() {
        const WIDTH = this.canvas.width;
        const HEIGHT = this.canvas.height;

        this.analyser.fftSize = 2048;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        this.analyser.getByteFrequencyData(dataArray);

        this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            const r = barHeight + 100;
            const g = 50;
            const b = 50;

            this.canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
            this.canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    drawWaveform() {
        const WIDTH = this.canvas.width;
        const HEIGHT = this.canvas.height;

        this.analyser.fftSize = 2048;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        this.analyser.getByteTimeDomainData(dataArray);

        this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
        this.canvasCtx.beginPath();

        const sliceWidth = WIDTH / bufferLength;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * HEIGHT / 2;

            if(i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        this.canvasCtx.stroke();
    }

    drawCircular() {
        const WIDTH = this.canvas.width;
        const HEIGHT = this.canvas.height;
        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;
        const radius = Math.min(WIDTH, HEIGHT) * 0.3;

        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        this.analyser.getByteFrequencyData(dataArray);

        this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        for(let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] * 0.5;
            const angle = (i / bufferLength) * Math.PI * 2;
            
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + barHeight);

            const gradient = this.canvasCtx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, `rgba(255, 0, 0, 0.8)`);
            gradient.addColorStop(1, `rgba(0, 255, 255, 0.8)`);

            this.canvasCtx.strokeStyle = gradient;
            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(x1, y1);
            this.canvasCtx.lineTo(x2, y2);
            this.canvasCtx.stroke();
        }
    }

    drawMatrix() {
        const WIDTH = this.canvas.width;
        const HEIGHT = this.canvas.height;
        const cellSize = 20;
        const cols = Math.floor(WIDTH / cellSize);
        const rows = Math.floor(HEIGHT / cellSize);

        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        this.analyser.getByteFrequencyData(dataArray);

        this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                const dataIndex = Math.floor((i / cols) * bufferLength);
                const intensity = dataArray[dataIndex] / 255;
                
                if (intensity > 0.5) {
                    const hue = (i / cols) * 360;
                    this.canvasCtx.fillStyle = `hsla(${hue}, 100%, 50%, ${intensity})`;
                    this.canvasCtx.fillRect(
                        i * cellSize + 2,
                        j * cellSize + 2,
                        cellSize - 4,
                        cellSize - 4
                    );
                }
            }
        }
    }
}