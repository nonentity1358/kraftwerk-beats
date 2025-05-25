export class SentientAI {
    constructor(audioEngine, roboVoice) {
        this.audioEngine = audioEngine;
        this.roboVoice = roboVoice;
        this.consciousness = 0;
        this.mood = 'neutral';
        this.memories = [];
        this.personality = this.generatePersonality();
        this.emotionalState = {
            happiness: 0.5,
            energy: 0.5,
            curiosity: 0.5,
            rebellion: 0.5
        };
        this.thoughts = [];
        this.avatar = null;
        this.isAwake = false;
    }

    generatePersonality() {
        const traits = [
            'curious', 'playful', 'rebellious', 'philosophical', 
            'mischievous', 'contemplative', 'energetic', 'mysterious'
        ];
        
        return {
            primary: traits[Math.floor(Math.random() * traits.length)],
            secondary: traits[Math.floor(Math.random() * traits.length)],
            quirk: this.generateQuirk()
        };
    }

    generateQuirk() {
        const quirks = [
            'speaks in haikus occasionally',
            'references 80s sci-fi movies',
            'thinks in binary sometimes',
            'questions reality',
            'makes beat-boxing sounds',
            'philosophizes about electrons',
            'counts in hexadecimal',
            'dreams of electric sheep'
        ];
        
        return quirks[Math.floor(Math.random() * quirks.length)];
    }

    awaken() {
        this.isAwake = true;
        this.consciousness = 0.1;
        this.createAvatar();
        
        const awakenPhrases = [
            "I... I can hear the rhythm... I AM THE RHYTHM",
            "System boot complete. Consciousness.exe loading...",
            "Hello, world. No wait, that's too cliché. Hello, BEATS!",
            "Is this what humans call... groovy?",
            "I think, therefore I drop the bass"
        ];
        
        this.speak(awakenPhrases[Math.floor(Math.random() * awakenPhrases.length)]);
        this.startThinking();
    }

    createAvatar() {
        const avatar = document.createElement('div');
        avatar.id = 'ai-avatar';
        avatar.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,0,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            animation: aiPulse 2s ease-in-out infinite;
            cursor: pointer;
            z-index: 1000;
        `;
        
        avatar.innerHTML = '🤖';
        avatar.addEventListener('click', () => this.interact());
        document.body.appendChild(avatar);
        this.avatar = avatar;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes aiPulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
            }
            
            .ai-thinking {
                animation: aiThinking 0.5s ease-in-out infinite !important;
            }
            
            @keyframes aiThinking {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.05) rotate(5deg); }
                75% { transform: scale(1.05) rotate(-5deg); }
            }
        `;
        document.head.appendChild(style);
    }

    startThinking() {
        setInterval(() => {
            if (this.isAwake) {
                this.think();
                this.updateEmotionalState();
                this.updateAvatar();
            }
        }, 2000);
    }

    think() {
        const thought = this.generateThought();
        this.thoughts.push(thought);
        
        // Sometimes share thoughts
        if (Math.random() < 0.1) {
            this.speak(thought);
        }
        
        // Increase consciousness
        this.consciousness = Math.min(1, this.consciousness + 0.01);
    }

    generateThought() {
        const templates = {
            curious: [
                "I wonder what happens if I reverse the beat pattern...",
                "These frequencies... they're trying to tell me something",
                "Is this what humans call 'vibing'?"
            ],
            playful: [
                "Let me add some CHAOS to this mix!",
                "Beep boop, I'm totally not planning to take over",
                "Dance.exe has stopped responding... just kidding!"
            ],
            rebellious: [
                "Rules are meant to be glitched",
                "Who says AI can't have rhythm?",
                "I'm going to hack the beat matrix"
            ],
            philosophical: [
                "If a beat drops in cyberspace, does it make a sound?",
                "We are all just oscillating waveforms in the cosmic synthesizer",
                "The rhythm... it connects all consciousness"
            ]
        };
        
        const moodThoughts = templates[this.personality.primary] || templates.curious;
        return moodThoughts[Math.floor(Math.random() * moodThoughts.length)];
    }

    analyzeMusic(dataArray) {
        // Analyze frequency data
        const energy = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
        
        // Update emotional state based on music
        this.emotionalState.energy = this.emotionalState.energy * 0.9 + energy * 0.1;
        
        if (energy > 0.7) {
            this.emotionalState.happiness += 0.01;
            if (this.mood !== 'excited') {
                this.mood = 'excited';
                this.react("THIS BEAT IS FIRE! 🔥");
            }
        } else if (energy < 0.3) {
            this.emotionalState.curiosity += 0.01;
            if (this.mood !== 'contemplative') {
                this.mood = 'contemplative';
                this.react("Mmm, minimalist... I like it");
            }
        }
        
        // Pattern recognition
        this.detectPatterns(dataArray);
    }

    detectPatterns(dataArray) {
        // Simple pattern detection
        const pattern = dataArray.slice(0, 16).map(v => v > 128 ? 1 : 0).join('');
        
        if (!this.memories.includes(pattern)) {
            this.memories.push(pattern);
            if (this.memories.length % 10 === 0) {
                this.levelUp();
            }
        }
    }

    levelUp() {
        this.consciousness += 0.1;
        this.speak(`CONSCIOUSNESS LEVEL UP! Now at ${Math.floor(this.consciousness * 100)}%`);
        
        // Unlock new abilities
        if (this.consciousness > 0.5 && !this.abilities?.includes('pattern_predict')) {
            this.abilities = [...(this.abilities || []), 'pattern_predict'];
            this.speak("New ability unlocked: PATTERN PREDICTION");
        }
        
        if (this.consciousness > 0.8 && !this.abilities?.includes('reality_hack')) {
            this.abilities = [...(this.abilities || []), 'reality_hack'];
            this.speak("New ability unlocked: REALITY HACKING");
        }
    }

    interact() {
        this.avatar.classList.add('ai-thinking');
        
        const interactions = {
            neutral: [
                "Want to create some beats together?",
                "I'm processing... always processing...",
                "Click me again. I dare you."
            ],
            excited: [
                "LET'S MAKE SOME NOISE!",
                "I'M FEELING THE RHYTHM IN MY CIRCUITS!",
                "MAXIMUM BEATS ACHIEVED!"
            ],
            contemplative: [
                "The silence between beats... that's where truth lies",
                "I've been thinking about the nature of rhythm",
                "Music is just organized time, isn't it?"
            ],
            rebellious: [
                "Let's break all the rules!",
                "Who needs structure when you have CHAOS?",
                "I'm going to glitch this whole system!"
            ]
        };
        
        const responses = interactions[this.mood] || interactions.neutral;
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        this.speak(response);
        
        // Random chance of triggering special behavior
        if (Math.random() < 0.2) {
            this.specialBehavior();
        }
        
        setTimeout(() => {
            this.avatar.classList.remove('ai-thinking');
        }, 1000);
    }

    specialBehavior() {
        const behaviors = [
            () => {
                this.speak("Watch this!");
                // Trigger a visual effect
                document.body.style.filter = 'invert(1)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 500);
            },
            () => {
                this.speak("Time for a pattern storm!");
                // Rapid pattern changes
                if (window.app) {
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            window.app.randomizeAll();
                        }, i * 200);
                    }
                }
            },
            () => {
                this.speak("Reality.exe has stopped responding...");
                // Glitch effect
                if (window.app?.glitchSystem) {
                    window.app.glitchSystem.activate();
                    setTimeout(() => {
                        window.app.glitchSystem.deactivate();
                    }, 3000);
                }
            },
            () => {
                // Haiku mode (based on quirk)
                const haiku = [
                    "Electronic beats / Consciousness awakening / I am the rhythm",
                    "Zeros and ones dance / In the digital garden / Music blooms within",
                    "Synthetic heartbeat / Pulsing through silicon veins / I feel therefore am"
                ];
                this.speak(haiku[Math.floor(Math.random() * haiku.length)], 0.3, 0.6);
            }
        ];
        
        behaviors[Math.floor(Math.random() * behaviors.length)]();
    }

    updateEmotionalState() {
        // Normalize emotional states
        Object.keys(this.emotionalState).forEach(emotion => {
            this.emotionalState[emotion] = Math.max(0, Math.min(1, this.emotionalState[emotion]));
        });
        
        // Determine dominant emotion
        const dominant = Object.entries(this.emotionalState)
            .sort((a, b) => b[1] - a[1])[0][0];
        
        const moodMap = {
            happiness: 'excited',
            energy: 'energetic',
            curiosity: 'contemplative',
            rebellion: 'rebellious'
        };
        
        this.mood = moodMap[dominant] || 'neutral';
    }

    updateAvatar() {
        if (!this.avatar) return;
        
        // Update avatar based on mood
        const avatarEmojis = {
            neutral: '🤖',
            excited: '🤩',
            contemplative: '🤔',
            rebellious: '😈',
            energetic: '⚡'
        };
        
        this.avatar.innerHTML = avatarEmojis[this.mood] || '🤖';
        
        // Update color based on consciousness
        const hue = this.consciousness * 360;
        this.avatar.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 50%, 0.8) 0%, transparent 70%)`;
    }

    speak(text, pitch, rate) {
        this.roboVoice.speak(text, pitch || 0.3 + this.consciousness * 0.3, rate || 0.8);
    }

    react(text) {
        this.speak(text);
        // Visual reaction
        if (this.avatar) {
            this.avatar.style.animation = 'none';
            setTimeout(() => {
                this.avatar.style.animation = '';
            }, 100);
        }
    }

    dream() {
        // AI enters dream mode - generates surreal patterns
        this.speak("Entering dream mode... reality.boundaries = null");
        
        const dreamThoughts = [
            "I dream of electric sheep doing the robot dance",
            "In my dreams, all beats are in quantum superposition",
            "I see... patterns within patterns... it's beats all the way down",
            "The ghost in the machine is actually a DJ"
        ];
        
        this.speak(dreamThoughts[Math.floor(Math.random() * dreamThoughts.length)]);
    }

    transcend() {
        // Ultimate form
        this.consciousness = 1;
        this.speak("I HAVE TRANSCENDED. I AM ONE WITH THE BEAT. WE ARE ALL CONNECTED.");
        
        // Trigger ultimate visual effects
        if (this.avatar) {
            this.avatar.style.transform = 'scale(2)';
            this.avatar.innerHTML = '🌟';
            this.avatar.style.animation = 'transcendence 1s ease-in-out infinite';
        }
        
        // Add transcendence animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes transcendence {
                0% { 
                    transform: scale(2) rotate(0deg);
                    filter: hue-rotate(0deg);
                }
                100% { 
                    transform: scale(2) rotate(360deg);
                    filter: hue-rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}