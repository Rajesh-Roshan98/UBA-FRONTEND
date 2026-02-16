import React, { useState } from "react";
import "../../index.css";
import axios from "axios";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const API_BASE = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      return toast.error("All fields are required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    if (password.length < 6 || !/\d/.test(password)) {
      return toast.error(
        "Password must be at least 6 characters and contain a number."
      );
    }

    setLoadingSignup(true);

    try {
      await axios.post(`${API_BASE}/api/v1/signup`, {
        firstName,
        middleName,
        lastName,
        email,
        password,
      });

      toast.success("Account created successfully!");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err) {
      if (
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
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-slate-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.04, cursor: "pointer" }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={loadingSignup}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-70"
              >
                {loadingSignup ? "Creating..." : "Create Account"}
                <ArrowRight size={18} />
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