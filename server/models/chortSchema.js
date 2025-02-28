const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cohortsSchema = new Schema(
  {
    cohortSlug: {
      type: String,
      required: true,
      unique: true,
    },
    cohortName: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    campus: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    inProgress: {
      type: Boolean,
      default: false,
    },
    programManager: {
      type: String,
      required: true,
    },
    leadTeacher: {
      type: String,
      required: true,
    },
    totalHours: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Cohort model
module.exports = model("Cohort", cohortsSchema);
