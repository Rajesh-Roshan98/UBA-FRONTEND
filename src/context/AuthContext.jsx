import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "../services/api";

// 🔥 NEW: Import socket functions (adjust the path if your file is named differently or in a different folder)
import { socket, connectUserSocket, disconnectUserSocket } from "../services/socket"; 

const AuthContext = createContext(null);

// Normalize user object from backend
const normalizeUser = (user) => ({
  ...user,
  role: user.role || "user", // 🔥 Ensure role is always defined (defaults to "user")
  isEmailVerified: user.isEmailVerified ?? user.emailVerified ?? false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper used for login/refresh where the app is already mounted
  const getUserFromServer = async () => {
    try {
      const res = await api.get("/api/v1/auth/getUserDetail");

      if (res.data.success && res.data.user) {
        const normalized = normalizeUser(res.data.user);
        // 🔥 Keep localStorage in sync with the fetched role
        localStorage.setItem("role", normalized.role);
        return normalized;
      }
    } catch (err) {
      console.error("getUserFromServer error:", err);
      if (!err.response || (err.response.status && err.response.status >= 500)) {
        throw err; // Internal throw to pass error down to login/refresh handlers
      }
    }

    return null;
  };

  /* ================= SOCKET EXPIRY LISTENER ================= */
  // 🔥 NEW: Handle token expiry from socket (VERY IMPORTANT)
  useEffect(() => {
    const handleSocketUnauthorized = () => {
      console.warn("⚠️ Socket unauthorized → logging out user");
      
      // Wipe storage directly instead of calling the API to prevent a 401 loop
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("authUser");
      setUser(null);
      
      // Disconnect socket and redirect
      disconnectUserSocket();
      window.location.href = "/login"; 
    };

    window.addEventListener("socket_unauthorized", handleSocketUnauthorized);

    return () => {
      window.removeEventListener("socket_unauthorized", handleSocketUnauthorized);
    };
  }, []);

  /* ================= LOAD USER ON APP START ================= */
  useEffect(() => {
    let isMounted = true;
    
    // 🔥 OPTIMIZATION 7: Single Global AbortController for all fetches and unmounts
    const globalAbortController = new AbortController();

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      let isFatalError = false; // 🔥 Track fatal errors for both paths

      // =================================================================
      // 🔥 TEACHER'S FIX: The Global Health Check for Unauthenticated Users
      // =================================================================
      if (!token) {
        try {
          if (!navigator.onLine) throw new Error("Offline");

          // 🔥 FIX 1: Replaced native fetch with Axios to ensure interceptor routing
          await api.get("/api/v1/auth/health", { 
            signal: globalAbortController.signal
          });

          if (isMounted) {
            setUser(null);
          }
        } catch (err) {
          // 🔥 SAFEGUARD: If the component unmounted, do not trigger a fake 504 redirect!
          if (!isMounted) return; 

          console.warn("Public Health Check failed: Server is likely offline or unreachable.");

          // 🔥 FIX 2: Check standard !err.response and throw to allow boundaries/interceptors to catch it
          if (!err.response) {
            console.warn("Network issue detected");
            isFatalError = true; // Locks UI from flashing while Axios redirects
            throw err; 
          }

          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setUser(null);
          } else {
            console.warn("Server issue detected");
            isFatalError = true;
            throw err; 
          }
          
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
        // Throw an error immediately if offline so we skip straight to the catch block
        if (!navigator.onLine) throw new Error("Offline");

        // 🔥 FIX 1: Replaced native fetch with Axios. Headers & Base URL are now auto-handled.
        const res = await api.get("/api/v1/auth/getUserDetail", {
          signal: globalAbortController.signal 
        });

        const data = res.data;

        if (isMounted) {
          if (data.success && data.user) {
            const normalizedUser = normalizeUser(data.user);
            localStorage.setItem("role", normalizedUser.role);
            setUser(normalizedUser);

            // 🔥 NEW: reconnect socket after reload
            if (!socket.connected) {
              connectUserSocket(token, normalizedUser.userId || normalizedUser.adminId || normalizedUser._id);
            }
          } else {
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("role"); // Clean up role on failure
          }
        }
      } catch (err) {
        // 🔥 SAFEGUARD: If the component unmounted, do not trigger a fake 504 redirect!
        if (!isMounted) return; 

        console.warn("Auth fetchUser failed: Server is likely offline or unreachable.");

        // 🔥 FIX 2: Check standard !err.response and throw to allow boundaries/interceptors to catch it
        if (!err.response) {
          console.warn("Network issue detected");
          isFatalError = true;
          throw err; 
        }

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
        } else {
          console.warn("Server issue detected");
          isFatalError = true;
          throw err; 
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

        // 🔥 NEW: CONNECT SOCKET HERE
        if (!socket.connected) {
          connectUserSocket(token, fetchedUser.userId || fetchedUser.adminId || fetchedUser._id);
        }
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    } catch (err) {
      console.error("Auth login error:", err);

      // 🔥 FIX 2: Check standard !err.response and throw to allow boundaries/interceptors to catch it
      if (!err.response) {
        isFatalError = true;
        throw err; 
      }

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
      } else {
        console.warn("Temporary login error.");
        if (err.response.status && err.response.status >= 500) {
          isFatalError = true; 
          throw err; 
        }
      }
    } finally {
      if (!isFatalError) {
        setLoading(false);
        setIsInitialized(true); // 🔥 Added to ensure state un-sticks after login
      }
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await api.post("/api/v1/auth/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("authUser");

      // 🔥 NEW: DISCONNECT SOCKET
      disconnectUserSocket();

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
        
        // 🔥 THE FIX: Un-stick the UI state so the Navbar knows it's safe to render!
        setIsInitialized(true);
        setLoading(false);
        
        // 🔥 NEW: Ensure socket is reconnected on refresh
        if (!socket.connected) {
          connectUserSocket(token, updatedUser.userId || updatedUser.adminId || updatedUser._id);
        }

        return updatedUser;
      }
    } catch (err) {
      console.error("Auth refreshUser error:", err);

      // 🔥 FIX 2: Check standard !err.response and throw to allow boundaries/interceptors to catch it
      if (!err.response) {
        throw err; 
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
      // 🔥 ADDED: Safely expose the generated alphanumeric ID for anywhere in your frontend
      userId: user?.userId || user?.adminId || null, 
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