# Interactive Textbook SCORM Package Framework

This framework provides a modular system for creating interactive SCORM packages for textbook chapters. It's designed specifically for CBSE curriculum content with support for students with specific learning disabilities (SLD).

## Getting Started

To create a new chapter:

1. Copy the entire folder structure to a new location
2. Edit `config.js` to update chapter content
3. Update `questions.js` with chapter-specific questions
4. Test locally by opening `index.html` in a browser
5. Package as SCORM using a tool like Articulate or SCORM Cloud

## File Structure

- `index.html` - The main template HTML file
- `config.js` - Chapter-specific content and configuration
- `questions.js` - Question bank for practice sections
- `module-loader.js` - Loads chapter content dynamically
- `scripts.js` - Core interactive functionality
- `styles.css` - Main styles for the application
- `accessible-exam.js` - Specialized code for assessments
- `accessible-exam.css` - Styles for assessment components  
- `sld-helpers.js` - Support for specific learning disabilities
- `sld-helpers.css` - Accessibility styling
- `chapter-generator.js` - Helper tool for creating new chapters
- `chapter-template.js` - Empty template for new chapter content

## Content Guidelines

### Chapter Configuration

Each chapter requires a configuration in `config.js`. Edit the `chapterConfig` object to match your content:

```javascript
const chapterConfig = {
    chapterInfo: {
        title: "Chapter Title",
        subject: "Subject Name",
        class: "Class Level",
        chapter: 1, // Chapter number
        description: "Brief description of the chapter"
    },
    
    introduction: {
        highlights: [
            { icon: "fas fa-icon-name", text: "Key point 1" },
            // Add 2-3 more highlights
        ],
        about: {
            content: `HTML content for the introduction overlay`
        }
    },
    
    topics: [
        {
            id: "topic1",
            title: "Topic Title",
            icon: "fas fa-icon-name",
            navTitle: "Short Nav Title",
            image: "images/topic-image.jpg",
            content: `HTML content for this topic`,
            question: {
                text: "Question text",
                options: ["Option 1", "Option 2", "Option 3"],
                correctAnswer: 0 // Index of correct option
            }
        },
        // Add 3-4 more topics
    ],
    
    vocabulary: [
        { word: "term", definition: "definition of the term" },
        // Add new vocabulary words
    ]
};
```

### Question Bank

The question bank in `questions.js` supports multiple question types:

1. Multiple Choice Questions (MCQs)
2. Fill in the Blanks
3. True or False
4. Matching Questions (using flip cards)
5. Short Answer Questions
6. Long Answer Questions
7. Picture-Based Questions
8. One-Word Answer Questions
9. Spelling Tests (Fill missing letters)
10. Sequence Arrangement Questions

Follow the existing format in `questions.js` to add new questions.

## Accessibility Features

This framework includes built-in accessibility features for students with specific learning disabilities:

- Text-to-speech functionality
- Dyslexic-friendly font options
- Reading guides
- High contrast mode
- Simplified UI mode
- Extra time settings

## Creating a SCORM Package

After customizing your content:

1. Test thoroughly in a web browser
2. Use a SCORM packaging tool (such as Articulate, SCORM Cloud, or Reload)
3. Import the entire folder as your source
4. Configure SCORM 1.2 or 2004 as needed for your LMS
5. Set the starting page as index.html
6. Create the package and upload to your Moodle installation

## Need Help?

Refer to the included `chapter-generator.html` tool which provides a visual interface for creating new chapter content.
