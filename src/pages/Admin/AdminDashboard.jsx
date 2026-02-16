import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Shield, AlertTriangle, Users, Database, 
  Activity, Cloud, Download, Clock 
} from 'lucide-react';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 2456,
    activeSessions: 134,
    criticalAlerts: 12,
    dataTransferred: '2.4TB',
    anomalyScore: 78,
    falsePositives: 3,
    avgResponseTime: '2.3s'
  });

  const [activityData, setActivityData] = useState([
    { hour: '00:00', normal: 400, suspicious: 240, critical: 40 },
    { hour: '04:00', normal: 300, suspicious: 139, critical: 60 },
    { hour: '08:00', normal: 200, suspicious: 380, critical: 120 },
    { hour: '12:00', normal: 278, suspicious: 390, critical: 200 },
    { hour: '16:00', normal: 189, suspicious: 480, critical: 180 },
    { hour: '20:00', normal: 239, suspicious: 380, critical: 160 }
  ]);

  const [threatDistribution, setThreatDistribution] = useState([
    { name: 'Insider Threat', value: 35, color: '#FF6B6B' },
    { name: 'Credential Theft', value: 25, color: '#4ECDC4' },
    { name: 'Data Exfiltration', value: 20, color: '#FFD166' },
    { name: 'Account Takeover', value: 15, color: '#06D6A0' },
    { name: 'Privilege Escalation', value: 5, color: '#118AB2' }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: 'john.doe@company.com', action: 'Bulk download', severity: 'high', time: '2 min ago', status: 'Blocked' },
    { id: 2, user: 'jane.smith@company.com', action: 'Access sensitive folder', severity: 'medium', time: '5 min ago', status: 'Flagged' },
    { id: 3, user: 'admin@company.com', action: 'Configuration change', severity: 'low', time: '10 min ago', status: 'Allowed' },
    { id: 4, user: 'contractor@external.com', action: 'API key generation', severity: 'critical', time: '15 min ago', status: 'Blocked' }
  ]);

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">UBA Security Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of user behavior and threat detection</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Generate Report
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={AlertTriangle}
          title="Critical Alerts"
          value={dashboardStats.criticalAlerts}
          change="+2"
          color="text-red-600"
        />
        <StatCard
          icon={Users}
          title="Active Sessions"
          value={dashboardStats.activeSessions}
          change="-5"
          color="text-blue-600"
        />
        <StatCard
          icon={Database}
          title="Data Monitored"
          value={dashboardStats.dataTransferred}
          change="+12%"
          color="text-green-600"
        />
        <StatCard
          icon={Shield}
          title="Anomaly Score"
          value={`${dashboardStats.anomalyScore}%`}
          change="-3%"
          color="text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Activity Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="normal" stroke="#4ECDC4" strokeWidth={2} />
              <Line type="monotone" dataKey="suspicious" stroke="#FFD166" strokeWidth={2} />
              <Line type="monotone" dataKey="critical" stroke="#FF6B6B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Threat Distribution</h2>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={300}>
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-8 space-y-3">
              {threatDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Security Events</h2>
          <button className="text-blue-600 hover:text-blue-800">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="pb-3">User</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">
                    <div className="font-medium">{activity.user}</div>
                  </td>
                  <td className="py-4">{activity.action}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      activity.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      activity.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {activity.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4">{activity.time}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                      activity.status === 'Flagged' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      Investigate
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;