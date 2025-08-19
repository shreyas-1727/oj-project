const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.resolve(process.cwd(), "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  // Get absolute paths to the folders we need to mount
  const codesPath = path.resolve(process.cwd(), "codes");
  const inputsPath = path.resolve(process.cwd(), "inputs");
  const outputsPath = path.resolve(process.cwd(), "outputs");

  // Get the unique filenames
  const codeFile = path.basename(filepath);
  const inputFile = path.basename(inputPath);
  const outputFile = path.basename(outPath);

  return new Promise((resolve, reject) => {
    const dockerCommand = `docker run --rm -v "${codesPath}:/app/codes" -v "${inputsPath}:/app/inputs" -v "${outputsPath}:/app/outputs" -w /app gcc sh -c "g++ codes/${codeFile} -o outputs/${outputFile} && ./outputs/${outputFile} < inputs/${inputFile}"`;

    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

module.exports = {
  executeCpp,
};