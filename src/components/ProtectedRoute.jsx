import { useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// 🔥 allowedRoles still supported
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading: contextLoading } = useAuth();
  // checking | unauth | unverified | unauthorized | verified

  const location = useLocation();

  // 1️⃣ Sync auth state from AuthContext (NO backend call here)
  const authState = useMemo(() => {
    if (contextLoading) return "checking";
    if (!user) return "unauth";
    if (!user.isEmailVerified) return "unverified";

    const userRole = user.role || "user";
    if (allowedRoles && !allowedRoles.includes(userRole))
      return "unauthorized";

    return "verified";
  }, [user, contextLoading, allowedRoles]);

  // 2️⃣ Unverified Toast (UNCHANGED)
  useEffect(() => {
    if (authState === "unverified") {
      toast.error("Please verify your email to access this page", {
        id: "verify-email-toast",
      });
    }
  }, [authState]);

  /* 🔄 Loading screen */
  if (contextLoading || authState === "checking") {
    return (
      <div className="flex items-center justify-center w-full h-full overflow-hidden font-semibold">
        Checking authentication...
      </div>
    );
  }

  /* ❌ Not logged in → redirect to login */
  if (authState === "unauth") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /* 🚫 Logged in but NOT verified → Redirect to Home */
  if (authState === "unverified") {
    if (
      location.pathname === "/" ||
      location.pathname === "/verify-email"
    ) {
      return children;
    }

    return <Navigate to="/" replace />;
  }

  /* 🛑 Wrong Role */
  if (authState === "unauthorized") {
    return <Navigate to="/unauthorized" replace />;
  }

  /* ✅ Verified */
  return children;
};

export default ProtectedRoute;