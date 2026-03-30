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
      'Data Access': { icon: Database, color: 'text-blue-600' },
      'Total Logins': { icon: Cloud, color: 'text-green-600' },
      'Failed Attempts': { icon: Key, color: 'text-red-600' },
      'Active Sessions': { icon: Lock, color: 'text-yellow-600' },
    };
    return config[label] || { icon: Activity, color: 'text-gray-600' };
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full bg-white/50 backdrop-blur-md rounded-xl">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading your security dashboard...
        </p>
      </div>
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
    <div className="p-6 space-y-6 bg-gray-100 w-full h-full overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">System monitoring is active.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${riskBgColor} ${riskColor}`}>
            <Shield size={14} /> {isHighRisk ? 'Threat Detected' : 'Monitoring Active'}
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
                className={`group relative p-6 rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 ${idx === 0 ? 'md:col-span-2' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${link.bg} ${link.color} mb-4`}>
                    <link.icon size={24} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                    <ArrowRight size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{link.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{link.desc}</p>
              </Link>
            ))}
          </div>

          {/* Right Column: Risk Score Widget */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className={riskColor} />
                <h3 className="text-gray-700 font-medium">Security Risk Score</h3>
              </div>
              <p className="text-xs text-gray-500">Real-time analysis via UBA Engine</p>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
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
                  <span className="text-3xl font-bold text-gray-800">{riskScore}</span>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider">{riskLabel}</span>
                </div>
              </div>
            </div>

            <div className={`border rounded-lg p-3 flex items-center gap-3 ${
              isHighRisk ? 'bg-red-50 border-red-200' : 
              isMediumRisk ? 'bg-yellow-50 border-yellow-200' : 
              'bg-green-50 border-green-200'
            }`}>
              <CheckCircle size={16} className={`${riskColor} shrink-0`} />
              <p className={`text-xs ${isHighRisk ? 'text-red-700' : isMediumRisk ? 'text-yellow-700' : 'text-green-700'}`}>
                {isHighRisk ? "Critical anomalies detected in behavior profile." : 
                 isMediumRisk ? "Minor deviations from baseline patterns." : 
                 "Your behavior profile is consistent with baseline patterns."}
              </p>
            </div>
          </div>
        </div>

        {/* --- Bottom Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats && stats.map((stat, index) => {
            const uiConfig = getStatUIConfig(stat.label);
            const IconComponent = uiConfig.icon;

            const isSessionCard = stat.label === "Active Sessions";
            const parts = stat.value ? stat.value.split('\n') : [""];
            const mainValue = parts[0];
            const subtext = parts[1] || "";

            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow group">
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
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
                  <div className={`p-2.5 rounded-xl bg-gray-100 ${uiConfig.color} group-hover:scale-110 transition-transform`}>
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