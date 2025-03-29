/**
 * SLD Helper Functions - Additional support for children with Specific Learning Disabilities
 */

// Global settings that can be adjusted for individual needs
const sldSettings = {
    textSize: 'medium', // small, medium, large
    fontType: 'regular', // regular, dyslexic
    highContrast: false,
    readingGuide: false,
    simplifiedUI: false,
    extraTime: false,
    ttsEnabled: true // New setting for text-to-speech toggle
};

// Initialize SLD support features
document.addEventListener('DOMContentLoaded', function() {
    createSLDControlPanel();
    applyStoredPreferences();
    
    // Setup reading guide if needed
    if (sldSettings.readingGuide) {
        setupReadingGuide();
    }
});

// Create accessible control panel for SLD settings
function createSLDControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'sld-panel';
    panel.innerHTML = `
        <button class="sld-panel-toggle" aria-label="Accessibility options">
            <i class="fas fa-universal-access"></i>
        </button>
        <div class="sld-panel-content">
            <h3>Accessibility Settings</h3>
            
            <div class="sld-option">
                <label for="text-size">Text Size:</label>
                <div class="sld-buttons">
                    <button class="sld-button" data-setting="textSize" data-value="small">A</button>
                    <button class="sld-button active" data-setting="textSize" data-value="medium">A</button>
                    <button class="sld-button" data-setting="textSize" data-value="large">A</button>
                </div>
            </div>
            
            <div class="sld-option">
                <label for="font-type">Font Type:</label>
                <div class="sld-buttons">
                    <button class="sld-button active" data-setting="fontType" data-value="regular">Regular</button>
                    <button class="sld-button" data-setting="fontType" data-value="dyslexic">Dyslexic</button>
                </div>
            </div>
            
            <div class="sld-option">
                <label>
                    <input type="checkbox" id="tts-enabled" data-setting="ttsEnabled" checked>
                    Enable Text-to-Speech
                </label>
            </div>
            
            <div class="sld-option">
                <label>
                    <input type="checkbox" id="high-contrast" data-setting="highContrast">
                    High Contrast
                </label>
            </div>
            
            <div class="sld-option">
                <label>
                    <input type="checkbox" id="reading-guide" data-setting="readingGuide">
                    Reading Guide
                </label>
            </div>
            
            <div class="sld-option">
                <label>
                    <input type="checkbox" id="simplified-ui" data-setting="simplifiedUI">
                    Simplified Interface
                </label>
            </div>
            
            <div class="sld-option">
                <label>
                    <input type="checkbox" id="extra-time" data-setting="extraTime">
                    Extra Time for Questions
                </label>
            </div>
            
            <button class="sld-apply-btn">Apply Settings</button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Toggle panel visibility
    const toggle = panel.querySelector('.sld-panel-toggle');
    const content = panel.querySelector('.sld-panel-content');
    
    toggle.addEventListener('click', function() {
        content.classList.toggle('visible');
    });
    
    // Handle button selections
    const buttons = panel.querySelectorAll('.sld-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from siblings
            const setting = this.getAttribute('data-setting');
            const value = this.getAttribute('data-value');
            
            document.querySelectorAll(`.sld-button[data-setting="${setting}"]`)
                .forEach(btn => btn.classList.remove('active'));
                
            // Add active class to selected button
            this.classList.add('active');
            
            // Update setting
            sldSettings[setting] = value;
        });
    });
    
    // Handle checkbox toggles
    const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const setting = this.getAttribute('data-setting');
            sldSettings[setting] = this.checked;
            
            // Special handling for reading guide
            if (setting === 'readingGuide') {
                if (this.checked) {
                    setupReadingGuide();
                } else {
                    removeReadingGuide();
                }
            }
        });
    });
       
    // Apply button
    const applyBtn = panel.querySelector('.sld-apply-btn');
    applyBtn.addEventListener('click', function() {
        applySettings();
        savePreferences();
        content.classList.remove('visible');
    });
}

// Apply all SLD settings
function applySettings() {
    // Apply text size
    document.documentElement.className = document.documentElement.className
        .replace(/text-size-\S+/g, '')
        .concat(' text-size-' + sldSettings.textSize);
        
    // Apply font type
    document.documentElement.className = document.documentElement.className
        .replace(/font-type-\S+/g, '')
        .concat(' font-type-' + sldSettings.fontType);
    
    // Apply high contrast
    if (sldSettings.highContrast) {
        document.documentElement.classList.add('high-contrast');
    } else {
        document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply simplified UI
    if (sldSettings.simplifiedUI) {
        document.documentElement.classList.add('simplified-ui');
    } else {
        document.documentElement.classList.remove('simplified-ui');
    }
    
    // Apply reading guide
    if (sldSettings.readingGuide) {
        document.documentElement.classList.add('reading-guide-active');
    } else {
        document.documentElement.classList.remove('reading-guide-active');
    }
    
    // Apply TTS setting
    if (sldSettings.ttsEnabled) {
        document.documentElement.classList.remove('tts-disabled');
    } else {
        document.documentElement.classList.add('tts-disabled');
    }
}

// Setup reading guide functionality
function setupReadingGuide() {
    // Create reading guide element if it doesn't exist
    if (!document.querySelector('.reading-guide')) {
        const guide = document.createElement('div');
        guide.className = 'reading-guide';
        document.body.appendChild(guide);
        
        // Make guide follow mouse movement
        document.addEventListener('mousemove', function(e) {
            if (sldSettings.readingGuide) {
                const guideElement = document.querySelector('.reading-guide');
                if (guideElement) {
                    guideElement.style.top = (e.clientY - 16) + 'px';
                }
            }
        });
    }
}

// Remove reading guide
function removeReadingGuide() {
    const guide = document.querySelector('.reading-guide');
    if (guide) {
        guide.remove();
    }
}

// Save preferences to localStorage
function savePreferences() {
    localStorage.setItem('sldSettings', JSON.stringify(sldSettings));
}

// Apply stored preferences on load
function applyStoredPreferences() {
    const stored = localStorage.getItem('sldSettings');
    if (stored) {
        try {
            const settings = JSON.parse(stored);
            Object.assign(sldSettings, settings);
            
            // Update UI to match stored settings
            for (const [setting, value] of Object.entries(sldSettings)) {
                if (typeof value === 'boolean') {
                    // Checkbox
                    const checkbox = document.querySelector(`input[data-setting="${setting}"]`);
                    if (checkbox) checkbox.checked = value;
                } else {
                    // Buttons
                    const buttons = document.querySelectorAll(`.sld-button[data-setting="${setting}"]`);
                    buttons.forEach(button => {
                        if (button.getAttribute('data-value') === value) {
                            button.classList.add('active');
                        } else {
                            button.classList.remove('active');
                        }
                    });
                }
            }
            
            // Apply settings
            applySettings();
        } catch (e) {
            console.error('Error loading SLD settings:', e);
        }
    }
}

// Create celebration effect for correct answers
function celebrateCorrectAnswer() {
    const container = document.createElement('div');
    container.className = 'celebration';
    document.body.appendChild(container);
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random position, color, and animation
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        // Random color
        const colors = ['#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(confetti);
    }
    
    // Remove after animation completes
    setTimeout(() => {
        document.body.removeChild(container);
    }, 6000);
}

// Word-by-word highlighting for text-to-speech
function highlightTextWordByWord(elementId, text) {
    const element = document.getElementById(elementId);
    if (!element || !text) return;
    
    const words = text.split(' ');
    let html = '';
    
    words.forEach((word, index) => {
        html += `<span class="tts-word" data-index="${index}">${word} </span>`;
    });
    
    element.innerHTML = html;
    
    // Create TTS with word highlighting
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Highlight words as they're spoken
    utterance.onboundary = function(event) {
        if (event.name === 'word') {
            // Calculate word index (approximate)
            const wordIndex = Math.floor(event.charIndex / 5);
            
            // Remove highlights from all words
            document.querySelectorAll('.tts-word').forEach(word => {
                word.classList.remove('highlight');
            });
            
            // Add highlight to current word
            const wordElement = document.querySelector(`.tts-word[data-index="${wordIndex}"]`);
            if (wordElement) {
                wordElement.classList.add('highlight');
            }
        }
    };
    
    // Reset highlighting when done
    utterance.onend = function() {
        document.querySelectorAll('.tts-word').forEach(word => {
            word.classList.remove('highlight');
        });
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
}

// Simplified keyboarding support for SLD
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Space or Enter to click focused element
        if ((e.key === ' ' || e.key === 'Enter') && document.activeElement !== document.body) {
            e.preventDefault();
            document.activeElement.click();
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowRight' && document.querySelector('.nav-button.next:not(:disabled)')) {
            e.preventDefault();
            document.querySelector('.nav-button.next').click();
        }
        
        if (e.key === 'ArrowLeft' && document.querySelector('.nav-button.prev:not(:disabled)')) {
            e.preventDefault();
            document.querySelector('.nav-button.prev').click();
        }
        
        // S key for speech
        if (e.key === 's' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            // Find the closest speech button and click it
            const speechButton = document.querySelector('.tts-button.read:not(:disabled)') || 
                                document.querySelector('.tts-mini-button');
            if (speechButton) {
                speechButton.click();
            }
        }
        
        // H key for help
        if (e.key === 'h' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            const helpButton = document.querySelector('.help-button');
            if (helpButton) {
                helpButton.click();
            }
        }
    });
}

// Initialize keyboard shortcuts
document.addEventListener('DOMContentLoaded', setupKeyboardShortcuts);
