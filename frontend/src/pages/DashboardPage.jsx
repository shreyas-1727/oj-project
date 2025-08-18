import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import userService from '../api/userService';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchSubmissions = async () => {
  //     try {
  //       const data = await userService.getMySubmissions();
  //       setSubmissions(data);
  //     } catch (err) {
  //       setError('Failed to fetch submission history.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSubmissions();
  // }, []);

  useEffect(() => {
    //let isMounted = true; // Flag to prevent state updates on unmounted component
    console.log("--- DashboardPage MOUNTED ---");
    const fetchSubmissions = async () => {
      console.log("Fetching submissions...");
      try {
        const data = await userService.getMySubmissions();
        console.log("Data received:", data);
        //if (isMounted) { // Only update state if the component is still mounted
          setSubmissions(data);
        //}
      } catch (err) {
        console.error("Fetch failed:", err);
        //if (isMounted) {
          //setError('Failed to fetch submission history.');
          toast.error('Failed to fetch submission history.');
        //}
      } finally {
        //if (isMounted) {
          setLoading(false);
        //}
      }
    };

    fetchSubmissions();

    // This is the cleanup function
    // It runs when the component "unmounts" (e.g., during the Strict Mode double-run)
    return () => {
      console.log("--- DashboardPage UNMOUNTED ---");
      //isMounted = false;
    };
  }, []); // The empty dependency array is correct

  if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6"><SkeletonLoader className="h-8 w-64" /></h1>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
                    <SkeletonLoader className="h-6 w-1/3 mb-4" />
                    <SkeletonLoader className="h-4 w-1/2 mb-2" />
                    <SkeletonLoader className="h-4 w-1/2 mb-2" />
                    <SkeletonLoader className="h-4 w-1/4" />
                </div>
                <h2 className="text-2xl font-semibold mb-4"><SkeletonLoader className="h-7 w-48" /></h2>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <SkeletonLoader className="h-40 w-full" />
                </div>
            </div>
        );
    }
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Welcome, {user?.username}!
      </h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Profile</h2>
        <p className="dark:text-gray-300"><strong>Username:</strong> {user?.username}</p>
        <p className="dark:text-gray-300"><strong>Email:</strong> {user?.email}</p>
        <p className="dark:text-gray-300"><strong>Role:</strong> {user?.role}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Submissions</h2>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Problem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                  <Link to={`/problem/${sub.problemId?._id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    {sub.problemId?.title || 'Problem not found'}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sub.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{sub.language}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(sub.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {submissions.length === 0 && (
          <p className="text-center p-4 text-gray-500 dark:text-gray-400">
            You haven't made any submissions yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;