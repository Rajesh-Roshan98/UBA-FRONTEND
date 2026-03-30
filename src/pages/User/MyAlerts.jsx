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
          navigate('/server-error');
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

  // 🎨 UI MATCH: Updated to light theme icon colors
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  // 🎨 UI MATCH: Updated to light theme card backgrounds and borders
  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-white border-gray-200';
    }
  };

  // 🎨 UI MATCH: Updated to light theme text colors
  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-green-700';
      default: return 'text-gray-600';
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

  // 🎨 UI MATCH: Updated loading spinner to exactly match the Dashboard
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full bg-white/50 backdrop-blur-md rounded-xl">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading your alerts...
        </p>
      </div>
    );
  }

  // 🔥 REMOVED: Inline error rendering block has been completely removed

  return (
    // 🎨 UI MATCH: Updated main background to bg-gray-100
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 🎨 UI MATCH: Header styling */}
        <div className="flex flex-col md:flex-row mb-2 md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Alerts</h1>
            <p className="text-gray-600 mt-1">Security notifications and risk indicators</p>
          </div>
          
          {/* 🎨 UI MATCH: Light theme filter buttons */}
          <div className="flex space-x-2">
            {['active', 'resolved', 'all'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm ${
                  filter === option
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-blue-600'
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
              // 🎨 UI MATCH: Added subtle shadows and hover transitions to cards
              className={`rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${getSeverityBg(alert.severity)}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    {/* 🎨 UI MATCH: Dark bold text for titles */}
                    <h3 className="text-lg font-bold text-gray-800">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    
                    <div className="flex flex-wrap items-center mt-3 gap-3">
                      {/* 🎨 UI MATCH: Light theme badges */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        alert.status === 'active' 
                          ? 'bg-red-100 text-red-700 border-red-200' 
                          : 'bg-green-100 text-green-700 border-green-200'
                      }`}>
                        {alert.status}
                      </span>
                      
                      <span className="flex items-center text-xs font-medium text-gray-500">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {formatTime(alert.time)}
                      </span>
                      
                      <span className={`text-xs font-bold uppercase ${getSeverityText(alert.severity)}`}>
                        {alert.severity} risk
                      </span>
                    </div>
                  </div>
                </div>
                
                {alert.status === 'active' && (
                  <button 
                    onClick={() => handleResolve(alert.id)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-white font-medium transition-colors shadow-sm self-start whitespace-nowrap"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* 🎨 UI MATCH: Light theme empty state with dashed borders */}
          {filteredAlerts.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-4">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-bold text-gray-800">No alerts</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">
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