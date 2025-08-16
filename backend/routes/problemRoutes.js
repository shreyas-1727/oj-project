const express = require('express');
const router = express.Router();
const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem, 
} = require('../controllers/problemController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Routes for /api/problems
router.route('/')
  .post(authMiddleware, adminMiddleware, createProblem)
  .get(getAllProblems);

// Routes for /api/problems/:id
router.route('/:id')
  .get(getProblemById)
  .put(authMiddleware, adminMiddleware, updateProblem)
  .delete(authMiddleware, adminMiddleware, deleteProblem);

module.exports = router;