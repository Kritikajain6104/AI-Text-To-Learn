const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // [cite: 108]
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // [cite: 109]
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // [cite: 109]
  },
  { timestamps: true }
); // [cite: 110]

const Module = mongoose.model("Module", moduleSchema);
module.exports = Module;
