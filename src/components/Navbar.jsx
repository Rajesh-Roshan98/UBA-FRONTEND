import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; 
import UserAvatar from "./UserAvatar";
import NotificationBell from "./Notification";
import Sidebar from "./Sidebar"; 
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null;

  const getInitials = (user) => {
    if (!user) return "";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  // 🔥 UPDATED LOGIC: Three-tier link system
  const navLinks = !isAuthenticated
    ? [
        // 1. Visitor Links (Common Pages)
        { path: "/", label: "Home" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
      ]
    : isAdmin
    ? [
        // 2. Admin Links
        { path: "/admin-homepage", label: "Home" },
        { path: "/admin-dashboard", label: "Dashboard" },
        { path: "/system-logs", label: "Logs" }, 
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
      ]
    : [
        // 3. Regular User Links
        { path: "/", label: "Home" },
        { path: "/user-dashboard", label: "Dashboard" },
        { path: "/activity", label: "My Activity" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
      ];

  return (
    <>
      <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

      <nav
        className={`fixed top-0 w-full h-14 z-40 transition-all duration-300
          ${
            scrolled
              ? "bg-white/50 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/30 shadow-sm"
              : "bg-transparent"
          }
        `}
      >
        <div className="w-full h-full px-4 md:px-8 grid grid-cols-3 items-center">
          
          <div className="flex justify-start items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                scrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-800 hover:bg-white/20"
              }`}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>

            <Link
              to={isAdmin ? "/admin-homepage" : "/"}
              className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600"
            >
              UBA
            </Link>
          </div>

          <div className="flex justify-center hidden lg:flex">
            <ul className="flex gap-8 text-sm font-medium">
              {navLinks.map(({ path, label }) => {
                const active = location.pathname === path;

                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`transition-colors duration-200 ${
                        active
                          ? "text-indigo-600 font-semibold"
                          : scrolled
                          ? "text-slate-700 hover:text-indigo-600"
                          : "text-slate-800 hover:text-indigo-600"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex justify-end items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <NotificationBell />
                <UserAvatar user={user} fallback={getInitials(user)} />
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;