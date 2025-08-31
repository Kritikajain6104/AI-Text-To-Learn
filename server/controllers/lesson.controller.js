const Lesson = require("../models/lesson.model");
const Module = require("../models/module.model");
const Course = require("../models/course.model");
const { generateLessonContent } = require("../services/ai.service");

exports.generateLessonContentController = async (req, res) => {
  console.log("--- Received request to generate lesson content ---");
  try {
    const { lessonId } = req.params;
    console.log(`[LOG] 1. Lesson ID from request: ${lessonId}`);

    const lesson = await Lesson.findById(lessonId).populate({
      path: "module",
      model: "Module",
      populate: {
        path: "course",
        model: "Course",
      },
    });

    console.log("[LOG] 2. Result from database query:", lesson);

    if (!lesson || !lesson.module || !lesson.module.course) {
      console.error(
        "[ERROR] 3. Could not find complete lesson, module, or course link."
      );
      return res
        .status(404)
        .json({ message: "Lesson, module, or course not found" });
    }

    console.log("[LOG] 3. Found complete lesson, module, and course data.");

    if (lesson.isEnriched) {
      console.log(
        "[INFO] 4. Lesson content already exists. Returning existing content."
      );
      return res.status(200).json(lesson);
    }

    const courseTitle = lesson.module.course.title;
    const moduleTitle = lesson.module.title;
    const lessonTitle = lesson.title;

    console.log(
      `[LOG] 4. Calling AI service with: Course="${courseTitle}", Module="${moduleTitle}", Lesson="${lessonTitle}"`
    );
    const generatedContent = await generateLessonContent(
      courseTitle,
      moduleTitle,
      lessonTitle
    );

    console.log("[LOG] 5. Received content from AI service.");

    lesson.content = generatedContent;
    lesson.isEnriched = true;
    await lesson.save();

    console.log(
      "[LOG] 6. Saved lesson to database. Sending response to client."
    );
    res.status(200).json(lesson);
  } catch (error) {
    console.error(
      "[FATAL ERROR] 7. An error occurred in the controller:",
      error
    );
    res.status(500).json({ message: "Failed to generate lesson content" });
  }
};
