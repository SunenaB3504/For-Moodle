// Game variables
let currentLevel = 0;
let score = 0;
let levelScores = [0, 0, 0, 0, 0];
let examAnswers = [];
let examCurrentQuestion = 0;
let examTotalQuestions = 8;
let examScore = 0;
let synth = window.speechSynthesis;
let speaking = false;

// Audio functionality
let backgroundMusic = null;
let soundEnabled = true;

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Navigation is now handled by moduleLoader
    
    // Hide all screens except intro
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'intro') {
            screen.style.display = 'none';
        }
    });

    // Initialize background music
    backgroundMusic = new Audio('sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3; // Lower volume for background music
    
    // Add sound controls to the UI
    addSoundControls();
    
    // Set initial history state
    window.history.replaceState({screen: 'intro'}, "Introduction", "#intro");
    
    // Check if URL contains a hash and navigate accordingly
    const hash = window.location.hash;
    if (hash) {
        if (hash.startsWith('#level')) {
            const level = parseInt(hash.replace('#level', ''));
            if (level >= 1 && level <= 5) {
                showLevel(level);
                showNavigation();
            }
        } else if (hash === '#practice') {
            startExamPractice();
            showNavigation();
        }
    }
});

// Add sound controls to the interface
function addSoundControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'sound-controls';
    controlsDiv.innerHTML = `
        <button id="toggle-music" class="sound-button">
            <i class="fas fa-music"></i>
        </button>
        <button id="toggle-sound" class="sound-button">
            <i class="fas fa-volume-up"></i>
        </button>
    `;
    
    document.getElementById('game-container').appendChild(controlsDiv);
    
    // Add event listeners for sound controls
    document.getElementById('toggle-music').addEventListener('click', toggleBackgroundMusic);
    document.getElementById('toggle-sound').addEventListener('click', toggleSoundEffects);
}

// Toggle background music
function toggleBackgroundMusic() {
    const musicButton = document.getElementById('toggle-music');
    
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicButton.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        backgroundMusic.pause();
        musicButton.innerHTML = '<i class="fas fa-music-slash"></i>';
    }
}

// Toggle sound effects
function toggleSoundEffects() {
    const soundButton = document.getElementById('toggle-sound');
    
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        soundButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        soundButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// Play sound effect
function playSound(soundName) {
    if (!soundEnabled) return;
    
    const sounds = {
        'click': 'sounds/click.mp3',
        'complete': 'sounds/complete.mp3',
        'correct': 'sounds/correct.mp3',
        'incorrect': 'sounds/incorrect.mp3',
        'error': 'sounds/error.mp3',
        'points': 'sounds/points.mp3'
    };
    
    if (sounds[soundName]) {
        const audio = new Audio(sounds[soundName]);
        audio.play();
    }
}

// Show navigation after starting game
function showNavigation() {
    document.querySelector('.kid-nav').style.display = 'flex';
}

// Start the game - simplified to use moduleLoader
function startGame() {
    moduleLoader.loadModule('explanation1');
    showNavigation();
    updateProgress(1, 5);
}

// Enhanced version of showLevel to use moduleLoader
function showLevel(level) {
    // Play click sound
    playSound('click');
    
    // Update the module being shown
    moduleLoader.loadModule('explanation' + level);
    currentLevel = level;
    
    // Update progress
    updateProgress(level, 5);
    
    // Save current position in browser's history to enable back button
    window.history.pushState({level: level}, "Level " + level, "#level" + level);
}

// Add back button support
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.level) {
        showLevel(event.state.level);
    } else {
        showIntro();
    }
});

// Enhanced showIntro with history support
function showIntro() {
    moduleLoader.loadModule('intro');
    
    // Save state
    window.history.pushState({screen: 'intro'}, "Introduction", "#intro");
}

// Update progress bar
function updateProgress(current, total) {
    const progressFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');
    
    const percentage = (current / total) * 100;
    progressFill.style.width = percentage + '%';
    progressText.textContent = current + ' / ' + total;
}

// Show introduction overlay
function showIntroduction() {
    document.getElementById('introduction-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind overlay
}

// Hide introduction overlay
function hideIntroduction() {
    document.getElementById('introduction-overlay').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Level-specific functions
function exploreAlbum() {
    document.getElementById('album-feedback').textContent = "You're exploring Vasu's mother's photo album!";
    setTimeout(() => {
        document.getElementById('question1').style.display = 'block';
        document.getElementById('album-feedback').textContent = '';
    }, 1000);
}

function exploreChanges() {
    document.getElementById('changes-feedback').textContent = "You're learning about how people change as they grow!";
    setTimeout(() => {
        document.getElementById('question2').style.display = 'block';
        document.getElementById('changes-feedback').textContent = '';
    }, 1000);
}

function exploreFamilies() {
    document.getElementById('families-feedback').textContent = "You're discovering different types of families!";
    setTimeout(() => {
        document.getElementById('question3').style.display = 'block';
        document.getElementById('families-feedback').textContent = '';
    }, 1000);
}

function exploreRelatives() {
    document.getElementById('relatives-feedback').textContent = "You're learning about paternal and maternal relatives!";
    setTimeout(() => {
        document.getElementById('question4').style.display = 'block';
        document.getElementById('relatives-feedback').textContent = '';
    }, 1000);
}

function exploreNewWords() {
    document.getElementById('words-feedback').textContent = "You're learning new words and reviewing what we learned!";
    setTimeout(() => {
        document.getElementById('question5').style.display = 'block';
        document.getElementById('words-feedback').textContent = '';
    }, 1000);
}

// Proceed to question
function proceedToQuestion(level) {
    moduleLoader.loadModule('level' + level);
}

// Enhanced checkAnswer function with sounds
function checkAnswer(level) {
    // Now uses config-based answers
    let selectedOption = document.querySelector(`input[name="q${level}"]:checked`);
    const feedbackElement = document.getElementById('feedback' + level);
    
    if (!selectedOption) {
        feedbackElement.textContent = "Please select an answer.";
        return;
    }
    
    // Get answer from config
    const topic = chapterConfig.topics[level-1];
    const correctAnswer = topic.question.correctAnswer;
    const optionValue = selectedOption.value.charCodeAt(0) - 97; // Convert a,b,c to 0,1,2
    
    if (optionValue === correctAnswer) {
        feedbackElement.textContent = "Correct! Well done!";
        feedbackElement.style.color = "green";
        levelScores[level-1] = 20; // 20 points per level
        score = levelScores.reduce((a, b) => a + b, 0);
        
        // Play correct sound
        playSound('correct');
        
        // Show animation for correct answer
        showPointsAnimation(20, selectedOption);
        
        // Disable options after correct answer
        disableOptions(level);
        
        // Show next level button after a delay
        setTimeout(() => {
            if (level < 5) {
                const nextButton = document.createElement('button');
                nextButton.textContent = "Next Level";
                nextButton.onclick = function() { showLevel(level + 1); };
                feedbackElement.parentNode.appendChild(nextButton);
            } else {
                const resultsButton = document.createElement('button');
                resultsButton.textContent = "See Results";
                resultsButton.onclick = function() { showResults(); };
                feedbackElement.parentNode.appendChild(resultsButton);
            }
        }, 1500);
    } else {
        feedbackElement.textContent = "Try again. Think about what you learned.";
        feedbackElement.style.color = "red";
        
        // Play incorrect sound
        playSound('incorrect');
    }
}

// Disable options after correct answer
function disableOptions(level) {
    const options = document.querySelectorAll(`input[name="q${level}"]`);
    options.forEach(option => {
        option.disabled = true;
    });
}

// Add sound to points animation
function showPointsAnimation(points, element) {
    const pointsElement = document.createElement('div');
    pointsElement.className = 'points-earned';
    pointsElement.textContent = '+' + points;
    
    // Position near the element
    const rect = element.getBoundingClientRect();
    pointsElement.style.left = rect.left + 'px';
    pointsElement.style.top = rect.top + 'px';
    
    document.body.appendChild(pointsElement);
    
    // Play points sound
    playSound('points');
    
    // Remove after animation completes
    setTimeout(() => {
        document.body.removeChild(pointsElement);
    }, 1500);
}

// Show results screen
function showResults() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('total-score').textContent = score;
    
    // Create level breakdown
    const levelBreakdown = document.getElementById('level-scores-breakdown');
    levelBreakdown.innerHTML = '';
    
    const levelNames = [
        "Family Album",
        "Growing Up",
        "Family Types",
        "Relatives",
        "New Words & Summary"
    ];
    
    for (let i = 0; i < levelScores.length; i++) {
        const levelRow = document.createElement('div');
        levelRow.className = 'score-row';
        levelRow.innerHTML = `
            <span>Level ${i+1}: ${levelNames[i]}</span>
            <span>${levelScores[i]} / 20</span>
        `;
        levelBreakdown.appendChild(levelRow);
    }
    
    // Play confetti animation
    playConfetti();
}

// Add sound to confetti
function playConfetti() {
    // Play completion sound
    playSound('complete');
    
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random position
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    
    // Random color
    const colors = ['#f39c12', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6'];
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random size
    const size = Math.floor(Math.random() * 10) + 5;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    
    // Random rotation
    confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    
    // Random animation duration
    const duration = Math.random() * 3 + 2;
    confetti.style.animationDuration = duration + 's';
    
    document.body.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(confetti);
    }, duration * 1000);
}

// Enhanced version of startExamPractice
function startExamPractice() {
    moduleLoader.loadModule('accessible-exam');
    
    // Save state
    window.history.pushState({screen: 'exam'}, "Practice Questions", "#practice");
}

// Start exam questions (after clicking Begin Practice)
function startExamQuestions() {
    // Hide intro section
    const examIntro = document.querySelector('.exam-intro');
    if (examIntro) {
        examIntro.style.display = 'none';
    }
    
    // Show exam content
    document.getElementById('exam-content').style.display = 'block';
    
    // Reset exam data
    examAnswers = [];
    examCurrentQuestion = 0;
    examScore = 0;
    
    // Set total questions
    examTotalQuestions = examQuestionsData.length;
    document.getElementById('total-exam-questions').textContent = examTotalQuestions;
    
    // Prepare questions
    prepareExamQuestions();
    
    // Load first question
    loadExamQuestion(0);
    
    // Create question navigation dots
    createQuestionDots();
    
    // Add event listeners for navigation buttons
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const submitButton = document.getElementById('submit-btn');
    
    if (prevButton) {
        prevButton.addEventListener('click', previousQuestion);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextQuestion);
    }
    
    if (submitButton) {
        submitButton.addEventListener('click', submitCurrentQuestion);
    }
}

// Add new function to handle submit button click
function submitCurrentQuestion() {
    saveCurrentAnswer();
    
    // Show feedback
    const currentQuestion = examQuestionsData[examCurrentQuestion];
    let isCorrect = false;
    
    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'image-mcq') {
        isCorrect = examAnswers[examCurrentQuestion] === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'tf') {
        isCorrect = examAnswers[examCurrentQuestion] === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'fillblank') {
        isCorrect = examAnswers[examCurrentQuestion] && 
                   examAnswers[examCurrentQuestion].toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    }
    
    // Show appropriate feedback based on correctness
    if (isCorrect) {
        playSound('correct');
        // Add visual feedback
        alert("Correct! " + currentQuestion.explanation);
    } else {
        playSound('incorrect');
        // Add visual feedback
        alert("Not quite right. Please check the explanation to learn more.");
    }
    
    // Enable next button after submitting
    const nextButton = document.getElementById('next-btn');
    if (nextButton) {
        nextButton.disabled = false;
    }
}

// Prepare exam questions
function prepareExamQuestions() {
    examAnswers = Array(examTotalQuestions).fill(null);
}

// Create question navigation dots - Fixed missing closing quotation marks
function createQuestionDots() {
    const navigationContainer = document.createElement('div');
    navigationContainer.className = 'question-navigation';
    
    for (let i = 0; i < examTotalQuestions; i++) {
        const dot = document.createElement('div');
        dot.className = i === 0 ? 'question-dot active' : 'question-dot';
        dot.setAttribute('data-question', i);
        dot.onclick = function() {
            saveCurrentAnswer();
            loadExamQuestion(parseInt(this.getAttribute('data-question')));
        };
        navigationContainer.appendChild(dot);
    }
    
    const examContent = document.getElementById('exam-content');
    const questionProgress = document.getElementById('question-progress');
    if (examContent && questionProgress) {
        examContent.insertBefore(navigationContainer, questionProgress.nextSibling);
    }
}

// Update question dots
function updateQuestionDots(currentIndex) {
    const dots = document.querySelectorAll('.question-dot');
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (examAnswers[index] !== null && examAnswers[index] !== undefined) {
            dot.classList.add('answered');
        }
        if (index === currentIndex) {
            dot.classList.add('active');
        }
    });
}

// Enhanced version of loadExamQuestion with fixed image-mcq handling
function loadExamQuestion(index) {
    const questionContainer = document.getElementById('question-container');
    document.getElementById('current-exam-question').textContent = index + 1;
    
    // Update progress bar
    const progressFill = document.getElementById('exam-progress-fill');
    progressFill.style.width = ((index + 1) / examTotalQuestions * 100) + '%';
    
    // Enable/disable navigation buttons
    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('next-btn').disabled = index === examTotalQuestions - 1;
    
    // Update question dots
    updateQuestionDots(index);
    
    // Get the current question
    const currentQuestion = examQuestionsData[index];
    let html = '';
    
    // Question type label
    let typeLabel = '';
    switch(currentQuestion.type) {
        case 'mcq': typeLabel = 'Multiple Choice'; break;
        case 'tf': typeLabel = 'True or False'; break;
        case 'fillblank': typeLabel = 'Fill in the Blank'; break;
        case 'image-mcq': typeLabel = 'Image Selection'; break;
        case 'ordering': typeLabel = 'Arrange in Order'; break;
    }
    
    html += `<div class="question-type-label">${typeLabel}</div>`;
    
    // Question text
    html += `<div class="question-text">${currentQuestion.question}</div>`;
    
    // Question content based on type
    if (currentQuestion.type === 'mcq') {
        html += `<div class="options-container">`;
        currentQuestion.options.forEach((option, i) => {
            const checked = examAnswers[index] === i ? 'checked' : '';
            html += `
                <div class="option">
                    <input type="radio" name="exam-q${index}" value="${i}" id="exam-q${index}-${i}" ${checked}>
                    <label for="exam-q${index}-${i}">${option}</label>
                </div>
            `;
        });
        html += `</div>`;
    } else if (currentQuestion.type === 'tf') {
        html += `<div class="options-container">`;
        const trueChecked = examAnswers[index] === true ? 'checked' : '';
        const falseChecked = examAnswers[index] === false ? 'checked' : '';
        html += `
            <div class="option">
                <input type="radio" name="exam-q${index}" value="true" id="exam-q${index}-true" ${trueChecked}>
                <label for="exam-q${index}-true">True</label>
            </div>
            <div class="option">
                <input type="radio" name="exam-q${index}" value="false" id="exam-q${index}-false" ${falseChecked}>
                <label for="exam-q${index}-false">False</label>
            </div>
        `;
        html += `</div>`;
    } else if (currentQuestion.type === 'fillblank') {
        html += `
            <div class="text-input-container">
                <input type="text" class="text-input" id="exam-q${index}-input" value="${examAnswers[index] || ''}">
            </div>
        `;
    } else if (currentQuestion.type === 'image-mcq') {
        html += `<div class="image-question-container">`;
        currentQuestion.options.forEach((option, i) => {
            const selected = examAnswers[index] === i ? 'selected' : '';
            html += `
                <div class="image-option ${selected}" onclick="selectImage(${index}, ${i})">
                    <img src="${option.image}" alt="${option.text}">
                    <p>${option.text}</p>
                </div>
            `;
        });
        html += `</div>`;
    } else if (currentQuestion.type === 'ordering') {
        const items = examAnswers[index] || [...currentQuestion.items];
        
        html += `<div class="ordering-container">`;
        html += `<div class="ordering-items">`;
        items.forEach((item, i) => {
            html += `<div class="ordering-item" draggable="true" data-index="${i}">${item}
                <div class="ordering-handle"><i class="fas fa-grip-lines"></i></div>
            </div>`;
        });
        html += `</div>`;
        html += `</div>`;
    }
    
    questionContainer.innerHTML = html;
    examCurrentQuestion = index;
    
    // Set up drag and drop for matching questions
    if (currentQuestion.type === 'matching') {
        setupMatchingDragAndDrop();
    }
    
    // Set up sorting for ordering questions
    if (currentQuestion.type === 'ordering') {
        setupOrderingSorting();
    }
}

// Select image for image-mcq questions
function selectImage(questionIndex, optionIndex) {
    const imageOptions = document.querySelectorAll('.image-option');
    imageOptions.forEach(option => option.classList.remove('selected'));
    
    // Select the clicked option
    imageOptions[optionIndex].classList.add('selected');
    
    // Save the answer
    examAnswers[questionIndex] = optionIndex;
    
    // Update question dots
    updateQuestionDots(questionIndex);
}

// Set up drag and drop for matching questions
function setupMatchingDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropTargets = document.querySelectorAll('.drop-target');
    
    dragItems.forEach(item => {
        item.addEventListener('dragstart', function() {
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    dropTargets.forEach(target => {
        target.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('active');
        });
        
        target.addEventListener('dragleave', function() {
            this.classList.remove('active');
        });
        
        target.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('active');
            
            const draggingItem = document.querySelector('.dragging');
            if (draggingItem && !this.getAttribute('data-matched') === 'true') {
                // Clone the dragged item to place in the target
                const clone = draggingItem.cloneNode(true);
                
                // Clear any existing content
                this.innerHTML = '';
                
                // Add the clone to the target
                this.appendChild(clone);
                
                // Mark target as matched
                this.setAttribute('data-matched', 'true');
                
                // Save the match in examAnswers
                const targetIndex = parseInt(this.getAttribute('data-target'));
                const itemIndex = parseInt(draggingItem.getAttribute('data-index'));
                
                // Initialize the answers array for this question if needed
                if (!examAnswers[examCurrentQuestion] || !Array.isArray(examAnswers[examCurrentQuestion])) {
                    examAnswers[examCurrentQuestion] = Array(dropTargets.length).fill(null);
                }
                
                // Set the match
                examAnswers[examCurrentQuestion][targetIndex] = itemIndex;
                
                // Update question dots
                updateQuestionDots(examCurrentQuestion);
            }
        });
    });
}

// Set up sorting for ordering questions
function setupOrderingSorting() {
    const orderingItems = document.querySelectorAll('.ordering-item');
    const orderingContainer = document.querySelector('.ordering-items');
    
    orderingItems.forEach(item => {
        item.addEventListener('dragstart', function() {
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            
            // Save the current order
            const items = [];
            document.querySelectorAll('.ordering-item').forEach(orderItem => {
                items.push(orderItem.textContent.trim());
            });
            
            examAnswers[examCurrentQuestion] = items;
            
            // Update question dots
            updateQuestionDots(examCurrentQuestion);
        });
    });
    
    orderingContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(orderingContainer, e.clientY);
        const draggable = document.querySelector('.dragging');
        
        if (afterElement == null) {
            orderingContainer.appendChild(draggable);
        } else {
            orderingContainer.insertBefore(draggable, afterElement);
        }
    });
}

// Helper function for ordering question
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.ordering-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Calculate exam score with more detail
function calculateExamScore() {
    examScore = 0;
    const detailedScores = [];
    
    examAnswers.forEach((answer, index) => {
        const question = examQuestionsData[index];
        let points = 0;
        let isCorrect = false;
        
        if (question.type === 'mcq' || question.type === 'image-mcq') {
            isCorrect = answer === question.correctAnswer;
            points = isCorrect ? 10 : 0;
        } else if (question.type === 'tf') {
            isCorrect = answer === question.correctAnswer;
            points = isCorrect ? 10 : 0;
        } else if (question.type === 'fillblank') {
            isCorrect = answer && answer.toLowerCase() === question.correctAnswer.toLowerCase();
            points = isCorrect ? 10 : 0;
        } else if (question.type === 'matching') {
            if (answer) {
                let correctMatches = 0;
                answer.forEach((match, i) => {
                    if (match === i) correctMatches++;
                });
                points = (correctMatches / question.pairs.length) * 10;
                isCorrect = correctMatches === question.pairs.length;
            }
        } else if (question.type === 'ordering') {
            if (answer) {
                // Check if ordering is correct
                const correctOrder = question.items;
                let orderCorrect = true;
                
                for (let i = 0; i < correctOrder.length; i++) {
                    if (answer[i] !== correctOrder[i]) {
                        orderCorrect = false;
                        break;
                    }
                }
                
                isCorrect = orderCorrect;
                points = orderCorrect ? 10 : 0;
            }
        }
        
        examScore += points;
        detailedScores.push({
            questionNumber: index + 1,
            points: points,
            isCorrect: isCorrect
        });
    });
    
    return detailedScores;
}

// Show enhanced exam results
function showExamResults() {
    document.getElementById('exam-practice').style.display = 'none';
    document.getElementById('exam-results').style.display = 'block';
    
    // Calculate score and get detailed breakdown
    const detailedScores = calculateExamScore();
    document.getElementById('exam-total-score').textContent = examScore;
    
    // Create score breakdown
    const scoreBreakdown = document.getElementById('exam-score-breakdown');
    scoreBreakdown.innerHTML = '';
    
    detailedScores.forEach(score => {
        const questionType = examQuestionsData[score.questionNumber - 1].type.toUpperCase();
        const scoreRow = document.createElement('div');
        scoreRow.className = 'score-row';
        
        scoreRow.innerHTML = `
            <span>Q${score.questionNumber}: ${questionType}</span>
            <span>${score.isCorrect ? '✓' : '✗'} ${score.points} pts</span>
        `;
        
        scoreBreakdown.appendChild(scoreRow);
    });
    
    // Add performance feedback
    const feedbackElement = document.getElementById('exam-feedback');
    let feedbackMessage = '';
    
    if (examScore >= 90) {
        feedbackMessage = 'Excellent! You have an outstanding understanding of families and growing up!';
    } else if (examScore >= 75) {
        feedbackMessage = 'Great job! You have a very good grasp of the material!';
    } else if (examScore >= 60) {
        feedbackMessage = 'Good effort! You understand most of the concepts!';
    } else if (examScore >= 40) {
        feedbackMessage = 'Keep practicing! Try reviewing the chapter material again.';
    } else {
        feedbackMessage = 'Let\'s try again! Review the chapter carefully and attempt the questions once more.';
    }
    
    feedbackElement.textContent = feedbackMessage;
    
    // Play celebration animation if score is good
    if (examScore >= 70) {
        playConfetti();
    }
}

// Export answers to PDF or printable format - Fixed quotation marks
function exportAnswers() {
    alert('This feature would allow saving or printing results in a real implementation!');
    
    // In a real implementation, you would:
    // 1. Format the answers and results nicely;
    // 2. Use a library like jsPDF to create a PDF;
    // 3. Provide a download link
}

// Retry the exam
function retryExam() {
    document.getElementById('exam-results').style.display = 'none';
    startExamPractice();
}

// Text to speech functions
function speakText(elementId) {
    if (speaking) {
        stopSpeaking();
    }
    
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set speaking flag
    speaking = true;
    
    // Enable stop button, disable read button
    document.querySelectorAll('.tts-button.read').forEach(btn => btn.disabled = true);
    document.querySelectorAll('.tts-button.stop').forEach(btn => btn.disabled = false);
    
    // Start speaking
    synth.speak(utterance);
    
    // When done speaking
    utterance.onend = function() {
        speaking = false;
        document.querySelectorAll('.tts-button.read').forEach(btn => btn.disabled = false);
        document.querySelectorAll('.tts-button.stop').forEach(btn => btn.disabled = true);
    };
}

function stopSpeaking() {
    if (speaking) {
        synth.cancel();
        speaking = false;
        
        // Update buttons
        document.querySelectorAll('.tts-button.read').forEach(btn => btn.disabled = false);
        document.querySelectorAll('.tts-button.stop').forEach(btn => btn.disabled = true);
    }
}

// Navigate to previous question
function previousQuestion() {
    saveCurrentAnswer();
    if (examCurrentQuestion > 0) {
        loadExamQuestion(examCurrentQuestion - 1);
    }
}

// Navigate to next question
function nextQuestion() {
    saveCurrentAnswer();
    if (examCurrentQuestion < examTotalQuestions - 1) {
        loadExamQuestion(examCurrentQuestion + 1);
    }
}

// Save current answer
function saveCurrentAnswer() {
    const index = examCurrentQuestion;
    
    if (index >= examQuestionsData.length || !document.getElementById('question-container')) {
        return; // Exit if we're out of bounds or element doesn't exist
    }
    
    // Get question type
    const currentQuestion = examQuestionsData[index];
    
    if (currentQuestion.type === 'mcq') {
        const selected = document.querySelector(`input[name="exam-q${index}"]:checked`);
        examAnswers[index] = selected ? parseInt(selected.value) : null;
    } else if (currentQuestion.type === 'tf') {
        const selected = document.querySelector(`input[name="exam-q${index}"]:checked`);
        examAnswers[index] = selected ? (selected.value === 'true') : null;
    } else if (currentQuestion.type === 'fillblank') {
        const input = document.getElementById(`exam-q${index}-input`);
        examAnswers[index] = input ? input.value.trim() : null;
    } else if (currentQuestion.type === 'matching') {
        // Matching answers are saved during drag and drop
    } else if (currentQuestion.type === 'image-mcq') {
        // Image answers are saved during selection
    } else if (currentQuestion.type === 'ordering') {
        // Ordering answers are saved during sorting
    }
}

// Hide loading spinner when page is fully loaded
window.addEventListener('load', function() {
    setTimeout(() => {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.opacity = '0';
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 500);
        }
    }, 1000); // Minimum display time for spinner
});

// Preload images for better performance
function preloadImages() {
    const imagesToPreload = [
        'images/family_portrait.jpg',
        'images/growth_stages.jpg',
        'images/vitamin_d_sources.jpg',
        'images/elderly_person.jpg',
        'images/family_tree.jpg',
        'images/sunlight.jpg',
        'images/milk.jpg',
        'images/fish.jpg',
        'images/candy.jpg'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}
