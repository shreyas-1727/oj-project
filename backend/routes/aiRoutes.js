const express = require('express');
const router = express.Router();
const { explainCode } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/explain', authMiddleware, explainCode);

module.exports = router;