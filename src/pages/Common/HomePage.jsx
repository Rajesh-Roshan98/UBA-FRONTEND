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
      link: "/rt-monitoring", // 🔥 ADDED: Route link
    },
    {
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-200",
      title: "Insider Threat Detection",
      desc: "Identifies abnormal behavior patterns using advanced User Behavior Analytics (UBA) and ML models.",
      link: "/insider", // 🔥 ADDED: Route link
    },
    {
      icon: Database,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "group-hover:border-purple-200",
      title: "Data Leak Prevention",
      desc: "Converts large-scale activity logs into actionable security insights to prevent unauthorized exfiltration.",
      link: "/sc-analytics", // 🔥 ADDED: Route link
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
    // 🔥 UPDATED: Removed fixed/h-screen and replaced with relative min-h-[100dvh] for mobile scrolling
    <div className="relative min-h-[100dvh] w-full bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
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
      {/* 🔥 UPDATED: Added py-16 for mobile breathing room */}
      <div className="relative z-10 flex flex-col justify-center min-h-[100dvh] py-16 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <motion.div 
            className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* LEFT: TEXT CONTENT */}
            {/* 🔥 UPDATED: Added sm:text-center lg:text-left to handle centering nicely on tablets if desired, though left align is fine too */}
            <motion.div className="space-y-6 sm:space-y-8" variants={itemVariants}>
              
              {/* 🔥 UPDATED: Fluid text sizing */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] sm:leading-[1.1] tracking-tight">
                User Behavior Analytics for{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 animate-gradient-x block sm:inline mt-2 sm:mt-0">
                  Cloud Security.
                </span>
              </h1>
              
              {/* 🔥 UPDATED: Text size adjusted for mobile readability */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
                A centralized dashboard that analyzes user activity patterns to
                detect <strong>anomalies</strong>, monitor
                <strong> insider threats</strong>, and prevent
                <strong className="text-indigo-600"> unauthorized data exfiltration</strong> 
                {" "}in cloud environments.
              </p>

            </motion.div>

            {/* RIGHT: FEATURE CARDS (Staggered Grid) */}
            <motion.div className="flex flex-col gap-4 sm:gap-5" variants={containerVariants}>
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  // 🔥 UPDATED: Responsive padding on cards
                  className={`group relative bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 ${feature.border}`}
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    {/* 🔥 UPDATED: Responsive icon sizing */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} shrink-0 transition-transform group-hover:scale-110 duration-500`}>
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
                    </div>
                    <div className="pt-0.5 sm:pt-1">
                      {/* 🔥 UPDATED: Wrapped the heading in a Link */}
                      <Link to={feature.link} className="inline-block">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2 group-hover:text-indigo-600 hover:underline decoration-indigo-600 decoration-2 underline-offset-4 transition-all">
                          {feature.title}
                        </h3>
                      </Link>
                      <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-bl from-slate-100/50 to-transparent rounded-tr-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}