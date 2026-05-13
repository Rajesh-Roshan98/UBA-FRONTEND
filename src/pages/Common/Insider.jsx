import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Insider() {
  // Animation variants (matching homepage)
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
      <div className="relative z-10 flex flex-col justify-center min-h-[100dvh] py-10 pt-20 md:py-12 md:pt-24">
        {/* Expanded container: max-w-7xl instead of max-w-4xl, with wider padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 md:space-y-10"
          >
            {/* Header - text-justify added on mobile, left on larger to prevent awkward spacing */}
            <motion.div variants={itemVariants} className="mb-8 md:mb-10">
              <div className="text-xs sm:text-sm bg-indigo-100 text-indigo-800 w-fit px-3 py-1.5 rounded-full mb-4 font-medium">
                🔒 Cybersecurity
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Insider Threat Detection
              </h1>
              <p className="text-slate-600 text-base sm:text-lg text-justify sm:text-left leading-relaxed max-w-4xl">
                Insider Threat Detection involves monitoring and analyzing user behavior within an
                organization to identify suspicious activities by authorized personnel.
                It detects unusual actions like abnormal login times or unauthorized data access.
                Using techniques such as behavior analytics and machine learning,
                it helps prevent internal security breaches and data misuse.
              </p>
            </motion.div>

            {/* How It Works */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔍</span> How It Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mb-6 text-justify sm:text-left leading-relaxed">
                The system learns normal behavior for each user and uses AI to detect unusual activities.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <div className="bg-slate-50/80 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold shrink-0">1</div>
                  <div className="text-sm font-medium text-slate-700">Learn Normal Behavior</div>
                </div>
                <div className="bg-slate-50/80 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold shrink-0">2</div>
                  <div className="text-sm font-medium text-slate-700">Monitor Activities</div>
                </div>
                <div className="bg-slate-50/80 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold shrink-0">3</div>
                  <div className="text-sm font-medium text-slate-700">Detect Threats</div>
                </div>
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-5">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">👥</span> User Analytics
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">Track user behavior and access patterns</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">⚡</span> Real-time Monitoring
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">24/7 activity monitoring and alerts</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">🤖</span> AI Detection
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">Machine learning for threat detection</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">📊</span> Cloud Analysis
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">Analyze logs from cloud services</p>
                </div>
              </div>
            </motion.div>

            {/* Why Important */}
            <motion.div
              variants={itemVariants}
              className="bg-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-indigo-100 shadow-sm"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4">Why It's Important</h2>
              <p className="text-sm sm:text-base text-slate-700 mb-5 text-justify sm:text-left leading-relaxed">
                Insider threats are hard to detect because the user already has legitimate access.
                This system helps identify risks before data is compromised.
              </p>
              <div className="bg-indigo-100/60 p-4 rounded-xl border border-indigo-200/50">
                <p className="text-sm text-indigo-900 flex items-start sm:items-center gap-2">
                  <span className="shrink-0">💡</span> 
                  <span><strong className="font-bold">Did you know?</strong> Over 60% of data breaches involve insider threats.</span>
                </p>
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center p-2">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">99%</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Accuracy</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1">24/7</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Monitoring</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">50ms</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Response</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-1">100%</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Coverage</div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons with Routing */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 md:mb-10">
              <Link to="/learn-more" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 cursor-pointer transition-colors shadow-sm active:scale-95">
                  Learn More
                </button>
              </Link>
            </motion.div>

            {/* Back Button */}
            <motion.div variants={itemVariants} className="pb-10">
              <Link to="/" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-slate-200 shadow-sm font-semibold active:scale-95">
                  ← Back to Home
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Insider;
