import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex-grow flex items-center justify-center text-center">
      <div className="p-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          Sharpen Your Coding Skills
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Practice data structures and algorithms with a curated set of coding challenges. Get instant feedback on your solutions and prepare for your next technical interview.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          </Link>
          <Link
            to="/problems"
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            Browse Problems
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;