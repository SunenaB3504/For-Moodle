/**
 * Question Bank Template
 * Copy this file and rename it to questions.js for a new chapter
 */

const questionBank = {
    // Multiple Choice Questions (MCQs)
    mcq: [
        {
            id: "mcq1",
            question: "Your multiple choice question text here?",
            options: [
                "Option 1 - correct answer",
                "Option 2 - incorrect answer",
                "Option 3 - incorrect answer",
                "Option 4 - incorrect answer"
            ],
            correctAnswer: 0,
            explanation: "Explanation of why option 1 is correct."
        },
        // Add 4-5 more MCQs
    ],

    // Fill in the Blanks
    fillBlanks: [
        {
            id: "fill1",
            question: "Complete this sentence: The capital of India is _______.",
            correctAnswer: "Delhi",
            explanation: "Delhi is the capital city of India."
        },
        // Add 4-5 more fill-in-the-blank questions
    ],

    // True or False
    truefalse: [
        {
            id: "tf1",
            question: "Your true/false statement here.",
            correctAnswer: true, // or false
            explanation: "Explanation of why this statement is true/false."
        },
        // Add 4-5 more true/false questions
    ],

    // Short Answer Questions
    shortAnswer: [
        {
            id: "short1",
            question: "Your short answer question requiring 2-3 sentences?",
            modelAnswer: "A sample answer that shows what a good response would include. This helps students compare their own answers.",
            explanation: "Further guidance about what should be included in a good answer."
        },
        // Add 2-3 more short answer questions
    ],

    // Long Answer Questions
    longAnswer: [
        {
            id: "long1",
            question: "Your long answer question requiring a paragraph or more?",
            modelAnswer: "A detailed model answer that students can use to compare with their own writing. This should be comprehensive and cover all key points that students would be expected to include.\n\nIt should be structured with proper paragraphs to model good writing.",
            explanation: "Additional context about why certain elements should be included in the answer."
        },
        // Add 2-3 more long answer questions
    ],

    // One-Word Answer Questions
    oneWordAnswers: [
        {
            id: "word1",
            question: "Question requiring a single word answer?",
            correctAnswer: "answer",
            explanation: "Brief explanation of the answer."
        },
        // Add 4-5 more one-word answer questions
    ],

    // Spelling Tests (Fill missing letters)
    spellingTests: [
        {
            id: "spell1",
            word: "complete",
            blankedWord: "c_mp__te", // Fill in o, le
            hint: "Hint to help identify the word",
            explanation: "Brief explanation of what this word means."
        },
        // Add 4-5 more spelling tests
    ],

    // Sequence Arrangement Questions
    sequenceQuestions: [
        {
            id: "seq1",
            question: "Arrange these items in the correct order:",
            items: [
                "First item",
                "Second item",
                "Third item",
                "Fourth item"
            ],
            correctSequence: [0, 1, 2, 3],
            explanation: "Explanation of why this is the correct sequence."
        },
        // Add 2-3 more sequence questions
    ],

    // Flip Card Questions (for matching activities)
    flipCards: [
        {
            id: "flip1",
            front: "Term or concept",
            back: "Definition or explanation",
            explanation: "Additional information about this match."
        },
        // Add 6-8 more flip cards
    ]
};
