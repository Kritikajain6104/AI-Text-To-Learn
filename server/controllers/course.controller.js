const { generateCourseOutline } = require("../services/ai.service");
const Course = require("../models/course.model");
const Module = require("../models/module.model");
const Lesson = require("../models/lesson.model");

exports.generateCourseController = async (req, res) => {
  // 1. Get the topic from the user's request body
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ message: "Topic is required." });
  }

  // 2. Get the authenticated user's ID from the token
  const userId = req.auth.payload.sub;

  try {
    // 3. Call the AI service to get the course outline
    console.log("Generating course outline from AI...");
    const aiCourseOutline = await generateCourseOutline(topic);

    // 4. Create the main Course document
    const newCourse = new Course({
      title: aiCourseOutline.title,
      description: aiCourseOutline.description,
      tags: aiCourseOutline.tags,
      creator: userId,
    });

    // 5. Create Module and Lesson documents and link them together
    const modulePromises = aiCourseOutline.modules.map(async (moduleData) => {
      const newModule = new Module({
        title: moduleData.title,
        course: newCourse._id,
      });

      const lessonPromises = moduleData.lesson_titles.map(
        async (lessonTitle) => {
          const newLesson = new Lesson({
            title: lessonTitle,
            module: newModule._id,
            content: [], // Content will be generated later
          });
          await newLesson.save();
          return newLesson._id; // Return the ID of the saved lesson
        }
      );

      newModule.lessons = await Promise.all(lessonPromises);
      await newModule.save();
      return newModule._id; // Return the ID of the saved module
    });

    newCourse.modules = await Promise.all(modulePromises);
    await newCourse.save();

    // 6. Respond to the user with the newly created course data
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error in course generation controller:", error);
    res.status(500).json({ message: "Failed to generate course." });
  }
};

// Add this new function to the file
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: "modules",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Optional: Check if the user is the creator of the course
    // if (course.creator !== req.auth.payload.sub) {
    //   return res.status(403).json({ message: 'User not authorized to view this course' });
    // }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ message: "Server error while fetching course." });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const courses = await Course.find({ creator: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};
