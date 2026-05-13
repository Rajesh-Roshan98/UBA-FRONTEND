import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function SecureCloudAnalytics() {
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
    <div className="relative min-h-[100dvh] w-full bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
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
      <div className="relative z-10 flex flex-col justify-center min-h-[100dvh] py-10 pt-20 md:py-12 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 md:space-y-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8 md:mb-10">
              <div className="text-xs sm:text-sm bg-purple-100 text-purple-800 w-fit px-3 py-1.5 rounded-full mb-4 font-medium">
                ☁️ Cloud Security
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Secure Cloud Analytics
              </h1>
              <p className="text-slate-600 text-base sm:text-lg text-justify sm:text-left leading-relaxed max-w-4xl">
                Machine learning models analyze large-scale cloud logs to detect 
                abnormal patterns and prevent unauthorized data exfiltration. 
                The system continuously monitors cloud environments to ensure 
                data integrity, compliance, and security.
              </p>
            </motion.div>

            {/* How It Works */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔍</span> How It Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mb-6 text-justify sm:text-left leading-relaxed">
                The platform collects and processes cloud activity logs from 
                various services such as storage systems, databases, and 
                virtual machines. Machine learning algorithms analyze 
                behavioral patterns to detect anomalies.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <div className="bg-slate-50/80 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-purple-100 text-purple-600 text-sm font-bold shrink-0">1</div>
                  <div className="text-sm font-medium text-slate-700">Collect Cloud Logs</div>
                </div>
                <div className="bg-slate-50/80 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-purple-100 text-purple-600 text-sm font-bold shrink-0">2</div>
                  <div className="text-sm font-medium text-slate-700">Analyze with ML Models</div>
                </div>
                <div className="bg-slate-50/80 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-purple-100 text-purple-600 text-sm font-bold shrink-0">3</div>
                  <div className="text-sm font-medium text-slate-700">Detect Data Exfiltration</div>
                </div>
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-5">
                Key Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-purple-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">📊</span> Log Aggregation
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Collects logs from multiple cloud platforms in real time.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-purple-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">🤖</span> ML-Based Detection
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Uses anomaly detection algorithms to identify suspicious activity.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-purple-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">🚨</span> Data Exfiltration Alerts
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Detects unusual data transfers and prevents leakage.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-purple-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">☁️</span> Multi-Cloud Support
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Works across AWS, Azure, and Google Cloud environments.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Why Important */}
            <motion.div
              variants={itemVariants}
              className="bg-purple-50/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border border-purple-100 shadow-sm"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">
                Why It Matters
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mb-5 text-justify sm:text-left leading-relaxed">
                As organizations migrate to the cloud, data becomes more 
                distributed and vulnerable. Secure Cloud Analytics ensures 
                continuous monitoring and rapid detection of abnormal 
                data movement to prevent security breaches.
              </p>
              <div className="bg-purple-100/60 p-4 rounded-xl border border-purple-200/50">
                <p className="text-sm text-purple-900 flex items-start sm:items-center gap-2">
                  <span className="shrink-0">💡</span> 
                  <span><strong className="font-bold">Insight:</strong> Cloud misconfigurations and insider misuse are leading causes of modern data breaches.</span>
                </p>
              </div>
            </motion.div>

            {/* Performance Stats */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-6">
                System Capabilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center p-2">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">98%</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Detection Accuracy</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">24/7</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Cloud Monitoring</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">Real-Time</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Threat Alerts</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-1">Multi</div>
                  <div className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Cloud Support</div>
                </div>
              </div>
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

export default SecureCloudAnalytics;
