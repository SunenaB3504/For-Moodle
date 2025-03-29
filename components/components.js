/**
 * Component System
 * Implements UI components used by the SCORM interactive textbook framework
 */

// Loader Component - Shows while resources are loading
class LoaderComponent extends Component {
    async init() {
        // Initialize loader resources
    }
    
    async render() {
        const element = document.createElement('div');
        element.className = 'screen loader-screen';
        element.id = 'loader-screen';
        
        element.innerHTML = `
            <div class="loader-container">
                <div class="spinner"></div>
                <h2>Loading Content...</h2>
                <p>Please wait while we prepare your learning adventure!</p>
            </div>
        `;
        
        return element;
    }
}

// Intro Component - Main menu/introduction screen
class IntroComponent extends Component {
    async init() {
        // Initialize intro-specific resources
    }
    
    async render() {
        // Create element properly to fix the "Component element not created" error
        const element = document.createElement('div');
        element.className = 'screen intro-screen';
        element.id = 'intro-screen';
        
        // Get chapter info from config
        const chapterInfo = this.app.config?.chapterInfo || {
            title: "Interactive Textbook",
            subject: "Subject",
            class: "Class Level",
            chapter: 1,
            description: "Chapter description not available"
        };
        
        // Create intro screen HTML
        element.innerHTML = `
            <div class="intro-header">
                <h1>${chapterInfo.title}</h1>
                <p class="subtitle">${chapterInfo.subject} | ${chapterInfo.class} | Chapter ${chapterInfo.chapter}</p>
            </div>
            
            <div class="intro-content">
                <div class="level-box intro-box">
                    <p>${chapterInfo.description}</p>
                    <button id="start-adventure" class="accent-button">
                        <i class="fas fa-play"></i> Start Adventure
                    </button>
                </div>
                
                <div class="chapter-highlights">
                    <!-- Highlights will be dynamically added here -->
                </div>
            </div>
            
            <div class="intro-buttons">
                <button id="show-about" class="info-button">
                    <i class="fas fa-info-circle"></i> About This Chapter
                </button>
                <button id="start-practice" class="exam-button">
                    <i class="fas fa-pencil-alt"></i> Practice Questions
                </button>
            </div>
        `;
        
        // Set up event handlers after rendering
        setTimeout(() => {
            // Start adventure button
            const startBtn = element.querySelector('#start-adventure');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    this.app.navigateTo('topic', { id: 1 });
                });
            }
            
            // About button
            const aboutBtn = element.querySelector('#show-about');
            if (aboutBtn) {
                aboutBtn.addEventListener('click', () => {
                    this.showAboutOverlay();
                });
            }
            
            // Practice button
            const practiceBtn = element.querySelector('#start-practice');
            if (practiceBtn) {
                practiceBtn.addEventListener('click', () => {
                    this.app.navigateTo('exam');
                });
            }
            
            // Add highlights
            const highlightsContainer = element.querySelector('.chapter-highlights');
            if (highlightsContainer && this.app.config?.introduction?.highlights) {
                highlightsContainer.innerHTML = this.app.config.introduction.highlights.map(item => `
                    <div class="highlight-item">
                        <i class="${item.icon}"></i>
                        <span>${item.text}</span>
                    </div>
                `).join('');
            }
        }, 0);
        
        return element;
    }
    
    showAboutOverlay() {
        const aboutContent = this.app.config?.introduction?.about?.content || 'About content not available';
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <div class="overlay-content">
                <h2>About This Chapter</h2>
                ${aboutContent}
                <button id="close-overlay" class="accent-button">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(overlay);
        
        // Set up close handler
        const closeBtn = overlay.querySelector('#close-overlay');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                overlay.remove();
            });
        }
    }
}

// Topic Component - Handles content pages and questions
class TopicComponent extends Component {
    constructor(app) {
        super(app);
    }
    
    async init() {
        // Initialize topic-specific resources
    }
    
    async render(params = {}) {
        const element = document.createElement('div');
        element.className = 'screen topic-screen';
        element.id = 'topic-screen';
        
        // Get topic ID from params (default to 1)
        const topicId = params.id ? parseInt(params.id) : 1;
        
        // Get topics from config
        const topics = this.app.config?.topics || [];
        
        // Get current topic
        const topic = topics[topicId - 1] || {
            title: "Topic Not Found",
            content: "<p>Sorry, this topic could not be found.</p>"
        };
        
        element.innerHTML = `
            <div class="topic-header">
                <h2>${topic.title}</h2>
            </div>
            
            <div class="topic-content">
                <div class="textbook-content">
                    ${topic.content}
                </div>
                
                ${topic.image ? `
                <div class="topic-image">
                    <img src="${topic.image}" alt="${topic.title}" 
                        onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'200\' viewBox=\'0 0 300 200\'%3E%3Crect width=\'300\' height=\'200\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'150\' y=\'100\' font-family=\'Arial\' font-size=\'16\' fill=\'%23666\' text-anchor=\'middle\'%3EImage not found%3C/text%3E%3C/svg%3E';">
                </div>
                ` : ''}
                
                ${topic.question ? `
                <div class="topic-question">
                    <h3>Check Your Understanding</h3>
                    <div class="question-container">
                        <p class="question-text">${topic.question.text}</p>
                        <div class="options-container">
                            ${topic.question.options.map((option, index) => `
                                <div class="option">
                                    <input type="radio" name="topic-question" id="option-${index}" value="${index}">
                                    <label for="option-${index}">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                        <button class="check-answer-btn accent-button">
                            <i class="fas fa-check-circle"></i> Check Answer
                        </button>
                        <div class="question-feedback" id="question-feedback"></div>
                    </div>
                </div>
                ` : ''}
                
                <div class="topic-navigation">
                    <button class="nav-button prev" ${topicId <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Previous Topic
                    </button>
                    <button class="nav-button next" ${topicId >= topics.length ? 'disabled' : ''}>
                        Next Topic <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Set up event handlers
        setTimeout(() => {
            // Topic navigation
            const prevButton = element.querySelector('.nav-button.prev');
            const nextButton = element.querySelector('.nav-button.next');
            
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    if (topicId > 1) {
                        this.app.navigateTo('topic', { id: topicId - 1 });
                    }
                });
            }
            
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    if (topicId < topics.length) {
                        this.app.navigateTo('topic', { id: topicId + 1 });
                    }
                });
            }
            
            // Check answer functionality if there's a question
            if (topic.question) {
                const checkButton = element.querySelector('.check-answer-btn');
                const feedback = element.querySelector('#question-feedback');
                
                if (checkButton) {
                    checkButton.addEventListener('click', () => {
                        const selectedOption = element.querySelector('input[name="topic-question"]:checked');
                        
                        if (selectedOption) {
                            const selectedValue = parseInt(selectedOption.value);
                            const isCorrect = selectedValue === topic.question.correctAnswer;
                            
                            if (feedback) {
                                feedback.innerHTML = isCorrect ? 
                                    '<p class="correct">✓ Correct! Great job!</p>' : 
                                    `<p class="incorrect">✗ Not quite. The correct answer is "${topic.question.options[topic.question.correctAnswer]}"</p>`;
                            }
                            
                            // Play sound
                            const audioService = this.app.getService('audio');
                            if (audioService) {
                                audioService.playSound(isCorrect ? 'correct' : 'incorrect');
                            }
                        } else {
                            if (feedback) {
                                feedback.innerHTML = '<p class="warning">Please select an answer first.</p>';
                            }
                        }
                    });
                }
            }
        }, 0);
        
        return element;
    }
}

// Exam Component - Handles practice questions section
class ExamComponent extends Component {
    constructor(app) {
        super(app);
        this.currentQuestionType = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.questionsPerType = 5; // Default number of questions per type
    }
    
    async init() {
        // Load questions data if needed
        if (!window.questionBank) {
            try {
                await this.loadQuestionsData();
            } catch (error) {
                console.error('Error loading questions data:', error);
            }
        }
    }
    
    async loadQuestionsData() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'questions.js';
            script.onload = () => {
                if (window.questionBank) {
                    resolve(window.questionBank);
                } else {
                    reject(new Error('Questions data not found'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load questions.js'));
            document.head.appendChild(script);
        });
    }
    
    async render(params = {}) {
        const element = document.createElement('div');
        element.className = 'screen exam-screen';
        element.id = 'exam-screen';
        
        // Check if we have question type selected
        if (params.type) {
            this.currentQuestionType = params.type;
            this.currentQuestionIndex = params.index || 0;
            
            element.innerHTML = this.renderQuestion();
        } else {
            // Show question type selection
            element.innerHTML = this.renderQuestionTypeSelection();
        }
        
        // Set up event handlers after rendering
        setTimeout(() => {
            // For question type selection
            const typeCards = element.querySelectorAll('.question-type-card');
            typeCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    const type = e.currentTarget.getAttribute('data-type');
                    this.currentQuestionType = type;
                    this.currentQuestionIndex = 0;
                    this.userAnswers[type] = [];
                    
                    this.app.navigateTo('exam', { type });
                });
            });
            
            // For question navigation
            const prevBtn = element.querySelector('.prev-btn');
            const nextBtn = element.querySelector('.next-btn');
            const submitBtn = element.querySelector('.submit-btn');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.saveCurrentAnswer();
                    this.app.navigateTo('exam', { 
                        type: this.currentQuestionType, 
                        index: this.currentQuestionIndex - 1 
                    });
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.saveCurrentAnswer();
                    
                    const questions = this.getQuestionsOfCurrentType();
                    if (this.currentQuestionIndex + 1 < questions.length) {
                        this.app.navigateTo('exam', { 
                            type: this.currentQuestionType, 
                            index: this.currentQuestionIndex + 1 
                        });
                    } else {
                        // End of questions, show results
                        this.app.navigateTo('results');
                    }
                });
            }
            
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    this.checkCurrentAnswer();
                });
            }
            
            // For flip cards
            const flipCard = element.querySelector('.flip-card');
            if (flipCard) {
                flipCard.addEventListener('click', () => {
                    flipCard.classList.toggle('flipped');
                    const audioService = this.app.getService('audio');
                    audioService.playSound('click');
                });
            }
        }, 0);
        
        return element;
    }
    
    renderQuestionTypeSelection() {
        const questionTypes = [
            { id: 'mcq', name: 'Multiple Choice', icon: 'fa-list-ul' },
            { id: 'fillBlanks', name: 'Fill in the Blanks', icon: 'fa-underline' },
            { id: 'truefalse', name: 'True or False', icon: 'fa-check-circle' },
            { id: 'shortAnswer', name: 'Short Answers', icon: 'fa-pencil-alt' },
            { id: 'longAnswer', name: 'Long Answers', icon: 'fa-paragraph' },
            { id: 'oneWordAnswers', name: 'One-Word Answers', icon: 'fa-spell-check' },
            { id: 'spellingTests', name: 'Spelling Test', icon: 'fa-keyboard' },
            { id: 'sequenceQuestions', name: 'Arrange in Order', icon: 'fa-sort-numeric-down' },
            { id: 'flipCards', name: 'Flip Cards', icon: 'fa-exchange-alt' }
        ];
        
        return `
            <div class="exam-header">
                <h2>Practice Questions: ${this.app.config.chapterInfo.title}</h2>
                <p>Choose the type of questions you want to practice:</p>
            </div>
            <div class="question-type-grid">
                ${questionTypes.map(type => `
                    <div class="question-type-card" data-type="${type.id}">
                        <div class="question-type-icon"><i class="fas ${type.icon}"></i></div>
                        <div class="question-type-name">${type.name}</div>
                    </div>
                `).join('')}
            </div>
            <div class="back-to-main">
                <button class="accent-button" id="back-to-main-btn">
                    <i class="fas fa-home"></i> Back to Main Menu
                </button>
            </div>
        `;
    }
    
    renderQuestion() {
        const questions = this.getQuestionsOfCurrentType();
        
        if (!questions || questions.length === 0 || this.currentQuestionIndex >= questions.length) {
            return `
                <div class="exam-error">
                    <h2>No Questions Available</h2>
                    <p>Sorry, there are no questions of this type yet.</p>
                    <button class="accent-button" id="back-to-selection-btn">
                        <i class="fas fa-arrow-left"></i> Back to Question Types
                    </button>
                </div>
            `;
        }
        
        const question = questions[this.currentQuestionIndex];
        
        return `
            <div class="exam-header">
                <h2>${this.getQuestionTypeName()}</h2>
                <div class="progress-indicator">
                    Question ${this.currentQuestionIndex + 1} of ${questions.length}
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentQuestionIndex + 1) / questions.length) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="question-content">
                ${this.renderQuestionContent(question)}
            </div>
            
            <div class="question-navigation">
                <button class="prev-btn nav-button" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                <button class="submit-btn">
                    <i class="fas fa-check-circle"></i> Check Answer
                </button>
                <button class="next-btn nav-button" ${this.currentQuestionIndex === questions.length - 1 ? 'disabled' : ''}>
                    Next <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            
            <div class="feedback-container" id="feedback-container" style="display: none;">
                <div class="feedback-content" id="feedback-content"></div>
                <button class="tts-button read">
                    <span class="tts-icon">🔊</span> Read Feedback
                </button>
            </div>
        `;
    }
    
    renderQuestionContent(question) {
        // Common header with TTS button for all types except flip cards
        let content = '';
        
        if (this.currentQuestionType !== 'flipCards') {
            content += `
                <div class="question-text-container" id="question-text-${this.currentQuestionIndex}">
                    <div class="question-text">${question.question}</div>
                    <button class="tts-mini-button">
                        <span class="tts-icon">🔊</span>
                    </button>
                </div>
            `;
        }
        
        // Different content based on question type
        switch (this.currentQuestionType) {
            case 'mcq':
                content += this.renderMCQ(question);
                break;
            case 'fillBlanks':
                content += this.renderFillBlanks(question);
                break;
            case 'truefalse':
                content += this.renderTrueFalse(question);
                break;
            case 'shortAnswer':
            case 'longAnswer':
                content += this.renderTextAnswer(question);
                break;
            case 'oneWordAnswers':
                content += this.renderOneWordAnswer(question);
                break;
            case 'spellingTests':
                content += this.renderSpellingTest(question);
                break;
            case 'sequenceQuestions':
                content += this.renderSequenceQuestion(question);
                break;
            case 'flipCards':
                content += this.renderFlipCard(question);
                break;
            default:
                content += `<p>Question type not supported: ${this.currentQuestionType}</p>`;
        }
        
        return content;
    }
    
    renderMCQ(question) {
        return `
            <div class="options-container">
                ${question.options.map((option, i) => `
                    <div class="option">
                        <input type="radio" name="current-question" value="${i}" id="option-${i}">
                        <label for="option-${i}" class="option-label">
                            ${option}
                            <button class="tts-option-button">🔊</button>
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderFillBlanks(question) {
        return `
            <div class="fill-blank-container">
                <input type="text" class="fill-blank-input" id="blank-input" placeholder="Type your answer here">
                <button class="tts-mini-button">
                    <span class="tts-icon">🔊</span>
                </button>
            </div>
        `;
    }
    
    renderTrueFalse(question) {
        return `
            <div class="tf-container">
                <div class="option">
                    <input type="radio" name="current-question" id="true-option" value="true">
                    <label for="true-option" class="option-label tf-option true-option">
                        TRUE
                        <button class="tts-option-button">🔊</button>
                    </label>
                </div>
                <div class="option">
                    <input type="radio" name="current-question" id="false-option" value="false">
                    <label for="false-option" class="option-label tf-option false-option">
                        FALSE
                        <button class="tts-option-button">🔊</button>
                    </label>
                </div>
            </div>
        `;
    }
    
    renderTextAnswer(question) {
        const isShort = this.currentQuestionType === 'shortAnswer';
        return `
            <div class="notebook-answer-container">
                <div class="notebook-instruction">
                    <i class="fas fa-pencil-alt"></i>
                    <span>Write your answer in your notebook. When you're ready, click "Show Model Answer" to compare.</span>
                </div>
                
                <div class="notebook-buttons">
                    <button class="notebook-confirm-btn" id="show-model-btn">
                        <i class="fas fa-check"></i> Show Model Answer
                    </button>
                    <button class="notebook-tts-btn">
                        <i class="fas fa-volume-up"></i> Read Question Again
                    </button>
                </div>
                
                <div class="notebook-answer" id="model-answer" style="display: none;">
                    <h4>Model Answer:</h4>
                    <p>${question.modelAnswer}</p>
                    <button class="tts-button read">
                        <span class="tts-icon">🔊</span> Read Aloud
                    </button>
                </div>
            </div>
        `;
    }
    
    renderOneWordAnswer(question) {
        return `
            <div class="fill-blank-container">
                <input type="text" class="fill-blank-input" id="word-input" placeholder="Type your one-word answer here">
                <button class="tts-mini-button">
                    <span class="tts-icon">🔊</span>
                </button>
            </div>
        `;
    }
    
    renderSpellingTest(question) {
        const word = question.blankedWord.split('');
        
        let content = `
            <div class="spelling-container">
                <div class="spelling-hint">
                    Hint: ${question.hint}
                    <button class="tts-mini-button">
                        <span class="tts-icon">🔊</span>
                    </button>
                </div>
                <div class="spelling-word">
        `;
        
        word.forEach((letter, i) => {
            if (letter === '_') {
                content += `
                    <div class="letter-box">
                        <input type="text" 
                               class="letter-input" 
                               maxlength="1" 
                               data-index="${i}"
                               aria-label="Letter ${i + 1}">
                    </div>
                `;
            } else {
                content += `<div class="letter-box">${letter}</div>`;
            }
        });
        
        content += `
                </div>
                <button class="spelling-listen">
                    <i class="fas fa-volume-up"></i> Listen to the word
                    <span id="spelling-fullword" style="position: absolute; left: -9999px;">${question.word}</span>
                </button>
            </div>
        `;
        
        return content;
    }
    
    renderSequenceQuestion(question) {
        // Create a shuffled version of the items
        const shuffledItems = [...question.items]
            .map((item, index) => ({ item, index }))
            .sort(() => Math.random() - 0.5);
            
        let content = `<div class="sequence-container">`;
        
        shuffledItems.forEach((itemObj, i) => {
            content += `
                <div class="sequence-item" data-original-index="${itemObj.index}">
                    <select class="sequence-select" aria-label="Position for ${itemObj.item}">
            `;
            
            // Add options 1 to n
            for (let j = 1; j <= question.items.length; j++) {
                content += `<option value="${j}">${j}</option>`;
            }
            
            content += `
                    </select>
                    <span class="sequence-text">${itemObj.item}</span>
                    <button class="tts-mini-button">
                        <span class="tts-icon">🔊</span>
                    </button>
                </div>
            `;
        });
        
        content += `</div>`;
        return content;
    }
    
    renderFlipCard(question) {
        return `
            <div class="flip-card-container">
                <div class="flip-card" tabindex="0">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <p>${question.front}</p>
                            <div class="flip-instruction">Click to flip</div>
                        </div>
                        <div class="flip-card-back">
                            <p>${question.back}</p>
                            <div class="flip-explanation">${question.explanation}</div>
                        </div>
                    </div>
                </div>
                
                <div class="flip-card-controls">
                    <button class="flip-btn">
                        <i class="fas fa-exchange-alt"></i> Flip Card
                    </button>
                    <button class="tts-button read" data-content="${question.front}">
                        <span class="tts-icon">🔊</span> Read Front
                    </button>
                    <button class="tts-button read" data-content="${question.back} ${question.explanation}">
                        <span class="tts-icon">🔊</span> Read Back
                    </button>
                </div>
            </div>
        `;
    }
    
    getQuestionsOfCurrentType() {
        // Safely get questions from the question bank
        if (!window.questionBank || !this.currentQuestionType || !window.questionBank[this.currentQuestionType]) {
            return [];
        }
        
        // Get subset of questions (limited by questionsPerType)
        return window.questionBank[this.currentQuestionType].slice(0, this.questionsPerType);
    }
    
    getQuestionTypeName() {
        const typeMap = {
            'mcq': 'Multiple Choice Questions',
            'fillBlanks': 'Fill in the Blanks',
            'truefalse': 'True or False',
            'shortAnswer': 'Short Answer Questions',
            'longAnswer': 'Long Answer Questions',
            'oneWordAnswers': 'One-Word Answers',
            'spellingTests': 'Spelling Test',
            'sequenceQuestions': 'Arrange in Order',
            'flipCards': 'Flip Cards'
        };
        
        return typeMap[this.currentQuestionType] || 'Questions';
    }
    
    saveCurrentAnswer() {
        if (!this.currentQuestionType) return;
        
        // Initialize user answers for this type if needed
        if (!this.userAnswers[this.currentQuestionType]) {
            this.userAnswers[this.currentQuestionType] = [];
        }
        
        // Different handling based on question type
        switch (this.currentQuestionType) {
            case 'mcq':
                const selectedOption = document.querySelector('input[name="current-question"]:checked');
                if (selectedOption) {
                    this.userAnswers[this.currentQuestionType][this.currentQuestionIndex] = parseInt(selectedOption.value);
                }
                break;
                
            case 'truefalse':
                const trueSelected = document.getElementById('true-option')?.checked;
                const falseSelected = document.getElementById('false-option')?.checked;
                if (trueSelected) {
                    this.userAnswers[this.currentQuestionType][this.currentQuestionIndex] = true;
                } else if (falseSelected) {
                    this.userAnswers[this.currentQuestionType][this.currentQuestionIndex] = false;
                }
                break;
                
            case 'fillBlanks':
            case 'oneWordAnswers':
                const inputField = document.querySelector('.fill-blank-input');
                if (inputField) {
                    this.userAnswers[this.currentQuestionType][this.currentQuestionIndex] = inputField.value.trim();
                }
                break;
                
            case 'spellingTests':
                // Collect letters from all inputs
                const letterInputs = document.querySelectorAll('.letter-input');
                const question = this.getQuestionsOfCurrentType()[this.currentQuestionIndex];
                const blankedWord = question.blankedWord;
                let filledWord = '';
                
                for (let i = 0; i < blankedWord.length; i++) {
                    if (blankedWord[i] === '_') {
                        const input = document.querySelector(`.letter-input[data-index="${i}"]`);
                        filledWord += input ? input.value : '_';
                    } else {
                        filledWord += blankedWord[i];
                    }
                }
                
                this.userAnswers[this.currentQuestionType][this.currentQuestionIndex] = filledWord;
                break;
                
            case 'sequenceQuestions':
                // Get the ordering from the dropdowns
                const sequenceItems = document.querySelectorAll('.sequence-item');
                const order = Array(sequenceItems.length).fill(null);
                
                sequenceItems.forEach(item => {
                    const originalIndex = parseInt(item.getAttribute('data-original-index'));
                    const selectElement = item.querySelector('select');
                    const position = parseInt(selectElement.value) - 1;
                    order[position] = originalIndex;
                });
                
                this.userAnswers[this.currentQuestionType][this.currentQuestionIndex] = order;
                break;
                
            case 'shortAnswer':
            case 'longAnswer':
            case 'flipCards':
                // These are self-evaluated / reviewed
                this.userAnswers[this.currentQuestionType][this.currentQuestionIndex] = true;
                break;
        }
    }
    
    checkCurrentAnswer() {
        const questions = this.getQuestionsOfCurrentType();
        const question = questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionType][this.currentQuestionIndex];
        
        let isCorrect = false;
        let feedbackText = '';
        
        // Check correctness based on question type
        switch(this.currentQuestionType) {
            case 'mcq':
                isCorrect = userAnswer === question.correctAnswer;
                feedbackText = isCorrect ? 
                    "Correct! " + question.explanation : 
                    `Not quite. The correct answer is "${question.options[question.correctAnswer]}". ${question.explanation}`;
                break;
                
            case 'truefalse':
                isCorrect = userAnswer === (question.correctAnswer === 'true');
                feedbackText = isCorrect ? 
                    "Correct! " + question.explanation : 
                    `Not quite. The answer is ${question.correctAnswer}. ${question.explanation}`;
                break;
                
            case 'fillBlanks':
                const inputField = document.querySelector('.fill-blank-input');
                const correct = question.correctAnswer.toLowerCase();
                const userResponse = inputField ? inputField.value.toLowerCase().trim() : '';
                isCorrect = userResponse === correct;
                feedbackText = isCorrect ? 
                    "Correct! " + question.explanation : 
                    `Not quite. The correct answer is "${question.correctAnswer}". ${question.explanation}`;
                break;
                
            case 'spellingTests':
                const spellingInput = document.querySelector('.spelling-word');
                const correctSpelling = question.word.toLowerCase();
                const userSpelling = this.getSpellingAnswer();
                isCorrect = userSpelling === correctSpelling;
                
                feedbackText = isCorrect ? 
                    `Excellent spelling! The word is "${question.word}". ${question.explanation}` : 
                    `Not quite. The correct spelling is "${question.word}". ${question.explanation}`;
                break;
                
            case 'sequenceQuestions':
                const selectedOrder = this.getSequenceOrder();
                isCorrect = this.checkSequenceOrder(selectedOrder, question.correctSequence);
                feedbackText = isCorrect ? 
                    `Correct sequence! ${question.explanation}` : 
                    `Not quite right. The correct sequence is: ${question.correctSequence.join(', ')}. ${question.explanation}`;
                break;
                
            case 'shortAnswer':
            case 'longAnswer':
                feedbackText = `Compare your answer with the model answer. ${question.explanation}`;
                break;
                
            case 'flipCards':
                feedbackText = `Review the answer on the back of the card. ${question.explanation}`;
                break;
        }
        
        // Update UI with feedback
        const feedbackContainer = document.querySelector('.feedback-container');
        const feedbackContent = document.querySelector('.feedback-content');
        
        if (feedbackContainer && feedbackContent) {
            feedbackContent.innerHTML = feedbackText;
            feedbackContainer.style.display = 'block';
        }
    }
    
    getSpellingAnswer() {
        let answer = '';
        const letterInputs = document.querySelectorAll('.letter-input');
        letterInputs.forEach(input => {
            answer += input.value;
        });
        return answer.toLowerCase();
    }
    
    getSequenceOrder() {
        const sequenceItems = document.querySelectorAll('.sequence-item');
        return Array.from(sequenceItems).map(item => {
            const select = item.querySelector('select');
            return parseInt(select.value);
        });
    }
    
    checkSequenceOrder(userOrder, correctOrder) {
        if (userOrder.length !== correctOrder.length) return false;
        
        for (let i = 0; i < userOrder.length; i++) {
            if (userOrder[i] !== correctOrder[i]) return false;
        }
        
        return true;
    }
}

// Results Component - Displays the results of the interactive adventure
class ResultsComponent extends Component {
    async init() {
        // Initialize results-specific resources
    }
    
    async render() {
        const stateService = this.app.getService('state');
        const score = stateService.get('score');
        const levelScores = stateService.get('levelScores');
        
        const element = document.createElement('div');
        element.className = 'screen results-screen';
        element.id = 'results-screen';
        
        element.innerHTML = `
            <h2>🎉 Adventure Complete! 🎉</h2>
            
            <div class="results-summary">
                <div class="trophy-icon">🏆</div>
                <p>Amazing job! You've learned all about this chapter!</p>
                <div class="final-score">Your score: <span id="total-score">${score}</span> / 100</div>
            </div>
            
            <div class="level-breakdown">
                <h3>Level Breakdown</h3>
                <div class="level-scores" id="level-scores-breakdown">
                    <!-- Level scores will be inserted dynamically -->
                </div>
            </div>
            
            <div class="results-buttons">
                <button id="back-to-main-btn" class="accent-button"><i class="fas fa-home"></i> Back to Main Menu</button>
                <button id="play-again-btn"><i class="fas fa-redo"></i> Play Again</button>
            </div>
        `;
        
        // Set up event handlers after rendering
        setTimeout(() => {
            // Back to main menu button
            const backToMainBtn = element.querySelector('#back-to-main-btn');
            if (backToMainBtn) {
                backToMainBtn.addEventListener('click', () => {
                    this.app.navigateTo('intro');
                });
            }
            
            // Play again button
            const playAgainBtn = element.querySelector('#play-again-btn');
            if (playAgainBtn) {
                playAgainBtn.addEventListener('click', () => {
                    // Reset state and navigate to the first topic
                    stateService.clearState();
                    this.app.navigateTo('topic', { id: 1 });
                });
            }
            
            // Create level breakdown
            const levelBreakdown = element.querySelector('#level-scores-breakdown');
            if (levelBreakdown && levelScores) {
                const levelNames = [
                    "Family Album",
                    "Growing Up",
                    "Family Types",
                    "Relatives",
                    "New Words & Summary"
                ];
                
                let breakdownHTML = '';
                for (let i = 0; i < levelScores.length; i++) {
                    breakdownHTML += `
                        <div class="score-row">
                            <span>Level ${i+1}: ${levelNames[i]}</span>
                            <span>${levelScores[i]} / 20</span>
                        </div>
                    `;
                }
                levelBreakdown.innerHTML = breakdownHTML;
            }
        }, 0);
        
        return element;
    }
}

window.LoaderComponent = LoaderComponent;
window.IntroComponent = IntroComponent;
window.TopicComponent = TopicComponent;
window.ExamComponent = ExamComponent;
window.ResultsComponent = ResultsComponent;