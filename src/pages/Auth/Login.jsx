import React, { useState, useEffect } from "react";
import "../../index.css";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
// 🔥 FIX: Added RefreshCw for the CAPTCHA reload button
import { Mail, Lock, Eye, EyeOff, ShieldCheck, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔥 FIX: Changed state from 'email' to 'identifier'
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: Cooldown state for rate limiting UX
  const [cooldown, setCooldown] = useState(0);

  // 🔥 NEW: CAPTCHA States
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaData, setCaptchaData] = useState({ captchaImage: "", captchaToken: "" });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 🔥 NEW: Function to fetch CAPTCHA from backend
  const fetchCaptcha = async () => {
    try {
      // Adjust this endpoint URL if your router uses a different path for exports.getCaptcha
      const res = await api.get("/api/v1/auth/get-captcha");
      if (res.data.success) {
        setCaptchaData({
          captchaImage: res.data.captchaImage,
          captchaToken: res.data.captchaToken,
        });
        setCaptchaInput(""); // Clear input on refresh
      }
    } catch (error) {
      console.error("Failed to fetch CAPTCHA", error);
      // 🔥 UPDATED: Read the exact retryAfter payload to show a smart countdown
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.data?.retryAfter || 60;
        const timeText = retryAfter < 60 ? `${retryAfter} seconds` : `${Math.ceil(retryAfter / 60)} minutes`;
        toast.error(`CAPTCHA limit reached. Please wait ${timeText}.`);
      } else {
        toast.error("Failed to load security CAPTCHA");
      }
    }
  };

  // 🔥 PRO UPGRADE: Fetch CAPTCHA & Restore Cooldown on mount
  useEffect(() => {
    const expiry = localStorage.getItem("loginCooldownExpiry");

    if (expiry) {
      const remaining = Math.floor((expiry - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        localStorage.removeItem("loginCooldownExpiry");
      }
    }

    fetchCaptcha();
  }, []);

  // 🔥 PRO UPGRADE: Clean React interval for cooldown (No memory leaks)
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount/re-render
  }, [cooldown]);

  const loginHandler = async (e) => {
    e.preventDefault();
    if (loading || cooldown > 0) return;

    if (!identifier || !password) {
      toast.error("Email/User ID and password are required");
      return;
    }

    // 🔥 NEW: CAPTCHA Validation before hitting backend
    if (!captchaInput) {
      toast.error("Please enter the CAPTCHA characters");
      return;
    }
    
    // 🔥 NEW: CAPTCHA Fallback if the token didn't load properly
    if (!captchaData.captchaToken) {
      toast.error("Security verification failed. Please refresh.");
      return;
    }

    // 🔥 FIX: Smart validation. Only run email regex if they typed an '@'
    const isEmail = identifier.includes("@");
    if (isEmail && !emailRegex.test(identifier)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // 🔥 FIX: Removed password strength validation here. 
    // Users with old/weaker passwords must still be allowed to log in!

    try {
      setLoading(true);
      const res = await api.post("/api/v1/auth/login", {
        // 🔥 PRO POLISH: Removed .toLowerCase() to preserve case-sensitive usernames!
        identifier: identifier.trim(), 
        password,
        // 🔥 NEW: Inject CAPTCHA data into the payload
        captchaInput: captchaInput.trim(),
        captchaToken: captchaData.captchaToken,
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Login failed");
        
        // 🔥 NEW: Refresh CAPTCHA from backend payload if provided, otherwise fetch fresh
        if (res.data.newCaptcha) {
          setCaptchaData({
            captchaImage: res.data.newCaptcha.captchaImage,
            captchaToken: res.data.newCaptcha.captchaToken,
          });
          setCaptchaInput("");
        } else {
          fetchCaptcha();
        }
        return;
      }

      const token = res.data.token;
      
      // 1. Pass the token to AuthContext's login function
      await login(token);
      toast.success("Login successful");

      // 2. Handle Redirection based on OTP requirements
      if (res.data.requiresOtp) {
        // 🔥 FIX: Pass their actual real email from the database response, NOT the identifier they typed!
        // We use an optional chain fallback just in case.
        navigate("/verify-otp", { state: { email: res.data.user?.email || identifier } });
      } else {
        
        // 🔥 FIX: Safely decode the JWT token to guarantee we get the correct role
        let userRole = "user"; // Default fallback
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          userRole = payload.role;
        } catch (decodeErr) {
          console.error("Could not decode token for role mapping", decodeErr);
        }
        
        // 3. Role-Based Navigation
        if (userRole === "admin") {
          // Replaces history so the admin cannot use the back button to return to public pages
          navigate("/admin-homepage", { replace: true });
        } else {
          // Normal users proceed normally without the replace override
          navigate("/");
        }
      }

    } catch (err) {
      // 🔥 UPDATED: Dynamic Rate Limit UX based on retryAfter
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || 600; // default to 10 mins if missing
        
        // Start cooldown timer to disable button & Persist across reloads
        const expiry = Date.now() + retryAfter * 1000;
        localStorage.setItem("loginCooldownExpiry", expiry);
        setCooldown(retryAfter);

        toast.error(err.response.data?.message || `Too many login attempts. Please try again in ${retryAfter} seconds.`);
      } else {
        const errorMsg = err.response?.data?.message || "Invalid credentials";
        toast.error(errorMsg);
      }
      
      // 🔥 NEW: Automatically update CAPTCHA if backend generated a new one during rejection
      if (err.response?.data?.newCaptcha) {
        setCaptchaData({
          captchaImage: err.response.data.newCaptcha.captchaImage,
          captchaToken: err.response.data.newCaptcha.captchaToken,
        });
        setCaptchaInput("");
      } else if (err.response?.status !== 429) { // Only fetch new captcha if not rate limited
        fetchCaptcha();
      }
    } finally {
      setLoading(false);
    }
  };

  /* Animations (same language as homepage) */
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-screen w-screen fixed inset-0 bg-slate-50 overflow-hidden">
      {/* ───── MATRIX GRID BACKGROUND ───── */}
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

        <div className="absolute -top-32 -left-32 w-150 h-150 bg-purple-200/40 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob" />
        <div className="absolute -top-32 -right-32 w-150 h-150 bg-indigo-200/40 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-150 h-150 bg-blue-200/40 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      {/* ───── LOGIN CARD ───── */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div
            variants={item}
            className="bg-white/80 backdrop-blur-xl border border-slate-100
              rounded-3xl p-8 shadow-xl shadow-indigo-500/10"
          >
            {/* Header */}
            <motion.div variants={item} className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShieldCheck size={30} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Secure Login
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                User Behavior Analytics for Cloud Security
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              variants={item}
              onSubmit={loginHandler}
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" // 🔥 FIX: Changed from "email" to "text"
                  placeholder="Email or User ID" // 🔥 FIX: Updated placeholder
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200
                  focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200
                  focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-500 hover:text-indigo-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* 🔥 NEW: CAPTCHA UI */}
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <div 
                    className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 h-[50px] flex-1 flex justify-center items-center select-none"
                    dangerouslySetInnerHTML={{ __html: captchaData.captchaImage || "<span>Loading...</span>" }}
                  />
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition cursor-pointer"
                    title="Refresh CAPTCHA"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter the characters above"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  autoComplete="off"
                />
              </div>

              {/* Forgot Password Link */}
              <motion.div variants={item} className="text-right">
                <Link
                  to="/forget-password"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              <motion.button
                whileHover={loading || cooldown > 0 ? {} : { scale: 1.02 }}
                whileTap={loading || cooldown > 0 ? {} : { scale: 0.98 }}
                disabled={loading || cooldown > 0}
                type="submit"
                className="w-full flex justify-center items-center gap-2
                bg-indigo-600 text-white py-3 rounded-xl font-semibold
                hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30
                transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading
                  ? "Authenticating..."
                  : cooldown > 0
                  ? `Retry in ${cooldown}s`
                  : "Login"}
              </motion.button>
            </motion.form>

            <motion.p
              variants={item}
              className="mt-6 text-center text-sm text-slate-600"
            >
              New user?{" "}
              <Link
                to="/Signup"
                className="text-indigo-600 font-medium hover:underline"
              >
                Create an account
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
