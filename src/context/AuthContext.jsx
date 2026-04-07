import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { redirect } from "../services/navigationService"; 

const AuthContext = createContext(null);

// Normalize user object from backend
const normalizeUser = (user) => ({
  ...user,
  role: user.role || "user", // 🔥 Ensure role is always defined (defaults to "user")
  isEmailVerified: user.isEmailVerified ?? user.emailVerified ?? false,
});

// 🔥 OPTIMIZATION 1: Centralized Network Error Checker
const checkIsNetworkError = (err) => {
  return (
    !navigator.onLine ||
    err instanceof TypeError ||
    err.message === "Offline" ||
    err.message === "Failed to fetch" ||
    err.message === "Network Error" ||
    (!err.response && !err.status)
  );
};

// 🔥 OPTIMIZATION 5: Centralized Timeout Error Checker
const isTimeoutError = (err) => {
  return (
    err.name === 'AbortError' ||
    err.code === 'ECONNABORTED' ||
    err.message?.toLowerCase().includes('timeout') ||
    err.message?.toLowerCase().includes('aborted')
  );
};

// 🔥 OPTIMIZATION 6: Centralized Error Code Resolver
const getErrorCode = (err) => {
  if (isTimeoutError(err)) return 504;
  if (err.response?.status) return err.response.status;
  return 503;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper used for login/refresh where the app is already mounted
  const getUserFromServer = async () => {
    try {
      const res = await api.get("/api/v1/getUserDetail");

      if (res.data.success && res.data.user) {
        const normalized = normalizeUser(res.data.user);
        // 🔥 Keep localStorage in sync with the fetched role
        localStorage.setItem("role", normalized.role);
        return normalized;
      }
    } catch (err) {
      console.error("getUserFromServer error:", err);
      if (!err.response || err.response.status >= 500) {
        throw err;
      }
    }

    return null;
  };

  /* ================= LOAD USER ON APP START ================= */
  useEffect(() => {
    let isMounted = true;
    
    // 🔥 OPTIMIZATION 7: Single Global AbortController for all fetches and unmounts
    const globalAbortController = new AbortController();

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      let isFatalError = false; // 🔥 Track fatal errors for both paths

      // 🔥 OPTIMIZATION 9 & 11: Centralized Redirect Helper with Closure Fix
      const handleFatalRedirect = (code) => {
        const isOnErrorPage = window.location.pathname.startsWith("/server-error");
        if (!isOnErrorPage) {
          redirect(`/server-error?code=${code}`);
          return true; // Explicitly return true if we executed the redirect
        }
        return false; // Return false if we were already on the error page
      };

      // =================================================================
      // 🔥 TEACHER'S FIX: The Global Health Check for Unauthenticated Users
      // =================================================================
      if (!token) {
        // 🔥 OPTIMIZATION 8: Use the global controller instead of creating a duplicate
        const timeoutId = setTimeout(() => globalAbortController.abort(), 8000);

        try {
          const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
          
          if (!navigator.onLine) throw new Error("Offline");

          // Ping the lightweight health route
          const response = await fetch(`${baseUrl}/api/v1/health`, { 
            method: "GET",
            signal: globalAbortController.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw { response: { status: response.status } }; 
          }

          if (isMounted) {
            setUser(null);
          }
        } catch (err) {
          clearTimeout(timeoutId);
          
          // 🔥 SAFEGUARD: If the component unmounted, do not trigger a fake 504 redirect!
          if (!isMounted) return; 

          // 🔥 OPTIMIZATION 12: Reduced the severity of the console log 
          // (It's expected behavior if the server is down, so a warning is cleaner than an error stack trace in production)
          console.warn("Public Health Check failed: Server is likely offline or unreachable.");

          // 🔥 OPTIMIZATION 10 & 11: Cleanly pass the error and cleanly update the local state without closure issues
          isFatalError = handleFatalRedirect(getErrorCode(err));
          return;
          
        } finally {
          if (isMounted && !isFatalError) {
            setLoading(false);
            setIsInitialized(true);
          }
        }
        return; // Exit here since they have no token
      }
      // =================================================================
      // END HEALTH CHECK
      // =================================================================

      try {
        // 🔥 FIX: Use native fetch for the initial boot ONLY.
        const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
        
        // Throw an error immediately if offline so we skip straight to the catch block
        if (!navigator.onLine) throw new Error("Offline");

        const response = await fetch(`${baseUrl}/api/v1/getUserDetail`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: globalAbortController.signal 
        });

        if (!response.ok) {
          // If it's a 401, we want to clear the token and log out naturally.
          if (response.status === 401 || response.status === 403) {
            throw { response: { status: 401 } }; 
          }
          // If it's a 500+, throw a fatal error.
          throw { response: { status: response.status } }; 
        }

        const data = await response.json();

        if (isMounted) {
          if (data.success && data.user) {
            const normalizedUser = normalizeUser(data.user);
            localStorage.setItem("role", normalizedUser.role);
            setUser(normalizedUser);
          } else {
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("role"); // Clean up role on failure
          }
        }
      } catch (err) {
        // 🔥 SAFEGUARD: If the component unmounted, do not trigger a fake 504 redirect!
        if (!isMounted) return; 

        // 🔥 OPTIMIZATION 12: Cleaned up the console log
        console.warn("Auth fetchUser failed: Server is likely offline or unreachable.");

        if (checkIsNetworkError(err)) {
          isFatalError = handleFatalRedirect(getErrorCode(err));
          return;
        }

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
        } else {
          isFatalError = handleFatalRedirect(getErrorCode(err));
          return;
        }
      } finally {
        if (isMounted && !isFatalError) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
      // 🔥 Cleanly kill any pending network requests when leaving the app!
      globalAbortController.abort(); 
    };
  }, []);

  /* ================= LOGIN ================= */
  const login = async (token) => {
    if (!token) return;
    localStorage.setItem("token", token);
    setLoading(true);

    let isFatalError = false; 

    try {
      const fetchedUser = await getUserFromServer();

      if (fetchedUser) {
        setUser(fetchedUser);
        localStorage.setItem("role", fetchedUser.role); 
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    } catch (err) {
      console.error("Auth login error:", err);

      if (checkIsNetworkError(err)) {
        isFatalError = true;
        return;
      }

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
      } else {
        console.warn("Temporary login error.");
        if (!err.response || err.response.status >= 500) {
          isFatalError = true; 
        }
      }
    } finally {
      if (!isFatalError) {
        setLoading(false);
      }
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await api.post("/api/v1/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("authUser");
      setUser(null);
      setIsLoggingOut(false);
    }
  };

  /* ================= REFRESH USER ================= */
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const updatedUser = await getUserFromServer();

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("role", updatedUser.role);
        return updatedUser;
      }
    } catch (err) {
      console.error("Auth refreshUser error:", err);

      if (checkIsNetworkError(err)) {
        return null;
      }

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
      }
    }

    return null;
  };

  /* ================= CONTEXT VALUE ================= */

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      role: user?.role || "user",
      isAdmin: user?.role === "admin",
      isEmailVerified: user?.isEmailVerified ?? false,
      loading,
      isInitialized,
      login,
      logout,
      refreshUser,
      setUser,
      isLoggingOut,
    }),
    [user, loading, isLoggingOut, isInitialized],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ================= CUSTOM HOOK ================= */
export const useAuth = () => useContext(AuthContext);
export default AuthContext;