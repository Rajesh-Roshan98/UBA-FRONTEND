import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { KeyRound, ShieldCheck, Lock, MailCheck, Eye, EyeOff } from "lucide-react"; // 👁️ added Eye icons
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

// Add Password Regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// 🔥 NEW: Cooldown time constant
const COOLDOWN_TIME = 120; 

// Spinner component matching your VerifyEmail page
const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

const ForgotPassword = () => { 
  const navigate = useNavigate(); 

  // Logical steps: 'email', 'otp', 'reset', 'success'
  const [step, setStep] = useState('email');
  
  // 🔥 FIX: Changed state from 'email' to 'identifier' for clarity and dual-login support
  const [identifier, setIdentifier] = useState('');
  
  // Update OTP state to an array of 6 elements for the box model
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  
  // 👁️ State for password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 NEW: Resend cooldown state
  const [resendCooldown, setResendCooldown] = useState(0);

  // 🔥 PRO UPGRADE: Restore Cooldown on mount
  useEffect(() => {
    const expiry = localStorage.getItem("forgotPasswordCooldownExpiry");
    if (expiry) {
      const remaining = Math.floor((expiry - Date.now()) / 1000);
      if (remaining > 0) {
        setResendCooldown(remaining);
      } else {
        localStorage.removeItem("forgotPasswordCooldownExpiry");
      }
    }
  }, []);

  // 🔥 PRO UPGRADE: Clean React interval for cooldown (No memory leaks)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((p) => p - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 1. Request OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault(); // Added optional chaining so the Resend button can call this safely
    if (isLoading || resendCooldown > 0) return; // Prevents accidental double click execution and respects cooldown

    // Explicit validation: Only shows toast
    if (!identifier.trim()) {
      toast.error("Email or User ID is required");
      return;
    }

    // 🔥 FIX: Smart validation. Only run email regex if they typed an '@'
    const isEmail = identifier.includes("@");
    if (isEmail && !emailRegex.test(identifier)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    
    try {
      // 🔥 FIX: Send 'identifier' in payload
      const res = await api.post("/api/v1/auth/forgot-password/send-otp", { identifier: identifier.trim() });
      toast.success(res.data.message || "OTP sent successfully"); // 🔥 FIX 2: Universal phrasing
      setStep('otp'); 
      
      // 🔥 NEW: Start the cooldown timer and persist it
      const expiry = Date.now() + COOLDOWN_TIME * 1000;
      localStorage.setItem("forgotPasswordCooldownExpiry", expiry);
      setResendCooldown(COOLDOWN_TIME);

      // Auto-focus the first OTP box when transitioning to the OTP step
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (err) {
      // 🔥 UPDATED: Dynamic Rate Limit UX
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || COOLDOWN_TIME;
        
        // Start cooldown timer to disable resend button & Persist across reloads
        const expiry = Date.now() + retryAfter * 1000;
        localStorage.setItem("forgotPasswordCooldownExpiry", expiry);
        setResendCooldown(retryAfter);

        toast.error(err.response.data?.message || `Too many OTP requests. Please try again in ${retryAfter} seconds.`);
      } else {
        const errorMsg = err.response?.data?.message || "Failed to send OTP";
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevents accidental double click execution

    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    setIsLoading(true);
    try {
      // 🔥 FIX: Send 'identifier' in payload
      const res = await api.post("/api/v1/auth/forgot-password/verify-otp", { 
        identifier: identifier.trim(), 
        otp: Number(finalOtp) 
      });
      toast.success(res.data.message || "OTP Verified!");
      setStep('reset');
    } catch (err) {
      // 🔥 UPDATED: Rate Limit UI catch
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || 60;
        toast.error(err.response.data?.message || `Too many attempts. Please try again in ${retryAfter} seconds.`);
      } else {
        const errorMsg = err.response?.data?.message || "Invalid OTP";
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 UX UPGRADE: Auto-submit on full OTP
  useEffect(() => {
    if (otp.join("").length === 6) {
      // Pass a fake event to prevent e.preventDefault() from crashing
      handleVerifyOtp({ preventDefault: () => {} }); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  // 3. Update Database
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevents accidental double click execution

    if (!passwords.new || !passwords.confirm) {
      toast.error("All fields are required.");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    // NEW: Password Strength Regex Validation
    if (!PASSWORD_REGEX.test(passwords.new)) {
      toast.error("Password must include uppercase, lowercase, number, and special character.");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    const finalOtp = otp.join("");
    setIsLoading(true);
    try {
      // 🔥 FIX: Send 'identifier' in payload
      const res = await api.post("/api/v1/auth/forgot-password/reset", { 
        identifier: identifier.trim(), 
        otp: Number(finalOtp), 
        newPassword: passwords.new 
      });
      
      toast.success(res.data.message || "Password updated successfully");
      setStep('success');
      setIsLoading(false); // 🔥 FIX 1: Ensure loading state is turned off on success

      // Navigate to login page after a short delay so the user can see the success toast
      // FIXED: Added { replace: true } to clear the history stack
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
      
    } catch (err) {
      // 🔥 UPDATED: Rate Limit UI catch
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || 60;
        toast.error(err.response.data?.message || `Too many attempts. Please try again in ${retryAfter} seconds.`);
      } else {
        const errorMsg = err.response?.data?.message || "Failed to update password";
        toast.error(errorMsg);
      }
      setIsLoading(false); 
    }
  };

  // 🔥 PRO UX: Boolean to determine if the reset password button should be disabled
  const isResetDisabled = isLoading || !passwords.new || !PASSWORD_REGEX.test(passwords.new) || passwords.new !== passwords.confirm;

  return (
    <div className="h-screen w-screen fixed inset-0 bg-slate-50 overflow-hidden">
      {/* MATRIX BACKGROUND (Copied exactly from VerifyEmail) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-slate-50 to-white" />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
          style={{
            maskImage:
              "radial-gradient(circle at center, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        />
        <div className="absolute -top-32 -left-32 w-150 h-150 bg-purple-200/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute -top-32 -right-32 w-150 h-150 bg-indigo-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-150 h-150 bg-blue-200/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        
        {/* Render Card for Steps 1, 2, and 3 */}
        {step !== 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-xl shadow-indigo-500/10"
          >
            {/* Step 1: Enter Email/Identifier */}
            {step === 'email' && (
              <form onSubmit={handleRequestOtp} noValidate>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <KeyRound size={30} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Enter your email or ID to receive a recovery code
                  </p>
                </div>

                <div className="relative w-full mb-6">
                  <input 
                    type="text" // 🔥 FIX: Changed from "email" to "text"
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)} 
                    placeholder="Email or User ID" // 🔥 FIX: Updated placeholder
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 bg-white"
                  />
                </div>

                <motion.button
                  whileHover={isLoading || resendCooldown > 0 ? {} : { scale: 1.04 }}
                  whileTap={isLoading || resendCooldown > 0 ? {} : { scale: 0.96 }}
                  type="submit" 
                  disabled={isLoading || resendCooldown > 0}
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                >
                  {isLoading 
                    ? <><Spinner /> Sending...</> 
                    : resendCooldown > 0 
                    ? `Wait ${resendCooldown}s to Send` 
                    : 'Send OTP'}
                </motion.button>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} noValidate>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ShieldCheck size={30} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Verify OTP</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    We sent a 6-digit code to <strong>{identifier}</strong>
                  </p>
                </div>

                {/* 6-Box OTP Input Array */}
                <div className="flex justify-between gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      value={digit}
                      onFocus={(e) => e.target.select()} 
                      onChange={(e) => {
                        const val = e.target.value.slice(-1); 
                        if (!/^\d?$/.test(val)) return;
                        const updated = [...otp];
                        updated[index] = val;
                        setOtp(updated);
                        if (val && index < 5)
                          inputsRef.current[index + 1]?.focus();
                      }}
                      // 🔥 NEW UX UPGRADE: Backspace & Arrow navigation
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          inputsRef.current[index - 1]?.focus();
                        }
                        if (e.key === "ArrowLeft" && index > 0) {
                          inputsRef.current[index - 1]?.focus();
                        }
                        if (e.key === "ArrowRight" && index < 5) {
                          inputsRef.current[index + 1]?.focus();
                        }
                      }}
                      // 🔥 NEW UX UPGRADE: Paste full OTP support
                      onPaste={(e) => {
                        const pasteData = e.clipboardData.getData("text").slice(0, 6);
                        if (!/^\d+$/.test(pasteData)) return;

                        const updated = pasteData.split("");
                        setOtp([...updated, ...Array(6 - updated.length).fill("")]);

                        inputsRef.current[Math.min(updated.length, 5)]?.focus();
                        e.preventDefault();
                      }}
                      className="w-10 h-12 text-center text-lg font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={isLoading || otp.join("").length !== 6 ? {} : { scale: 1.04 }}
                  whileTap={isLoading || otp.join("").length !== 6 ? {} : { scale: 0.96 }}
                  type="submit" 
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                >
                  {isLoading ? <><Spinner /> Verifying...</> : 'Verify Code'}
                </motion.button>

                {/* 🔥 NEW: Resend OTP Button exactly matching your VerifyEmail page */}
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isLoading || resendCooldown > 0}
                  className="w-full mt-4 text-sm text-indigo-600 hover:underline disabled:text-slate-400 disabled:cursor-not-allowed disabled:no-underline"
                >
                  {isLoading
                    ? "Sending OTP..."
                    : resendCooldown > 0
                      ? `Resend OTP in ${Math.floor(resendCooldown / 60)}:${String(resendCooldown % 60).padStart(2, "0")}` 
                      : "Resend OTP"}
                </button>
              </form>
            )}

            {/* Step 3: Set New Password (with eye icons) */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} noValidate>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Lock size={30} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Set New Password</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Create a strong new password
                  </p>
                </div>

                {/* New Password field with eye toggle */}
                <div className="relative w-full mb-4">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="New Password (min 8 chars)" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600 focus:outline-none"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Confirm Password field with eye toggle */}
                <div className="relative w-full mb-6">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm Password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <motion.button
                  whileHover={isResetDisabled ? {} : { scale: 1.04 }}
                  whileTap={isResetDisabled ? {} : { scale: 0.96 }}
                  type="submit" 
                  disabled={isResetDisabled} // 🔥 FIX: Disables button if regex fails or passwords don't match
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                >
                  {isLoading ? <><Spinner /> Updating...</> : 'Update Password'}
                </motion.button>
              </form>
            )}
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-xl shadow-indigo-500/10 border border-slate-100"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-600 flex items-center justify-center">
              <MailCheck className="text-white" size={30} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
            <p className="text-slate-600 mb-6">
              Your password has been successfully updated. Redirecting to login...
            </p>
            
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/login", { replace: true })}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
            >
              Return to Login Page
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
