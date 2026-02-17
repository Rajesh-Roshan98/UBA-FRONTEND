import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Activity, Database, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const features = [
    {
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "group-hover:border-blue-200",
      title: "Real-time Monitoring",
      desc: "Tracks user actions including logins, file access, data usage, and interaction frequency in real-time.",
    },
    {
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-200",
      title: "Threat Detection",
      desc: "Identifies abnormal behavior patterns using advanced User Behavior Analytics (UBA) and ML models.",
    },
    {
      icon: Database,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "group-hover:border-purple-200",
      title: "Data Leak Prevention",
      desc: "Converts large-scale activity logs into actionable security insights to prevent unauthorized exfiltration.",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50, damping: 20 } 
    },
  };

  return (
    <div className="h-screen w-screen fixed inset-0 bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* --- MATRIX GRID BACKGROUND EFFECT (Fixed to cover entire viewport) --- */}
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
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6 w-full">
          
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* LEFT: TEXT CONTENT */}
            <motion.div className="space-y-8" variants={itemVariants}>
              
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                User Behavior Analytics for{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 animate-gradient-x">
                  Cloud Security.
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                A centralized dashboard that analyzes user activity patterns to
                detect <strong>anomalies</strong>, monitor
                <strong> insider threats</strong>, and prevent
                <strong className="text-indigo-600"> unauthorized data exfiltration</strong> 
                in cloud environments.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/dashboard"
                    className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-colors duration-300 font-semibold text-base w-full sm:w-auto"
                  >
                    Open Dashboard
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/logs"
                    className="inline-flex justify-center items-center px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-colors duration-300 font-medium shadow-sm w-full sm:w-auto"
                  >
                    View Live Logs
                  </Link>
                </motion.div>
              </div>

            </motion.div>

            {/* RIGHT: FEATURE CARDS (Staggered Grid) */}
            <motion.div className="flex flex-col gap-5" variants={containerVariants}>
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 ${feature.border}`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} shrink-0 transition-transform group-hover:scale-110 duration-500`}>
                      <feature.icon size={28} strokeWidth={1.5} />
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-slate-100/50 to-transparent rounded-tr-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}