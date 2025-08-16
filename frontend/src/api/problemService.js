import api from './api';

const getAllProblems = async () => {
  const response = await api.get('/problems');
  return response.data;
};

const getProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};

const deleteProblem = async (id) => {
  const response = await api.delete(`/problems/${id}`);
  return response.data;
};

const createProblem = async (problemData) => {
  const response = await api.post('/problems', problemData);
  return response.data;
};

const updateProblem = async (id, problemData) => {
  const response = await api.put(`/problems/${id}`, problemData);
  return response.data;
};

export default {
  getAllProblems,
  getProblemById,
  deleteProblem,
  createProblem,
  updateProblem,
};