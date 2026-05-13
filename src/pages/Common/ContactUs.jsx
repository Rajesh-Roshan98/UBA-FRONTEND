import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Mail, User, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

// 🔥 NEW: Import useAuth to grab the logged-in user automatically
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const ContactUs = () => {
  // 🔥 UPDATED: Pull the loading state from AuthContext (aliased to avoid conflict)
  const { user, loading: isAuthLoading } = useAuth();

  // Helper function to safely combine firstName and lastName from your database
  const getFullName = (u) => {
    if (!u) return "";
    const first = u.firstName || "";
    const last = u.lastName || "";
    return `${first} ${last}`.trim();
  };

  const [formData, setFormData] = useState({
    name: getFullName(user), // <-- Updated to use the helper
    email: user?.email || "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // --- NEW: Pre-fill data if user is logged in ---
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: getFullName(user), // <-- Updated to use the helper
        email: user.email || "",
      }));
    }
  }, [user]);
  // -----------------------------------------------

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      await api.post(`${API_BASE}/api/v1/auth/contact`, formData);
      toast.success("Message sent successfully!");
      
      // UPDATED: Keep name and email filled after sending if logged in, clear only message
      setFormData({ 
        name: getFullName(user), // <-- Updated to use the helper
        email: user?.email || "", 
        message: "" 
      });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // --- CONDITIONAL RENDERING: EXACTLY LIKE ADMIN HOMEPAGE ---
  if (isAuthLoading) {
    return (
      <div className="relative h-full w-full bg-slate-50 flex items-center justify-center font-sans selection:bg-indigo-100 selection:text-indigo-900 py-10 px-4 sm:px-6 lg:px-8">
        
        {/* --- BACKGROUND GRID EFFECT --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-slate-50 to-white"></div>
          
          {/* The Grid Pattern */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
            style={{
              maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
            }}
          ></div>
        </div>

        {/* Admin Home Page Loading Animation Style */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[90%] sm:max-w-md lg:max-w-lg bg-white/50 backdrop-blur-md rounded-xl p-8 sm:p-12 md:p-16">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-500 text-center">
            Loading Contact Us...
          </p>
        </div>
      </div>
    );
  }

  return (
    // UPDATED: Changed min-h-[100dvh] back to h-full to delegate scrolling to parent layout and fix PC scrollbar issue
    <div className="relative h-full w-full bg-slate-50 flex items-center justify-center font-sans selection:bg-indigo-100 selection:text-indigo-900 py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      
      {/* --- BACKGROUND GRID EFFECT --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-slate-50 to-white"></div>
        
        {/* The Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
          style={{
            maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        ></div>
      </div>

      {/* --- FORM CARD --- */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl w-full max-w-[95%] sm:max-w-md lg:max-w-lg p-6 sm:p-8 md:p-10 mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-2">
          Contact Us
        </h2>
        <p className="text-sm sm:text-base text-slate-600 text-center mb-6 sm:mb-8 px-2 sm:px-0">
          Have questions or found an anomaly? Get in touch with us.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name */}
          <div>
            <label className="text-slate-700 text-sm sm:text-base font-medium">Name</label>
            {/* UPDATED: Dynamic wrapper classes for hover state */}
            <div className={`flex items-center border border-slate-200 rounded-lg px-3 mt-1.5 transition-all ${user ? "bg-slate-100 cursor-not-allowed opacity-80" : "bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400"}`}>
              <User className={user ? "text-slate-400 shrink-0" : "text-indigo-500 shrink-0"} size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!!user} // <-- Disables if user exists
                placeholder="Your name"
                className="bg-transparent w-full px-3 py-3 sm:py-2.5 text-base text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-slate-700 text-sm sm:text-base font-medium">Email</label>
            {/* UPDATED: Dynamic wrapper classes for hover state */}
            <div className={`flex items-center border border-slate-200 rounded-lg px-3 mt-1.5 transition-all ${user ? "bg-slate-100 cursor-not-allowed opacity-80" : "bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400"}`}>
              <Mail className={user ? "text-slate-400 shrink-0" : "text-indigo-500 shrink-0"} size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!user} // <-- Disables if user exists
                placeholder="your@email.com"
                className="bg-transparent w-full px-3 py-3 sm:py-2.5 text-base text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-slate-700 text-sm sm:text-base font-medium">Message</label>
            <div className="flex bg-slate-50 border border-slate-200 rounded-lg px-3 mt-1.5 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
              <MessageSquare className="text-indigo-500 mt-3.5 sm:mt-3 shrink-0" size={20} />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Write your message..."
                className="bg-transparent w-full px-3 py-3 sm:py-2.5 text-base text-slate-700 outline-none resize-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-lg mt-4 sm:mt-2 py-3 sm:py-2.5 text-base text-white font-semibold shadow-md shadow-indigo-200 disabled:opacity-70 active:scale-[0.98]"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
