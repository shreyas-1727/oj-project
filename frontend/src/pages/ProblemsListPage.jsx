import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import problemService from '../api/problemService';
import toast from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';

const ProblemsListPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemService.getAllProblems();
        setProblems(data);
      } catch (err) {
        toast.error('Failed to fetch problems.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold my-6"><SkeletonLoader className="h-8 w-48" /></h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <SkeletonLoader className="h-6 w-1/2" />
                <SkeletonLoader className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-6 text-gray-900 dark:text-white">Problem Set</h1>

      <div className="space-y-4">
        {problems.map((problem) => (
          <Link
            to={`/problem/${problem._id}`}
            key={problem._id}

            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl hover:border-indigo-300 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-indigo-500"
          >
            <div className="flex justify-between items-center">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {problem.title}
              </h5>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                  }`}
              >
                {problem.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProblemsListPage;