export class AdvancedAudioProcessor {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.audioContext = audioEngine.audioContext;
        this.processors = {};
        this.impulseResponses = {};
        this.setupProcessors();
    }

    setupProcessors() {
        // Multi-band compressor
        this.createMultibandCompressor();
        
        // Spatial audio setup
        this.createSpatialProcessor();
        
        // Vintage warmth processor
        this.createWarmthProcessor();
        
        // Shimmer reverb
        this.createShimmerReverb();
        
        // Analog-style filters
        this.createAnalogFilters();
    }

    createMultibandCompressor() {
        // Split audio into frequency bands for individual processing
        const splitter = {
            lowShelf: this.audioContext.createBiquadFilter(),
            midPeak: this.audioContext.createBiquadFilter(),
            highShelf: this.audioContext.createBiquadFilter()
        };

        splitter.lowShelf.type = 'lowshelf';
        splitter.lowShelf.frequency.value = 320;
        splitter.lowShelf.gain.value = 3;

        splitter.midPeak.type = 'peaking';
        splitter.midPeak.frequency.value = 1000;
        splitter.midPeak.Q.value = 0.5;
        splitter.midPeak.gain.value = 2;

        splitter.highShelf.type = 'highshelf';
        splitter.highShelf.frequency.value = 3200;
        splitter.highShelf.gain.value = 4;

        // Compressors for each band
        const compressors = {
            low: this.createCompressor(4, -24, 10, 0.003, 0.1),
            mid: this.createCompressor(3, -18, 5, 0.005, 0.1),
            high: this.createCompressor(2, -12, 3, 0.001, 0.05)
        };

        this.processors.multiband = { splitter, compressors };
    }

    createCompressor(ratio, threshold, knee, attack, release) {
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.value = threshold;
        compressor.knee.value = knee;
        compressor.ratio.value = ratio;
        compressor.attack.value = attack;
        compressor.release.value = release;
        return compressor;
    }

    createSpatialProcessor() {
        // 3D spatial positioning
        const panner = this.audioContext.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'exponential';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 2;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;

        // Listener for 3D audio
        const listener = this.audioContext.listener;
        if (listener.positionX) {
            listener.positionX.value = 0;
            listener.positionY.value = 0;
            listener.positionZ.value = 0;
        }

        // Binaural processing using delay nodes instead of ScriptProcessor
        const binauralDelay = this.audioContext.createDelay(0.001);
        binauralDelay.delayTime.value = 0.0003; // 0.3ms ITD
        
        const binauralGain = this.audioContext.createGain();
        binauralGain.gain.value = 0.8; // ILD
        
        // Create a simple binaural processor using built-in nodes
        const binauralSplitter = this.audioContext.createChannelSplitter(2);
        const binauralMerger = this.audioContext.createChannelMerger(2);
        
        // No processing on left channel
        binauralSplitter.connect(binauralMerger, 0, 0);
        
        // Delay and attenuate right channel
        binauralSplitter.connect(binauralDelay, 1);
        binauralDelay.connect(binauralGain);
        binauralGain.connect(binauralMerger, 0, 1);

        this.processors.spatial = { 
            panner, 
            binauralProcessor: {
                input: binauralSplitter,
                output: binauralMerger
            }
        };
    }

    createWarmthProcessor() {
        // Tube-like saturation
        const waveshaper = this.audioContext.createWaveShaper();
        const curve = new Float32Array(65536);
        
        for (let i = 0; i < 65536; i++) {
            const x = (i - 32768) / 32768;
            // Soft clipping curve that emulates tube saturation
            curve[i] = Math.tanh(x * 2) * 0.7 + x * 0.3;
            
            // Add even harmonics for warmth
            curve[i] += Math.sin(x * Math.PI) * 0.05;
            curve[i] += Math.sin(x * Math.PI * 2) * 0.02;
        }
        
        waveshaper.curve = curve;
        waveshaper.oversample = '4x';

        // Analog-style EQ for warmth
        const warmthEQ = this.audioContext.createBiquadFilter();
        warmthEQ.type = 'peaking';
        warmthEQ.frequency.value = 200;
        warmthEQ.Q.value = 0.7;
        warmthEQ.gain.value = 2;

        this.processors.warmth = { waveshaper, warmthEQ };
    }

    createShimmerReverb() {
        const reverb = this.audioContext.createConvolver();
        const reverbTime = 4; // seconds
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * reverbTime;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        // Create shimmer reverb impulse
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            
            for (let i = 0; i < length; i++) {
                // Exponential decay
                let sample = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
                
                // Add shimmer (pitch-shifted reflections)
                if (i > sampleRate * 0.1) {
                    const shimmerFreq = 1.5; // Octave up
                    const shimmerIndex = Math.floor(i / shimmerFreq);
                    if (shimmerIndex < length) {
                        sample += channelData[shimmerIndex] * 0.3;
                    }
                }
                
                // Add modulation
                sample *= 1 + Math.sin(i / sampleRate * Math.PI * 4) * 0.1;
                
                channelData[i] = sample;
            }
        }
        
        reverb.buffer = impulse;

        // Filters for reverb shaping
        const preFilter = this.audioContext.createBiquadFilter();
        preFilter.type = 'highpass';
        preFilter.frequency.value = 200;
        
        const postFilter = this.audioContext.createBiquadFilter();
        postFilter.type = 'lowpass';
        postFilter.frequency.value = 10000;

        this.processors.shimmerReverb = { reverb, preFilter, postFilter };
    }

    createAnalogFilters() {
        // Moog-style ladder filter emulation
        const filters = [];
        for (let i = 0; i < 4; i++) {
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            filter.Q.value = 5;
            filters.push(filter);
        }
        
        // Chain filters for 24dB/octave slope
        for (let i = 0; i < filters.length - 1; i++) {
            filters[i].connect(filters[i + 1]);
        }

        // Resonance feedback
        const feedbackGain = this.audioContext.createGain();
        feedbackGain.gain.value = 0.8;
        
        const feedbackDelay = this.audioContext.createDelay();
        feedbackDelay.delayTime.value = 0.001;

        filters[filters.length - 1].connect(feedbackGain);
        feedbackGain.connect(feedbackDelay);
        feedbackDelay.connect(filters[0]);

        this.processors.analogFilter = { filters, feedbackGain };
    }

    createConvolutionReverb(type = 'hall') {
        const reverb = this.audioContext.createConvolver();
        
        const impulseResponses = {
            hall: { duration: 4, decay: 0.8, density: 0.9 },
            cathedral: { duration: 8, decay: 0.95, density: 0.7 },
            plate: { duration: 2, decay: 0.6, density: 0.95 },
            spring: { duration: 1, decay: 0.5, density: 0.3 },
            space: { duration: 10, decay: 0.99, density: 0.5 }
        };

        const config = impulseResponses[type];
        const length = this.audioContext.sampleRate * config.duration;
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            
            for (let i = 0; i < length; i++) {
                // Complex reverb algorithm
                let sample = 0;
                
                // Early reflections
                if (i < this.audioContext.sampleRate * 0.1) {
                    const reflections = 5;
                    for (let r = 0; r < reflections; r++) {
                        const delay = Math.random() * 0.05 * this.audioContext.sampleRate;
                        if (i === Math.floor(delay)) {
                            sample += (Math.random() * 2 - 1) * (1 - r / reflections);
                        }
                    }
                }
                
                // Diffuse reverb tail
                sample += (Math.random() * 2 - 1) * 
                         Math.pow(config.decay, i / this.audioContext.sampleRate) * 
                         config.density;
                
                // Modulation
                const modFreq = 0.5 + Math.random() * 2;
                sample *= 1 + Math.sin(i / this.audioContext.sampleRate * Math.PI * modFreq) * 0.1;
                
                channelData[i] = sample;
            }
        }

        reverb.buffer = impulse;
        return reverb;
    }

    processAudioChain(source, options = {}) {
        let node = source;

        // Apply warmth
        if (options.warmth) {
            node.connect(this.processors.warmth.warmthEQ);
            this.processors.warmth.warmthEQ.connect(this.processors.warmth.waveshaper);
            node = this.processors.warmth.waveshaper;
        }

        // Apply multiband compression
        if (options.compress) {
            const mb = this.processors.multiband;
            node.connect(mb.splitter.lowShelf);
            node.connect(mb.splitter.midPeak);
            node.connect(mb.splitter.highShelf);
            
            mb.splitter.lowShelf.connect(mb.compressors.low);
            mb.splitter.midPeak.connect(mb.compressors.mid);
            mb.splitter.highShelf.connect(mb.compressors.high);
            
            const merger = this.audioContext.createGain();
            mb.compressors.low.connect(merger);
            mb.compressors.mid.connect(merger);
            mb.compressors.high.connect(merger);
            node = merger;
        }

        // Apply spatial processing
        if (options.spatial) {
            node.connect(this.processors.spatial.panner);
            node = this.processors.spatial.panner;
        }

        // Apply shimmer reverb
        if (options.shimmer) {
            const wet = this.audioContext.createGain();
            const dry = this.audioContext.createGain();
            wet.gain.value = options.shimmerAmount || 0.3;
            dry.gain.value = 1 - wet.gain.value;

            node.connect(dry);
            node.connect(this.processors.shimmerReverb.preFilter);
            this.processors.shimmerReverb.preFilter.connect(this.processors.shimmerReverb.reverb);
            this.processors.shimmerReverb.reverb.connect(this.processors.shimmerReverb.postFilter);
            this.processors.shimmerReverb.postFilter.connect(wet);

            const mixer = this.audioContext.createGain();
            dry.connect(mixer);
            wet.connect(mixer);
            node = mixer;
        }

        return node;
    }

    createEmotionalFilter(emotion) {
        const filters = {
            joy: {
                highpass: { freq: 200, q: 0.7 },
                peak: { freq: 3000, q: 1, gain: 6 },
                brightness: 1.2
            },
            melancholy: {
                lowpass: { freq: 2000, q: 0.7 },
                peak: { freq: 400, q: 2, gain: 4 },
                brightness: 0.7
            },
            tension: {
                bandpass: { freq: 1000, q: 5 },
                distortion: 0.3,
                brightness: 1.1
            },
            peace: {
                lowpass: { freq: 5000, q: 0.5 },
                reverb: 0.4,
                brightness: 0.9
            },
            power: {
                lowshelf: { freq: 100, gain: 6 },
                highshelf: { freq: 8000, gain: 4 },
                compression: 0.8,
                brightness: 1.3
            }
        };

        return filters[emotion] || filters.joy;
    }

    animateParameter(param, startValue, endValue, duration, curve = 'exponential') {
        const now = this.audioContext.currentTime;
        param.cancelScheduledValues(now);
        param.setValueAtTime(startValue, now);
        
        if (curve === 'exponential') {
            param.exponentialRampToValueAtTime(endValue, now + duration);
        } else {
            param.linearRampToValueAtTime(endValue, now + duration);
        }
    }

    createSidechainCompression(source, trigger) {
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.value = -50;
        compressor.knee.value = 40;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        // Route trigger to compressor sidechain
        trigger.connect(compressor);
        source.connect(compressor);

        return compressor;
    }
    
    // Parameter control methods
    setWarmth(amount) {
        if (this.processors.warmth) {
            // Adjust waveshaper mix
            const curve = this.processors.warmth.waveshaper.curve;
            if (curve) {
                // Adjust the saturation curve intensity
                for (let i = 0; i < curve.length; i++) {
                    const x = (i - 32768) / 32768;
                    curve[i] = Math.tanh(x * (1 + amount * 2)) * 0.7;
                }
            }
            
            // Adjust EQ for warmth
            this.processors.warmth.warmthEQ.frequency.value = 200 + (amount * 100);
            this.processors.warmth.warmthEQ.gain.value = 3 + (amount * 6);
        }
    }
    
    setSpatialPosition(position) {
        if (this.processors.spatial && this.processors.spatial.panner) {
            // Position from -1 (left) to 1 (right)
            const x = position * 2;
            const z = -Math.abs(position); // Move back when panned
            
            const panner = this.processors.spatial.panner;
            if (panner.positionX) {
                // Modern API
                panner.positionX.value = x;
                panner.positionY.value = 0;
                panner.positionZ.value = z;
            } else {
                // Legacy API
                panner.setPosition(x, 0, z);
            }
        }
    }
    
    setSpatialWidth(width) {
        if (this.processors.spatial && this.processors.spatial.binauralProcessor) {
            // The binaural processor is now a structure with input/output nodes
            // We need to recreate the delay with new timing
            const itdTime = 0.0003 * width; // 0-0.3ms
            
            // For now, just store the width value for future use
            this.spatialWidth = width;
        }
    }
    
    setCompressionRatio(ratio) {
        if (this.processors.multiband) {
            const compressors = this.processors.multiband.compressors;
            compressors.low.ratio.value = ratio;
            compressors.mid.ratio.value = ratio * 0.8;
            compressors.high.ratio.value = ratio * 0.6;
        }
    }
    
    setShimmerIntensity(intensity) {
        if (this.processors.shimmerReverb) {
            // Adjust reverb mix and filter
            this.processors.shimmerReverb.postFilter.frequency.value = 2000 + (intensity * 8000);
            this.processors.shimmerReverb.postFilter.gain.value = intensity * 12;
        }
    }
}