const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  code: {
    type: String,
    required: [true, 'Code submission cannot be empty'],
  },
  language: {
    type: String,
    required: true,
    enum: ['java', 'python', 'cpp'], // Add more languages as needed
  },
  status: {
    type: String,
    enum: [
      'Pending',
      'Processing',
      'Running',
      'Accepted',
      'Wrong Answer',
      'Time Limit Exceeded',
      'Compilation Error',
      'Runtime Error',
    ],
    default: 'Pending',
  },
  output: {
    type: String,
  },
}, {
  timestamps: true,
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;