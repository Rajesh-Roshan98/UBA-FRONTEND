import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

// Normalize user object from backend
const normalizeUser = (user) => ({
  ...user,
  isEmailVerified: user.isEmailVerified ?? user.emailVerified ?? false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ON APP START ================= */
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/api/v1/getUserDetail`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.user) {
          setUser(normalizeUser(res.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth fetchUser error:", err);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (token) => {
    if (!token) return;
    localStorage.setItem("token", token);
    setLoading(true);

    try {
      const res = await axios.get(`${API_BASE}/api/v1/getUserDetail`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.user) {
        setUser(normalizeUser(res.data.user));
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Auth login error:", err);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /* ================= REFRESH USER ================= */
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const res = await axios.get(`${API_BASE}/api/v1/getUserDetail`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.user) {
        const updatedUser = normalizeUser(res.data.user);
        setUser(updatedUser);
        return updatedUser;
      }
    } catch (err) {
      console.error("Auth refreshUser error:", err);
    }

    return null;
  };

  /* ================= CONTEXT VALUE ================= */
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isEmailVerified: user?.isEmailVerified ?? false, // 🔥 Important for ProtectedRoute
        loading,
        login,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
