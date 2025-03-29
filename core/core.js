/**
 * Core system for SCORM interactive textbook
 * This manages the component system, module loading, and app lifecycle
 */

// Main application class
class SCORMApp {
    constructor() {
        this.config = null;
        this.components = new Map();
        this.services = new Map();
        this.currentScreen = null;
        this.isInitialized = false;
    }
    
    // Initialize the application
    async init(configPath = 'config.js') {
        // Load configuration
        try {
            this.config = await this.loadConfig(configPath);
            console.log('Configuration loaded');
        } catch (error) {
            console.error('Failed to load configuration:', error);
            return false;
        }
        
        // Register core services
        this.registerService('navigation', new NavigationService(this));
        this.registerService('accessibility', new AccessibilityService(this));
        this.registerService('audio', new AudioService(this));
        this.registerService('state', new StateService(this));
        
        // Register core components
        await this.registerComponent('loader', new LoaderComponent(this));
        await this.registerComponent('intro', new IntroComponent(this));
        await this.registerComponent('topic', new TopicComponent(this));
        await this.registerComponent('exam', new ExamComponent(this));
        await this.registerComponent('results', new ResultsComponent(this));
        
        // Initialize UI
        this.initializeUI();
        
        // Mark as initialized
        this.isInitialized = true;
        return true;
    }
    
    // Load configuration dynamically
    async loadConfig(configPath) {
        return new Promise((resolve, reject) => {
            // Check if config is already loaded
            if (window.chapterConfig) {
                console.log('Configuration already loaded, using existing config');
                resolve(window.chapterConfig);
                return;
            }
            
            const script = document.createElement('script');
            script.src = configPath;
            script.onload = () => {
                if (window.chapterConfig) {
                    resolve(window.chapterConfig);
                } else {
                    reject(new Error('Config loaded but chapterConfig not found'));
                }
            };
            script.onerror = () => reject(new Error(`Failed to load ${configPath}`));
            document.head.appendChild(script);
        });
    }
    
    // Register a component
    async registerComponent(id, component) {
        if (this.components.has(id)) {
            console.warn(`Component ${id} already registered, replacing`);
        }
        
        // Initialize the component
        await component.init();
        this.components.set(id, component);
        return component;
    }
    
    // Register a service
    registerService(id, service) {
        if (this.services.has(id)) {
            console.warn(`Service ${id} already registered, replacing`);
        }
        this.services.set(id, service);
        return service;
    }
    
    // Get a component by ID
    getComponent(id) {
        return this.components.get(id);
    }
    
    // Get a service by ID
    getService(id) {
        return this.services.get(id);
    }
    
    // Navigate to a specific screen
    async navigateTo(screenId, params = {}) {
        const navService = this.getService('navigation');
        return navService.navigateTo(screenId, params);
    }
    
    // Initialize the UI
    initializeUI() {
        // Create container structure if not exists
        if (!document.getElementById('app-container')) {
            const container = document.createElement('div');
            container.id = 'app-container';
            document.body.appendChild(container);
        }
        
        // Set page title
        document.title = this.config?.chapterInfo?.title || 'Interactive Textbook';
        
        // Initialize navigation
        const navService = this.getService('navigation');
        navService.initializeNavigation();
        
        // Navigate to intro screen by default
        this.navigateTo('intro');
    }
}

// Base Component class
class Component {
    constructor(app) {
        this.app = app;
        this.element = null;
    }
    
    async init() {
        // To be implemented by child classes
    }
    
    async render(params = {}) {
        // To be implemented by child classes
        return '';
    }
    
    async mount(containerSelector = '#app-container') {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container not found: ${containerSelector}`);
            return false;
        }
        
        if (!this.element) {
            console.error('Component element not created. Call render() first.');
            return false;
        }
        
        container.appendChild(this.element);
        return true;
    }
    
    async unmount() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            return true;
        }
        return false;
    }
}

// Navigation Service
class NavigationService {
    constructor(app) {
        this.app = app;
        this.history = [];
        this.currentScreen = null;
    }
    
    initializeNavigation() {
        // Handle browser back button
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.screen) {
                this.navigateTo(event.state.screen, event.state.params, true);
            }
        });
        
        // Create navigation menu
        this.createNavigationMenu();
    }
    
    createNavigationMenu() {
        // Create navigation menu based on config
        const navContainer = document.createElement('nav');
        navContainer.className = 'kid-nav';
        navContainer.style.display = 'none'; // Hide initially
        
        // Add home button
        const homeButton = document.createElement('button');
        homeButton.className = 'nav-button';
        homeButton.id = 'nav-home';
        homeButton.innerHTML = '<i class="fas fa-home"></i> Home';
        homeButton.addEventListener('click', () => this.navigateTo('intro'));
        navContainer.appendChild(homeButton);
        
        // Add topics from config
        if (this.app.config && this.app.config.topics) {
            this.app.config.topics.forEach((topic, index) => {
                const button = document.createElement('button');
                button.className = 'nav-button';
                button.id = `nav-topic-${index + 1}`;
                button.innerHTML = `<i class="${topic.icon || 'fas fa-book'}"></i> ${topic.navTitle || topic.title}`;
                button.addEventListener('click', () => this.navigateTo('topic', { id: index + 1 }));
                navContainer.appendChild(button);
            });
        }
        
        // Add practice button
        const practiceButton = document.createElement('button');
        practiceButton.className = 'nav-button';
        practiceButton.id = 'nav-practice';
        practiceButton.innerHTML = '<i class="fas fa-pencil-alt"></i> Practice';
        practiceButton.addEventListener('click', () => this.navigateTo('exam'));
        navContainer.appendChild(practiceButton);
        
        // Add to app container
        const container = document.getElementById('app-container');
        if (container) {
            container.appendChild(navContainer);
        }
    }
    
    async navigateTo(screenId, params = {}, isHistoryNavigation = false) {
        // Prevent navigation if same screen and params
        if (this.currentScreen && 
            this.currentScreen.id === screenId && 
            JSON.stringify(this.currentScreen.params) === JSON.stringify(params)) {
            return false;
        }
        
        console.log(`Navigating to: ${screenId}`, params);
        
        // Save current state to history if needed
        if (!isHistoryNavigation && this.currentScreen) {
            this.history.push(this.currentScreen);
            
            // Update browser history
            const url = new URL(window.location);
            url.hash = `#${screenId}`;
            window.history.pushState({ screen: screenId, params }, '', url);
        }
        
        // Unmount current component if exists
        let currentComponent = null;
        if (this.currentScreen && this.currentScreen.component) {
            currentComponent = this.currentScreen.component;
            await currentComponent.unmount();
        }
        
        // Determine which component to use
        let component;
        switch (screenId) {
            case 'intro':
                component = this.app.getComponent('intro');
                break;
            case 'topic':
                component = this.app.getComponent('topic');
                break;
            case 'exam':
                component = this.app.getComponent('exam');
                break;
            case 'results':
                component = this.app.getComponent('results');
                break;
            default:
                console.error(`Unknown screen: ${screenId}`);
                return false;
        }
        
        if (!component) {
            console.error(`Component not found for screen: ${screenId}`);
            return false;
        }
        
        // Render and mount new component
        const element = await component.render(params);
        component.element = element;
        await component.mount();
        
        // Update current screen
        this.currentScreen = { 
            id: screenId, 
            params,
            component
        };
        
        // Show navigation menu except on intro screen
        const navMenu = document.querySelector('.kid-nav');
        if (navMenu) {
            navMenu.style.display = screenId === 'intro' ? 'none' : 'flex';
            
            // Update active button
            navMenu.querySelectorAll('.nav-button').forEach(btn => {
                btn.classList.remove('current');
            });
            
            if (screenId === 'intro') {
                navMenu.querySelector('#nav-home').classList.add('current');
            } else if (screenId === 'topic' && params.id) {
                navMenu.querySelector(`#nav-topic-${params.id}`).classList.add('current');
            } else if (screenId === 'exam') {
                navMenu.querySelector('#nav-practice').classList.add('current');
            }
        }
        
        return true;
    }
    
    goBack() {
        if (this.history.length > 0) {
            const prevScreen = this.history.pop();
            return this.navigateTo(prevScreen.id, prevScreen.params, true);
        }
        return this.navigateTo('intro', {}, true);
    }
}

// Accessibility Service
class AccessibilityService {
    constructor(app) {
        this.app = app;
        this.settings = {
            textSize: 'medium',
            fontType: 'regular',
            highContrast: false,
            readingGuide: false,
            simplifiedUI: false,
            extraTime: false,
            ttsEnabled: true
        };
    }
    
    init() {
        // Load saved settings
        this.loadSettings();
        
        // Apply settings
        this.applySettings();
        
        // Create accessibility panel
        this.createAccessibilityPanel();
    }
    
    loadSettings() {
        const storedSettings = localStorage.getItem('accessibilitySettings');
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                this.settings = { ...this.settings, ...parsedSettings };
            } catch (e) {
                console.error('Error loading accessibility settings:', e);
            }
        }
    }
    
    saveSettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    }
    
    applySetting(setting, value) {
        this.settings[setting] = value;
        this.applySettings();
        this.saveSettings();
    }
    
    applySettings() {
        // Apply text size
        document.documentElement.className = document.documentElement.className
            .replace(/text-size-\S+/g, '')
            .concat(' text-size-' + this.settings.textSize);
            
        // Apply font type
        document.documentElement.className = document.documentElement.className
            .replace(/font-type-\S+/g, '')
            .concat(' font-type-' + this.settings.fontType);
        
        // Apply high contrast
        if (this.settings.highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
        
        // Apply simplified UI
        if (this.settings.simplifiedUI) {
            document.documentElement.classList.add('simplified-ui');
        } else {
            document.documentElement.classList.remove('simplified-ui');
        }
        
        // Apply reading guide
        if (this.settings.readingGuide) {
            document.documentElement.classList.add('reading-guide-active');
            this.setupReadingGuide();
        } else {
            document.documentElement.classList.remove('reading-guide-active');
            this.removeReadingGuide();
        }
        
        // Apply TTS setting
        if (this.settings.ttsEnabled) {
            document.documentElement.classList.remove('tts-disabled');
        } else {
            document.documentElement.classList.add('tts-disabled');
        }
    }
    
    createAccessibilityPanel() {
        // Implementation of the accessibility panel
        // This will be a lot like the existing SLD panel but more modular
    }
    
    setupReadingGuide() {
        // Implementation similar to existing code
    }
    
    removeReadingGuide() {
        // Implementation similar to existing code
    }
    
    // Text to speech function
    speakText(text, options = {}) {
        if (!this.settings.ttsEnabled) return;
        
        const audioService = this.app.getService('audio');
        if (audioService) {
            audioService.speakText(text, options);
        }
    }
}

// Audio Service - handles speech synthesis and sound effects
class AudioService {
    constructor(app) {
        this.app = app;
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.soundEnabled = true;
        this.musicEnabled = false;
        this.backgroundMusic = null;
    }
    
    init() {
        this.loadSoundSettings();
        this.initBackgroundMusic();
    }
    
    loadSoundSettings() {
        const settings = localStorage.getItem('soundSettings');
        if (settings) {
            try {
                const { soundEnabled, musicEnabled } = JSON.parse(settings);
                this.soundEnabled = soundEnabled;
                this.musicEnabled = musicEnabled;
            } catch (e) {
                console.error('Error loading sound settings:', e);
            }
        }
    }
    
    saveSoundSettings() {
        localStorage.setItem('soundSettings', JSON.stringify({
            soundEnabled: this.soundEnabled,
            musicEnabled: this.musicEnabled
        }));
    }
    
    initBackgroundMusic() {
        this.backgroundMusic = new Audio('sounds/background.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        }
    }
    
    playBackgroundMusic() {
        if (this.backgroundMusic && this.musicEnabled) {
            this.backgroundMusic.play().catch(e => console.log('Music autoplay prevented:', e));
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    toggleBackgroundMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
        
        this.saveSoundSettings();
        return this.musicEnabled;
    }
    
    toggleSoundEffects() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSoundSettings();
        return this.soundEnabled;
    }
    
    playSound(soundName) {
        if (!this.soundEnabled) return;
        
        const sounds = {
            'click': 'sounds/click.mp3',
            'complete': 'sounds/complete.mp3',
            'correct': 'sounds/correct.mp3',
            'incorrect': 'sounds/incorrect.mp3',
            'error': 'sounds/error.mp3',
            'points': 'sounds/points.mp3'
        };
        
        if (sounds[soundName]) {
            try {
                const audio = new Audio(sounds[soundName]);
                audio.play().catch(e => console.log('Sound play error:', e));
            } catch (e) {
                console.error('Error playing sound:', e);
            }
        }
    }
    
    speakText(text, options = {}) {
        // Cancel any ongoing speech
        this.stopSpeaking();
        
        // Check if text is an element ID
        if (typeof text === 'string' && document.getElementById(text)) {
            const element = document.getElementById(text);
            text = element.textContent;
        }
        
        if (!text) return;
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Apply options
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;
        
        // Set voice if specified or available
        if (options.voice) {
            utterance.voice = options.voice;
        } else {
            // Try to find a good voice
            const voices = this.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Look for a child-friendly voice
                const preferredVoice = voices.find(v => 
                    v.name.toLowerCase().includes('kids') || 
                    v.name.toLowerCase().includes('child') ||
                    v.name.toLowerCase().includes('female')
                );
                
                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }
            }
        }
        
        // Handle word highlighting if needed
        if (options.highlight && options.elementId) {
            this.highlightWhileSpeaking(utterance, options.elementId);
        }
        
        // Set callbacks
        utterance.onstart = options.onstart || null;
        utterance.onend = options.onend || null;
        utterance.onerror = options.onerror || null;
        
        // Store current utterance
        this.currentUtterance = utterance;
        
        // Start speaking
        this.speechSynthesis.speak(utterance);
        
        return utterance;
    }
    
    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        this.currentUtterance = null;
    }
    
    highlightWhileSpeaking(utterance, elementId) {
        // Implementation for word-by-word highlighting
    }
}

// State Service - manages application state
class StateService {
    constructor(app) {
        this.app = app;
        this.state = {
            currentLevel: 0,
            score: 0,
            levelScores: [0, 0, 0, 0, 0],
            examAnswers: [],
            examScore: 0
        };
        
        // Observers for state changes
        this.observers = {};
    }
    
    // Get state value
    get(key) {
        return this.state[key];
    }
    
    // Set state value
    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        // Notify observers
        this.notifyObservers(key, oldValue, value);
        
        return value;
    }
    
    // Update state object
    update(partialState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...partialState };
        
        // Notify observers for each changed key
        Object.keys(partialState).forEach(key => {
            if (oldState[key] !== this.state[key]) {
                this.notifyObservers(key, oldState[key], this.state[key]);
            }
        });
        
        return this.state;
    }
    
    // Add state change observer
    observe(key, callback) {
        if (!this.observers[key]) {
            this.observers[key] = [];
        }
        this.observers[key].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.observers[key] = this.observers[key].filter(cb => cb !== callback);
        };
    }
    
    // Notify observers of state change
    notifyObservers(key, oldValue, newValue) {
        if (this.observers[key]) {
            this.observers[key].forEach(callback => {
                try {
                    callback(newValue, oldValue, key);
                } catch (e) {
                    console.error('Error in state observer:', e);
                }
            });
        }
    }
    
    // Save state to localStorage
    saveState() {
        try {
            localStorage.setItem('appState', JSON.stringify(this.state));
        } catch (e) {
            console.error('Error saving state:', e);
        }
    }
    
    // Load state from localStorage
    loadState() {
        try {
            const savedState = localStorage.getItem('appState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                this.state = { ...this.state, ...parsedState };
            }
        } catch (e) {
            console.error('Error loading state:', e);
        }
    }
    
    // Clear saved state
    clearState() {
        localStorage.removeItem('appState');
        // Reset to default state
        this.state = {
            currentLevel: 0,
            score: 0,
            levelScores: [0, 0, 0, 0, 0],
            examAnswers: [],
            examScore: 0
        };
    }
}

// Export the core application
window.SCORMApp = SCORMApp;
