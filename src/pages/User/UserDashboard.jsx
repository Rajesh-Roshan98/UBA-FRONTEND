import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { 
  Shield, 
  Activity, 
  FileText, 
  Bell, 
  Database, 
  Cloud, 
  Key, 
  Lock, 
  CheckCircle,
  ArrowRight,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast'; 
import api from "../../services/api";

export default function UserDashboard() {
  const navigate = useNavigate(); 
  
  // 🔥 UPDATED: Initialized with null to distinguish between "Initial State" and "Fetched State"
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/user/udashboard`); 
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data. Please try again later.");
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/unauthorized');
        } else {
          navigate('/server-error');
        }
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
      color: 'text-blue-400', 
      bg: 'bg-blue-900/20', 
      border: 'hover:border-blue-500/50',
      path: '/activity' 
    },
    { 
      title: 'My Alerts', 
      desc: 'Check security warnings and risk indicators.', 
      icon: Bell, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-900/20', 
      border: 'hover:border-yellow-500/50',
      path: '/my-alerts' 
    },
    { 
      title: 'My Reports', 
      desc: 'Download generated PDF and CSV summaries.', 
      icon: FileText, 
      color: 'text-purple-400', 
      bg: 'bg-purple-900/20', 
      border: 'hover:border-purple-500/50',
      path: '/my-reports' 
    },
  ];

  // Helper function to map backend stat labels to UI icons/colors
  const getStatUIConfig = (label) => {
    const config = {
      'Data Access': { icon: Database, color: 'text-blue-400' },
      'Total Logins': { icon: Cloud, color: 'text-green-400' },
      'Failed Attempts': { icon: Key, color: 'text-red-400' },
      'Active Sessions': { icon: Lock, color: 'text-yellow-400' },
    };
    return config[label] || { icon: Activity, color: 'text-gray-400' };
  };

  if (loading || !dashboardData) {
    return (
      <div className="w-full h-full overflow-hidden bg-gray-900 flex flex-col items-center justify-center text-gray-400">
        <Loader className="animate-spin mb-4" size={32} />
        <p>Loading your security dashboard...</p>
      </div>
    );
  }

  const { riskScore, stats } = dashboardData;

  // Dynamic visual styles based on the real risk score
  const isHighRisk = riskScore > 70;
  const isMediumRisk = riskScore > 40 && riskScore <= 70;
  const riskColor = isHighRisk ? 'text-red-500' : isMediumRisk ? 'text-yellow-500' : 'text-green-500';
  const riskLabel = isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-400 mt-1">System monitoring is active.</p>
          </div>
          <span className={`px-4 py-1.5 border rounded-full text-sm font-medium flex items-center gap-2 ${
            isHighRisk ? 'bg-red-900/20 text-red-400 border-red-900/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
            'bg-green-900/20 text-green-400 border-green-900/50 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
          }`}>
            <Shield size={16} /> {isHighRisk ? 'Threat Detected' : 'Monitoring Active'}
          </span>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Quick Access Links */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             {quickLinks.map((link, idx) => (
               <Link 
                 key={idx} 
                 to={link.path}
                 className={`group relative p-6 rounded-2xl border border-gray-700 bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${link.border} ${idx === 0 ? 'md:col-span-2' : ''}`}
               >
                 <div className="flex justify-between items-start">
                   <div className={`p-3 rounded-xl ${link.bg} ${link.color} mb-4`}>
                     <link.icon size={24} />
                   </div>
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">
                     <ArrowRight size={20} />
                   </div>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">{link.title}</h3>
                 <p className="text-gray-400 text-sm leading-relaxed">{link.desc}</p>
               </Link>
             ))}
          </div>

          {/* Right Column: Risk Score Widget */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex flex-col justify-between relative overflow-hidden min-h-[260px]">
            <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-20 ${
              isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className={riskColor} />
                <h3 className="text-gray-300 font-medium">Security Risk Score</h3>
              </div>
              <p className="text-xs text-gray-500">Real-time analysis via UBA Engine</p>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
               <div className="relative">
                 <svg className="w-32 h-32 transform -rotate-90">
                   <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                   <circle 
                     cx="64" cy="64" r="56" 
                     stroke="currentColor" 
                     strokeWidth="8" 
                     fill="transparent" 
                     className={riskColor}
                     strokeDasharray={351.86} 
                     strokeDashoffset={351.86 - (351.86 * riskScore) / 100} 
                     strokeLinecap="round"
                     style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                   />
                 </svg>
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                   <span className="text-3xl font-bold text-white">{riskScore}</span>
                   <span className="block text-[10px] text-gray-400 uppercase tracking-wider">{riskLabel}</span>
                 </div>
               </div>
            </div>

            <div className={`border rounded-lg p-3 flex items-center gap-3 ${
              isHighRisk ? 'bg-red-900/10 border-red-900/30' : 
              isMediumRisk ? 'bg-yellow-900/10 border-yellow-900/30' : 
              'bg-green-900/10 border-green-900/30'
            }`}>
              <CheckCircle size={16} className={`${riskColor} shrink-0`} />
              <p className={`text-xs ${isHighRisk ? 'text-red-300' : isMediumRisk ? 'text-yellow-300' : 'text-green-300'}`}>
                {isHighRisk ? "Critical anomalies detected in behavior profile." : 
                 isMediumRisk ? "Minor deviations from baseline patterns." : 
                 "Your behavior profile is consistent with baseline patterns."}
              </p>
            </div>
          </div>

        </div>

        {/* --- Bottom Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 🔥 UPDATED: Added safe check for stats existence */}
          {stats && stats.map((stat, index) => {
            const uiConfig = getStatUIConfig(stat.label);
            const IconComponent = uiConfig.icon;

            const isSessionCard = stat.label === "Active Sessions";
            const parts = stat.value ? stat.value.split('\n') : [""];
            const mainValue = parts[0];
            const subtext = parts[1] || "";

            return (
              <div key={index} className="bg-gray-800 p-5 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {mainValue}
                    </p>
                    {isSessionCard && subtext && (
                      <p className="text-[11px] text-gray-500 mt-1 font-mono tracking-tight opacity-80">
                        {subtext}
                      </p>
                    )}
                  </div>
                  <div className={`p-2.5 rounded-xl bg-gray-700/30 ${uiConfig.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}