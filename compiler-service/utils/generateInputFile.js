const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

// Point to the root of the service to create an 'inputs' folder
const dirInputs = path.join(process.cwd(), 'inputs');

if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
    const jobID = uuid();
    const inputFilename = `${jobID}.txt`;
    const inputFilePath = path.join(dirInputs, inputFilename);
    await fs.writeFileSync(inputFilePath, input);
    return inputFilePath;
};

module.exports = {
    generateInputFile,
};
