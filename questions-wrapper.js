/**
 * Questions Wrapper
 * This file safely loads the questions data and prevents redeclaration issues
 */

(function() {
    // Check if questionBank already exists
    if (!window.questionBank) {
        // Create script element to load questions
        const script = document.createElement('script');
        script.src = 'questions.js';
        script.onerror = function() {
            console.error("Failed to load questions.js");
            
            // Create fallback question bank with sample questions
            window.questionBank = {
                mcq: [
                    {
                        id: "mcq1",
                        question: "What did Vasu's mother do during her school and college days?",
                        options: [
                            "She was an athlete.",
                            "She was a teacher.",
                            "She was a doctor."
                        ],
                        correctAnswer: 0,
                        explanation: "Vasu's mother was an athlete during her school and college days."
                    }
                ],
                fillBlanks: [],
                truefalse: [],
                shortAnswer: [],
                longAnswer: [],
                oneWordAnswers: [],
                spellingTests: [],
                sequenceQuestions: [],
                flipCards: []
            };
        };
        document.head.appendChild(script);
    }
})();
