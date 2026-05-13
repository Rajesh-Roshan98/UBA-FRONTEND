import React, { useState, useEffect, useRef } from 'react';
import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api"; // 🔥 NEW: Import API service for backend calls

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
      const res = await api.get('/api/v1/auth/notifications'); // Assumes baseURL is set to /api
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 TEACHER FIX 2 & 4: Fetch on mount, clear on logout, NO POLLING
  useEffect(() => {
    if (!user) {
      setNotifications([]); // Prevent ghost notifications for new users
      return;
    }
    fetchNotifications();
  }, [user]);

  // ====================================================================
  // 🔥 TEACHER FIX 1 & 3: Listen for real-time socket notifications safely!
  // ====================================================================
  useEffect(() => {
    const handleNewNotification = (event) => {
      const newNotif = event.detail;
      
      setNotifications((prev) => {
        // Prevent duplicate notifications if socket and API race each other
        const exists = prev.some((n) => n._id === newNotif._id);
        if (exists) return prev;
        
        return [newNotif, ...prev];
      });
    };

    // Listen to the custom event we dispatched in socket.js
    window.addEventListener("global_new_notification", handleNewNotification);

    return () => {
      window.removeEventListener("global_new_notification", handleNewNotification);
    };
  }, []);
  // ====================================================================

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
      await api.patch(`/api/v1/auth/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  // 🔥 NEW: Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.post('/api/v1/auth/notifications/read-all');
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
        // 🔥 Reduced touch target size slightly on mobile for a sleeker look
        className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
      >
        <div className="relative flex">
          {/* 🔥 Reduced icon size on mobile */}
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
          
          {/* Red dot conditionally rendered if there are unread items */}
          {unreadCount > 0 && (
            // 🔥 Made the red dot slightly smaller on mobile
            <span className="absolute -top-0.5 -right-0.5 block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      <div 
        // 🔥 Reduced width and right-offset on mobile to prevent it from feeling too bulky
        className={`absolute top-[110%] -right-12 sm:right-0 w-[260px] sm:w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 transition-all duration-300 origin-top sm:origin-top-right
          ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
      >
        <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center justify-between px-1 mb-3">
            {/* 🔥 Reduced font-weight from bold to semibold for a lighter feel */}
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] sm:text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* 🔥 EXISTING: Email verification warning (always shown if not verified) */}
          {!isEmailVerified && (
            <div className="mb-2.5 p-3 bg-red-50/80 border border-red-100 rounded-lg">
              {/* 🔥 Reduced font-weight from bold to semibold */}
              <p className="text-[10px] sm:text-[11px] font-semibold text-red-600 uppercase tracking-wider mb-1">
                Action Required
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                Please verify your email to continue.
              </p>
            </div>
          )}

          {/* 🔥 NEW: Render backend notifications */}
          {notifications.length === 0 && isEmailVerified && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500">
                You're all caught up!
              </p>
            </div>
          )}

          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg transition-colors group"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0"> {/* min-w-0 ensures truncation works */}
                    {/* 🔥 Reduced font-weight from bold to semibold */}
                    <p className="text-xs font-semibold text-gray-900 leading-snug">{notif.title}</p>
                    <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-relaxed break-words">{notif.message}</p>
                    {notif.data && (
                      <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1.5 font-medium truncate">
                        {notif.data.device} • {notif.data.location}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="text-[10px] text-slate-400 hover:text-indigo-600 font-medium sm:font-semibold cursor-pointer shrink-0 px-2 py-1 rounded hover:bg-indigo-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
