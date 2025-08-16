import api from './api';

const explainCode = async (problemTitle, language, code) => {
  const response = await api.post('/ai/explain', { problemTitle, language, code });
  return response.data;
};

export default {
  explainCode,
};