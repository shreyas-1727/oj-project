const { exec } = require("child_process");
const path = require("path");

const executePy = (filepath, input) => {
  const codesPath = path.resolve(process.cwd(), "codes");
  const codeFile = path.basename(filepath);

  return new Promise((resolve, reject) => {
    const dockerCommand = `docker run -i --rm -v "${codesPath}:/app/codes" -w /app python:3.8-slim python codes/${codeFile}`;

    const childProcess = exec(
      dockerCommand,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
    childProcess.stdin.write(input);
    childProcess.stdin.end();
  });
};

module.exports = {
  executePy,
};