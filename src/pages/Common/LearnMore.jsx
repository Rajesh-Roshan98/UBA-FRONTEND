import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LearnMore() {
  // Animation variants (matching Insider.jsx)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 20 },
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* --- MATRIX GRID BACKGROUND EFFECT (Matches Insider.jsx) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
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

        {/* Animated Color Blobs (Behind Grid) */}
        <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-150 h-150 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-150 h-150 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 pt-24">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="text-sm bg-indigo-100 text-indigo-800 w-fit px-3 py-1 rounded-full mb-4">
                📖 Documentation
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Insider Threat Detection – Detailed Overview
              </h1>
              <p className="text-slate-600 text-lg text-justify leading-relaxed">
                Insider Threat Detection focuses on identifying malicious or risky 
                activities performed by authorized users within an organization. 
                Unlike external cyberattacks, insider threats originate from 
                employees, contractors, or partners who already have access.
              </p>
            </motion.div>

            {/* Detection Techniques Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚙️</span> Detection Techniques
              </h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2">
                <li>User Behavior Analytics (UBA)</li>
                <li>Machine Learning-based anomaly detection</li>
                <li>Real-time log monitoring</li>
                <li>Access control analysis</li>
              </ul>
            </motion.div>

            {/* Benefits Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span> Benefits
              </h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2">
                <li>Prevents data leakage</li>
                <li>Detects suspicious login patterns</li>
                <li>Reduces internal fraud risk</li>
                <li>Enhances organizational security</li>
              </ul>
            </motion.div>

            {/* Back Button */}
            <motion.div variants={itemVariants}>
              <Link to="/insider">
                <button className="px-6 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-slate-200 shadow-sm font-medium">
                  ← Back
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LearnMore;