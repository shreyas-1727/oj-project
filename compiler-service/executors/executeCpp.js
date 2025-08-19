const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Get the absolute path to the outputs directory
const outputPath = path.resolve(__dirname, '..', 'outputs');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    // Constructing the Docker command
    const dockerCommand = `docker run --rm \
      -v "${path.dirname(filepath)}:/app" \
      -v "${path.dirname(inputPath)}:/app" \
      -v "${outputPath}:/app/outputs" \
      -w /app gcc sh -c "g++ ${path.basename(filepath)} -o outputs/${jobId}.out && ./outputs/${jobId}.out < ${path.basename(inputPath)}"`;

    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        // This includes compilation errors or runtime errors
        reject({ error, stderr });
      } else if (stderr) {
        // This catches warnings or other standard error output
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

module.exports = {
  executeCpp,
};