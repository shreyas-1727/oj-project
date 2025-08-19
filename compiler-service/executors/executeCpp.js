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

  // project root on host
  const projectRoot = path.resolve(process.cwd());

  return new Promise((resolve, reject) => {
    // Constructing the Docker command
    const dockerCommand = `docker run --rm \
      -v "${projectRoot}:/app" \
      -w /app gcc sh -c "g++ codes/${path.basename(filepath)} -o outputs/${jobId}.out && ./outputs/${jobId}.out < inputs/${path.basename(inputPath)}"`;

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