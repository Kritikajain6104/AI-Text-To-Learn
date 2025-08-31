const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lesson.controller");
const checkJwt = require("../middlewares/auth.middleware");

// POST /api/lessons/:lessonId/generate
router.post(
  "/:lessonId/generate",
  checkJwt,
  lessonController.generateLessonContentController
);

module.exports = router;
