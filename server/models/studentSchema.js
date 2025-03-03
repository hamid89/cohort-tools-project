const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const studentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  languages: {
    type: [String],
    required: true,
  },
  program: {
    type: String,
  },
  background: {
    type: String,
  },
  image: {
    type: String,
  },
  cohort: {
    type: Schema.Types.ObjectId,
    ref: "Cohort",
  },
  projects: {
    type: [Schema.Types.Mixed],
    default: [],
  },
});

module.exports = model("Student", studentSchema);
