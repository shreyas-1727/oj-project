const { spawn } = require("child_process");
const path = require("path");

const executePy = (filepath, input = "") => {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", ["-u", filepath], {
      cwd: process.cwd()
    });

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (d) => (stdout += d.toString()));
    py.stderr.on("data", (d) => (stderr += d.toString()));

    py.on("error", (err) => reject({ message: "Failed to start python3", error: err }));

    py.on("close", (code) => {
      if (code !== 0) return reject({ message: `Python exited with code ${code}`, stderr, stdout });
      resolve(stdout);
    });

    // pipe input
    if (input) py.stdin.write(input);
    py.stdin.end();
  });
};

module.exports = { executePy };
