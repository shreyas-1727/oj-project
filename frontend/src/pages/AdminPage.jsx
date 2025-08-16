import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import problemService from '../api/problemService';
import { confirmAlert } from 'react-confirm-alert';

const AdminPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemService.getAllProblems();
        setProblems(data);
      } catch (err) {
        toast.error('Failed to fetch problems.'); // Using toast for initial fetch error
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleDelete = (id, title) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Deletion</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Are you sure you want to delete the problem "{title}"?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  try {
                    await problemService.deleteProblem(id);
                    setProblems(problems.filter((p) => p._id !== id));
                    toast.success('Problem deleted successfully!');
                  } catch (err) {
                    toast.error('Failed to delete problem.');
                  }
                  onClose();
                }}
              >
                Yes, Delete it!
              </button>
            </div>
          </div>
        );
      }
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 text-gray-900 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Problems</h1>
        <Link
          to="/admin/create"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Create New Problem
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {problems.map((problem) => (
              <tr key={problem._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap">{problem.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{problem.difficulty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/edit/${problem._id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(problem._id, problem.title)}
                    className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;