const { exec } = require("child_process");
const path = require("path");

const executePy = (filepath, input) => {
  const projectRoot = path.resolve(process.cwd());
  const codeFile = path.basename(filepath);

  const dockerCommand = `docker run -i --rm -v "${projectRoot}:/app" -w /app python:3.8-slim python codes/${codeFile}`;

  console.log("DEBUG executePy - dockerCommand:", dockerCommand);

  return new Promise((resolve, reject) => {
    const child = exec(dockerCommand, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject(stderr);
      resolve(stdout);
    });
    if (input) child.stdin.write(input);
    child.stdin.end();
  });
};

module.exports = { executePy };
