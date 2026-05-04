import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react"; // 🔥 Removed ArrowLeft
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../services/api"; // Adjust path if it's in a different folder

// 🔥 FIX: Extracted regex outside component to prevent ReferenceErrors and improve performance
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 🔥 NEW: Cooldown state for rate limiting UX
  const [cooldown, setCooldown] = useState(0);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // 🔥 PRO UPGRADE: Restore Cooldown on mount
  useEffect(() => {
    const expiry = localStorage.getItem("resetPasswordCooldownExpiry");
    if (expiry) {
      const remaining = Math.floor((expiry - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        localStorage.removeItem("resetPasswordCooldownExpiry");
      }
    }
  }, []);

  // 🔥 PRO UPGRADE: Clean React interval for cooldown (No memory leaks)
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((p) => p - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || cooldown > 0) return;

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    // 🔥 PRO POLISH: Validate current password length to save a useless API call
    if (formData.currentPassword.trim().length < 6) {
      toast.error("Current password seems invalid");
      return;
    }

    // 🔥 FIX: Accurate error message mapping exactly to what the regex requires
    if (!STRONG_PASSWORD_REGEX.test(formData.newPassword)) {
      toast.error("Password must include uppercase, lowercase, number, and special character.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // Calls the backend to change the password
      const response = await api.put("/api/v1/auth/change-password", {
        // 🔥 PRO POLISH: Added .trim() to prevent trailing space errors
        currentPassword: formData.currentPassword.trim(),
        newPassword: formData.newPassword,
      });

      toast.success(response.data.message || "Password updated successfully");
      
      // 🔥 FIX: Redirect immediately without timeout
      navigate("/settings", { replace: true });
    } catch (err) {
      console.error("Password change error:", err);

      // 🔥 UPDATED: Dynamic Rate Limit UX
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || 60;
        
        // Start cooldown timer to disable button & Persist across reloads
        const expiry = Date.now() + retryAfter * 1000;
        localStorage.setItem("resetPasswordCooldownExpiry", expiry);
        setCooldown(retryAfter);

        toast.error(err.response.data?.message || `Too many attempts. Please try again in ${retryAfter} seconds.`);
      } else {
        toast.error(err?.response?.data?.message || err.message || "Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 PRO UX: Boolean to determine if the reset password button should be disabled
  const isResetDisabled = loading || cooldown > 0 || !formData.newPassword || !STRONG_PASSWORD_REGEX.test(formData.newPassword) || formData.newPassword !== formData.confirmPassword;


  return (
    <div className="h-screen w-screen fixed inset-0 bg-slate-50 overflow-hidden">
      {/* MATRIX BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50 to-white" />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{
            maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        />
        <div className="absolute -top-32 -left-32 w-[150%] h-[150%] bg-purple-200/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute -top-32 -right-32 w-[150%] h-[150%] bg-indigo-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-[150%] h-[150%] bg-blue-200/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* CARD */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-xl shadow-indigo-500/10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ShieldCheck size={30} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
            <p className="text-sm text-slate-500 mt-1">
              Create a new, strong password to secure your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  autoComplete="current-password" // 🔥 PRO POLISH: Added autocomplete
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password" // 🔥 PRO POLISH: Added autocomplete
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password" // 🔥 PRO POLISH: Added autocomplete
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={isResetDisabled ? {} : { scale: 1.02 }}
              whileTap={isResetDisabled ? {} : { scale: 0.98 }}
              type="submit"
              disabled={isResetDisabled}
              className="w-full mt-2 flex justify-center items-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner /> Updating...
                </>
              ) : cooldown > 0 ? (
                `Wait ${cooldown}s`
              ) : (
                "Update Password"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;