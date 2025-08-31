const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const checkJwt = require("../middlewares/auth.middleware");

// @route   POST /api/courses/generate
// @desc    Generate a new course from a topic using AI
// @access  Private
router.post("/generate", checkJwt, courseController.generateCourseController);

// GET /api/courses/my-courses
router.get("/my-courses", checkJwt, courseController.getMyCourses);

// GET /api/courses/:courseId
router.get("/:courseId", checkJwt, courseController.getCourseById);

module.exports = router;
