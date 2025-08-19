const express = require('express');
const router = express.Router();
const { runCode } = require('../controllers/runController');
const authMiddleware = require('../middleware/authMiddleware');

// This route is protected by authMiddleware to prevent abuse of the compiler
router.post('/', authMiddleware, runCode);

module.exports = router;