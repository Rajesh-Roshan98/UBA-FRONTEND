import { createContext, useContext, useEffect, useState, useMemo } from "react";
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
    }

    return null;
  };

  /* ================= LOAD USER ON APP START ================= */
  useEffect(() => {
    let isMounted = true;

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
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ================= LOGIN ================= */
  const login = async (token) => {
    if (!token) return;
    localStorage.setItem("token", token);
    setLoading(true);

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
      }
    } finally {
      setLoading(false);
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