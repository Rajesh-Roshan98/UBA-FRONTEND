import { Server } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Error page component that displays different HTTP error codes.
 * Defaults to 500 (Internal Server Error) for backward compatibility.
 *
 * @param {Object} props
 * @param {number} [props.code=500] - HTTP status code (404, 500, 503, etc.)
 */
const ServerError = ({ code = 500 }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const headingRef = useRef(null);

  // Pull loading state directly from AuthContext
  const { loading } = useAuth(); 

  // Network state
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 🔥 FIX: Replaced 'api' with native 'fetch' to bypass the global interceptor.
  // This stops the interceptor from catching the 500 error and forcing an infinite redirect loop!
  useEffect(() => {
    // Wait for AuthContext to finish its check so we don't conflict
    if (!loading) {
      const checkServerRecovery = async () => {
        try {
          const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
          
          // Quietly ping the backend using NATIVE FETCH (bypasses api.js interceptors)
          const response = await fetch(`${baseUrl}/api/v1/getUserDetail`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          // If the server responds with anything successful OR a normal auth error (401), it's alive!
          if (response.status < 500) {
            let lastPath = sessionStorage.getItem('lastValidPath') || '/';
            
            // Safety fallback: Never redirect back to the error page itself
            if (lastPath.includes('/server-error')) {
              lastPath = '/';
            }
            
            window.location.href = lastPath;
          }
          // If response.status is 500+, we do nothing. The server is still down, stay on the page.
          
        } catch (error) {
          // Network completely unreachable. Do nothing, safely stay on the Error Page.
        }
      };

      checkServerRecovery();
    }
  }, [loading]);

  // Map error codes to display messages
  const errorMessages = {
    404: {
      title: '404',
      badge: 'Page Not Found',
      description: "The page you're looking for doesn't exist or has been moved.",
    },
    500: {
      title: '500',
      badge: 'Internal Server Error',
      description: 'Sorry, something went wrong on our end.',
    },
    503: {
      title: '503',
      badge: 'Service Unavailable',
      description: 'The service is temporarily unavailable. Please try again later.',
    },
  };

  // Use the provided code or fallback to 500
  const { title, badge, description } = errorMessages[code] || errorMessages[500];

  // Move focus to the heading for screen readers (accessibility)
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  // Log the error to an analytics/monitoring service (e.g., Sentry, Google Analytics)
  useEffect(() => {
    if (window.analytics) {
      window.analytics.logEvent('error_page_view', {
        error_code: code,
        path: window.location.pathname,
      });
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Error page viewed: ${code} at ${window.location.href}`);
      }
    }
  }, [code]);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto‑recover when the internet comes back online
  useEffect(() => {
    const handleOnline = () => {
      let lastPath = sessionStorage.getItem('lastValidPath') || '/';
      if (lastPath.includes('/server-error')) lastPath = '/';
      
      // Must use window.location.href to unfreeze AuthContext state
      window.location.href = lastPath; 
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Show a spinner while awaiting AuthContext loading. 
  // Because Navbar also waits for this same state, they will render simultaneously!
  if (loading) {
    return (
      <div className="w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gray-100 text-gray-800">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 font-medium text-gray-500">Awaiting server response...</p>
      </div>
    );
  }

  return (
    <main
      role="main"
      className="w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gray-100 text-gray-800"
    >
      <h1
        ref={headingRef}
        tabIndex={-1} // Make it programmatically focusable without adding to tab order
        className="text-9xl font-extrabold text-blue-600 tracking-widest outline-none"
      >
        {title}
      </h1>
      <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute">
        <span className="text-white font-bold">{badge}</span>
      </div>
      <p className="mt-5 text-xl font-medium md:text-2xl text-gray-600">
        {!isOnline
          ? 'You are offline. Please check your internet.'
          : description}
      </p>
    </main>
  );
};

export default ServerError;