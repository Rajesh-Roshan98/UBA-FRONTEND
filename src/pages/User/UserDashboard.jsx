import React from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRight 
} from 'lucide-react';

export default function UserDashboard() {
  // Risk Data (Kept for the risk card)
  const riskScore = 32;

  // Navigation Links Data
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

  const stats = [
    { label: 'Data Access', value: '5,689', icon: Database, color: 'text-blue-400' },
    { label: 'Total Logins', value: '1,247', icon: Cloud, color: 'text-green-400' },
    { label: 'Failed Attempts', value: '3', icon: Key, color: 'text-red-400' },
    { label: 'Active Sessions', value: '1', icon: Lock, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-400 mt-1">Welcome back, Alex. System status is normal.</p>
          </div>
          <span className="px-4 py-1.5 bg-green-900/20 text-green-400 border border-green-900/50 rounded-full text-sm font-medium flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            <Shield size={16} /> Monitoring Active
          </span>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Quick Access Links (Replaces Profile) */}
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

          {/* Right Column: Risk Score (Visual Enhancement) */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex flex-col justify-between relative overflow-hidden min-h-[260px]">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-green-500" />
                <h3 className="text-gray-300 font-medium">Security Risk Score</h3>
              </div>
              <p className="text-xs text-gray-500">Real-time analysis via UBA Engine</p>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
               <div className="relative">
                 {/* Circular Background */}
                 <svg className="w-32 h-32 transform -rotate-90">
                   <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                   <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-green-500" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * riskScore) / 100} />
                 </svg>
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                   <span className="text-3xl font-bold text-white">{riskScore}</span>
                   <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Low Risk</span>
                 </div>
               </div>
            </div>

            <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-3 flex items-center gap-3">
              <CheckCircle size={16} className="text-green-400 shrink-0" />
              <p className="text-xs text-green-300">Your behavior profile is consistent with baseline patterns.</p>
            </div>
          </div>

        </div>

        {/* --- Bottom Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 p-5 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-gray-700/30 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}