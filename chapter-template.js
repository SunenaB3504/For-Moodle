/**
 * Chapter Template
 * Copy this file and rename it to config.js for a new chapter
 */

const chapterConfig = {
    // Basic chapter information
    chapterInfo: {
        title: "Chapter Title",
        subject: "Subject Name",
        class: "Class Level",
        chapter: 1,
        description: "Brief description of what students will learn in this chapter"
    },
    
    // Introduction section
    introduction: {
        highlights: [
            {
                icon: "fas fa-icon-name",
                text: "Key concept 1"
            },
            {
                icon: "fas fa-icon-name",
                text: "Key concept 2"
            },
            {
                icon: "fas fa-icon-name",
                text: "Key concept 3"
            }
        ],
        about: {
            content: `
                <p>In this chapter, we'll learn:</p>
                <ul>
                    <li>First learning objective</li>
                    <li>Second learning objective</li>
                    <li>Third learning objective</li>
                    <li>Fourth learning objective</li>
                </ul>
                <p>Additional context about the chapter's importance.</p>
                <p>The interactive adventure has 5 levels with questions to help you learn these concepts in a fun way!</p>
            `
        }
    },
    
    // Topic sections - Create 3-5 topics for the chapter
    topics: [
        {
            id: "topic1",
            title: "First Topic Title",
            icon: "fas fa-icon-name",
            navTitle: "Short Name",
            image: "images/topic1.jpg",
            content: `
                <h3>First Topic Title</h3>
                <p>First paragraph of content explaining the concept.</p>
                
                <p>Second paragraph with more details or examples.</p>
                
                <p>Third paragraph that might include a question for reflection.</p>
                
                <div class="info-box expanded">
                    <h3>DID YOU KNOW?</h3>
                    <p>An interesting fact related to this topic.</p>
                </div>
            `,
            question: {
                text: "Question text related to this topic?",
                options: [
                    "Correct answer option",
                    "Incorrect option 1",
                    "Incorrect option 2"
                ],
                correctAnswer: 0
            }
        },
        // Add more topics following the same structure
    ],
    
    // New words and terms
    vocabulary: [
        {
            word: "new-term",
            definition: "definition of the new term"
        },
        {
            word: "another-term",
            definition: "definition of another term"
        }
    ]
};

// Question bank template is in questions-template.js
