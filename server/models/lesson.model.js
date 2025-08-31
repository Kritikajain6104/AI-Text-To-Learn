const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true }, // [cite: 115]
  content: { type: [mongoose.Schema.Types.Mixed], required: true }, // [cite: 116]
  isEnriched: { type: Boolean, default: false }, // [cite: 117]
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }, // [cite: 117, 118]
});

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
