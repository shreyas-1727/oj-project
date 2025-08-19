const { exec } = require("child_process");
const fs = require("fs/promises"); // Using the promise-based version of fs
const path = require("path");
const { v4: uuid } = require("uuid");
const util = require("util");
const execPromise = util.promisify(exec); // Promisify exec for async/await

const tempPath = path.resolve(process.cwd(), "temp");

// Creating temp directory once on startup
(async () => {
  try {
    await fs.mkdir(tempPath, { recursive: true });
  } catch (error) {
    console.error("Error creating temp directory:", error);
  }
})();

const executeJava = async (code, input = '') => {
  const jobId = uuid();
  const jobPath = path.join(tempPath, jobId);
  const codeFilePath = path.join(jobPath, "Main.java");
  const inputFilePath = path.join(jobPath, "input.txt");

  try {
    //Creating unique directory and files using async/await
    await fs.mkdir(jobPath, { recursive: true });
    await fs.writeFile(codeFilePath, code);
    await fs.writeFile(inputFilePath, input);

    //Constructing the Docker command to use the files
    const dockerCommand = `docker run --rm \
      -v "${jobPath}:/app" \
      -w /app openjdk:11-slim sh -c "javac Main.java && java Main < input.txt"`;

    // Executing the command
    const { stdout, stderr } = await execPromise(dockerCommand);

    if (stderr) {
      // Throw stderr to be caught by the catch block
      throw new Error(stderr);
    }

    return stdout;

  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  } finally {
    //Ensuring cleanup always happens
    try {
      await fs.rm(jobPath, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }
  }
};

module.exports = {
  executeJava,
};