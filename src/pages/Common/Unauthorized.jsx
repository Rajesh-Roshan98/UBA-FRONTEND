import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  // 🔥 FIX: Bulletproof refresh detection using sessionStorage
  useEffect(() => {
    // Check if the user is already on this page before the mount
    const isRefresh = sessionStorage.getItem('unauth_locked');

    if (isRefresh) {
      // If it exists, the browser was refreshed! Clear it and bounce to Home.
      sessionStorage.removeItem('unauth_locked');
      navigate("/", { replace: true });
    } else {
      // Normal click from a protected route. Mark the page as visited.
      sessionStorage.setItem('unauth_locked', 'true');
    }

    // Cleanup: When the user leaves naturally (clicks Go Back), remove the lock
    return () => {
      sessionStorage.removeItem('unauth_locked');
    };
  }, [navigate]);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="relative">
        {/* Note: Kept your 404 text here as requested! */}
        <h1 className="text-9xl font-bold text-red-500 opacity-20">404</h1>
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
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-md mr-4 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;