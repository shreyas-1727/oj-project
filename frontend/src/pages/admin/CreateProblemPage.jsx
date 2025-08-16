import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import problemService from '../../api/problemService';

const CreateProblemPage = () => {
  const [problem, setProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    testCases: [{ input: '', output: '' }],
  });
  //const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedTestCases = [...problem.testCases];
    // Handle checkbox and text inputs differently
    updatedTestCases[index][name] = type === 'checkbox' ? checked : value;
    setProblem({ ...problem, testCases: updatedTestCases });
  };

  const addTestCase = () => {
    setProblem({
      ...problem,
      testCases: [...problem.testCases, { input: '', output: '', isSample: false }],
    });
  };

  const removeTestCase = (index) => {
    const updatedTestCases = problem.testCases.filter((_, i) => i !== index);
    setProblem({ ...problem, testCases: updatedTestCases });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await problemService.createProblem(problem);
      toast.success('Problem created successfully!');
      navigate('/admin');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create problem.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto p-4 text-gray-900 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Problem</h1>

        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          &larr; Back to Dashboard
        </button>

      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input type="text" name="title" value={problem.title} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea name="description" value={problem.description} onChange={handleChange} rows="6" required className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm"></textarea>
        </div>
        <div>
          <label htmlFor="difficulty" className="block font-medium">Difficulty</label>
          <select name="difficulty" value={problem.difficulty} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="inputFormat" className="block font-medium">Input Format</label>
          <textarea name="inputFormat" value={problem.inputFormat} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm"></textarea>
        </div>
        <div>
          <label htmlFor="outputFormat" className="block font-medium">Output Format</label>
          <textarea name="outputFormat" value={problem.outputFormat} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm"></textarea>
        </div>
        <div>
          <label htmlFor="constraints" className="block font-medium">Constraints</label>
          <textarea name="constraints" value={problem.constraints} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm"></textarea>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Test Cases</h2>
          {problem.testCases.map((tc, index) => (
            <div key={index} className="space-y-2 border-t dark:border-gray-700 pt-4 mt-4">
              <label className="block font-medium">Test Case {index + 1}</label>
              <textarea name="input" value={tc.input} onChange={(e) => handleTestCaseChange(index, e)} placeholder="Input" rows="3" className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm"></textarea>
              <textarea name="output" value={tc.output} onChange={(e) => handleTestCaseChange(index, e)} placeholder="Expected Output" rows="3" className="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm"></textarea>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isSample"
                  checked={tc.isSample || false}
                  onChange={(e) => handleTestCaseChange(index, e)}
                  className="h-4 w-4 rounded"
                />
                <label className="text-sm">Make this a sample test case</label>
              </div>

              <button type="button" onClick={() => removeTestCase(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addTestCase} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Test Case</button>
        </div>

        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Create Problem</button>
      </form>
    </div>
  );
};

export default CreateProblemPage;