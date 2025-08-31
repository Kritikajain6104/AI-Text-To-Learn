const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // [cite: 99]
    description: String, // [cite: 100]
    creator: { type: String, required: true }, // [cite: 101]
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }], // [cite: 102]
    tags: [{ type: String, trim: true }], // [cite: 103]
  },
  { timestamps: true }
); // [cite: 104]

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
