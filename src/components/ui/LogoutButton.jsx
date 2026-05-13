import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <button
        className="bg-linear-to-br from-red-500 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </>
  );
};

export default Logout;
 