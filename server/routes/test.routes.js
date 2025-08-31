const express = require("express");
const router = express.Router();
const checkJwt = require("../middlewares/auth.middleware");

// This is a public route, accessible by anyone
router.get("/api/public", (req, res) => {
  res.json({ message: "Hello from a public endpoint!" });
});

// This is a protected route, it requires a valid access token
router.get("/api/private", checkJwt, (req, res) => {
  res.json({
    message: "Hello from a private endpoint! You are authenticated.",
  });
});

module.exports = router;
