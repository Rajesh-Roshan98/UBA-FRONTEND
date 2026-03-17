import React from "react";
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

  // Handle logout and close sidebar simultaneously
  const handleLogout = () => {
    setOpen(false); // Closes the sidebar
    logout();      // Existing logout logic
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
        { path: "/model-results", label: "Model Results", icon: BarChart3 },
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
      {/* Overlay with Blur */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              UBA
            </span>
          </div>
          <button 
            onClick={() => setOpen(false)} 
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            {navLinks.map((item) => (
              <NavItem key={item.path} item={item} active={location.pathname === item.path} onClick={() => setOpen(false)} />
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Support
            </p>
            {commonLinks.map((item) => (
              <NavItem key={item.path} item={item} active={location.pathname === item.path} onClick={() => setOpen(false)} />
            ))}
          </div>
        </nav>

        {/* Footer / Logout */}
        {user && (
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout} // Updated this line
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      <Icon size={18} className={`${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
      <span className="text-sm font-medium">{item.label}</span>
    </Link>
  );
};

export default Sidebar;