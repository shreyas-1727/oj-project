import axios from 'axios';

const API_URL = 'http://localhost:5000/run';

const runCode = async (language, code, input) => {
  const response = await axios.post(VITE_COMPILER_URL, {
    language,
    code,
    input,
  });
  return response.data;
};

export default {
  runCode,
};