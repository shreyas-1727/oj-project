const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Keep writing outputs to existing outputs/ dir
const outputPath = path.resolve(process.cwd(), "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  // Compile + run directly inside the same container 
  const cmd = `g++ "${filepath}" -O2 -std=c++17 -o "${outPath}" && "${outPath}" < "${inputPath}"`;

  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: process.cwd(), timeout: 1000 * 10 }, (error, stdout, stderr) => {
      if (error) {
        // Including both stdout/stderr to help debugging compile vs runtime errors
        return reject({ message: "C++ execution failed", stdout, stderr });
      }
      resolve(stdout);
    });
  });
};

module.exports = { executeCpp };
