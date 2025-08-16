import api from './api';

const createSubmission = async (problemId, code, language) => {
  const response = await api.post(`/submissions/${problemId}`, { code, language });
  return response.data;
};

export default {
  createSubmission,
};