import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Home, LayoutDashboard, ShieldCheck, Users, Activity, 
  FileText, Bell, Settings, Info, Mail, LogOut, X, 
  Database, AlertTriangle, BarChart3 
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Added: State for global animation

  // Handle logout and close sidebar simultaneously
  const handleLogout = async () => {
    if (isLoggingOut) return; // Added: Prevent double-click execution
    setIsLoggingOut(true);    // Added: Trigger the global animation overlay
    setOpen(false); // Closes the sidebar
    await logout();      // Existing logout logic
    setIsLoggingOut(false); // FIX: Reset animation state so it doesn't get stuck on the login page
  };

  const getLinks = () => {
    let roleLinks = [];
    if (user?.role === "admin") {
      roleLinks = [
        { path: "/admin-homepage", label: "Admin Home", icon: Home },
        { path: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/access-control", label: "Access Control", icon: ShieldCheck },
        { path: "/user-management", label: "User Management", icon: Users },
        { path: "/system-logs", label: "System Logs", icon: Database },
        { path: "/anomaly-review", label: "Anomaly Review", icon: AlertTriangle },
        { path: "/alerts", label: "Alerts", icon: BarChart3 },
      ];
    } else if (user) {
      roleLinks = [
        { path: "/", label: "Home", icon: Home },
        { path: "/user-dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/activity", label: "Activity", icon: Activity },
        { path: "/my-alerts", label: "My Alerts", icon: Bell },
        { path: "/my-reports", label: "My Reports", icon: FileText },
      ];
    } else {
      roleLinks = [{ path: "/", label: "Home", icon: Home }];
    }
    return roleLinks;
  };

  const navLinks = getLinks();
  const commonLinks = [
    { path: "/about", label: "About Us", icon: Info },
    { path: "/contact", label: "Contact Us", icon: Mail },
  ];

  return (
    <>
      {/* Added: Global Full-Page Logout Animation Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300 px-4 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm sm:text-base text-indigo-900 font-medium animate-pulse tracking-wide">logging out...</p>
        </div>
      )}

      {/* Overlay with Blur */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-[100dvh] w-[80%] max-w-[300px] sm:w-72 bg-white border-r border-slate-200 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 flex justify-between items-center border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              UBA
            </span>
          </div>
          <button 
            onClick={() => setOpen(false)} 
            className="p-1.5 sm:p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="px-4 sm:px-6 py-3 shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <span className="inline-block px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 custom-scrollbar">
          <div className="space-y-1">
            <p className="px-3 text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2 sm:mt-0">
              Main Menu
            </p>
            {navLinks.map((item) => (
              <NavItem key={item.path} item={item} active={location.pathname === item.path} onClick={() => setOpen(false)} />
            ))}
          </div>

          <div className="mt-6 sm:mt-8 space-y-1">
            <p className="px-3 text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Support
            </p>
            {commonLinks.map((item) => (
              <NavItem key={item.path} item={item} active={location.pathname === item.path} onClick={() => setOpen(false)} />
            ))}
          </div>
        </nav>

        {/* Footer / Logout */}
        {user && (
          <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0">
            <button 
              onClick={handleLogout} // Updated this line
              disabled={isLoggingOut} // Added: Disable button while logging out
              className={`flex items-center gap-3 w-full px-3 py-3 sm:py-2 text-[15px] sm:text-sm font-medium rounded-lg transition-colors ${
                isLoggingOut 
                  ? 'opacity-50 cursor-not-allowed text-slate-600' 
                  : 'text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer active:scale-[0.98] sm:active:scale-100'
              }`}
            >
              <LogOut size={20} className="sm:w-[18px] sm:h-[18px]" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const NavItem = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-lg transition-all duration-200 group active:scale-[0.98] sm:active:scale-100 ${
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      <Icon size={20} className={`sm:w-[18px] sm:h-[18px] ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
      <span className="text-[15px] sm:text-sm font-medium">{item.label}</span>
    </Link>
  );
};

export default Sidebar;