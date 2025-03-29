// Accessible Exam Implementation for Children with SLD

// Global variables
let currentQuestionType = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let currentSection = null;
let totalScore = 0;
let questionsPerType = 5; // Display 5 questions of each type
let soundEnabled = true; // Global sound setting
let speaking = false; // Track speech synthesis status

// Initialize the exam when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupExamInterface();
});

// Set up the main exam interface
function setupExamInterface() {
    const examContainer = document.getElementById('exam-container');
    if (!examContainer) return;
    
    // Create question type selection interface
    const questionTypes = [
        { id: 'mcq', name: 'Multiple Choice', icon: 'fa-list-ul' },
        { id: 'fillBlanks', name: 'Fill in the Blanks', icon: 'fa-underline' },
        { id: 'truefalse', name: 'True or False', icon: 'fa-check-circle' },
        { id: 'shortAnswer', name: 'Short Answers', icon: 'fa-pencil-alt' },
        { id: 'longAnswer', name: 'Long Answers', icon: 'fa-paragraph' },
        { id: 'pictureQuestions', name: 'Picture Questions', icon: 'fa-image' },
        { id: 'oneWordAnswers', name: 'One-Word Answers', icon: 'fa-spell-check' },
        { id: 'spellingTests', name: 'Spelling Test', icon: 'fa-keyboard' },
        { id: 'sequenceQuestions', name: 'Arrange in Order', icon: 'fa-sort-numeric-down' },
        { id: 'flipCards', name: 'Flip Cards', icon: 'fa-exchange-alt' } // Add flip cards option
    ];
    
    let html = `
        <div class="exam-header">
            <h2>Practice Questions: All in the Family</h2>
            <p>Choose the type of questions you want to practice:</p>
        </div>
        <div class="question-type-grid">
    `;
    
    questionTypes.forEach(type => {
        html += `
            <div class="question-type-card" onclick="startQuestionType('${type.id}')">
                <div class="question-type-icon"><i class="fas ${type.icon}"></i></div>
                <div class="question-type-name">${type.name}</div>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="tts-global-controls">
            <button class="tts-button read" onclick="speakText('exam-header')">
                <span class="tts-icon">🔊</span> Read Instructions
            </button>
        </div>
    `;
    
    examContainer.innerHTML = html;

    // Add debugging to check if flipCards are in questionBank
    console.log("Available question types:", Object.keys(questionBank));
    if (questionBank.flipCards) {
        console.log("Flip cards found:", questionBank.flipCards.length);
    }
}

// Enhanced version of startQuestionType with debug output
function startQuestionType(questionType) {
    console.log("Starting question type:", questionType);
    playSound('click');
    currentQuestionType = questionType;
    currentQuestionIndex = 0;
    userAnswers[questionType] = [];
    
    // Check if questions exist for this type
    if (!questionBank[questionType]) {
        console.error(`No questions found for type: ${questionType}`);
        return;
    }
    
    const questions = questionBank[questionType].slice(0, questionsPerType);
    console.log(`Found ${questions.length} questions of type ${questionType}`);
    
    // Load first question
    loadQuestion(questionType, 0, questions);
}

// Load a specific question
function loadQuestion(questionType, index, questions) {
    const examContainer = document.getElementById('exam-container');
    const question = questions[index];
    
    // Create progress indicator
    let html = `
        <div class="exam-header">
            <h2>${getQuestionTypeName(questionType)}</h2>
            <div class="progress-indicator">
                Question ${index + 1} of ${questions.length}
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((index + 1) / questions.length) * 100}%"></div>
                </div>
            </div>
        </div>
    `;
    
    // Create question content based on type
    html += `<div class="question-content" id="question-content">`;
    
    // Add question text with TTS button - BUT NOT FOR FLIP CARDS
    if (questionType !== 'flipCards') {
        html += `
            <div class="question-text-container" id="question-text-${index}">
                <div class="question-text">${question.question}</div>
                <button class="tts-mini-button" onclick="speakText('question-text-${index}')">
                    <span class="tts-icon">🔊</span>
                </button>
            </div>
        `;
    }
    
    // Different content based on question type
    switch(questionType) {
        case 'mcq':
        case 'pictureQuestions':
            // Add image if it's a picture question
            if (questionType === 'pictureQuestions' && question.image) {
                html += `<img src="${question.image}" alt="Question image" class="question-image">`;
            }
            
            // Multiple choice options
            html += `<div class="options-container">`;
            question.options.forEach((option, i) => {
                html += `
                    <div class="option">
                        <input type="radio" name="question-${index}" id="option-${i}" value="${i}">
                        <label for="option-${i}" class="option-label">
                            ${option}
                            <button class="tts-option-button" onclick="speakText('option-${i}')">🔊</button>
                        </label>
                    </div>
                `;
            });
            html += `</div>`;
            break;
            
        case 'truefalse':
            // True or False options
            html += `
                <div class="tf-container">
                    <div class="option">
                        <input type="radio" name="question-${index}" id="true-option" value="true">
                        <label for="true-option" class="option-label tf-option true-option">
                            TRUE
                            <button class="tts-option-button" onclick="speakText('true-option')">🔊</button>
                        </label>
                    </div>
                    <div class="option">
                        <input type="radio" name="question-${index}" id="false-option" value="false">
                        <label for="false-option" class="option-label tf-option false-option">
                            FALSE
                            <button class="tts-option-button" onclick="speakText('false-option')">🔊</button>
                        </label>
                    </div>
                </div>
            `;
            break;
            
        case 'fillBlanks':
        case 'oneWordAnswers':
            // Text input for fill in blanks or one-word answers
            html += `
                <div class="fill-blank-container">
                    <input type="text" class="fill-blank-input" id="blank-input-${index}" placeholder="Type your answer here">
                    <button class="tts-mini-button" onclick="speakText('blank-instructions')" id="blank-instructions">
                        <span class="tts-icon">🔊</span>
                    </button>
                </div>
            `;
            break;
            
        case 'spellingTests':
            // Spelling test with missing letters
            const word = question.blankedWord.split('');
            
            html += `
                <div class="spelling-container">
                    <div class="spelling-hint">
                        Hint: ${question.hint}
                        <button class="tts-mini-button" onclick="speakText('spelling-hint')">
                            <span class="tts-icon">🔊</span>
                        </button>
                    </div>
                    <div class="spelling-word">
            `;
            
            word.forEach((letter, i) => {
                if (letter === '_') {
                    html += `
                        <div class="letter-box">
                            <input type="text" 
                                   class="letter-input" 
                                   maxlength="1" 
                                   data-index="${i}" 
                                   onkeyup="moveFocus(this, ${i}, ${word.length})"
                                   aria-label="Letter ${i + 1}">
                        </div>
                    `;
                } else {
                    html += `<div class="letter-box">${letter}</div>`;
                }
            });
            
            html += `
                    </div>
                    <button class="spelling-listen" onclick="speakText('spelling-fullword')">
                        <i class="fas fa-volume-up"></i> Listen to the word
                        <span id="spelling-fullword" style="position: absolute; left: -9999px;">${question.word}</span>
                    </button>
                </div>
            `;
            break;
            
        case 'sequenceQuestions':
            // Sequence question with dropdown numbers
            html += `<div class="sequence-container">`;
            
            // Create a shuffled version of the items
            const shuffledItems = [...question.items]
                .map((item, index) => ({ item, index }))
                .sort(() => Math.random() - 0.5);
                
            shuffledItems.forEach((itemObj, i) => {
                html += `
                    <div class="sequence-item" data-original-index="${itemObj.index}">
                        <select class="sequence-select" aria-label="Position for ${itemObj.item}">
                `;
                
                // Add options 1 to n
                for (let j = 1; j <= question.items.length; j++) {
                    html += `<option value="${j}">${j}</option>`;
                }
                
                html += `
                        </select>
                        <span class="sequence-text">${itemObj.item}</span>
                        <button class="tts-mini-button" onclick="speakText('sequence-item-${i}')">
                            <span class="tts-icon">🔊</span>
                            <span id="sequence-item-${i}" style="position: absolute; left: -9999px;">${itemObj.item}</span>
                        </button>
                    </div>
                `;
            });
            
            html += `</div>`;
            break;
            
        case 'shortAnswer':
        case 'longAnswer':
            // Short answer or long answer text area
            const rows = questionType === 'shortAnswer' ? 3 : 6;
            
            html += `
                <div class="notebook-answer-container">
                    <div class="notebook-instruction" id="notebook-instruction-${index}">
                        <i class="fas fa-pencil-alt"></i>
                        <span>Write your answer in your notebook. When you're ready, click "I've Written My Answer" to see the model answer.</span>
                        <button class="tts-mini-button" onclick="speakText('notebook-instruction-${index}')">
                            <span class="tts-icon">🔊</span>
                        </button>
                    </div>
                    
                    <div class="notebook-buttons">
                        <button class="notebook-confirm-btn" onclick="showModelAnswer(${index})">
                            <i class="fas fa-check"></i> I've Written My Answer
                        </button>
                        <button class="notebook-tts-btn" onclick="speakText('question-text-${index}')">
                            <i class="fas fa-volume-up"></i> Read Question Again
                        </button>
                    </div>
                    
                    <div class="notebook-answer" id="model-answer-${index}" style="display: none;">
                        <h4>Model Answer:</h4>
                        <p>${question.modelAnswer}</p>
                        <button class="tts-button read" onclick="speakText('model-answer-${index}')">
                            <span class="tts-icon">🔊</span> Read Aloud
                        </button>
                    </div>
                </div>
            `;
            break;

        case 'flipCards':
            // Debug output
            console.log("Loading flip card:", question);
            
            // DIRECT TEST IMPLEMENTATION - NO DEPENDENCIES ON OTHER STYLES
            html += `
                <div style="margin: 30px auto; max-width: 500px; perspective: 1000px;">
                    <div id="flip-card-${index}" tabindex="0" style="width: 100%; height: 250px; position: relative; cursor: pointer; margin-bottom: 20px;">
                        <div id="flip-card-inner-${index}" style="position: absolute; width: 100%; height: 100%; text-align: center; transition: transform 0.6s; transform-style: preserve-3d; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 15px;">
                            <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border-radius: 15px; background-color: #d2b4de; color: #34495e; font-size: 24px; font-weight: bold; border: 2px solid #9b59b6;">
                                <p>${question.front}</p>
                                <div style="position: absolute; bottom: 10px; font-size: 14px; opacity: 0.8; font-style: italic; background-color: rgba(255,255,255,0.7); padding: 5px 10px; border-radius: 10px;">Click to flip</div>
                            </div>
                            <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border-radius: 15px; background-color: #fcf3cf; color: #34495e; transform: rotateY(180deg); font-size: 22px; border: 2px solid #f1c40f;">
                                <p>${question.back}</p>
                                <div style="margin-top: 15px; font-size: 16px; font-style: italic; color: #8e44ad; padding-top: 10px; border-top: 1px dashed #9b59b6; max-width: 90%;">${question.explanation}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                        <button id="flip-btn-${index}" class="flip-btn" style="background-color: #9b59b6; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-exchange-alt"></i> Flip Card
                        </button>
                        <button class="tts-button read" onclick="speakText('flip-front-${index}')">
                            <span class="tts-icon">🔊</span> Read Front
                            <span id="flip-front-${index}" style="position: absolute; left: -9999px;">${question.front}</span>
                        </button>
                        <button class="tts-button read" id="read-answer-btn-${index}" onclick="speakText('flip-back-${index}')">
                            <span class="tts-icon">🔊</span> Read Back
                            <span id="flip-back-${index}" style="position: absolute; left: -9999px;">${question.back} ${question.explanation}</span>
                        </button>
                    </div>
                </div>
            `;
            break;
    }
    
    html += `</div>`;
    
    // Add navigation buttons
    html += `
        <div class="question-navigation">
            <button class="nav-button prev" ${index === 0 ? 'disabled' : ''} onclick="navigateQuestion(${index - 1})">
                <i class="fas fa-arrow-left"></i> Previous
            </button>
            <button class="submit-button" onclick="submitAnswer(${index})">
                <i class="fas fa-check-circle"></i> Check Answer
            </button>
            <button class="nav-button next" ${index === questions.length - 1 ? 'disabled' : ''} onclick="navigateQuestion(${index + 1})">
                Next <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    // Add feedback container
    html += `
        <div class="feedback-container" id="feedback-container" style="display: none;">
            <div class="feedback-content" id="feedback-content"></div>
            <button class="tts-button read" onclick="speakText('feedback-content')">
                <span class="tts-icon">🔊</span> Read Feedback
            </button>
        </div>
    `;
    
    examContainer.innerHTML = html;

    // After rendering is complete, attach event handlers
    setTimeout(() => {
        // Add explicit click handlers for navigation buttons
        const prevButton = document.querySelector('.nav-button.prev');
        const nextButton = document.querySelector('.nav-button.next');
        const submitButton = document.querySelector('.submit-button');
        
        if (prevButton) {
            prevButton.onclick = function() {
                if (index > 0) navigateQuestion(index - 1);
            };
        }
        
        if (nextButton) {
            nextButton.onclick = function() {
                if (index < questions.length - 1) navigateQuestion(index + 1);
            };
        }
        
        if (submitButton) {
            submitButton.onclick = function() {
                submitAnswer(index);
            };
        }
        
        // Add flip card functionality
        if (questionType === 'flipCards') {
            console.log("Setting up flip card handlers");
            
            const flipCard = document.getElementById(`flip-card-${index}`);
            const flipCardInner = document.getElementById(`flip-card-inner-${index}`);
            const flipBtn = document.getElementById(`flip-btn-${index}`);
            
            if (flipCard && flipCardInner) {
                console.log("Found flip card elements");
                
                // Direct manipulation instead of class toggle
                let isFlipped = false;
                
                flipCard.onclick = function() {
                    console.log("Flip card clicked");
                    isFlipped = !isFlipped;
                    flipCardInner.style.transform = isFlipped ? 'rotateY(180deg)' : '';
                    playSound('click');
                };
                
                if (flipBtn) {
                    flipBtn.onclick = function(e) {
                        e.stopPropagation(); // Prevent the card click handler from firing
                        console.log("Flip button clicked");
                        isFlipped = !isFlipped;
                        flipCardInner.style.transform = isFlipped ? 'rotateY(180deg)' : '';
                        playSound('click');
                    };
                }
                
                // Test immediate flip to see if transform works
                console.log("Testing flip animation...");
                setTimeout(() => {
                    flipCardInner.style.transform = 'rotateY(180deg)';
                    setTimeout(() => {
                        flipCardInner.style.transform = '';
                    }, 1000);
                }, 500);
            } else {
                console.error("Flip card elements not found:", {
                    flipCardFound: !!flipCard,
                    flipCardInnerFound: !!flipCardInner
                });
            }
        }
    }, 100);
}

// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Navigation functions
function navigateQuestion(newIndex) {
    playSound('click');
    saveCurrentAnswer();
    
    const questions = questionBank[currentQuestionType].slice(0, questionsPerType);
    
    if (newIndex >= 0 && newIndex < questions.length) {
        currentQuestionIndex = newIndex;
        loadQuestion(currentQuestionType, newIndex, questions);
    }
}

// Submit and check the current answer
function submitAnswer(index) {
    saveCurrentAnswer();
    
    const questions = questionBank[currentQuestionType].slice(0, questionsPerType);
    const question = questions[index];
    const userAnswer = userAnswers[currentQuestionType][index];
    
    let isCorrect = false;
    let feedbackText = '';
    
    // Check correctness based on question type
    switch(currentQuestionType) {
        case 'mcq':
        case 'pictureQuestions':
            isCorrect = userAnswer === question.correctAnswer;
            feedbackText = isCorrect ? 
                "Correct! " + question.explanation : 
                `Not quite. The correct answer is "${question.options[question.correctAnswer]}". ${question.explanation}`;
            break;
            
        case 'truefalse':
            isCorrect = userAnswer === question.correctAnswer;
            feedbackText = isCorrect ? 
                "Correct! " + question.explanation : 
                `Not quite. The answer is ${question.correctAnswer ? "TRUE" : "FALSE"}. ${question.explanation}`;
            break;
            
        case 'fillBlanks':
        case 'oneWordAnswers':
            isCorrect = userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
            feedbackText = isCorrect ? 
                "Correct! " + question.explanation : 
                `Not quite. The correct answer is "${question.correctAnswer}". ${question.explanation}`;
            break;
            
        case 'spellingTests':
            const completeWord = question.word.toLowerCase();
            isCorrect = userAnswer && userAnswer.toLowerCase() === completeWord;
            feedbackText = isCorrect ? 
                `Excellent spelling! The word is "${question.word}". ${question.explanation}` : 
                `Not quite. The correct spelling is "${question.word}". ${question.explanation}`;
            feedbackText += highlightSpellingFeedback(userAnswer, question.word);
            break;
            
        case 'sequenceQuestions':
            isCorrect = true;
            for (let i = 0; i < question.correctSequence.length; i++) {
                if (userAnswer[i] !== question.correctSequence[i]) {
                    isCorrect = false;
                    break;
                }
            }
            
            if (isCorrect) {
                feedbackText = `Correct sequence! ${question.explanation}`;
            } else {
                feedbackText = `Not quite right. The correct sequence is: `;
                question.correctSequence.forEach((index, position) => {
                    feedbackText += `<br>${position + 1}. ${question.items[index]}`;
                });
                feedbackText += `<br><br>${question.explanation}`;
            }
            break;
            
        case 'shortAnswer':
        case 'longAnswer':
            // These are self-evaluated, so we just show the model answer
            feedbackText = `You can compare your answer with the model answer. ${question.explanation}`;
            break;

        case 'flipCards':
            // Flip cards are self-evaluated
            feedbackText = `You can review the answer on the back of the card. ${question.explanation}`;
            break;
    }
    
    // Show feedback
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackContent = document.getElementById('feedback-content');
    
    if (feedbackContainer && feedbackContent) {
        feedbackContainer.style.display = 'block';
        feedbackContent.innerHTML = feedbackText;
        
        if (isCorrect) {
            feedbackContainer.className = 'feedback-container correct';
            // Play success sound
            playSound('success');
        } else {
            feedbackContainer.className = 'feedback-container incorrect';
            // Play try again sound
            playSound('tryagain');
        }
    }
    
    // Enable "Next" button if it's not the last question
    const nextButton = document.querySelector('.nav-button.next');
    if (nextButton && index < questionBank[currentQuestionType].length - 1) {
        nextButton.disabled = false;
    }
}

// Save the current answer before navigating
function saveCurrentAnswer() {
    if (!currentQuestionType) return;
    
    const index = currentQuestionIndex;
    
    switch(currentQuestionType) {
        case 'mcq':
        case 'pictureQuestions':
            const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
            if (selectedOption) {
                userAnswers[currentQuestionType][index] = parseInt(selectedOption.value);
            }
            break;
            
        case 'truefalse':
            const trueSelected = document.getElementById('true-option').checked;
            const falseSelected = document.getElementById('false-option').checked;
            if (trueSelected) {
                userAnswers[currentQuestionType][index] = true;
            } else if (falseSelected) {
                userAnswers[currentQuestionType][index] = false;
            }
            break;
            
        case 'fillBlanks':
        case 'oneWordAnswers':
            const inputField = document.getElementById(`blank-input-${index}`);
            if (inputField) {
                userAnswers[currentQuestionType][index] = inputField.value.trim();
            }
            break;
            
        case 'spellingTests':
            // Collect letters from all inputs
            const letterInputs = document.querySelectorAll('.letter-input');
            const blankedWord = questionBank[currentQuestionType][index].blankedWord;
            let filledWord = '';
            
            for (let i = 0; i < blankedWord.length; i++) {
                if (blankedWord[i] === '_') {
                    const input = document.querySelector(`.letter-input[data-index="${i}"]`);
                    filledWord += input ? input.value : '_';
                } else {
                    filledWord += blankedWord[i];
                }
            }
            
            userAnswers[currentQuestionType][index] = filledWord;
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
            
            userAnswers[currentQuestionType][index] = order;
            break;
            
        case 'shortAnswer':
        case 'longAnswer':
            // These are self-evaluated
            userAnswers[currentQuestionType][index] = true; // Just mark as answered
            break;

        case 'flipCards':
            // For flip cards, we just mark them as viewed
            userAnswers[currentQuestionType][index] = true;
            break;
    }
}

// Helper functions
function getQuestionTypeName(type) {
    const typeMap = {
        'mcq': 'Multiple Choice Questions',
        'fillBlanks': 'Fill in the Blanks',
        'truefalse': 'True or False',
        'shortAnswer': 'Short Answer Questions',
        'longAnswer': 'Long Answer Questions',
        'pictureQuestions': 'Picture-Based Questions',
        'oneWordAnswers': 'One-Word Answers',
        'spellingTests': 'Spelling Test',
        'sequenceQuestions': 'Arrange in Order',
        'flipCards': 'Flip Cards' // Add flip cards to type map
    };
    
    return typeMap[type] || 'Questions';
}

// Enhanced text-to-speech functionality for children with SLD
function speakText(elementId, customText) {
    // Check if TTS is enabled in SLD settings
    if (typeof sldSettings !== 'undefined' && sldSettings.ttsEnabled === false) {
        console.log('Text-to-speech is disabled in settings');
        return;
    }

    if (!window.speechSynthesis) {
        console.log('Speech synthesis not supported in this browser');
        return;
    }
    
    if (speaking) {
        stopSpeaking();
    }
    
    let textToSpeak = '';
    
    if (customText) {
        textToSpeak = customText;
    } else if (elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        textToSpeak = element.textContent;
    }
    
    if (!textToSpeak) return;
    
    // Set speaking flag
    speaking = true;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Optimize settings for children with SLD
    utterance.rate = 0.85; // Slightly slower for better comprehension
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 1.0; // Full volume for clarity
    
    // Try to get voices (might be async in some browsers)
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
        // If no voices loaded yet, wait for them
        window.speechSynthesis.onvoiceschanged = function() {
            voices = window.speechSynthesis.getVoices();
            setPreferredVoice();
            window.speechSynthesis.speak(utterance);
        };
    } else {
        setPreferredVoice();
        window.speechSynthesis.speak(utterance);
    }
    
    function setPreferredVoice() {
        // Try to find a child-friendly voice that's clear for SLD
        const preferredVoices = voices.filter(voice => 
            voice.name.includes('Child') || 
            voice.name.includes('Kid') || 
            voice.name.includes('Female') ||
            voice.name.includes('Zira') ||  // Good for clarity
            voice.name.includes('Samantha')  // Good for clarity
        );
        
        if (preferredVoices.length > 0) {
            utterance.voice = preferredVoices[0];
        }
    }
    
    // Visual feedback that TTS is active
    const ttsButtons = document.querySelectorAll('.tts-button.read, .tts-mini-button');
    ttsButtons.forEach(btn => {
        btn.classList.add('speaking');
    });
    
    // When done speaking
    utterance.onend = function() {
        speaking = false;
        // Remove visual feedback
        ttsButtons.forEach(btn => {
            btn.classList.remove('speaking');
        });
    };
    
    // Error handling
    utterance.onerror = function(event) {
        console.log('Speech synthesis error:', event.error);
        speaking = false;
        ttsButtons.forEach(btn => {
            btn.classList.remove('speaking');
        });
    };
}

// Function to stop speaking
function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    speaking = false;
}

// Function to show model answer for short and long answer questions
function showModelAnswer(index) {
    // Play sound effect
    playSound('success');
    
    // Get model answer container and make it visible with animation
    const modelAnswer = document.getElementById(`model-answer-${index}`);
    if (modelAnswer) {
        modelAnswer.style.display = 'block';
        modelAnswer.style.animation = 'slideUp 0.5s ease';
    }
    
    // Disable the confirmation button to prevent multiple clicks
    const confirmBtn = document.querySelector('.notebook-confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Answer Shown';
    }
    
    // Auto-read the model answer after a short delay
    setTimeout(() => {
        speakText(`model-answer-${index}`);
    }, 500);
    
    // Save that the user has viewed this answer
    if (!userAnswers[currentQuestionType]) {
        userAnswers[currentQuestionType] = [];
    }
    userAnswers[currentQuestionType][index] = true;
}

// Helper function for spelling tests - move focus to next input
function moveFocus(currentInput, currentIndex, totalLength) {
    if (currentInput.value.length === currentInput.maxLength) {
        // Find all letter inputs
        const inputs = document.querySelectorAll('.letter-input');
        
        // Find the next blank input
        for (let i = currentIndex + 1; i < totalLength; i++) {
            const nextInput = document.querySelector(`.letter-input[data-index="${i}"]`);
            if (nextInput) {
                nextInput.focus();
                return;
            }
        }
        
        // If we've reached the end, submit the answer
        const submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.focus();
        }
    }
}

// Add color-coding for correct/incorrect letters in spelling test
function highlightSpellingFeedback(userAnswer, correctWord) {
    if (!userAnswer || !correctWord) return '';
    
    let html = '<div class="spelling-feedback">';
    const userLetters = userAnswer.split('');
    const correctLetters = correctWord.toLowerCase().split('');
    
    userLetters.forEach((letter, i) => {
        if (i < correctLetters.length) {
            // Compare with correct letter (case insensitive)
            if (letter.toLowerCase() === correctLetters[i]) {
                html += `<span class="correct-letter">${letter}</span>`;
            } else {
                html += `<span class="incorrect-letter">${letter}</span>`;
            }
        } else {
            // Extra letters are always incorrect
            html += `<span class="incorrect-letter">${letter}</span>`;
        }
    });
    
    // Add missing letters if user answer is too short
    if (userLetters.length < correctLetters.length) {
        html += ` <span class="missing-letters">(missing ${correctLetters.length - userLetters.length} letters)</span>`;
    }
    
    html += '</div>';
    return html;
}

// Sound effects - Updated to use the actual sound files with error handling
function playSound(type) {
    if (!soundEnabled) return; // Check global sound setting
    
    const sounds = {
        'success': 'sounds/correct.mp3',
        'tryagain': 'sounds/incorrect.mp3',
        'match': 'sounds/points.mp3',
        'error': 'sounds/error.mp3',
        'click': 'sounds/click.mp3',
        'complete': 'sounds/complete.mp3'
    };
    
    if (sounds[type]) {
        try {
            const audio = new Audio(sounds[type]);
            
            // Add error handling for sound loading issues
            audio.onerror = function() {
                console.log('Error loading sound: ' + sounds[type]);
            };
            
            audio.play().catch(e => {
                console.log('Error playing sound: ' + e.message);
            });
        } catch(e) {
            console.log('Sound system error: ' + e.message);
        }
    }
}

// Helper function to celebrate correct answers
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
