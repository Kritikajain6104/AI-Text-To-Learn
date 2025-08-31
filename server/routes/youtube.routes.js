const express = require("express");
const router = express.Router();
const youtubeController = require("../controllers/youtube.controller");
const checkJwt = require("../middlewares/auth.middleware");

router.get("/search", checkJwt, youtubeController.searchVideos);

module.exports = router;
