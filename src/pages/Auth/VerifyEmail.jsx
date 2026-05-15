import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { MailCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { maskEmail } from "../../utils/maskData"; // 🔥 NEW: Imported masking utility

const COOLDOWN_TIME = 120; // 🔥 FIX 1: Changed to 120 seconds (2 minutes)

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const email = location.state?.email || user?.email;
  // 🔥 FIX 2: Default to true because Settings & Signup already sent the OTP before navigating here
  const initialOtpSent = location.state?.otpSent ?? true;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(initialOtpSent);
  const [resendCooldown, setResendCooldown] = useState(
    initialOtpSent ? COOLDOWN_TIME : 0,
  );
  const [pageReady, setPageReady] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const inputsRef = useRef([]);

  // 🔥 PRO UPGRADE: Restore Cooldown on mount
  useEffect(() => {
    const expiry = localStorage.getItem("verifyEmailCooldownExpiry");
    if (expiry) {
      const expiryTime = Number(expiry);
      const remaining = Math.floor((expiryTime - Date.now()) / 1000);
      if (remaining > 0) {
        setResendCooldown(remaining);
      } else {
        localStorage.removeItem("verifyEmailCooldownExpiry");
      }
    }
  }, []);

  /* ------------------- EXISTING LOGIC (UNCHANGED) ------------------- */
  useEffect(() => {
    if (!authLoading) {
      if (!email) {
        toast.error("No email found");
        navigate("/", { replace: true });
      } else if (user?.isEmailVerified) {
        toast.success("Email verified successfully.");
        navigate("/", { replace: true });
      } else {
        setPageReady(true);
      }
    }
  }, [authLoading, email, navigate, user?.isEmailVerified]);

  useEffect(() => {
    if (otpSent && pageReady) {
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [otpSent, pageReady]);

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((p) => (p <= 1 ? 0 : p - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendOtp = async () => {
    if (!email || sendingOtp || resendCooldown > 0) return;
    try {
      setSendingOtp(true);
      await api.post(`/api/v1/auth/sendotp`, { email });
      
      // 🔥 FIX: Removed backend message dependency. Hardcoded UI string instead.
      toast.success("Verification code sent successfully.");
      setOtpSent(true);
      
      // 🔥 PRO UPGRADE: Start the cooldown timer and persist it
      const expiry = Date.now() + COOLDOWN_TIME * 1000;
      localStorage.setItem("verifyEmailCooldownExpiry", expiry);
      setResendCooldown(COOLDOWN_TIME);
      
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err) {
      // 🔥 UPDATED: Dynamic Rate Limit UX
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || COOLDOWN_TIME;
        
        // Start cooldown timer to disable resend button & Persist across reloads
        const expiry = Date.now() + retryAfter * 1000;
        localStorage.setItem("verifyEmailCooldownExpiry", expiry);
        setResendCooldown(retryAfter);

        toast.error(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
      } else {
        toast.error("Unable to send verification code. Please try again later.");
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = async () => {
    if (verifying) return; // 🔥 PREVENTS DOUBLE-EXECUTION FROM FAST CLICKS/AUTO-SUBMIT

    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setVerifying(true);
      await api.post(`/api/v1/auth/verifyotp`, {
        email,
        otp: Number(finalOtp),
      });
      await refreshUser();
      setVerifiedSuccess(true);
      setTimeout(() => navigate("/", { replace: true }), 1600);
    } catch (err) {
      // 🔥 UPDATED: Rate Limit UI catch
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || 60;
        toast.error(`Too many verification attempts. Please try again in ${retryAfter} seconds.`);
      } else {
        toast.error("The verification code is incorrect or has expired.");
      }
    } finally {
      setVerifying(false);
    }
  };

  // 🔥 NEW UX UPGRADE: Auto-submit on full OTP
  useEffect(() => {
    if (otp.join("").length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (!pageReady) return null;

  /* ------------------- UI ------------------- */
  return (
    <div className="h-screen w-screen fixed inset-0 bg-slate-50 overflow-hidden">
      {/* MATRIX BACKGROUND (same as Login / Signup) */}
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

      {/* CARD */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-xl shadow-indigo-500/10"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ShieldCheck size={30} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Verify Email</h2>
            <p className="text-sm text-slate-600 mt-1">
              Secure account verification
            </p>
          </div>

          {/* Email */}
          <input
            type="email"
            value={maskEmail(email)} // 🔥 NEW: Visually mask the email using the utility
            readOnly
            className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
          />

          {/* OTP */}
          <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                autoComplete="one-time-code" // 🔥 ADDED: WebOTP API Support for mobile auto-fill
                ref={(el) => (inputsRef.current[index] = el)}
                value={digit}
                onFocus={(e) => e.target.select()} // 🔥 NEW: Auto-selects text when tapped
                onChange={(e) => {
                  // 🔥 NEW: Grabs the last typed character so users can overwrite instantly
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
                className="w-10 h-12 text-center text-lg font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            ))}
          </div>

          <motion.button
            // 🔥 Conditionally disable the framer-motion hover/tap scaling if the button is disabled
            whileHover={verifying || otp.join("").length !== 6 ? {} : { scale: 1.04 }}
            whileTap={verifying || otp.join("").length !== 6 ? {} : { scale: 0.96 }}
            onClick={handleVerify}
            // 🔥 FIX 3: Replaced the old broken logic with this clean check
            disabled={verifying || otp.join("").length !== 6} 
            // 🔥 ADDED: disabled:cursor-not-allowed and disabled:hover:bg-indigo-600
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
          >
            {verifying ? (
              <>
                <Spinner /> Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </motion.button>

          <button
            onClick={sendOtp}
            // 🔥 UX UPGRADE: Disable when there is no email to prevent API crashes
            disabled={!email || sendingOtp || resendCooldown > 0}
            // 🔥 ADDED: disabled:cursor-not-allowed and disabled:no-underline
            className="w-full mt-4 text-sm text-indigo-600 hover:underline disabled:text-slate-400 disabled:cursor-not-allowed disabled:no-underline"
          >
            {sendingOtp
              ? "Sending OTP..."
              : resendCooldown > 0
                // 🔥 FIX 4: Converted the raw seconds into a nice MM:SS visual format
                ? `Resend OTP in ${Math.floor(resendCooldown / 60)}:${String(resendCooldown % 60).padStart(2, "0")}` 
                : "Resend OTP"}
          </button>
        </motion.div>
      </div>

      {/* SUCCESS OVERLAY */}
      {verifiedSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-indigo-600 flex items-center justify-center">
              <MailCheck className="text-white" size={26} />
            </div>
            <p className="text-lg font-semibold text-slate-900">
              Email Verified Successfully
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Redirecting to homepage...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
