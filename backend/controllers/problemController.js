const Problem = require('../models/Problem');

// @desc    Create a new problem
// @route   POST /api/problems
// @access  Private/Admin
exports.createProblem = async (req, res) => {
  const {
    title, description, difficulty, testCases,
    inputFormat, outputFormat, constraints
  } = req.body;

  try {
    const problemExists = await Problem.findOne({ title });

    if (problemExists) {
      return res.status(400).json({ message: 'Problem with this title already exists' });
    }

    const problem = new Problem({
      title,
      description,
      difficulty,
      testCases,
      inputFormat,
      outputFormat,
      constraints,
    });

    const createdProblem = await problem.save();
    res.status(201).json(createdProblem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
exports.getAllProblems = async (req, res) => {
  try {
    // Selecting only title and difficulty for the list view to keep it lightweight
    const problems = await Problem.find({}).select('title difficulty');
    res.json(problems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single problem by ID
// @route   GET /api/problems/:id
// @access  Public
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(problem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a problem
// @route   PUT /api/problems/:id
// @access  Private/Admin
exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Get all possible fields from the request body
    const {
      title, description, difficulty, testCases,
      inputFormat, outputFormat, constraints
    } = req.body;

    // Explicitly assign each field to the document
    problem.title = title;
    problem.description = description;
    problem.difficulty = difficulty;
    problem.inputFormat = inputFormat;
    problem.outputFormat = outputFormat;
    problem.constraints = constraints;
    problem.testCases = testCases;

    const updatedProblem = await problem.save();
    res.json(updatedProblem);

  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server Error');
  }
};
// @desc    Delete a problem
// @route   DELETE /api/problems/:id
// @access  Private/Admin
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({ message: 'Problem removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};