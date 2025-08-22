const { exec } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");
const util = require("util");
const execPromise = util.promisify(exec);

const tempPath = path.resolve(process.cwd(), "temp");

const ensureTemp = async () => {
  await fs.mkdir(tempPath, { recursive: true });
};

const executeJava = async (code, input = "") => {
  await ensureTemp();

  const jobId = uuid();
  const jobDir = path.join(tempPath, jobId);
  const codeFile = path.join(jobDir, "Main.java");
  const inputFile = path.join(jobDir, "input.txt");

  try {
    await fs.mkdir(jobDir, { recursive: true });
    await fs.writeFile(codeFile, code);
    await fs.writeFile(inputFile, input ?? "");

    // Compile & run directly 
    // Using sh -c to handle redirection cleanly.
    const cmd = `sh -c "javac Main.java && java Main < input.txt"`;
    const { stdout } = await execPromise(cmd, { cwd: jobDir, timeout: 1000 * 15 });

    return stdout;
  } catch (error) {
    // Including stderr if present
    throw new Error(error.stderr || error.message || "Java execution failed");
  } finally {
    // cleanup
    try { await fs.rm(jobDir, { recursive: true, force: true }); } catch {}
  }
};

module.exports = { executeJava };
