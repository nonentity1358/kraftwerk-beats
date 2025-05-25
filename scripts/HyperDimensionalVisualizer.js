export class HyperDimensionalVisualizer {
    constructor(containerId, analyser) {
        this.container = document.getElementById(containerId);
        this.analyser = analyser;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometries = [];
        this.time = 0;
        this.dimensions = 5; // We're going BEYOND 3D
        this.quantumField = [];
        this.portalActive = false;
        this.realityTear = 0;
    }

    async init() {
        // Create THREE.js scene dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
            script.onload = () => {
                this.setupScene();
                this.createHyperGeometry();
                this.animate();
                resolve();
            };
        });
    }

    setupScene() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.001);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        this.camera.position.z = 100;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        overlay.appendChild(this.renderer.domElement);
        document.body.appendChild(overlay);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xff0000, 2, 1000);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);
        
        // Add some wild lights
        for (let i = 0; i < 5; i++) {
            const light = new THREE.PointLight(
                new THREE.Color().setHSL(Math.random(), 1, 0.5),
                1,
                500
            );
            light.position.set(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
            this.scene.add(light);
        }
    }

    createHyperGeometry() {
        // Create tesseract (4D hypercube) projection
        const tesseractGeometry = this.createTesseract();
        const tesseractMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });
        const tesseract = new THREE.LineSegments(tesseractGeometry, tesseractMaterial);
        this.scene.add(tesseract);
        this.geometries.push(tesseract);
        
        // Create quantum particle field
        const particleCount = 10000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 1000;
            positions[i + 1] = (Math.random() - 0.5) * 1000;
            positions[i + 2] = (Math.random() - 0.5) * 1000;
            
            const color = new THREE.Color();
            color.setHSL(Math.random(), 1, 0.5);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }
        
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.quantumField.push(particles);
        
        // Create interdimensional portal
        this.createPortal();
        
        // Create reality-bending mesh
        const torusGeometry = new THREE.TorusKnotGeometry(20, 5, 100, 16);
        const torusMaterial = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5,
            wireframe: true
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        this.scene.add(torus);
        this.geometries.push(torus);
    }

    createTesseract() {
        // 4D hypercube vertices projected to 3D
        const vertices = [];
        const edges = [];
        
        // Generate 16 vertices of a tesseract
        for (let i = 0; i < 16; i++) {
            const x = ((i & 1) ? 1 : -1) * 30;
            const y = ((i & 2) ? 1 : -1) * 30;
            const z = ((i & 4) ? 1 : -1) * 30;
            const w = ((i & 8) ? 1 : -1) * 30;
            
            // Project 4D to 3D using stereographic projection
            const scale = 1 / (2 - w / 30);
            vertices.push(new THREE.Vector3(x * scale, y * scale, z * scale));
        }
        
        // Connect vertices to create edges
        for (let i = 0; i < 16; i++) {
            for (let j = i + 1; j < 16; j++) {
                // Connect vertices that differ by exactly one bit
                const diff = i ^ j;
                if ((diff & (diff - 1)) === 0) {
                    edges.push(vertices[i], vertices[j]);
                }
            }
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(edges);
        return geometry;
    }

    createPortal() {
        // Interdimensional portal with shader material
        const portalGeometry = new THREE.RingGeometry(30, 50, 32);
        const portalMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                varying vec2 vUv;
                
                void main() {
                    vec2 p = vUv * 2.0 - 1.0;
                    float d = length(p);
                    
                    float angle = atan(p.y, p.x);
                    float radius = d + sin(angle * 5.0 + time) * 0.1;
                    
                    vec3 color = vec3(0.0);
                    color.r = sin(radius * 10.0 - time * 2.0) * 0.5 + 0.5;
                    color.g = sin(radius * 10.0 - time * 2.0 + 2.094) * 0.5 + 0.5;
                    color.b = sin(radius * 10.0 - time * 2.0 + 4.188) * 0.5 + 0.5;
                    
                    float alpha = 1.0 - smoothstep(0.4, 0.5, d);
                    alpha *= smoothstep(0.3, 0.4, d);
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const portal = new THREE.Mesh(portalGeometry, portalMaterial);
        portal.position.z = -200;
        this.scene.add(portal);
        this.portal = portal;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Get audio data
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        // Calculate audio metrics
        const bass = this.getFrequencyRange(dataArray, 0, 10) / 255;
        const mid = this.getFrequencyRange(dataArray, 10, 50) / 255;
        const treble = this.getFrequencyRange(dataArray, 50, 100) / 255;
        
        // Rotate tesseract in 4D space
        if (this.geometries[0]) {
            this.geometries[0].rotation.x += 0.001 + bass * 0.01;
            this.geometries[0].rotation.y += 0.002 + mid * 0.01;
            this.geometries[0].rotation.z += 0.003 + treble * 0.01;
            
            // 4D rotation (scale oscillation)
            const scale = 1 + Math.sin(this.time) * 0.2 * bass;
            this.geometries[0].scale.set(scale, scale, scale);
        }
        
        // Animate torus knot
        if (this.geometries[1]) {
            this.geometries[1].rotation.x += 0.01 * (1 + mid);
            this.geometries[1].rotation.y += 0.01 * (1 + treble);
            this.geometries[1].scale.set(
                1 + bass * 0.5,
                1 + mid * 0.5,
                1 + treble * 0.5
            );
        }
        
        // Quantum field animation
        this.quantumField.forEach((field, index) => {
            const positions = field.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += Math.sin(this.time + i) * bass;
                positions[i + 1] += Math.cos(this.time + i) * mid;
                positions[i + 2] += Math.sin(this.time * 0.5 + i) * treble;
            }
            field.geometry.attributes.position.needsUpdate = true;
            field.rotation.y += 0.001;
        });
        
        // Portal animation
        if (this.portal) {
            this.portal.material.uniforms.time.value = this.time;
            this.portal.rotation.z += 0.01;
            
            // Portal activation based on audio
            if (bass > 0.7 && !this.portalActive) {
                this.activatePortal();
            }
        }
        
        // Camera movement
        this.camera.position.x = Math.sin(this.time * 0.3) * 50;
        this.camera.position.y = Math.cos(this.time * 0.2) * 30;
        this.camera.lookAt(0, 0, 0);
        
        // Reality distortion
        if (this.realityTear > 0) {
            this.renderer.domElement.style.filter = `hue-rotate(${this.realityTear * 360}deg) contrast(${1 + this.realityTear})`;
            this.realityTear -= 0.01;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    getFrequencyRange(dataArray, start, end) {
        let sum = 0;
        for (let i = start; i < end && i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        return sum / (end - start);
    }

    activatePortal() {
        this.portalActive = true;
        this.realityTear = 1;
        
        // Create portal burst effect
        const burstCount = 100;
        const burstGeometry = new THREE.BufferGeometry();
        const burstPositions = new Float32Array(burstCount * 3);
        
        for (let i = 0; i < burstCount * 3; i += 3) {
            const angle = (i / 3) * (Math.PI * 2 / burstCount);
            const radius = 40 + Math.random() * 20;
            burstPositions[i] = Math.cos(angle) * radius;
            burstPositions[i + 1] = Math.sin(angle) * radius;
            burstPositions[i + 2] = -200;
        }
        
        burstGeometry.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
        
        const burstMaterial = new THREE.PointsMaterial({
            color: 0xff00ff,
            size: 5,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        const burst = new THREE.Points(burstGeometry, burstMaterial);
        this.scene.add(burst);
        
        // Animate burst
        const animateBurst = () => {
            burst.scale.multiplyScalar(1.1);
            burst.material.opacity *= 0.95;
            burst.position.z += 5;
            
            if (burst.material.opacity > 0.01) {
                requestAnimationFrame(animateBurst);
            } else {
                this.scene.remove(burst);
                this.portalActive = false;
            }
        };
        
        animateBurst();
    }

    enterHyperspace() {
        // Complete reality breakdown
        this.realityTear = 2;
        
        // Add extra dimensions
        this.dimensions++;
        
        // Create hyperdimensional objects
        const hyperGeometry = new THREE.IcosahedronGeometry(30, 2);
        const hyperMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        
        for (let i = 0; i < this.dimensions; i++) {
            const hyperObject = new THREE.Mesh(hyperGeometry, hyperMaterial);
            hyperObject.position.set(
                Math.random() * 200 - 100,
                Math.random() * 200 - 100,
                Math.random() * 200 - 100
            );
            this.scene.add(hyperObject);
            this.geometries.push(hyperObject);
        }
    }

    destroy() {
        if (this.renderer) {
            this.renderer.domElement.parentElement.remove();
            this.renderer.dispose();
        }
    }
}