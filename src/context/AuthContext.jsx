import { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import api from "../services/api";

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
    let safetyTimeout; // 🔥 Timeout to prevent hanging if redirect fails

    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
          setIsInitialized(true);
        }
        return;
      }

      let isFatalError = false; // 🔥 NEW: Track fatal errors to prevent race condition

      try {
        const fetchedUser = await getUserFromServer();

        if (isMounted) {
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("role"); // Clean up role on failure
          }
        }
      } catch (err) {
        console.error("Auth fetchUser error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
        } else {
          isFatalError = true; // 🔥 Set flag so we don't drop the loading state
          // Redirect is now handled centrally by the API interceptor

          // 🔥 Safety timeout: if redirect doesn't happen (e.g., isRedirecting blocked),
          // force loading to false after 5 seconds to prevent permanent spinner.
          safetyTimeout = setTimeout(() => {
            if (isMounted) {
              setLoading(false);
            }
          }, 5000);
        }
      } finally {
        // 🔥 FIX: Only stop loading if it wasn't a fatal error
        // This prevents ProtectedRoute from kicking you to /login before the redirect finishes!
        if (isMounted && !isFatalError) {
          setLoading(false);
          setIsInitialized(true);
        }
        // Note: If isFatalError is true, loading remains true; the safety timeout will eventually reset it.
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
      if (safetyTimeout) clearTimeout(safetyTimeout); // 🔥 Clean up timeout on unmount
    };
  }, []);

  /* ================= LOGIN ================= */
  const login = async (token) => {
    if (!token) return;
    localStorage.setItem("token", token);
    setLoading(true);

    let isFatalError = false; // 🔥 NEW: Track fatal errors here too

    try {
      // 🔥 Replaced manual URL/Headers with the Interceptor-friendly call

      const fetchedUser = await getUserFromServer();

      if (fetchedUser) {
        setUser(fetchedUser);
        localStorage.setItem("role", fetchedUser.role); // 🔥 Save role on successful login
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    } catch (err) {
      console.error("Auth login error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
      } else {
        console.warn("Temporary login error.");
        if (!err.response || err.response.status >= 500) {
          isFatalError = true; // 🔥 Set flag
          // Redirect is now handled centrally by the API interceptor
        }
      }
    } finally {
      // 🔥 FIX: Keep loading true if redirecting to server-error
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
      // 🔥 Replaced manual URL/Headers with the Interceptor-friendly call
      const updatedUser = await getUserFromServer();

      if (updatedUser) {
        // ✅ Logic maintained: We update the state with the fresh data from the server.
        // Because we are using the existing token, the session record in the DB remains the same.
        setUser(updatedUser);
        localStorage.setItem("role", updatedUser.role);
        return updatedUser;
      }
    } catch (err) {
      console.error("Auth refreshUser error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
      } else {
        // Redirect is now handled centrally by the API interceptor
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