import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔥 ADDED: useNavigate
import { AlertTriangle, CheckCircle, XCircle, Clock, Loader, Shield } from 'lucide-react';
import toast from 'react-hot-toast'; // 🔥 ADDED: Imported react-hot-toast
import api from "../../services/api";


const MyAlerts = () => {
  const navigate = useNavigate(); // 🔥 ADDED: Initialize navigate hook
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    const fetchAlertsData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/user/ualerts`);
        setAlerts(response.data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        // 🔥 CONVERTED: Replaced inline state error with a toast message
        toast.error("Failed to load your security alerts. Please try again later.");
        
        // 🔥 ADDED: Redirection logic based on error status
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/unauthorized');
        } else {
          navigate('/not-found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAlertsData();
  }, [navigate]); // 🔥 ADDED: Added navigate to dependency array

  const handleResolve = async (id) => {
    try {
      // Send resolve request to the backend
      await api.put(`/api/user/ualerts/${id}/resolve`);
      
      // Update the local state so the UI reflects the resolved status immediately
      setAlerts(currentAlerts => 
        currentAlerts.map(alert => 
          alert.id === id ? { ...alert, status: 'resolved' } : alert
        )
      );
    } catch (err) {
      console.error("Error resolving alert:", err);
      // Optional: You could add a toast notification here to tell the user it failed
    }
  };

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

  // Helper function to format the ISO date from MongoDB
  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown Time';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-400">
        <Loader className="animate-spin mb-4" size={32} />
        <p>Loading your alerts...</p>
      </div>
    );
  }

  // 🔥 REMOVED: Inline error rendering block has been completely removed

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
                        {formatTime(alert.time)}
                      </span>
                      <span className={`text-xs font-medium uppercase ${getSeverityText(alert.severity)}`}>
                        {alert.severity} risk
                      </span>
                    </div>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <button 
                    onClick={() => handleResolve(alert.id)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  >
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
                  : "No alerts found in this view."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAlerts;