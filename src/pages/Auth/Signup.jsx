import React, { useState, useEffect } from "react";
import "../../index.css";
import api from "../../services/api";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"; // 🔥 FIX 1: Imported useNavigate

// 🔥 FIX: Extracted regex outside component to prevent ReferenceErrors and improve performance
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const Signup = () => {
  const navigate = useNavigate(); // 🔥 FIX 1: Initialized navigate
  
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  // 🔥 NEW: Cooldown state for rate limiting UX
  const [cooldown, setCooldown] = useState(0);

  // 🔥 PRO UPGRADE: Restore Cooldown on mount
  useEffect(() => {
    const expiry = localStorage.getItem("signupCooldownExpiry");
    if (expiry) {
      // 🔥 FIX 2: Added type safety for the expiry string
      const expiryTime = Number(expiry);
      const remaining = Math.floor((expiryTime - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        localStorage.removeItem("signupCooldownExpiry");
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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loadingSignup || cooldown > 0) return;

    // 🔥 FIX 3: Trim inputs BEFORE validation to prevent bypassing with spaces
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      return toast.error("All fields are required.");
    }

    // 🔥 FIX 4: Normalize email before running regex validation
    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      return toast.error(
        "Password must include uppercase, lowercase, number, and special character."
      );
    }

    setLoadingSignup(true);

    try {
      await api.post("/api/v1/auth/signup", {
        firstName: firstName.trim(),
        // 🔥 FIX 5: Safely handle empty middle names
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
        email: cleanEmail, // 🔥 FIX 4: Send the normalized email
        password,
      });

      toast.success("Account created successfully!");
      
      // 🔥 FIX 1: Use navigate to maintain SPA behavior without full page reload
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      // 🔥 UPDATED: Dynamic Rate Limit UX
      if (err.response?.status === 429) {
        const retryAfter = err.response.data?.retryAfter || 60;
        
        // Start cooldown timer to disable button & Persist across reloads
        const expiry = Date.now() + retryAfter * 1000;
        localStorage.setItem("signupCooldownExpiry", expiry);
        setCooldown(retryAfter);

        toast.error(err.response.data?.message || `Too many attempts. Please try again in ${retryAfter} seconds.`);
      } else if (
        err.response?.status === 409 ||
        err.response?.data?.message?.toLowerCase().includes("already")
      ) {
        toast.error("Account already exists. Please login.");
      } else {
        toast.error(err.response?.data?.message || "Signup failed!");
      }
    } finally {
      setLoadingSignup(false);
    }
  };

  /* Animations (same as Login page) */
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
            maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        />

        <div className="absolute -top-32 -left-32 w-150 h-150 bg-purple-200/40 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob" />
        <div className="absolute -top-32 -right-32 w-150 h-150 bg-indigo-200/40 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-150 h-150 bg-blue-200/40 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      {/* ───── SIGNUP CARD ───── */}
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
                Create Your Account
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                User Behavior Analytics for Cloud Security
              </p>
            </motion.div>

            {/* Form */}
            <motion.form variants={item} onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name" // 🔥 PRO POLISH
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Middle Name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  autoComplete="additional-name" // 🔥 PRO POLISH
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name" // 🔥 PRO POLISH
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" // 🔥 PRO POLISH
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password" // 🔥 PRO POLISH
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-500 hover:text-indigo-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <motion.button
                whileHover={loadingSignup || cooldown > 0 ? {} : { scale: 1.04, cursor: "pointer" }}
                whileTap={loadingSignup || cooldown > 0 ? {} : { scale: 0.96 }}
                type="submit"
                disabled={loadingSignup || cooldown > 0}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingSignup ? (
                  "Creating..."
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s`
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.p variants={item} className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/Login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Login
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
