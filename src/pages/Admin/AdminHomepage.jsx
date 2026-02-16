import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Users, Lock, Bell, Activity, 
  BarChart3, FileText, Database, Settings, 
  TrendingUp, AlertTriangle, Cloud, Download,
  Eye, Settings as SettingsIcon, Server,
  Search, Filter, Clock, UserCheck,
  ShieldCheck, FileCheck, Activity as ActivityIcon,
  Zap, Cpu, Target, PieChart
} from 'lucide-react';


const AdminHomePage = () => {
  const navigate = useNavigate();
  
  const adminModules = [
  {
    id: 'dashboard',
    title: 'Admin Dashboard',
    description: 'Main admin dashboard with overview metrics',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',

    // MAPPED TO YOUR COMPONENT
    path: '/admin-dashboard',

    stats: { alerts: 12, users: 2456, anomalies: 45 },
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

    stats: { active: 134, highRisk: 8, pending: 3 },
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

    stats: { critical: 5, high: 12, total: 45 },
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

    stats: { pending: 8, confirmed: 12, falsePos: 3 },
    accessLevel: 'Analyst, Admin'
  },

  {
    id: 'model',
    title: 'Model Results',
    description: 'ML model performance and analytics',
    icon: Cpu,

    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',

    path: '/model-results',

    stats: { accuracy: '92.5%', f1Score: '90.5%', fpRate: '4.2%' },
    accessLevel: 'Data Scientist'
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

    stats: { today: 1245, errors: 12, warnings: 45 },
    accessLevel: 'Admin, DevOps'
  }
];


  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'User John Doe suspended', user: 'admin@company.com', time: '5 min ago', type: 'user' },
    { id: 2, action: 'Critical alert resolved', user: 'security@company.com', time: '10 min ago', type: 'alert' },
    { id: 3, action: 'New anomaly detected', user: 'system', time: '15 min ago', type: 'anomaly' },
    { id: 4, action: 'Monthly report generated', user: 'system', time: '20 min ago', type: 'report' },
    { id: 5, action: 'Access policy updated', user: 'security@company.com', time: '25 min ago', type: 'access' }
  ]);

  const [quickStats, setQuickStats] = useState({
    totalUsers: 2456,
    activeSessions: 134,
    criticalAlerts: 12,
    anomaliesToday: 45,
    dataMonitored: '2.4TB',
    modelAccuracy: '92.5%'
  });

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>
          <p className="text-gray-600">Detecting and Preventing Data Exfiltration in Cloud Using UBA</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search admin tools..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Quick Actions
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={quickStats.totalUsers}
          change="+2%"
          color="text-blue-600"
        />
        <StatCard
          icon={Activity}
          title="Active Sessions"
          value={quickStats.activeSessions}
          change="-5"
          color="text-green-600"
        />
        <StatCard
          icon={AlertTriangle}
          title="Critical Alerts"
          value={quickStats.criticalAlerts}
          change="+3"
          color="text-red-600"
        />
        <StatCard
          icon={Database}
          title="Data Monitored"
          value={quickStats.dataMonitored}
          change="+12%"
          color="text-purple-600"
        />
        <StatCard
          icon={Zap}
          title="Anomalies Today"
          value={quickStats.anomaliesToday}
          change="+8"
          color="text-orange-600"
        />
        <StatCard
          icon={Target}
          title="Model Accuracy"
          value={quickStats.modelAccuracy}
          change="+1.2%"
          color="text-cyan-600"
        />
      </div>

      {/* Admin Modules Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Modules</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                to={module.path}
                className={`${module.bgColor} rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color}`}>
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

      {/* Quick Access & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/admin/users"
                className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm">Add User</h3>
              </Link>
              <Link
                to="/admin/alerts"
                className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-sm">View Alerts</h3>
              </Link>
              <Link
                to="/admin/reports"
                className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm">Generate Report</h3>
              </Link>
              <Link
                to="/admin/model-results"
                className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm">Model Analytics</h3>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'user' ? 'bg-green-100' :
                    activity.type === 'alert' ? 'bg-red-100' :
                    activity.type === 'anomaly' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.type === 'user' && <Users className="w-4 h-4 text-green-600" />}
                    {activity.type === 'alert' && <Bell className="w-4 h-4 text-red-600" />}
                    {activity.type === 'anomaly' && <ActivityIcon className="w-4 h-4 text-orange-600" />}
                    {activity.type === 'report' && <FileText className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'access' && <Lock className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>by {activity.user}</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">UBA Model</h3>
            <p className="text-sm text-gray-600">Operational</p>
            <div className="mt-2 text-xs text-green-600">✓ Running</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Data Pipeline</h3>
            <p className="text-sm text-gray-600">2.4TB processed</p>
            <div className="mt-2 text-xs text-green-600">✓ Active</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <Server className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Log Collection</h3>
            <p className="text-sm text-gray-600">1,245 logs today</p>
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

      {/* Admin Documentation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Need Help?</h2>
            <p className="text-gray-600">Access admin guides and documentation</p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              View Docs
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;