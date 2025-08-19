const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.resolve(__dirname, "..", "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];

  // mount project root once
  const projectRoot = process.env.HOST_PROJECT_ROOT || path.resolve(process.cwd());

  const dockerCommand = `docker run --rm \
-v "${projectRoot}:/app" \
-w /app gcc sh -c "g++ codes/${path.basename(filepath)} -o outputs/${jobId}.out && ./outputs/${jobId}.out < inputs/${path.basename(inputPath)}"`;

  console.log("DEBUG executeCpp - dockerCommand:", dockerCommand);

  return new Promise((resolve, reject) => {
    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = { executeCpp };
