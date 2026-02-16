import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">404</h1>
      <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute">
        <span className="text-white font-bold">Page Not Found</span>
      </div>
      <p className="mt-5 text-xl font-medium md:text-2xl text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300"
        >
          Go Home
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;