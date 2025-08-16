const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
  },
  output: {
    type: String,
  },
  isSample: {
    type: Boolean,
    default: false,
  },
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Problem description is required'],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty is required'],
  },
  inputFormat: {
    type: String,
  },
  outputFormat: {
    type: String,
  },
  constraints: {
    type: String,
  },
  testCases: [testCaseSchema], // Array of test cases
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;