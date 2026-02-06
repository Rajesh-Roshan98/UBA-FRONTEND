import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true); // Show global spinner

    setTimeout(() => {
      // Remove authentication items
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");

      // Update Navbar or parent state if callback exists
      if (onLogout) onLogout(false);

      console.clear();

      navigate("/");

      setLoading(false); // Hide spinner
    }, 500); // Simulate delay
  };

  return (
    <>
      {/* Global Spinner Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <button
        className="bg-linear-to-br from-red-500 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center"
        onClick={handleLogout}
        disabled={loading}
      >
        Logout
      </button>
    </>
  );
};

export default Logout;
