import React from 'react';

const SkeletonLoader = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}></div>
  );
};

export default SkeletonLoader;