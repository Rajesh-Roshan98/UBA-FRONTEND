import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { 
  Shield, 
  Activity, 
  FileText, 
  Bell, 
  Database, 
  LogIn, 
  AlertTriangle, 
  Monitor, 
  CheckCircle,
  Gauge,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast'; 
import api from "../../services/api";
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const navigate = useNavigate(); 
  
  // 🔥 UPDATED: Initialized with null to distinguish between "Initial State" and "Fetched State"
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/v1/user/udashboard`); 
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data. Please try again later.");
        
        // 🔥 UPDATED: Manual navigation logic removed.
        // Your global api.js interceptor will now automatically handle redirects
        // to /unauthorized?code=... or /server-error?code=... based on HTTP status
        
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]); 

  // Navigation Links Data (Static)
  const quickLinks = [
    { 
      title: 'Activity Monitor', 
      desc: 'View logs, resource usage, and timeline.', 
      icon: Activity, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'hover:border-blue-300',
      path: '/activity' 
    },
    { 
      title: 'My Alerts', 
      desc: 'Check security warnings and risk indicators.', 
      icon: Bell, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50', 
      border: 'hover:border-yellow-300',
      path: '/my-alerts' 
    },
    { 
      title: 'My Reports', 
      desc: 'Download generated PDF and CSV summaries.', 
      icon: FileText, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      border: 'hover:border-purple-300',
      path: '/my-reports' 
    },
  ];

  // Helper function to map backend stat labels to UI icons/colors
  const getStatUIConfig = (label) => {
    const config = {
      'Data Access': { icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
      'Total Logins': { icon: LogIn, color: 'text-green-600', bg: 'bg-green-50' },
      'Failed Attempts': { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
      'Active Sessions': { icon: Monitor, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    };
    return config[label] || { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (loading || !dashboardData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="w-full h-full flex flex-col justify-center px-4 sm:px-8 lg:px-[50px] overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center h-[60vh] w-full bg-white/50 backdrop-blur-md rounded-xl">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </motion.div>
    );
  }

  const { riskScore, stats } = dashboardData;

  // Dynamic visual styles based on the real risk score
  const isHighRisk = riskScore > 70;
  const isMediumRisk = riskScore > 40 && riskScore <= 70;
  const riskColor = isHighRisk ? 'text-red-600' : isMediumRisk ? 'text-yellow-600' : 'text-green-600';
  const riskBgColor = isHighRisk ? 'bg-red-100' : isMediumRisk ? 'bg-yellow-100' : 'bg-green-100';
  const riskLabel = isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk';

  return (
    <div className="w-full h-full flex-1 flex flex-col px-4 sm:px-8 lg:px-[50px] overflow-y-auto overflow-x-hidden scroll-smooth">
      
      {/* Wrapper forcing vertical center via auto margins, animated with Framer Motion */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full my-auto space-y-6 py-8"
      >
        
        {/* --- Header --- */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">System monitoring is active.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 ${riskBgColor} ${riskColor}`}>
            <Shield size={14} /> {isHighRisk ? 'Threat Detected' : 'Monitoring Active'}
          </span>
        </motion.div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Quick Access Links */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickLinks.map((link, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={idx === 0 ? 'md:col-span-2' : ''}
              >
                <Link 
                  to={link.path}
                  className="group block h-full relative p-6 rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${link.bg} ${link.color} mb-4`}>
                      <link.icon size={24} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{link.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{link.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Risk Score Widget */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between relative overflow-hidden border border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gauge size={18} className={riskColor} />
                <h3 className="text-gray-800 font-bold">Security Risk Score</h3>
              </div>
              <p className="text-sm text-gray-600">Real-time analysis via UBA Engine</p>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <svg className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                  <motion.circle 
                    cx="50%" cy="50%" r="45%" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    className={riskColor}
                    strokeDasharray={351.86} 
                    initial={{ strokeDashoffset: 351.86 }}
                    animate={{ strokeDashoffset: 351.86 - (351.86 * riskScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-800">{riskScore}</span>
                  <span className="block text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">{riskLabel}</span>
                </div>
              </div>
            </div>

            <div className={`border rounded-lg p-3 sm:p-4 flex items-start sm:items-center gap-3 ${
              isHighRisk ? 'bg-red-50 border-red-200' : 
              isMediumRisk ? 'bg-yellow-50 border-yellow-200' : 
              'bg-green-50 border-green-200'
            }`}>
              <CheckCircle size={16} className={`${riskColor} shrink-0 mt-0.5 sm:mt-0`} />
              <p className={`text-xs ${isHighRisk ? 'text-red-700' : isMediumRisk ? 'text-yellow-700' : 'text-green-700'}`}>
                {isHighRisk ? "Critical anomalies detected in behavior profile." : 
                 isMediumRisk ? "Minor deviations from baseline patterns." : 
                 "Your behavior profile is consistent with baseline patterns."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- Bottom Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats && stats.map((stat, index) => {
            const uiConfig = getStatUIConfig(stat.label);
            const IconComponent = uiConfig.icon;

            const isSessionCard = stat.label === "Active Sessions";
            const parts = stat.value ? stat.value.split('\n') : [""];
            const mainValue = parts[0];
            const subtext = parts[1] || "";

            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <p className="text-gray-600 text-sm mb-2">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {mainValue}
                    </p>
                    {isSessionCard && subtext && (
                      <p className="text-[11px] text-gray-500 mt-1 font-mono tracking-tight opacity-80">
                        {subtext}
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${uiConfig.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={24} className={uiConfig.color} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </motion.div>
    </div>
  );
};

export default UserDashboard;