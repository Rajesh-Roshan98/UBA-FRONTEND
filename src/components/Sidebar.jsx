import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/logs", label: "Logs" },

    // Admin Section
    { path: "/admin-dashboard", label: "Admin Dashboard" },
    { path: "/user-management", label: "User Management" },
    { path: "/system-logs", label: "System Logs" },
    { path: "/reports", label: "Reports" },
    { path: "/alerts", label: "Alerts" },

    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 p-5 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-indigo-600">Menu</h2>

          <button onClick={() => setOpen(false)} className="text-xl">
            ✕
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="mb-5 p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}

        {/* Links */}
        <ul className="flex flex-col gap-2">
          {links.map((item) => {
            const active = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-md transition ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-indigo-50 text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
