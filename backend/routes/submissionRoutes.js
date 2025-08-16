const express = require('express');
const router = express.Router();
const { createSubmission,
    getMySubmissions
} = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all submissions for the current user
router.get('/me', authMiddleware, getMySubmissions);

// The route to create a submission for a specific problem
router.post('/:problemId', authMiddleware, createSubmission);

module.exports = router;