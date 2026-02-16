import React, { useState } from "react";
import axios from "axios";
import { Mail, User, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

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
      await axios.post(`${API_BASE}/api/contact`, formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    // UPDATED: 'fixed inset-0' locks it to viewport. 'overflow-hidden' kills all scrollbars.
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-slate-50 flex items-center justify-center font-sans selection:bg-indigo-100 selection:text-indigo-900 overscroll-none">
      
      {/* --- BACKGROUND GRID EFFECT --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
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
      {/* Added max-h-screen to ensure card fits if screen is short */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl w-full max-w-lg p-8 mx-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
          Contact Us
        </h2>
        <p className="text-slate-600 text-center mb-6">
          Have questions or found an anomaly? Get in touch with us.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-slate-700 text-sm font-medium">Name</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
              <User className="text-indigo-500" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="bg-transparent w-full px-3 py-2 text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-slate-700 text-sm font-medium">Email</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
              <Mail className="text-indigo-500" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="bg-transparent w-full px-3 py-2 text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-slate-700 text-sm font-medium">Message</label>
            <div className="flex bg-slate-50 border border-slate-200 rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
              <MessageSquare className="text-indigo-500 mt-3" size={18} />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Write your message..."
                className="bg-transparent w-full px-3 py-2 text-slate-700 outline-none resize-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-2.5 text-white font-semibold shadow-md shadow-indigo-200 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;