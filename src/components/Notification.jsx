import React, { useState, useEffect, useRef } from 'react';
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; // 🔥 NEW: Import API service for backend calls

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // 🔥 NEW: State for notifications
  const [loading, setLoading] = useState(false); // 🔥 NEW: Loading state (optional)
  const wrapperRef = useRef(null);
  const { user } = useAuth();

  const isEmailVerified = user?.isEmailVerified;

  // 🔥 NEW: Fetch unread notifications from backend
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/api/v1/notifications'); // Assumes baseURL is set to /api
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Fetch on mount and when user changes
  useEffect(() => {
    fetchNotifications();
    // Optional: poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ✅ Always toggle dropdown on click (recommended)
  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
  };

  // 🔥 NEW: Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  // 🔥 NEW: Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.post('/api/v1/notifications/read-all');
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  // 🔥 NEW: Determine if there are any unread items (including email verification)
  const unreadCount = notifications.length + (isEmailVerified ? 0 : 1);

  // Don't render the bell if there is no logged-in user
  if (!user) return null;

  return (
    <div ref={wrapperRef} className="relative inline-flex items-center justify-center cursor-pointer">
      
      {/* Bell Icon Trigger */}
      <div 
        onClick={handleBellClick}
        className="relative flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
      >
        <div className="relative flex">
          <Bell className="w-5 h-5" strokeWidth={2} />
          
          {/* Red dot conditionally rendered if there are unread items */}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-[110%] right-0 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 transition-all duration-300 origin-top-right
          ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
      >
        <div className="p-2 max-h-96 overflow-y-auto">
          {/* 🔥 EXISTING: Email verification warning (always shown if not verified) */}
          {!isEmailVerified && (
            <div className="mb-2 p-2 bg-red-50 rounded-lg">
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
                Action Required
              </p>
              <p className="text-xs text-gray-600 leading-snug">
                Please verify your email to continue.
              </p>
            </div>
          )}

          {/* 🔥 NEW: Render backend notifications */}
          {notifications.length === 0 && isEmailVerified && (
            <p className="text-xs text-gray-500 text-center py-4">
              No new notifications
            </p>
          )}

          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="mb-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{notif.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                  {notif.data && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      {notif.data.device} · {notif.data.location}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => markAsRead(notif._id)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}

          {/* 🔥 NEW: Mark all as read button (only if there are notifications) */}
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="w-full mt-1 text-xs text-center text-indigo-600 hover:text-indigo-800 py-1 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;