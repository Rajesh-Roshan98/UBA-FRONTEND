import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="relative">
        <h1 className="text-9xl font-bold text-red-500 opacity-20">403</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl font-bold text-red-600">Access Denied</h2>
        </div>
      </div>
      
      <p className="mt-4 text-lg text-gray-600 text-center max-w-md">
        You do not have permission to view this page. If you believe this is an error, please contact your system administrator.
      </p>

      <div className="mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-md mr-4"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;