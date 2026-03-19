import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { KeyRound, ShieldCheck, Lock, MailCheck } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

const API_BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";

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
  const [email, setEmail] = useState('');
  
  // Update OTP state to an array of 6 elements for the box model
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 NEW: Resend cooldown state
  const [resendCooldown, setResendCooldown] = useState(0);

  // 🔥 NEW: Timer Effect
  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((p) => (p <= 1 ? 0 : p - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // 1. Request OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault(); // Added optional chaining so the Resend button can call this safely
    if (isLoading || resendCooldown > 0) return; // Prevents accidental double click execution and respects cooldown

    // Explicit validation: Only shows toast
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await axios.post(`${API_BASE}/api/v1/forgot-password/send-otp`, { email });
      toast.success(res.data.message || "OTP sent to your email");
      setStep('otp'); 
      
      // 🔥 NEW: Start the cooldown timer
      setResendCooldown(COOLDOWN_TIME);

      // Auto-focus the first OTP box when transitioning to the OTP step
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send OTP";
      toast.error(errorMsg);
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
      toast.error("OTP must be exactly 6 digits.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/forgot-password/verify-otp`, { 
        email, 
        otp: Number(finalOtp) 
      });
      toast.success(res.data.message || "OTP Verified!");
      setStep('reset');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid OTP";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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
      const res = await axios.post(`${API_BASE}/api/v1/forgot-password/reset`, { 
        email, 
        otp: Number(finalOtp), 
        newPassword: passwords.new 
      });
      
      toast.success(res.data.message || "Password updated successfully");
      setStep('success');

      // Navigate to login page after a short delay so the user can see the success toast
      // FIXED: Added { replace: true } to clear the history stack
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update password";
      toast.error(errorMsg);
      setIsLoading(false); 
    }
  };

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
            {/* Step 1: Enter Email */}
            {step === 'email' && (
              <form onSubmit={handleRequestOtp} noValidate>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <KeyRound size={30} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Enter your email to receive a recovery code
                  </p>
                </div>

                <div className="relative w-full mb-6">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="example@domain.com" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 bg-white"
                  />
                </div>

                <motion.button
                  whileHover={isLoading ? {} : { scale: 1.04 }}
                  whileTap={isLoading ? {} : { scale: 0.96 }}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                >
                  {isLoading ? <><Spinner /> Sending...</> : 'Send OTP'}
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
                    We sent a 6-digit code to <strong>{email}</strong>
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

            {/* Step 3: Set New Password */}
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

                <div className="relative w-full mb-4">
                  <input 
                    type="password" 
                    placeholder="New Password (min 8 chars)" 
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 bg-white"
                  />
                </div>
                
                <div className="relative w-full mb-6">
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 bg-white"
                  />
                </div>

                <motion.button
                  whileHover={isLoading ? {} : { scale: 1.04 }}
                  whileTap={isLoading ? {} : { scale: 0.96 }}
                  type="submit" 
                  disabled={isLoading}
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