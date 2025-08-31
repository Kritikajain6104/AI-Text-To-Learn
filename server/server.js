// Load environment variables from .env file
require("dotenv").config();
const testRoutes = require("./routes/test.routes");
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const youtubeRoutes = require("./routes/youtube.routes");
const express = require("express");

// Create the Express app
const app = express();
const cors = require("cors");

// Add your Vercel frontend URL to the list of allowed origins
const allowedOrigins = [
  "http://localhost:5173", // For local development
  "https://text-to-learn-l74ouray4-kritika-jains-projects.vercel.app", // Your live frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
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
