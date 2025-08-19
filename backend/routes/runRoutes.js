console.log("✅ runRoutes.js loaded");
const express = require('express');
const router = express.Router();
const { runCode } = require('../controllers/runController');
const authMiddleware = require('../middleware/authMiddleware');

// This route is protected by authMiddleware to prevent abuse of the compiler
//router.post('/', authMiddleware, runCode);
router.post('/', authMiddleware, (req, res, next) => {
  console.log("🔥 /api/run hit with body:", req.body);
  next();
}, runCode);

module.exports = router;