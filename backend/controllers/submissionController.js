const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const axios = require('axios');

// @desc    Create a new submission for a problem
// @route   POST /api/submissions/:problemId
// @access  Private
exports.createSubmission = async (req, res) => {
  const { problemId } = req.params;
  const { code, language } = req.body;
  const userId = req.user.id;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: 'Processing',
    });

    let finalVerdict = 'Accepted';
    let finalOutput = '';
    let passedCount = 0;

    for (const testCase of problem.testCases) {

      try {
        // Calling the compiler service's /run endpoint
        const response = await axios.post(process.env.COMPILER_API_URL, {
          language,
          code,
          input: testCase.input,
        });

        const output = response.data.output.trim();

        if (output !== testCase.output.trim()) {
          finalVerdict = 'Wrong Answer';
          finalOutput = `Wrong Answer on Test Case #${passedCount + 1}\n\nInput:\n${testCase.input}\n\nExpected Output:\n${testCase.output}\n\nYour Output:\n${output}`;
          break;
        }
        passedCount++;
      } catch (err) {
        finalVerdict = 'Runtime Error';
        finalOutput = err.response?.data?.error || 'An error occurred during execution.';
        break;
      }
    }

    submission.status = finalVerdict;
    submission.output = finalOutput || `Accepted: Passed ${passedCount}/${problem.testCases.length} test cases.`;
    await submission.save();

    res.status(201).json(submission);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all submissions for the logged-in user
// @route   GET /api/submissions/me
// @access  Private
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate('problemId', 'title') // Get the problem title
      .sort({ createdAt: -1 }); // Show the most recent first

    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};