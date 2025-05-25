export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.active = false;
        this.maxParticles = 50;
    }

    init() {
        this.createContainer();
        this.startParticleGeneration();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        document.body.appendChild(this.container);
    }

    startParticleGeneration() {
        this.active = true;
        this.generateParticles();
    }

    generateParticles() {
        if (!this.active) return;

        if (this.particles.length < this.maxParticles && Math.random() < 0.3) {
            this.createParticle();
        }

        this.particles = this.particles.filter(particle => {
            const rect = particle.element.getBoundingClientRect();
            if (rect.top < -50) {
                particle.element.remove();
                return false;
            }
            return true;
        });

        requestAnimationFrame(() => this.generateParticles());
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position along the bottom
        const x = Math.random() * window.innerWidth;
        particle.style.left = `${x}px`;
        particle.style.bottom = '-10px';
        
        // Random properties
        const size = Math.random() * 6 + 2;
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 2;
        const hue = Math.random() * 60 + 280; // Purple to pink range
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 50%, 1) 0%, transparent 70%)`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Add glow effect
        particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 100%, 50%, 0.5)`;
        
        this.container.appendChild(particle);
        this.particles.push({ element: particle, created: Date.now() });
    }

    createBurst(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle burst-particle';
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 100 + 50;
            const size = Math.random() * 8 + 4;
            const hue = Math.random() * 360;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 50%, 1) 0%, transparent 70%)`;
            particle.style.boxShadow = `0 0 ${size * 3}px hsla(${hue}, 100%, 50%, 0.8)`;
            
            // Custom animation
            particle.style.animation = 'none';
            particle.style.transition = 'all 1s ease-out';
            
            this.container.appendChild(particle);
            
            // Trigger animation
            setTimeout(() => {
                particle.style.transform = `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`;
                particle.style.opacity = '0';
            }, 10);
            
            // Remove after animation
            setTimeout(() => particle.remove(), 1000);
        }
    }

    createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'particle trail-particle';
        
        const size = Math.random() * 4 + 2;
        const hue = Math.random() * 60 + 180; // Cyan to purple
        
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.width = `${size}px`;
        trail.style.height = `${size}px`;
        trail.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 50%, 1) 0%, transparent 70%)`;
        trail.style.animation = 'fadeOut 0.5s ease-out forwards';
        
        this.container.appendChild(trail);
        
        setTimeout(() => trail.remove(), 500);
    }

    setMaxParticles(count) {
        this.maxParticles = count;
    }

    stop() {
        this.active = false;
        this.particles.forEach(p => p.element.remove());
        this.particles = [];
    }

    destroy() {
        this.stop();
        if (this.container) {
            this.container.remove();
        }
    }
}

// Add fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.5);
        }
    }
    
    .burst-particle {
        position: fixed !important;
    }
    
    .trail-particle {
        position: fixed !important;
        pointer-events: none;
    }
`;
document.head.appendChild(style);