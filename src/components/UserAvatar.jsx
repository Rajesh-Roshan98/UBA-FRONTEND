import React, { useEffect, useRef, useState } from "react";
import { LogOut, Settings, Mail, Loader2, User, ShieldAlert } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();

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

  // ✅ Notification count logic
  const notificationCount = !user?.isEmailVerified ? 1 : 0;

  // Close dropdown on outside click
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
    setOpen(false); 
    await logout();
    navigate("/login");
  };

  const handleVerifyClick = async () => {
    if (loading || !user?.email || user?.isEmailVerified) return;

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/v1/sendotp`, {
        email: user.email,
      });

      toast.success(res.data.message || `OTP sent to ${user.email}`);

      navigate("/verify-email", {
        state: { email: user.email, otpSent: true },
      });
      setOpen(false); 
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Failed to send OTP";

      if (status === 409 || status === 429) {
        toast.info(msg);
        navigate("/verify-email", {
          state: { email: user.email, otpSent: true },
        });
        setOpen(false);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger */}
      <div
        className="relative flex items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-all hover:ring-4 hover:ring-gray-100"
        onClick={() => setOpen((prev) => !prev)}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="User"
            className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <div
            className={`w-11 h-11 rounded-full ${bgColor} text-white flex items-center justify-center font-bold text-lg shadow-sm`}
          >
            {getInitials()}
          </div>
        )}

        {/* ✅ Alert Symbol (Pulse Removed) */}
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white shadow-sm">
            {notificationCount}
          </span>
        )}
      </div>

      {/* Rich Dropdown Menu (Made Smaller: w-64) */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 transform transition-all ease-out duration-200">
          
          {/* Header Section: Compact Padding */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${bgColor} flex items-center justify-center text-white text-xs font-bold`}>
                 {user.avatar ? <img src={user.avatar} className="w-9 h-9 rounded-full object-cover" /> : getInitials()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[11px] text-gray-500 truncate font-medium">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-1.5">
            
            {/* Verify Email Section */}
            {!user.isEmailVerified && user.email && (
              <div className="mb-1">
                <div className="px-2 py-1">
                   <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-0.5">Action Required</p>
                </div>
                <button
                  onClick={handleVerifyClick}
                  disabled={loading}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    loading 
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed" 
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ShieldAlert size={16} className="text-red-600" />
                  )}
                  {loading ? "Sending..." : "Verify Email"}
                </button>
              </div>
            )}

            {/* Standard Menu Items */}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings size={16} className="text-gray-500" /> 
              Settings
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <User size={16} className="text-gray-500" /> 
              Profile
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-2 my-0.5"></div>

          {/* Footer Section: Logout */}
          <div className="p-1.5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> 
              Sign Out
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default UserAvatar;