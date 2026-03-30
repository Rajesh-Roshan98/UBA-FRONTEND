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
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 pt-24">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* --- COMMON HEADER --- */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="text-sm bg-green-100 text-green-800 w-fit px-3 py-1 rounded-full mb-4 animate-pulse">
                📡 Live Security
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Real-Time Monitoring
              </h1>
              <p className="text-slate-600 text-lg text-justify leading-relaxed">
                Continuously tracks user actions, login behavior, access frequency,
                and data movement to prevent security threats instantly.
              </p>
            </motion.div>

            {/* --- SECTION 1: ANIMATED PIE CHART (Side-by-Side Layout) --- */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 mb-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Title with Live Indicator */}
              <div className="w-full flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  Activity Distribution Overview
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse tracking-widest">
                    LIVE
                  </span>
                </h2>
                <span className="text-xs text-slate-400 uppercase tracking-widest">
                  Updating every 2s
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12">
                {/* LEFT SIDE: The Chart */}
                <div className="relative w-full md:w-1/2 h-87.5 flex justify-center items-center">
                  {/* Glowing Pulse Ring */}
                  <div className="absolute w-64 h-64 rounded-full bg-green-400/20 blur-3xl animate-pulse"></div>

                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={65}
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
                    <div className="text-4xl font-bold text-slate-800">
                      {total}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                      Events
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: The Details (Legend) */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
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
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          {/* Colored Indicator Dot */}
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: currentColor,
                              boxShadow: `0 0 10px ${currentColor}40`,
                            }}
                          ></div>
                          <div>
                            <div className="text-sm font-semibold text-slate-700">
                              {entry.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {percentage}% of traffic
                            </div>
                          </div>
                        </div>

                        {/* Value */}
                        <div className="text-right">
                          <div className="text-lg font-mono font-bold text-slate-800">
                            {entry.value}
                          </div>
                          {index === alertIndex && (
                            <div className="text-[10px] text-red-500 animate-pulse font-bold tracking-wider">
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
                className="bg-red-50 border border-red-200 p-4 rounded-xl mb-8 flex items-center gap-3 shadow-sm"
              >
                <span className="text-2xl animate-pulse">🚨</span>
                <div>
                  <div className="font-bold text-red-700">
                    Security Alert Triggered
                  </div>
                  <div className="text-sm text-red-600">
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
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span> How It Works
              </h2>
              <p className="text-slate-600 mb-4 text-justify">
                The system continuously monitors system logs and user activities
                in real time. Any unusual pattern triggers instant alerts and
                security actions.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-50/80 px-4 py-2 rounded-lg border border-slate-200">
                  <div className="text-indigo-600 font-bold">1</div>
                  <div className="text-sm text-slate-700">Capture User Activity</div>
                </div>
                <div className="bg-slate-50/80 px-4 py-2 rounded-lg border border-slate-200">
                  <div className="text-indigo-600 font-bold">2</div>
                  <div className="text-sm text-slate-700">Analyze Patterns</div>
                </div>
                <div className="bg-slate-50/80 px-4 py-2 rounded-lg border border-slate-200">
                  <div className="text-indigo-600 font-bold">3</div>
                  <div className="text-sm text-slate-700">Trigger Alerts</div>
                </div>
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">
                Key Features
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2">
                    🔐 Login Tracking
                  </div>
                  <p className="text-slate-600 text-sm">
                    Monitors login time, device, and location
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2">
                    📁 Access Monitoring
                  </div>
                  <p className="text-slate-600 text-sm">
                    Tracks file and database access frequency
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2">
                    📊 Activity Logs
                  </div>
                  <p className="text-slate-600 text-sm">
                    Maintains real-time system logs
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-indigo-600 font-bold mb-2">
                    🚨 Instant Alerts
                  </div>
                  <p className="text-slate-600 text-sm">
                    Sends alerts for suspicious behavior
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Why Important */}
            <motion.div
              variants={itemVariants}
              className="bg-indigo-50/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-indigo-100 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Why It Matters
              </h2>
              <p className="text-slate-700 mb-4 text-justify">
                Real-time monitoring helps organizations detect threats immediately
                instead of discovering them after data damage occurs.
              </p>
              <div className="bg-indigo-100/50 p-4 rounded-lg">
                <p className="text-sm text-indigo-800">
                  💡 <span className="font-bold">Pro Insight:</span> Faster
                  detection reduces breach impact by up to 70%.
                </p>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div variants={itemVariants}>
              <Link to="/">
                <button className="px-6 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-slate-200 shadow-sm font-medium">
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