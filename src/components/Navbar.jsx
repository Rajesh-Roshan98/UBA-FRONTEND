import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav
      className={`fixed top-0 w-full h-14 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-white/50 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/30 shadow-sm"
            : "bg-transparent"
        }
      `}
    >
      {/* CRITICAL CHANGES HERE:
         1. Removed 'max-w-7xl mx-auto' (This allows the navbar to touch the edges of the screen)
         2. Added 'w-full' (Forces full width)
         3. Used 'grid grid-cols-3' (Creates 3 equal sections: Left, Center, Right)
      */}
      <div className="w-full h-full px-8 grid grid-cols-3 items-center">
        
        {/* --- LEFT: Logo --- */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600"
          >
            UBA
          </Link>
        </div>

        {/* --- CENTER: Links --- */}
        <div className="flex justify-center">
          <ul className="hidden md:flex gap-8 text-sm font-medium">
            {["/", "/dashboard", "/logs", "/about", "/contact"].map((path, i) => {
              const label = ["Home", "Dashboard", "Logs", "About", "Contact"][i];
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

        {/* --- RIGHT: Auth --- */}
        <div className="flex justify-end items-center gap-3">
          {isAuthenticated && user ? (
            <UserAvatar user={user} fallback={getInitials(user)} />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;