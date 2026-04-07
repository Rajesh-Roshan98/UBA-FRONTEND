import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import { ServerCrash, WifiOff, AlertCircle } from 'lucide-react'; 
import { redirect } from "../../services/navigationService"; 

/**
 * Error page component that displays different HTTP error codes.
 * Defaults to 500 (Internal Server Error) for backward compatibility.
 *
 * @param {Object} props
 * @param {number} [props.code] - HTTP status code (404, 500, 502, 503, 504, etc.)
 */
const ServerError = ({ code: propCode }) => { 
  const navigate = useNavigate();
  const location = useLocation(); 
  const [searchParams] = useSearchParams(); 
  const headingRef = useRef(null);

  // Bulletproof URL parameter extraction. 
  const extractCodeFromUrl = () => {
    let extracted = searchParams.get("code");
    
    if (!extracted && typeof window !== 'undefined') {
      extracted = new URLSearchParams(window.location.search).get("code");
    }
    
    if (!extracted && typeof window !== 'undefined' && window.location.hash.includes('?')) {
      const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
      extracted = hashParams.get("code");
    }
    
    return parseInt(extracted, 10);
  };

  const parsedUrlCode = extractCodeFromUrl();
  const initialCode = !isNaN(parsedUrlCode) ? parsedUrlCode : (propCode || 500);

  const [code, setCode] = useState(initialCode);

  // 🔥 THE NEW FIX: Make the UI blindly trust the URL from api.js!
  // Instead of overwriting the URL, we listen to it. If api.js changes the URL from 503 to 504, 
  // this effect catches it and updates the screen automatically.
  useEffect(() => {
    const currentUrlCode = parseInt(searchParams.get("code"), 10);
    if (!isNaN(currentUrlCode) && currentUrlCode !== code) {
      setCode(currentUrlCode); 
    }
  }, [searchParams, code]);

  // We still import this just in case, but we will NOT let it block the UI anymore!
  const { loading } = useAuth(); 

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Set initial pinging to FALSE. We want this page to render instantly!
  const [isPinging, setIsPinging] = useState(false);

  // 🔥 REMOVED: handlePingError
  // We no longer want this component guessing if it's a 503 or 504.
  // api.js handles all dynamic parsing now!

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    if (code !== 404) {
      const checkServerRecovery = async () => {
        if (!navigator.onLine) return;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
          
          const response = await fetch(`${baseUrl}/api/v1/getUserDetail`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          // If the server returns a healthy status, redirect back to the app!
          if (response.status > 0 && response.status < 500) {
            let lastPath = sessionStorage.getItem('lastValidPath') || '/';
            if (lastPath.includes('/server-error')) {
              lastPath = '/';
            }
            redirect(lastPath);
          } 
          // 🔥 REMOVED: else if (response.status >= 500) { setCode(response.status) }
          // We do nothing on failure. We let api.js dictate the error state.
          
        } catch (error) {
          clearTimeout(timeoutId);
          // 🔥 REMOVED: handlePingError(error)
          // Fail silently. Do not update the UI error code locally.
        }
      };

      checkServerRecovery();
    }
  }, [code]); 

  // Background Polling (Health Checks) for Server Crashes
  useEffect(() => {
    if (!isOnline || code === 404) return;

    let pollInterval;
    let isRequestPending = false; 

    const pollServer = async () => {
      // If the previous request is still stuck waiting, do NOT fire another one!
      if (isRequestPending) return; 
      
      isRequestPending = true;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
        const response = await fetch(`${baseUrl}/api/v1/getUserDetail`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          signal: controller.signal 
        });

        clearTimeout(timeoutId);

        // If healthy, redirect home!
        if (response.status > 0 && response.status < 500) {
          let lastPath = sessionStorage.getItem('lastValidPath') || '/';
          if (lastPath.includes('/server-error')) {
            lastPath = '/';
          }
          redirect(lastPath);
        } 
        // 🔥 REMOVED: else if (response.status >= 500) { setCode(response.status) }
        
      } catch (error) {
        clearTimeout(timeoutId);
        // 🔥 REMOVED: handlePingError(error)
      } finally {
        isRequestPending = false; 
      }
    };

    // Poll every 10 seconds to check if the backend woke up
    pollInterval = setInterval(pollServer, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        pollServer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOnline, code]); 

  const errorMessages = {
    404: {
      title: 'Page Not Found',
      description: "The page you are looking for doesn't exist or has been moved.",
    },
    500: {
      title: 'System Error',
      description: 'We are currently experiencing technical difficulties. Our team has been notified.',
    },
    502: {
      title: 'Bad Gateway',
      description: 'The server received an invalid response. Please try again in a moment.',
    },
    503: {
      title: 'Service Unavailable',
      description: 'The service is temporarily unavailable for maintenance. Please check back shortly.',
    },
    504: {
      title: 'Gateway Timeout',
      description: 'The server is taking too long to respond. Please check your connection and try again.',
    },
  };

  const { title, description } = errorMessages[code] || errorMessages[500];

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

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

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      // If we are not on a 404 page, try to redirect back to the app when we come online
      if (code !== 404) {
        let lastPath = sessionStorage.getItem('lastValidPath') || '/';
        if (lastPath.includes('/server-error')) lastPath = '/';
        redirect(lastPath); 
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [code]);

  if (isPinging) {
    return (
      <div className="w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gray-50 text-gray-800">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const ErrorIcon = !isOnline ? WifiOff : (code === 404 ? AlertCircle : ServerCrash);

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <main
        role="main"
        className="w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6"
      >
        <div className="max-w-md w-full text-center flex flex-col items-center animate-in fade-in duration-200">
          
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <ErrorIcon className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
          </div>

          <h1
            ref={headingRef}
            tabIndex={-1} 
            className="text-2xl sm:text-3xl font-semibold text-gray-900 outline-none mb-3"
          >
            {!isOnline ? "No Connection" : title}
          </h1>
          
          <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm">
            {!isOnline
              ? "You appear to be offline. Please check your network connection and try reloading the page."
              : description}
          </p>

          <div className="mt-12 pt-6 border-t border-gray-200 w-full">
            <p className="text-xs text-gray-400">
              Error Code: {!isOnline ? "ERR_NETWORK_DISCONNECTED" : code}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default ServerError;