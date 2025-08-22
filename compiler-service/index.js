const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const { generateFile } = require('./utils/generateFile');
const { generateInputFile } = require('./utils/generateInputFile');
const { executeCpp } = require('./executors/executeCpp');
const { executePy } = require('./executors/executePy');
const { executeJava } = require('./executors/executeJava');

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://oj-project-pi.vercel.app',
  'https://oj-project-six.vercel.app'
  // Add any other Vercel URLs you are using
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.json({ message: 'Compiler service is running!' }));

app.post('/run', async (req, res) => {
  const { language = 'cpp', code, input = '' } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  // Java executor handles its own file creation and cleanup
  if (language === 'java') {
    try {
      const output = await executeJava(code, input);
      return res.json({ success: true, output });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.stderr || e.message });
    }
  }

  let filePath = null;
  let inputPath = null;

  try {
    filePath = await generateFile(language, code);
    
    let output;
    if (language === 'cpp') {
      inputPath = await generateInputFile(input);
      output = await executeCpp(filePath, inputPath);
    } else if (language === 'python') {
      output = await executePy(filePath, input);
    } else {
      return res.status(400).json({ success: false, error: `Language '${language}' is not supported.` });
    }

    return res.json({ success: true, output });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.stderr || e.message });
  } finally {
    try { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch(err) { console.error("Error cleaning up code file:", err); }
    try { if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath); } catch(err) { console.error("Error cleaning up input file:", err); }

    if (language === 'cpp' && filePath) {
      try {
        const jobId = path.basename(filePath).split(".")[0];
        const outPath = path.join(process.cwd(), 'outputs', `${jobId}.out`);
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      } catch(err) {
        console.error("Error cleaning up output file:", err);
      }
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Compiler service listening on port ${PORT}`));