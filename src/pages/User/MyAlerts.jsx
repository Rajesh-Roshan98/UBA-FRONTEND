import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const fetchAlerts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Unusual data volume increase',
          description: '2.8x normal data export detected in the last hour',
          severity: 'high',
          status: 'active',
          time: '10 minutes ago',
          category: 'data-exfiltration'
        },
        {
          id: 2,
          title: 'Access from new location',
          description: 'Login from IP 203.0.113.45, not in typical location list',
          severity: 'medium',
          status: 'active',
          time: '25 minutes ago',
          category: 'unusual-location'
        },
        {
          id: 3,
          title: 'Multiple failed access attempts',
          description: '3 failed attempts on financial records within 5 minutes',
          severity: 'high',
          status: 'active',
          time: '45 minutes ago',
          category: 'brute-force'
        },
        {
          id: 4,
          title: 'Privilege escalation',
          description: 'Temporary admin rights granted for 24 hours',
          severity: 'medium',
          status: 'resolved',
          time: '2 hours ago',
          category: 'privilege-change'
        },
        {
          id: 5,
          title: 'API key rotation completed',
          description: 'Service account key rotated successfully',
          severity: 'low',
          status: 'resolved',
          time: '5 hours ago',
          category: 'maintenance'
        },
        {
          id: 6,
          title: 'New device enrollment',
          description: 'Unknown device "Workstation-XPS" added to trusted devices',
          severity: 'low',
          status: 'active',
          time: '1 day ago',
          category: 'device-change'
        }
      ]);
    }, 600);
  });
};

const MyAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetchAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'active') return alert.status === 'active';
    if (filter === 'resolved') return alert.status === 'resolved';
    return true; // 'all'
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-900/20 border-red-900/30';
      case 'medium': return 'bg-yellow-900/20 border-yellow-900/30';
      case 'low': return 'bg-green-900/20 border-green-900/30';
      default: return 'bg-gray-800 border-gray-700';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">My Alerts</h1>
            <p className="text-gray-400">Security notifications and risk indicators</p>
          </div>
          <div className="flex space-x-2">
            {['active', 'resolved', 'all'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl border p-5 ${getSeverityBg(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{alert.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                    <div className="flex items-center mt-3 space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === 'active' 
                          ? 'bg-red-900/50 text-red-300' 
                          : 'bg-green-900/50 text-green-300'
                      }`}>
                        {alert.status}
                      </span>
                      <span className="flex items-center text-xs text-gray-400">
                        <Clock className="mr-1 h-3 w-3" />
                        {alert.time}
                      </span>
                      <span className={`text-xs font-medium uppercase ${getSeverityText(alert.severity)}`}>
                        {alert.severity} risk
                      </span>
                    </div>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <button className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-300">No alerts</h3>
              <p className="mt-2 text-sm text-gray-500">
                {filter === 'active' 
                  ? "You're all caught up! No active alerts." 
                  : "No resolved alerts in this view."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAlerts;