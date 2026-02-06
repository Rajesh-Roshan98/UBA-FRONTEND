import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState("checking");
  // checking | unauth | unverified | verified

  const location = useLocation();

  // 1. Verify User Effect
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // ❌ Not logged in
        if (!token) {
          setAuthState("unauth");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/v1/getUserDetail`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data?.success) {
          setAuthState("unauth");
          return;
        }

        // 🚫 Logged in but email not verified
        if (!res.data.user.isEmailVerified) {
          setAuthState("unverified");
          return;
        }

        // ✅ Verified
        setAuthState("verified");
      } catch {
        setAuthState("unauth");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []); 

  // 2. Handle Unverified User Toast
  // We strictly watch authState. If it becomes 'unverified', we show the error.
  useEffect(() => {
    if (authState === "unverified") {
      toast.error("Please verify your email to access this page", {
        id: "verify-email-toast", // This ID prevents duplicate toasts
      });
    }
  }, [authState]);


  /* 🔄 Loading screen */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-semibold">
        Checking authentication...
      </div>
    );
  }

  /* ❌ Not logged in → redirect to login */
  if (authState === "unauth") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /* 🚫 Logged in but NOT verified → Redirect to Home (BLOCK ACCESS) */
  if (authState === "unverified") {
    // We redirect to "/" (Home) or a specific "/verify-email" page.
    // The useEffect above handles showing the toast message.
    return <Navigate to="/" replace />;
  }

  /* ✅ Verified → allow access */
  return children;
};

export default ProtectedRoute;