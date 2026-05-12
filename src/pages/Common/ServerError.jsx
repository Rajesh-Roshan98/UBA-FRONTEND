import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext'; // 🔥 ADDED: Import AuthContext
import api from "../../services/api"; // 🔥 ADDED: Import Axios instance
import { ServerCrash, WifiOff, AlertCircle, Loader2, Clock, Wrench } from 'lucide-react'; // 🔥 ADDED: Clock & Wrench for better UI
import { redirect } from "../../services/navigationService"; 
import { motion } from 'framer-motion'; // 🔥 ADDED: Framer Motion for smooth transitions

/**
 * Error page component that displays different HTTP error codes.
 * Defaults to 500 (Internal Server Error) for backward compatibility.
 *
 * @param {Object} props
 * @param {number} [props.code] - HTTP status code (404, 500, 502, 503, 504, etc.)
 */
const ServerError = ({ code: propCode }) => { 
  const location = useLocation(); 
  const [searchParams] = useSearchParams(); 
  const headingRef = useRef(null);
  
  // 🔥 FIX 3: Cleaner React architecture for timeouts
  const recoveryTimeoutRef = useRef(null); 

  // 🔥 ADDED: Extract refreshUser to sync global state on recovery
  const { refreshUser } = useAuth(); 

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
    
    // 🔥 IMPROVED: Return string codes directly, otherwise parse to integer
    if (extracted === "NETWORK_ERROR" || extracted === "SERVER_UNREACHABLE") {
      return extracted;
    }
    return parseInt(extracted, 10);
  };

  const parsedUrlCode = extractCodeFromUrl();
  const initialCode = (typeof parsedUrlCode === 'string' || !isNaN(parsedUrlCode)) ? parsedUrlCode : (propCode || 500);

  const [code, setCode] = useState(initialCode);

  // 🔥 ADDED: State to manage the smooth exit animation before redirecting
  const [isExiting, setIsExiting] = useState(false);

  // 🔥 ADDED: Helper function to trigger animation, wait, and then redirect smoothly
  const smoothRedirect = (path) => {
    setIsExiting(true);
    setTimeout(() => {
      redirect(path);
    }, 300); // 300ms matches the Framer Motion transition duration
  };

  // 🔥 THE NEW FIX: Make the UI blindly trust the URL from api.js!
  // Instead of overwriting the URL, we listen to it. If api.js changes the URL from 503 to 504, 
  // this effect catches it and updates the screen automatically.
  useEffect(() => {
    const rawCode = searchParams.get("code");
    let currentUrlCode;

    // 🔥 IMPROVED: Handle string-based network codes
    if (rawCode === "NETWORK_ERROR" || rawCode === "SERVER_UNREACHABLE") {
      currentUrlCode = rawCode;
    } else {
      currentUrlCode = parseInt(rawCode, 10);
    }

    if (currentUrlCode !== code && (typeof currentUrlCode === 'string' || !isNaN(currentUrlCode))) {
      setCode(currentUrlCode); 
    }
  }, [searchParams, code]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // NEW: State to handle the manual retry loading UI
  const [isRetrying, setIsRetrying] = useState(false);

  // 🔥 IMPROVED: State for UX error message and ref for auto-retry limit
  const [errorMessage, setErrorMessage] = useState("");
  const autoRetryCount = useRef(0);

  // 🔥 FIX (IMPORTANT): Google-Level Silent Retry Logic
  const retryRefresh = async (retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        // 🔥 THE FIX: Added 'true' to skip the Wake Animation and retry silently
        const user = await refreshUser(true);
        if (user) return true;
      } catch (e) {}

      await new Promise(res => setTimeout(res, delay));
    }
    return false;
  };

  // 🔥 FIX 2: Hard timeout wrapper to prevent infinite "Checking..." state
  const withTimeout = (promise, ms = 30000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Retry timeout")), ms)
      ),
    ]);
  };

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

  // 🔥 ADDED: Better Error Classification
  const isNetworkError = code === "NETWORK_ERROR";
  const isServerUnreachable = code === "SERVER_UNREACHABLE";
  const isTimeout = code === 504;
  const isMaintenance = code === 503;
  const isBadGateway = code === 502;
  const isNotFound = code === 404;

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

  // 🔥 IMPROVED: Dynamic title and description based on industry-standard network codes
  let title, description;

  if (isNetworkError) {
    // 🔥 FIX: Matched these strings EXACTLY to your JSX fallback below.
    // Now, when the app reconnects and switches from the JSX fallback to these variables, 
    // the text is identical, preventing any visible flashing.
    title = "No Connection";
    description = "You appear to be offline. Please check your network connection and try reloading the page.";
  } else if (isServerUnreachable) {
    title = "Server Unreachable";
    description = "We are unable to connect to the server. Please try again later.";
  } else {
    ({ title, description } = errorMessages[code] || errorMessages[500]);
  }

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

  // 🔥 THE AUTO-RECONNECT FIX: Sync the AuthContext before redirecting automatically
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setErrorMessage(""); // Clear old errors
      
      if (!isNotFound) { // 🔥 Using new classification variable here
        // 🔥 IMPROVED: Limit auto-retries to prevent infinite loops
        if (autoRetryCount.current >= 3) {
          setErrorMessage("Auto-reconnect failed. Please try again manually.");
          setIsRetrying(false); // 🔧 Fix 5: Ensure button is reset when auto-retry hits limit
          return;
        }
        autoRetryCount.current += 1;

        setIsRetrying(true); // Trigger the loading UI while we sync and wait
        
        // 🔥 INDUSTRY STANDARD FIX: Add a debounce so the backend DB has time to recover
        // 🔥 FIX 3: Using recoveryTimeoutRef instead of local variable
        recoveryTimeoutRef.current = setTimeout(async () => {
          if (!navigator.onLine) {
            setIsRetrying(false); // 🔧 Fix 5: Reset UI instantly if connection drops again during wait
            return;
          }

          // wait extra time before calling API
          await new Promise(res => setTimeout(res, 2000));

          const token = localStorage.getItem('token');
          
          // SCENARIO 1: AUTO-RETRY FOR GUEST (UNAUTHENTICATED)
          if (!token) {
            try {
              // 🔥 FIX: ADDED MISSING HEALTH CHECK FOR GUEST AUTO-RETRY
              // Previously, this blindly redirected without ensuring the server was actually back up!
              await api.get("/api/v1/auth/health", {
                skipGlobalErrorHandler: true
              });
              
              let lastPath = sessionStorage.getItem('lastValidPath') || '/';
              if (lastPath.includes('/server-error')) lastPath = '/';
              sessionStorage.removeItem('lastValidPath'); // 🔥 CLEANUP
              smoothRedirect(lastPath); // 🔥 UPDATED TO SMOOTH REDIRECT
            } catch (error) {
              setErrorMessage("Server still unavailable. Try again.");
              setIsRetrying(false);
            }
            return;
          }

          // SCENARIO 2: AUTO-RETRY FOR AUTHENTICATED USER
          try {
            // 🔥 ADDED SILENT RETRY LOGIC HERE
            // 🔥 FIX 2: Wrapped with hard timeout to prevent infinite hang
            const success = await withTimeout(retryRefresh(), 30000);
            
            if (success) {
              let lastPath = sessionStorage.getItem('lastValidPath') || '/';
              if (lastPath.includes('/server-error')) lastPath = '/';
              sessionStorage.removeItem('lastValidPath'); // 🔥 CLEANUP
              smoothRedirect(lastPath); // 🔥 UPDATED TO SMOOTH REDIRECT
            } else if (!localStorage.getItem('token')) {
              smoothRedirect('/login'); // 🔥 UPDATED TO SMOOTH REDIRECT
            } else {
              // Fallback to prevent infinite loading
              setErrorMessage("Server still unavailable. Try again.");
              setIsRetrying(false);
            }
          } catch (error) {
            setErrorMessage("Server still unavailable. Try again.");
            setIsRetrying(false);
          }
        }, 4000); // Wait 4 seconds before hitting the backend
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Clear the timeout if they lose connection again while waiting
      if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current); // Prevent memory leaks on unmount
    };
  }, [code, refreshUser, isNotFound]);

  // 🔥 THE FINAL FIX: Use AuthContext to sync state before redirecting
  const handleRetry = async () => {
    if (!navigator.onLine) {
      window.location.reload();
      return;
    }

    setErrorMessage(""); // Clear previous errors
    setIsRetrying(true);
    autoRetryCount.current = 0; // 🔥 Reset auto-retry limit on manual action

    const token = localStorage.getItem('token');

    // SCENARIO 1: User is unauthenticated (Guest)
    if (!token) {
      try {
        // 🔥 FIX: Replaced fetch with api.get using skipGlobalErrorHandler flag to maintain SSOT
        await api.get("/api/v1/auth/health", {
          skipGlobalErrorHandler: true
        });
        
        let lastPath = sessionStorage.getItem('lastValidPath') || '/';
        if (lastPath.includes('/server-error')) lastPath = '/';
        sessionStorage.removeItem('lastValidPath'); // 🔥 CLEANUP
        smoothRedirect(lastPath); // 🔥 UPDATED TO SMOOTH REDIRECT
      } catch (error) {
        setErrorMessage("Server still unavailable. Try again.");
        setIsRetrying(false);
      }
      return;
    }

    // SCENARIO 2: User is Authenticated. 
    // We MUST use refreshUser() so the Navbar gets the updated avatar profile data!
    try {
      // 🔥 ADDED SILENT RETRY LOGIC HERE
      // 🔥 FIX 2: Wrapped with hard timeout to prevent infinite hang
      const success = await withTimeout(retryRefresh(), 30000);

      if (success) {
        // Server is awake AND global state is updated! Safe to redirect.
        let lastPath = sessionStorage.getItem('lastValidPath') || '/';
        if (lastPath.includes('/server-error')) {
          lastPath = '/';
        }
        sessionStorage.removeItem('lastValidPath'); // 🔥 CLEANUP
        smoothRedirect(lastPath); // 🔥 UPDATED TO SMOOTH REDIRECT
      } else {
        // If refreshUser returns null, check if it wiped the token (401)
        if (!localStorage.getItem('token')) {
          smoothRedirect('/login'); // 🔥 UPDATED TO SMOOTH REDIRECT
        } else {
          // Token is still there, server is just still down (503)
          // Fallback to prevent infinite loading
          setErrorMessage("Server still unavailable. Try again.");
          setIsRetrying(false);
        }
      }
    } catch (error) {
      setErrorMessage("Server still unavailable. Try again.");
      setIsRetrying(false);
    }
  };

  // 🔥 IMPROVED: Better icon classification mapping using the new variables
  const getErrorIcon = () => {
    // 🔥 FIX: Separated user-side offline states from server-side unreachable states for accurate icons
    if (!isOnline || isNetworkError) return WifiOff;
    if (isServerUnreachable) return ServerCrash; // Correctly maps to the server icon
    if (isTimeout) return Clock;
    if (isMaintenance) return Wrench;
    if (isNotFound) return AlertCircle;
    return ServerCrash; // Default for 500, 502, etc.
  };

  const ErrorIcon = getErrorIcon();

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* 🔥 REPLACED <main> with <motion.main> to handle smooth exits */}
      <motion.main
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.3 }}
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
            {/* Kept existing !isOnline fallback to ensure immediate browser detection overrides */}
            {!isOnline ? "No Connection" : title}
          </h1>
          
          <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-sm">
            {!isOnline
              ? "You appear to be offline. Please check your network connection and try reloading the page."
              : description}
          </p>

          {/* 🔥 IMPROVED: Display clear feedback to the user when retries fail */}
          {errorMessage && (
            <p className="text-sm text-red-500 mb-4 font-medium animate-in fade-in">
              {errorMessage}
            </p>
          )}

          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
          >
            {isRetrying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Try Again'
            )}
          </button>

          <div className="mt-10 pt-6 border-t border-gray-200 w-full">
            <p className="text-xs text-gray-400">
              {/* 🔥 FIX: Added "|| isNetworkError" to ensure it never flashes "NETWORK_ERROR" */}
              Error Code: {!isOnline || isNetworkError ? "ERR_NETWORK_DISCONNECTED" : code}
            </p>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default ServerError;