import React from "react";
import { motion } from "framer-motion"; // 🔥 ADDED: Framer Motion for a premium, buttery-smooth experience

const BootScreen = () => {
  return (
    // 🔥 UPGRADE: The entire page now fades in smoothly and gracefully fades out on navigation
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }} // 🔥 ADDED: Smooth exit transition
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden p-6 sm:p-8"
    >
      
      {/* 🔥 NEW: Subtle ambient background glow for depth (Vercel/Linear style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 🔥 UPGRADE: Staggered entrance for the entire content block */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Spring-like easing
        className="relative z-10 flex flex-col items-center text-center w-full max-w-md"
      >
        
        {/* 🔥 NEW: Minimalist Geometric Boot Loader */}
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
          {/* Outer rotating boundary */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 rounded-2xl border border-slate-200/80 bg-gradient-to-tr from-white to-slate-50 shadow-sm"
          />
          {/* Inner pulsing core */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-5 bg-indigo-600 rounded-lg shadow-md shadow-indigo-500/30"
          />
        </div>

        {/* 🔥 UX UPGRADE: Removed the dotted animation. Clean, confident typography is much more premium. */}
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight px-2">
          Starting up
        </h2>
        
        {/* 🔥 CSS FIX: Optimized line-height and colors */}
        <p className="text-slate-500 mt-3 sm:mt-4 text-sm sm:text-base px-4 max-w-[18rem] sm:max-w-sm leading-relaxed">
          Please wait a moment while we get things ready. <br className="hidden sm:block" />
          This process usually takes about 30–60 seconds to complete.
        </p>

        {/* 🔥 NEW: Ultra-sleek indeterminate sweeping progress bar */}
        <div className="mt-8 w-48 sm:w-56 h-1 bg-slate-200/60 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1/2 h-full bg-indigo-600 rounded-full"
          />
        </div>

      </motion.div>
      
    </motion.div>
  );
};

export default BootScreen;