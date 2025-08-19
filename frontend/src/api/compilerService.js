//import axios from 'axios';
import api from './api';
//const API_URL = import.meta.env.VITE_COMPILER_URL || 'http://localhost:5000/run';
const runCode = async (language, code, input) => {
  const response = await api.post('/run', {
    language,
    code,
    input,
  });
  return response.data;
};

export default {
  runCode,
};