import React, { useState } from "react";
import "../index.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const passwordRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const loginHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // // Password strength validation
    // if (!passwordRegex.test(password)) {
    //   toast.error(
    //     "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    //   );
    //   return;
    // }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/v1/login`, {
        email: email.trim(),
        password,
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Login failed");
        return;
      }

      await login(res.data.token);
      toast.success("Login successful");

      res.data.requiresOtp
        ? navigate("/verify-otp", { state: { email } })
        : navigate("/");
    } catch {
      toast.error("Invalid credentials or server error");
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

      {/* ───── MATRIX GRID BACKGROUND (Same as Homepage) ───── */}
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
            <motion.form variants={item} onSubmit={loginHandler} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200
                  focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
              </div>

              {/* Password */}
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
                  className="absolute right-4 top-3 text-slate-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                disabled={loading}
                type="submit"
                className="w-full flex justify-center items-center gap-2
                bg-indigo-600 text-white py-3 rounded-xl font-semibold
                hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30
                transition disabled:opacity-70"
              >
                {loading ? "Authenticating..." : "Login"}
                <ArrowRight size={18} />
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.p variants={item} className="mt-6 text-center text-sm text-slate-600">
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
}

export default Login;