const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a course outline using the Gemini AI model.
 * @param {string} topic - The topic for which to generate the course.
 * @returns {Promise<object>} A promise that resolves to the structured course JSON object.
 */
const generateCourseOutline = async (topic) => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // This is the prompt engineering part. We are instructing the AI on exactly what to do.
    const prompt = `
      You are an expert curriculum designer. Your task is to generate a comprehensive course outline for the topic: "${topic}".

      The output must be a raw JSON object only, without any markdown formatting (e.g., no \`\`\`json).

      The JSON object must have the following structure:
      - A "title" (string) for the course.
      - A "description" (string) summarizing the course.
      - An array of "tags" (string[]) related to the topic.
      - An array of "modules" (object[]), where each module has:
        - A "title" (string).
        - An array of "lesson_titles" (string[]).

      Ensure there are between 3 to 6 modules, and each module has between 3 to 5 lesson titles.
      The curriculum should progress logically from basic to advanced concepts.

      Here is an example structure:
      {
        "title": "Example Course Title",
        "description": "An example course description.",
        "tags": ["example", "learning"],
        "modules": [
          {
            "title": "Module 1: Introduction",
            "lesson_titles": ["Lesson 1.1", "Lesson 1.2"]
          },
          {
            "title": "Module 2: Core Concepts",
            "lesson_titles": ["Lesson 2.1", "Lesson 2.2"]
          }
        ]
      }

      Now, generate the JSON for the topic: "${topic}".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // The AI might still wrap the JSON in markdown, so we'll clean it.
    let cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    cleanedText = cleanedText.replace(/,\s*([\]}])/g, "$1");

    // Parse the cleaned text into a JSON object
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating course outline from AI:", error);
    throw new Error("Failed to generate course outline. Please try again.");
  }
};

/**
 * Generates detailed content for a single lesson.
 * @param {string} courseTitle - The title of the course.
 * @param {string} moduleTitle - The title of the module.
 * @param {string} lessonTitle - The title of the lesson to generate content for.
 * @returns {Promise<object[]>} A promise that resolves to an array of content blocks.
 */
const generateLessonContent = async (courseTitle, moduleTitle, lessonTitle) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert instructional designer creating content for an online course.
      Course: "${courseTitle}"
      Module: "${moduleTitle}"
      Lesson: "${lessonTitle}"

      Your task is to generate the lesson content in a raw JSON array format. Do not include any markdown formatting.

      The array must contain objects with a "type" field and corresponding content. Include the following types:
      1.  "heading": for titles and subtitles.
      2.  "paragraph": for explanatory text. Use Markdown for formatting like **bold** or *italics*.
      3.  "code": if the topic is technical. Include a "language" and "text" field.
      4.  "video": Generate a concise, effective YouTube search query for a relevant video. The object must have a "query" field.
      5.  "mcq": At the end of the lesson, include one multiple-choice question to test understanding. The object must have:
          - a "question" (string).
          - an "options" (array of strings).
          - an "answer" (number, representing the index of the correct option).
          - an "explanation" (string, explaining why the answer is correct).

      Example structure:
      [
        { "type": "heading", "text": "Key Concepts" },
        { "type": "paragraph", "text": "This is an important concept. Make sure to **understand** it well." },
        { "type": "video", "query": "What is a linked list data structure explained" },
        { "type": "mcq", "question": "What is the primary benefit of a linked list over an array?", "options": ["Faster access to elements by index", "Dynamic size", "Elements are stored contiguously in memory"], "answer": 1, "explanation": "Linked lists can easily grow or shrink in size, which is a major advantage over arrays that have a fixed size." }
      ]

      Now, generate the complete JSON content for the lesson: "${lessonTitle}".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    let cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    cleanedText = cleanedText.replace(/,\s*([\]}])/g, "$1");

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating lesson content from AI:", error);
    throw new Error("Failed to generate lesson content from AI.");
  }
};

module.exports = { generateCourseOutline, generateLessonContent };
