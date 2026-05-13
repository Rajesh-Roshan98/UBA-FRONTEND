import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function RealTimeMonitoring() {
  // --- LOGIC FROM CODE A (Pie Chart & Real-time generation) ---
  const generatePieData = () => {
    return [
      { name: "Logins", value: Math.floor(Math.random() * 40) + 10 },
      { name: "File Access", value: Math.floor(Math.random() * 30) + 10 },
      { name: "Downloads", value: Math.floor(Math.random() * 30) + 10 },
      { name: "DB Queries", value: Math.floor(Math.random() * 30) + 10 },
    ];
  };

  const [pieData, setPieData] = useState(generatePieData());
  const [alertIndex, setAlertIndex] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generatePieData();
      setPieData(newData);

      const totalValue = newData.reduce((acc, item) => acc + item.value, 0);
      setTotal(totalValue);

      const maxIndex = newData.findIndex(
        (item) => item.value === Math.max(...newData.map((d) => d.value))
      );
      setAlertIndex(maxIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7"];

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
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-10 pt-20 md:py-12 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 md:space-y-10"
          >
            {/* --- COMMON HEADER --- */}
            <motion.div variants={itemVariants} className="mb-8 md:mb-10">
              <div className="text-xs sm:text-sm bg-green-100 text-green-800 w-fit px-3 py-1.5 rounded-full mb-4 animate-pulse font-medium">
                📡 Live Security
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Real-Time Monitoring
              </h1>
              <p className="text-slate-600 text-base sm:text-lg text-justify sm:text-left leading-relaxed max-w-3xl">
                Continuously tracks user actions, login behavior, access frequency,
                and data movement to prevent security threats instantly.
              </p>
            </motion.div>

            {/* --- SECTION 1: ANIMATED PIE CHART (Side-by-Side Layout) --- */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-8 mb-8 md:mb-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Title with Live Indicator */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8 border-b border-slate-200 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-3">
                  Activity Distribution
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse tracking-widest shrink-0">
                    LIVE
                  </span>
                </h2>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
                  Updating every 2s
                </span>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* LEFT SIDE: The Chart */}
                <div className="relative w-full lg:w-1/2 h-[300px] sm:h-[350px] flex justify-center items-center">
                  {/* Glowing Pulse Ring */}
                  <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-green-400/20 blur-3xl animate-pulse"></div>

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={window.innerWidth < 640 ? 90 : 110}
                        innerRadius={window.innerWidth < 640 ? 55 : 65}
                        paddingAngle={4}
                        animationDuration={1200}
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === alertIndex
                                ? "#ef4444"
                                : PIE_COLORS[index % PIE_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          color: "#1e293b",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                        }}
                        itemStyle={{ color: "#1e293b", fontWeight: "500" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Animated Percentage */}
                  <div className="absolute text-center pointer-events-none">
                    <div className="text-3xl sm:text-4xl font-bold text-slate-800">
                      {total}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-medium">
                      Events
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: The Details (Legend) */}
                <div className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4">
                  {pieData.map((entry, index) => {
                    const currentColor =
                      index === alertIndex
                        ? "#ef4444"
                        : PIE_COLORS[index % PIE_COLORS.length];
                    const percentage =
                      Math.round((entry.value / total) * 100) || 0;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 border-b-slate-100 last:border-b-transparent"
                      >
                        <div className="flex items-center gap-3">
                          {/* Colored Indicator Dot */}
                          <div
                            className="w-3 h-3 shrink-0 rounded-full"
                            style={{
                              backgroundColor: currentColor,
                              boxShadow: `0 0 10px ${currentColor}40`,
                            }}
                          ></div>
                          <div>
                            <div className="text-sm sm:text-base font-semibold text-slate-700">
                              {entry.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {percentage}% of traffic
                            </div>
                          </div>
                        </div>

                        {/* Value */}
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-mono font-bold text-slate-800">
                            {entry.value}
                          </div>
                          {index === alertIndex && (
                            <div className="text-[9px] sm:text-[10px] text-red-500 animate-pulse font-bold tracking-wider mt-0.5">
                              HIGH TRAFFIC
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* --- ALERT INFO (From Code A) --- */}
            {alertIndex !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 p-4 sm:p-5 rounded-xl mb-8 flex items-start sm:items-center gap-3 sm:gap-4 shadow-sm"
              >
                <span className="text-2xl sm:text-3xl animate-pulse mt-0.5 sm:mt-0 shrink-0">🚨</span>
                <div>
                  <div className="text-sm sm:text-base font-bold text-red-700 mb-0.5">
                    Security Alert Triggered
                  </div>
                  <div className="text-xs sm:text-sm text-red-600 leading-relaxed">
                    Abnormal spike detected in{" "}
                    <span className="font-bold underline decoration-red-400 decoration-2 underline-offset-2">
                      {pieData[alertIndex].name}
                    </span>
                    .
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- SECTION 3: TEXT INFO (From Code B) --- */}

            {/* How It Works */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span> How It Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mb-6 text-justify sm:text-left leading-relaxed">
                The system continuously monitors system logs and user activities
                in real time. Any unusual pattern triggers instant alerts and
                security actions.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="bg-slate-50/80 px-4 py-2.5 rounded-lg border border-slate-200 flex-grow sm:flex-grow-0 flex items-center gap-3">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold shrink-0">1</div>
                  <div className="text-sm font-medium text-slate-700">Capture Activity</div>
                </div>
                <div className="bg-slate-50/80 px-4 py-2.5 rounded-lg border border-slate-200 flex-grow sm:flex-grow-0 flex items-center gap-3">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold shrink-0">2</div>
                  <div className="text-sm font-medium text-slate-700">Analyze Patterns</div>
                </div>
                <div className="bg-slate-50/80 px-4 py-2.5 rounded-lg border border-slate-200 flex-grow sm:flex-grow-0 flex items-center gap-3">
                  <div className="w-6 h-6 flex justify-center items-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold shrink-0">3</div>
                  <div className="text-sm font-medium text-slate-700">Trigger Alerts</div>
                </div>
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-5">
                Key Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">🔐</span> Login Tracking
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Monitors login time, device, and location
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">📁</span> Access Monitoring
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Tracks file and database access frequency
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">📊</span> Activity Logs
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Maintains real-time system logs
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">🚨</span> Instant Alerts
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Sends alerts for suspicious behavior
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Why Important */}
            <motion.div
              variants={itemVariants}
              className="bg-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border border-indigo-100 shadow-sm"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4">
                Why It Matters
              </h2>
              <p className="text-sm sm:text-base text-slate-700 mb-5 text-justify sm:text-left leading-relaxed">
                Real-time monitoring helps organizations detect threats immediately
                instead of discovering them after data damage occurs.
              </p>
              <div className="bg-indigo-100/60 p-4 rounded-xl border border-indigo-200/50">
                <p className="text-sm text-indigo-900 flex items-start sm:items-center gap-2">
                  <span className="shrink-0">💡</span> 
                  <span><strong className="font-bold">Pro Insight:</strong> Faster detection reduces breach impact by up to 70%.</span>
                </p>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div variants={itemVariants} className="pb-10">
              <Link to="/">
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

export default RealTimeMonitoring;
