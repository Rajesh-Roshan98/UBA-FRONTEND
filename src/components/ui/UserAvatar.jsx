import React, { useEffect, useRef, useState } from "react";
import { LogOut, Settings, User, ShieldCheck } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ✅ FIX: Removed API_BASE since Cloudinary provides the full URL

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [imgError, setImgError] = useState(false); // ✅ FIX: Added local state for image fallback
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const bgColors = [
    "bg-indigo-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-pink-600",
  ];
  const bgColor = bgColors[(user?.firstName?.length || 0) % bgColors.length];

  // ✅ FIX: Reset image error state if the user updates their avatar globally
  useEffect(() => {
    setImgError(false);
  }, [user?.avatar]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return; 
    setIsLoggingOut(true);    
    setOpen(false); 
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      {/* Global Full-Page Logout Animation Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300 px-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm sm:text-base text-indigo-900 font-medium animate-pulse tracking-wide">logging out...</p>
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Avatar Trigger */}
        <div
          className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full cursor-pointer transition-all hover:ring-4 hover:ring-gray-100"
          onClick={() => setOpen((prev) => !prev)}
        >
          {user.avatar && !imgError ? (
            // ✅ FIX: Use raw Cloudinary URL and fallback to initials on error
            <img
              src={user.avatar}
              alt="User"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-gray-200 shadow-sm"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full ${bgColor} text-white flex items-center justify-center font-bold text-sm sm:text-lg shadow-sm`}
            >
              {getInitials()}
            </div>
          )}
        </div>

        {/* Rich Dropdown Menu */}
        {open && (
          <div 
            className="absolute top-[110%] -right-2 sm:right-0 w-[240px] sm:w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 transform transition-all ease-out duration-200 origin-top sm:origin-top-right"
          >
            
            {/* Header Section */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0`}>
                   {/* ✅ FIX: Use raw Cloudinary URL and fallback to initials on error */}
                   {user.avatar && !imgError ? (
                     <img 
                       src={user.avatar} 
                       className="w-9 h-9 rounded-full object-cover" 
                       onError={() => setImgError(true)} 
                     />
                   ) : (
                     getInitials()
                   )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    {/* ADMIN BADGE */}
                    {user.role === 'admin' && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider border border-indigo-200 shrink-0">
                        <ShieldCheck size={10} />
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate font-medium mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-1.5">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 sm:py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <User size={16} className="text-gray-500" /> 
                Profile
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/settings");
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 sm:py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Settings size={16} className="text-gray-500" /> 
                Settings
              </button>
              
            </div>

            <div className="h-px bg-gray-100 mx-2 my-0.5"></div>

            <div className="p-1.5">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut} 
                className={`flex items-center gap-3 w-full px-3 py-2.5 sm:py-2 rounded-lg text-sm font-medium text-red-600 transition-colors ${
                  isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 cursor-pointer'
                }`} 
              >
                <LogOut size={16} /> 
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserAvatar;