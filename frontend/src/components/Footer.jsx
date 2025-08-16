import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4 text-center mt-auto shadow-inner">
      <div className="container mx-auto">
        <p>&copy; {currentYear} OnlineJudge. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;