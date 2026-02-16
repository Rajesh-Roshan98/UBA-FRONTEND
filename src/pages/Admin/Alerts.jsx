import React, { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, XCircle, Filter, Eye, BellOff, Download } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Unusual Data Download Pattern',
      description: 'User downloaded 5GB of sensitive data in 10 minutes',
      severity: 'critical',
      user: 'john.doe@company.com',
      timestamp: '2024-01-15 14:30:22',
      source: 'AWS S3',
      status: 'open',
      assignedTo: 'Security Team'
    },
    {
      id: 2,
      title: 'Suspicious Login Attempt',
      description: 'Login from unusual geographic location (Russia)',
      severity: 'high',
      user: 'admin@company.com',
      timestamp: '2024-01-15 13:15:45',
      source: 'Azure AD',
      status: 'in-progress',
      assignedTo: 'John Smith'
    },
    {
      id: 3,
      title: 'Multiple Failed Access Attempts',
      description: '15 failed access attempts to financial database',
      severity: 'medium',
      user: 'unknown',
      timestamp: '2024-01-15 12:45:10',
      source: 'PostgreSQL',
      status: 'open',
      assignedTo: 'Unassigned'
    },
    {
      id: 4,
      title: 'Data Exfiltration Attempt',
      description: 'Large volume of data transfer to external IP',
      severity: 'critical',
      user: 'contractor@external.com',
      timestamp: '2024-01-15 11:20:33',
      source: 'Network Gateway',
      status: 'resolved',
      assignedTo: 'Security Team'
    },
    {
      id: 5,
      title: 'Privilege Escalation Attempt',
      description: 'User attempted to access admin panel without authorization',
      severity: 'high',
      user: 'jane.smith@company.com',
      timestamp: '2024-01-15 10:05:18',
      source: 'Application Logs',
      status: 'closed',
      assignedTo: 'Admin'
    }
  ]);

  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus;
    return matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsResolved = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const dismissAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'closed' } : alert
    ));
  };

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    open: alerts.filter(a => a.status === 'open').length,
    resolved: alerts.filter(a => a.status === 'resolved' || a.status === 'closed').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Security Alerts</h1>
          <p className="text-gray-600">Monitor and respond to security incidents</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Configure Alerts
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-gray-600">Total Alerts</div>
            </div>
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
              <div className="text-gray-600">Critical Alerts</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">{stats.open}</div>
              <div className="text-gray-600">Open Alerts</div>
            </div>
            <Bell className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-gray-600">Resolved Alerts</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quick Actions</label>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setAlerts(alerts.map(alert => ({ ...alert, status: 'resolved' })));
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve All
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Alert</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Severity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Source</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-gray-500">{alert.description}</div>
                      <div className="text-xs text-gray-400 mt-1">{alert.timestamp}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{alert.user}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{alert.source}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{alert.assignedTo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => markAsResolved(alert.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm flex items-center"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </button>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Dismiss
                      </button>
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Details Panel */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Alert Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Alert Distribution by Severity</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Critical</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full" 
                      style={{ width: `${(stats.critical / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium">{stats.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">High</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-600 rounded-full" 
                      style={{ width: `${(alerts.filter(a => a.severity === 'high').length / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium">{alerts.filter(a => a.severity === 'high').length}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Response Time Statistics</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Average Response Time</span>
                  <span className="font-medium">15 minutes</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-green-600 rounded-full w-3/4" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Resolution Rate</span>
                  <span className="font-medium">82%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-blue-600 rounded-full w-4/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;