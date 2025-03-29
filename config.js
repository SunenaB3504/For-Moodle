/**
 * Chapter Configuration
 * This file contains all the content for the chapter.
 * Edit this file to change content without touching the code structure.
 */

// Check if chapterConfig already exists to avoid redeclaration
if (!window.chapterConfig) {
    window.chapterConfig = {
        // Basic chapter information
        chapterInfo: {
            title: "All in the Family",
            subject: "EVS",
            class: "Class 4",
            chapter: 1,
            description: "Join Vasu as he explores his mother's photo album and discovers how people change over time. Learn about different types of families and how they are connected!"
        },
        
        // Introduction section
        introduction: {
            highlights: [
                {
                    icon: "fas fa-child",
                    text: "How we change as we grow"
                },
                {
                    icon: "fas fa-users",
                    text: "Joint and nuclear families"
                },
                {
                    icon: "fas fa-user-friends",
                    text: "Maternal and paternal relatives"
                }
            ],
            about: {
                content: `
                    <p>In this chapter "All in the Family," we'll learn:</p>
                    <ul>
                        <li>How people change physically and mentally as they grow older</li>
                        <li>What makes up a family and the different types of families</li>
                        <li>The difference between joint and nuclear families</li>
                        <li>Who are paternal and maternal relatives</li>
                    </ul>
                    <p>We'll also learn new words like "tracksuit" and "athlete" as we follow Vasu's exploration of his family album.</p>
                    <p>The interactive adventure has 5 levels with questions to help you learn these concepts in a fun way!</p>
                `
            }
        },
        
        // Topic sections
        topics: [
            {
                id: "topic1",
                title: "Vasu's Family Album",
                icon: "fas fa-book-open",
                navTitle: "Family Album",
                image: "placeholder-image.jpg", // Changed from missing image to placeholder
                content: `
                    <h3>Vasu's Family Album</h3>
                    <p>Vasu looks through his mother's album. He likes the picture of his mother dressed in a tracksuit. She was an athlete during her school and college days. He also admires the picture which shows her riding a motorcycle.</p>
                    
                    <p>Now, Vasu's mother is much older. She works in an office. She looks after the family too.</p>
                    
                    <p>Have you seen pictures of your mother in her younger days? What do you like about the pictures?</p>
                `,
                question: {
                    text: "What did Vasu's mother do during her school and college days?",
                    options: [
                        "She was an athlete.",
                        "She was a teacher.",
                        "She was a doctor."
                    ],
                    correctAnswer: 0
                }
            },
            {
                id: "topic2",
                title: "People Change As They Grow",
                icon: "fas fa-child",
                navTitle: "Growing Up",
                image: "images/growing-up.jpg",
                content: `
                    <h3>People Change As They Grow</h3>
                    <p>We change as we grow. We change physically and mentally. Physical changes include the way we look. Some of us grow taller, wear glasses, become fatter or thinner than we were before. As we grow old, our hair begins to turn grey and our skin begins to wrinkle.</p>
                    
                    <p>Mental changes include the ability to do more things. When you were a baby, you could not eat, dress, read, sing or do many other things on your own. Now, you can do most of these things. This is because we get better at doing things and doing more work as we grow. We can do things ourselves. We are more independent. We can take care of our families.</p>
                    
                    <div class="info-box expanded">
                        <h3>DID YOU KNOW?</h3>
                        <p>We need to be healthy to grow tall. For healthy bones, we need Vitamin D. We get this from sunlight. If you drink milk and get enough sunlight, you will not require any 'energy drink'!</p>
                    </div>
                `,
                question: {
                    text: "What are physical changes that happen as we grow older?",
                    options: [
                        "We become more independent.",
                        "Our hair turns grey and skin wrinkles.",
                        "We learn to read and write."
                    ],
                    correctAnswer: 1
                }
            }
        ],
        
        // New words and terms
        vocabulary: [
            {
                word: "tracksuit",
                definition: "a loose set of clothes worn by sportspersons"
            },
            {
                word: "athlete",
                definition: "a person who takes part in sports events such as running, jumping"
            }
        ],
        
        // Practice questions (imported from separate file)
        practiceQuestions: "questionBank" // This will be loaded from questions.js
    };
}
