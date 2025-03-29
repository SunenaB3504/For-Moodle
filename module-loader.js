/**
 * Module Loader
 * Handles dynamic loading of chapter content based on configuration
 */

class ModuleLoader {
    constructor(config) {
        this.config = config;
        this.currentModule = null;
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupIntroduction();
            this.setupTopics();
            this.setupNavigation();
            
            // Hide loading spinner when done
            setTimeout(() => {
                const spinner = document.getElementById('loading-spinner');
                if (spinner) {
                    spinner.style.opacity = '0';
                    setTimeout(() => {
                        spinner.style.display = 'none';
                    }, 500);
                }
            }, 800);
        });
    }
    
    setupIntroduction() {
        // Set chapter title
        document.title = this.config.chapterInfo.title;
        
        // Set main heading
        const mainHeading = document.querySelector('#intro h1');
        if (mainHeading) mainHeading.textContent = this.config.chapterInfo.title;
        
        // Set chapter description
        const chapterDescription = document.querySelector('#intro .level-box p');
        if (chapterDescription) chapterDescription.textContent = this.config.chapterInfo.description;
        
        // Set chapter highlights
        const highlightsContainer = document.querySelector('.chapter-highlights');
        if (highlightsContainer && this.config.introduction.highlights) {
            highlightsContainer.innerHTML = this.config.introduction.highlights.map(item => `
                <div class="highlight-item">
                    <i class="${item.icon}"></i>
                    <span>${item.text}</span>
                </div>
            `).join('');
        }
        
        // Set about content
        const aboutContent = document.getElementById('intro-content');
        if (aboutContent && this.config.introduction.about) {
            aboutContent.innerHTML = this.config.introduction.about.content;
        }
    }
    
    setupTopics() {
        // Create topic screens
        this.config.topics.forEach((topic, index) => {
            this.createTopicScreen(topic, index + 1);
        });
        
        // Set up new words/summary section
        this.createSummaryScreen();
    }
    
    createTopicScreen(topic, levelNumber) {
        // Create explanation screen
        const explanationId = `explanation${levelNumber}`;
        const explanationScreen = document.getElementById(explanationId);
        
        if (explanationScreen) {
            // Set heading
            const heading = explanationScreen.querySelector('h2');
            if (heading) heading.textContent = topic.title;
            
            // Set content
            const contentElement = explanationScreen.querySelector('.textbook-content');
            if (contentElement) contentElement.innerHTML = topic.content;
            
            // Set image
            const image = explanationScreen.querySelector('img');
            if (image) {
                image.src = topic.image;
                image.alt = topic.title;
            }
        }
        
        // Create level screen with question
        const levelId = `level${levelNumber}`;
        const levelScreen = document.getElementById(levelId);
        
        if (levelScreen) {
            // Set heading
            const heading = levelScreen.querySelector('h2');
            if (heading) heading.textContent = topic.title;
            
            // Set question content
            if (topic.question) {
                const questionContainer = document.getElementById(`question${levelNumber}`);
                if (questionContainer) {
                    const questionText = questionContainer.querySelector('.question-text');
                    if (questionText) {
                        questionText.innerHTML = `
                            <p>${topic.question.text}</p>
                            <button class="tts-mini-button" onclick="speakText('question${levelNumber}')">
                                <span class="tts-icon">🔊</span>
                            </button>
                        `;
                    }
                    
                    // Add options
                    const optionsContainer = questionContainer.querySelector('.options-container');
                    if (optionsContainer) {
                        optionsContainer.innerHTML = topic.question.options.map((option, i) => `
                            <div class="option">
                                <input type="radio" name="q${levelNumber}" value="${String.fromCharCode(97 + i)}" id="q${levelNumber}${String.fromCharCode(97 + i)}">
                                <label for="q${levelNumber}${String.fromCharCode(97 + i)}">${option}</label>
                            </div>
                        `).join('');
                    }
                }
            }
        }
    }
    
    createSummaryScreen() {
        const summaryScreen = document.getElementById('explanation5');
        if (summaryScreen) {
            const contentElement = summaryScreen.querySelector('.textbook-content');
            
            if (contentElement) {
                // Create vocabulary section
                let vocabHtml = '<h3>New Words</h3>';
                this.config.vocabulary.forEach(item => {
                    vocabHtml += `<p><strong>${item.word}:</strong> ${item.definition}</p>`;
                });
                
                // Create summary section
                vocabHtml += '<h3>In A Nutshell</h3><ul>';
                
                // Generate summary bullets from topics
                this.config.topics.forEach(topic => {
                    // Extract first sentence from each topic as summary
                    const firstSentence = topic.content.split('</h3>')[1].split('</p>')[0]
                        .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
                        .trim()
                        .split('.')[0] + '.';
                    
                    vocabHtml += `<li>${firstSentence}</li>`;
                });
                
                vocabHtml += '</ul>';
                contentElement.innerHTML = vocabHtml;
            }
        }
    }
    
    setupNavigation() {
        // Create navigation items
        const navItems = this.config.topics.map((topic, i) => ({
            id: `nav-level${i+1}`, 
            title: topic.navTitle || topic.title,
            icon: topic.icon,
            action: `showLevel(${i+1})`
        }));
        
        // Add summary/final item
        navItems.push({
            id: 'nav-level5',
            title: 'Summary',
            icon: 'fas fa-book',
            action: 'showLevel(5)'
        });
        
        // Add practice questions
        navItems.push({
            id: 'nav-practice',
            title: 'Practice',
            icon: 'fas fa-pencil-alt',
            action: 'startExamPractice()'
        });
        
        // Create navigation buttons
        const navDiv = document.querySelector('.kid-nav');
        if (navDiv) {
            navDiv.innerHTML = `
                <button onclick="showIntro()" class="nav-button" id="nav-home" title="Go to Home screen">
                    <i class="fas fa-home"></i> Home
                </button>
                ${navItems.map(item => `
                    <button onclick="${item.action}" class="nav-button" id="${item.id}" title="Go to ${item.title}">
                        <i class="${item.icon}"></i> ${item.title}
                    </button>
                `).join('')}
            `;
        }
    }
    
    loadModule(moduleName) {
        if (this.currentModule === moduleName) return;
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Show requested module
        const moduleElement = document.getElementById(moduleName);
        if (moduleElement) {
            moduleElement.style.display = 'block';
            this.currentModule = moduleName;
            
            // Update navigation
            document.querySelectorAll('.nav-button').forEach(btn => {
                btn.classList.remove('current');
            });
            
            // Find corresponding nav button and make it current
            if (moduleName.startsWith('level') || moduleName.startsWith('explanation')) {
                const level = moduleName.replace(/[^0-9]/g, '');
                const navButton = document.getElementById(`nav-level${level}`);
                if (navButton) navButton.classList.add('current');
            } else if (moduleName === 'intro') {
                document.getElementById('nav-home').classList.add('current');
            } else if (moduleName === 'exam-practice' || moduleName === 'accessible-exam') {
                document.getElementById('nav-practice').classList.add('current');
            }
        }
    }
}

// Initialize the module loader
const moduleLoader = new ModuleLoader(chapterConfig);
moduleLoader.init();
