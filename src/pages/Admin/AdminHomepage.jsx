import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Users, Lock, Bell, Activity, 
  BarChart3, FileText, Database, 
  AlertTriangle, Cloud, Eye, Settings as SettingsIcon, Server,
  Search, Filter, UserCheck,
  ShieldCheck, FileCheck, Activity as ActivityIcon,
  Zap, Cpu, Target, PieChart
} from 'lucide-react';
import api from "../../services/api";
import ThemeLayout from "../../themes/ThemeLayout";

const AdminHomePage = () => {
  const navigate = useNavigate();
  
  const API_BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "");

  const [quickStats, setQuickStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    criticalAlerts: 0,
    highAlerts: 0,
    anomaliesToday: 0,
    dataMonitored: 'Loading...',
    modelAccuracy: '0%',
    f1Score: '0%',
    fpRate: '0%'
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🔥 OPTIMIZED: Fetch Stats, Alerts, and Logs simultaneously (Parallel fetching)
        const [statsRes, alertsRes, logsRes] = await Promise.all([
          api.get(`${API_BASE}/api/admin/stats`),
          api.get(`${API_BASE}/api/uba/alerts`),
          api.get(`${API_BASE}/api/uba/logs?limit=5`)
        ]);

        const statsData = statsRes.data;
        const alertsData = alertsRes.data;
        const logsData = logsRes.data;

        // Default model metrics (API removed as per request)
        let modelMetrics = { accuracy: null, f1Score: '0%', fpRate: '0%' };

        let exactCriticalCount = 0;
        let exactHighCount = 0;

        if (alertsData.success) {
          exactCriticalCount = alertsData.alerts.filter(a => a.severity?.toLowerCase() === 'critical').length;
          exactHighCount = alertsData.alerts.filter(a => a.severity?.toLowerCase() === 'high').length;
        }

        if (statsData.success) {
          const totalAnomalies = statsData.stats.totalAnomalies || statsData.stats.anomalyScore || 0;

          setQuickStats({
            totalUsers: statsData.stats.totalUsers || 0,
            activeSessions: 1, 
            criticalAlerts: exactCriticalCount, 
            highAlerts: exactHighCount,
            anomaliesToday: totalAnomalies,
            dataMonitored: statsData.stats.dataTransferred || '0 KB', 
            modelAccuracy: modelMetrics.accuracy || statsData.stats.modelAccuracy || '0%',
            f1Score: modelMetrics.f1Score,
            fpRate: modelMetrics.fpRate
          });
        }

        // Assuming logsData might be an array directly or wrapped in an object
        const rawLogs = Array.isArray(logsData) ? logsData : (logsData.logs || []);
        
        if (rawLogs.length > 0) {
          const mappedActivities = rawLogs.slice(0, 5).map((log, index) => ({
            id: log.id || log._id || index,
            action: log.message || log.action || `Activity by ${log.user_id}`,
            user: log.user || log.employee_name || log.user_id,
            time: new Date(log.timestamp || log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: log.level === 'ERROR' || log.prediction === 'Anomaly' ? 'alert' : 'user'
          }));
          setRecentActivities(mappedActivities);
        }

      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
        
        // 🔥 UPDATED: Manual navigation logic removed.
        // Your global api.js interceptor will now automatically handle redirects
        // to /unauthorized?code=... or /server-error?code=... based on HTTP status
        
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, API_BASE]);

  const adminModules = [
    {
      id: 'dashboard',
      title: 'Admin Dashboard',
      description: 'Main admin dashboard with overview metrics',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      path: '/admin-dashboard',
      stats: { alerts: quickStats.criticalAlerts, users: quickStats.totalUsers, anomalies: quickStats.anomaliesToday },
      accessLevel: 'All Admins'
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      path: '/user-management',
      stats: { active: quickStats.activeSessions, highRisk: Math.ceil(quickStats.anomaliesToday * 0.1), pending: 0 },
      accessLevel: 'Admin, Super Admin'
    },
    {
      id: 'access',
      title: 'Access Control',
      description: 'Control resource access and permissions',
      icon: Lock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      path: '/access-control',
      stats: { policies: 12, active: 156, pending: 8 },
      accessLevel: 'Security Admin'
    },
    {
      id: 'alerts',
      title: 'Security Alerts',
      description: 'Monitor and respond to security incidents',
      icon: Bell,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      path: '/alerts',
      stats: { critical: quickStats.criticalAlerts, high: quickStats.highAlerts, total: quickStats.anomaliesToday },
      accessLevel: 'Security Team'
    },
    {
      id: 'anomalies',
      title: 'Anomaly Review',
      description: 'Review and validate detected anomalies',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      path: '/anomaly-review',
      stats: { pending: quickStats.anomaliesToday, confirmed: 0, falsePos: 0 },
      accessLevel: 'Analyst, Admin'
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'Generate and manage security reports',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      path: '/reports',
      stats: { total: 45, scheduled: 3, downloads: 126 },
      accessLevel: 'All Staff'
    },
    {
      id: 'logs',
      title: 'System Logs',
      description: 'Monitor system activities and events',
      icon: Database,
      color: 'from-gray-700 to-gray-800',
      bgColor: 'bg-gray-50',
      path: '/system-logs',
      stats: { total : quickStats.totalUsers, anomalies: quickStats.anomaliesToday, critical: quickStats.criticalAlerts},
      accessLevel: 'Admin, DevOps'
    },
  ];

  // Clean, static loading animation
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full bg-white/50 backdrop-blur-md rounded-xl">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading Homepage...
        </p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );

  return (
    <ThemeLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>
          <p className="text-gray-600">Detecting and Preventing Data Exfiltration in Cloud Using UBA</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:space-x-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search admin tools..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
            />
          </div>
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center">
            Quick Actions
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Users} title="Total Users" value={quickStats.totalUsers} color="text-blue-600" />
        <StatCard icon={Activity} title="Active Sessions" value={quickStats.activeSessions} color="text-green-600" />
        <StatCard icon={AlertTriangle} title="Critical Alerts" value={quickStats.criticalAlerts} color="text-red-600" />
        <StatCard icon={Database} title="Data Monitored" value={quickStats.dataMonitored} color="text-purple-600" />
        <StatCard icon={Zap} title="Anomalies Today" value={quickStats.anomaliesToday} color="text-orange-600" />
        <StatCard icon={Target} title="Model Accuracy" value={quickStats.modelAccuracy} color="text-cyan-600" />
      </div>

      {/* Admin Modules Grid */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold text-gray-800">Admin Modules</h2>
          <div className="flex w-full sm:w-auto space-x-2">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                to={module.path}
                className={`${module.bgColor} rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-linear-to-r ${module.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                    {module.accessLevel}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    {Object.entries(module.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-xs text-gray-500 uppercase">{key}</div>
                        <div className="text-sm font-bold">{value}</div>
                      </div>
                    ))}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">UBA Model</h3>
            <p className="text-sm text-gray-600">Operational</p>
            <div className="mt-2 text-xs text-green-600">✓ Running</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Data Pipeline</h3>
            <p className="text-sm text-gray-600">{quickStats.dataMonitored} processed</p>
            <div className="mt-2 text-xs text-green-600">✓ Active</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <Server className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Log Collection</h3>
            <p className="text-sm text-gray-600">{recentActivities.length}+ logs today</p>
            <div className="mt-2 text-xs text-green-600">✓ Healthy</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <Cloud className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
            <h3 className="font-semibold">Cloud Services</h3>
            <p className="text-sm text-gray-600">AWS, Azure, GCP</p>
            <div className="mt-2 text-xs text-green-600">✓ Connected</div>
          </div>
        </div>
      </div>
    </div>
    </ThemeLayout>
  );
};

export default AdminHomePage;