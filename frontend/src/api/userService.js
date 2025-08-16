import api from './api';

const getMySubmissions = async () => {
  const response = await api.get('/submissions/me');
  return response.data;
};

export default {
  getMySubmissions,
};