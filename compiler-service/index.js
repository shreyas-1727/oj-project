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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.json({ message: 'Compiler service is running!' });
});

app.post('/run', async (req, res) => {
  const { language = 'cpp', code, input } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code!" });
  }

  // Java executor handles its own file creation and cleanup
  if (language === 'java') {
    try {
      const output = await executeJava(code, input);
      return res.json({ success: true, output });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.stderr || error.message });
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
    }

    return res.json({ success: true, output });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.stderr || error.message });
  } finally {
    // Cleanup for C++ and Python
    if (filePath) fs.unlinkSync(filePath);
    if (inputPath) fs.unlinkSync(inputPath);
    
    if (language === 'cpp' && filePath) {
      const jobId = path.basename(filePath).split(".")[0];
      const outPath = path.join(__dirname, 'outputs', `${jobId}.out`);
      if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Compiler service listening on port ${PORT}`);
});