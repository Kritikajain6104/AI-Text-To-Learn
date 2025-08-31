// Load environment variables from .env file
require("dotenv").config();
const testRoutes = require("./routes/test.routes");
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const youtubeRoutes = require("./routes/youtube.routes");
const express = require("express");
const cors = require("cors");

// Create the Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

const connectDB = require("./config/database"); // <-- IMPORT HERE

// Connect to the database
connectDB(); // <-- CALL THE FUNCTION HERE
app.use(testRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/youtube", youtubeRoutes);
// A simple test route to check if the server is running
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is up and running!" });
});

// Get the port from environment variables, with a default value
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
