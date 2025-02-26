
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const studentSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  linkedinUrl: {
    type: String
  },
  languages: {
    type: [String],
    default: []  
  },
  program: {
    type: String,
    required: true
  },
  background: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  cohort: {
    type: Number,
    required: true
  },
  projects: {
    type: [Schema.Types.Mixed],
    default: []  
}, {
  timestamps: true  
});

module.exports = model('Student', studentSchema);
