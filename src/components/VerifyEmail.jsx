import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { MailCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
const COOLDOWN_TIME = 60;

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const email = location.state?.email || user?.email;
  const initialOtpSent = location.state?.otpSent || false;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(initialOtpSent);
  const [resendCooldown, setResendCooldown] = useState(
    initialOtpSent ? COOLDOWN_TIME : 0
  );
  const [pageReady, setPageReady] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const inputsRef = useRef([]);

  /* ------------------- EXISTING LOGIC (UNCHANGED) ------------------- */
  useEffect(() => {
    if (!authLoading) {
      if (!email) {
        toast.error("No email found");
        navigate("/", { replace: true });
      } else if (user?.isEmailVerified) {
        toast.success("Email already verified");
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
      const res = await axios.post(`${API_BASE}/api/v1/sendotp`, { email });
      toast.success(res.data.message || "OTP sent");
      setOtpSent(true);
      setResendCooldown(COOLDOWN_TIME);
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      setVerifying(true);
      await axios.post(`${API_BASE}/api/v1/verifyotp`, {
        email,
        otp: Number(finalOtp),
      });
      await refreshUser();
      setVerifiedSuccess(true);
      setTimeout(() => navigate("/", { replace: true }), 1600);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-slate-900">
              Verify Email
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Secure account verification
            </p>
          </div>

          {/* Email */}
          <input
            type="email"
            value={email}
            readOnly
            className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
          />

          {/* OTP */}
          <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                maxLength="1"
                value={digit}
                onChange={(e) => {
                  if (!/^\d?$/.test(e.target.value)) return;
                  const updated = [...otp];
                  updated[index] = e.target.value;
                  setOtp(updated);
                  if (e.target.value && index < 5)
                    inputsRef.current[index + 1]?.focus();
                }}
                className="w-10 h-12 text-center text-lg font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleVerify}
            disabled={!otpSent || verifying}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {verifying ? <><Spinner /> Verifying</> : "Verify Email"}
          </motion.button>

          <button
            onClick={sendOtp}
            disabled={sendingOtp || resendCooldown > 0}
            className="w-full mt-4 text-sm text-indigo-600 hover:underline disabled:text-slate-400"
          >
            {sendingOtp
              ? "Sending OTP..."
              : resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
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
}

export default VerifyEmail;