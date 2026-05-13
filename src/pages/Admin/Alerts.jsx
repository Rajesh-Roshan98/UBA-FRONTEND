import React, { useState, useEffect } from 'react';
// 🔥 NEW: Imported useNavigate for error redirection
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, CheckCircle, XCircle, Eye, Download, ChevronLeft, ChevronRight, HardDrive } from 'lucide-react';
import api from "../../services/api"; // 🔥 Imported centralized API instance

const API_BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:5000";

// Extracting color maps to save space and remove bulky switch statements
const SEV_COLORS = { critical: 'bg-red-100 text-red-800', high: 'bg-orange-100 text-orange-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-blue-100 text-blue-800' };
const STAT_COLORS = { open: 'bg-red-100 text-red-800', 'in-progress': 'bg-yellow-100 text-yellow-800', investigating: 'bg-blue-100 text-blue-800', pending: 'bg-yellow-100 text-yellow-800', resolved: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800', 'false-positive': 'bg-gray-100 text-gray-800' };

const Alerts = () => {
  // 🔥 NEW: Initialize navigate
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // ✅ ADDED: State to manage the detailed view modal
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      // We can use URLSearchParams to build the query string cleanly
      const params = new URLSearchParams();
      if (selectedSeverity !== 'all') params.append('severity', selectedSeverity);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';

      // 🔥 Switched from fetch to api.get
      const res = await api.get(`${API_BASE}/api/v1/uba/alerts${queryString}`);
      const data = res.data; // Axios auto-parses JSON to .data

      if (data.success) {
        setAlerts(data.alerts);
        setCurrentPage(1);
      } else {
        setError(data.message || 'Failed to fetch alerts');
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("An error occurred while fetching alerts.");
      
      // 🔥 UPDATED: Manual navigation logic removed.
      // Your global api.js interceptor will now automatically handle redirects
      // to /unauthorized?code=... or /server-error?code=... based on HTTP status
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [selectedSeverity, selectedStatus]);

  const updateAlertStatus = async (id, newStatus) => {
    try {
      // Optimistic UI update
      setAlerts(alerts.map(a => (a.id === id ? { ...a, status: newStatus } : a)));
      
      // 🔥 Switched from fetch to api.put
      const res = await api.put(`${API_BASE}/api/v1/uba/alerts/${id}/status`, { status: newStatus });
      const data = res.data;
      
      if (!data.success) {
        fetchAlerts(); // Revert on failure
        console.error("Failed to update status:", data.message);
      }
    } catch (err) {
      console.error("Error updating alert status:", err);
      fetchAlerts(); // Revert on failure
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(alerts.length / itemsPerPage);

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity?.toLowerCase() === 'critical').length,
    open: alerts.filter(a => ['open', 'pending'].includes(a.status?.toLowerCase())).length,
    resolved: alerts.filter(a => ['resolved', 'closed'].includes(a.status?.toLowerCase())).length
  };

  // Reusable configuration arrays for mapping UI components
  const statCards = [
    { count: stats.total, label: 'Total Alerts', icon: Bell, valCol: 'text-gray-800', icnCol: 'text-blue-600' },
    { count: stats.critical, label: 'Critical Alerts', icon: AlertTriangle, valCol: 'text-red-600', icnCol: 'text-red-600' },
    { count: stats.open, label: 'Open Alerts', icon: Bell, valCol: 'text-yellow-600', icnCol: 'text-yellow-600' },
    { count: stats.resolved, label: 'Resolved Alerts', icon: CheckCircle, valCol: 'text-green-600', icnCol: 'text-green-600' }
  ];

  const distBars = [
    { label: 'Critical', count: stats.critical, color: 'bg-red-600' },
    { label: 'High', count: alerts.filter(a => a.severity?.toLowerCase() === 'high').length, color: 'bg-orange-600' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 w-full overflow-x-hidden bg-gray-50">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Security Alerts</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor and respond to security incidents</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:space-x-3">
          <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex justify-center items-center transition-colors duration-200 text-sm font-medium bg-white">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center items-center transition-colors duration-200 hover:shadow-md text-sm font-medium">
            <Bell className="w-4 h-4 mr-2" /> Configure Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between transition-all duration-300 hover:shadow-md cursor-default">
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${s.valCol}`}>{s.count}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
            <s.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${s.icnCol} shrink-0`} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row flex-wrap gap-4 transition-all duration-300 hover:shadow-md">
        <div className="w-full sm:w-auto sm:flex-1">
          <label className="block text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Severity</label>
          <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-base sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all bg-white" value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)}>
            {['all', 'Critical', 'High', 'Medium'].map(s => <option key={s} value={s}>{s === 'all' ? 'All Severities' : s}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-auto sm:flex-1">
          <label className="block text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Status</label>
          <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-base sm:text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all bg-white" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="false-positive">False Positive</option>
          </select>
        </div>
        <div className="w-full sm:w-auto sm:flex-1 flex flex-col justify-end">
          <label className="hidden sm:block text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">&nbsp;</label>
          <button onClick={fetchAlerts} className="w-full px-4 py-2 border border-gray-200 cursor-pointer rounded-md text-sm font-medium bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200">
            Refresh Data
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      
      {loading ? (
        // 🔥 NEW: AdminHomePage-style loading animation (replacing plain text loader)
        <div className="flex flex-col items-center justify-center min-h-[40vh] w-full bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-gray-200">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading Alerts...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all duration-300">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Alert", "User ID", "Severity", "Source", "Status", "Assigned To", "Actions"].map(th => (
                    <th key={th} className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentAlerts.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500 italic text-sm">No alerts found.</td></tr>
                ) : (
                  currentAlerts.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/80 transition-colors duration-200">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-semibold text-sm text-gray-900">{a.title}</div>
                        <div className="text-xs text-gray-600 mt-1 truncate max-w-[250px]">{a.description}</div>
                        <div className="text-[11px] text-gray-400 mt-1">{new Date(a.timestamp).toLocaleString()}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-800 break-all sm:break-normal">{a.user_id || a.user || 'Unknown'}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${SEV_COLORS[a.severity?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{a.severity || "UNKNOWN"}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{a.source || 'UBA Model'}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${STAT_COLORS[a.status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{a.status?.replace(/-/g, ' ')}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{a.assignedTo || 'Security Team'}</td>
                      <td className="px-4 sm:px-6 py-4 flex space-x-2">
                        <button onClick={() => updateAlertStatus(a.id, 'resolved')} className="p-1.5 bg-green-50 text-green-600 cursor-pointer rounded hover:bg-green-100 text-sm flex items-center transition-colors duration-200" title="Resolve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateAlertStatus(a.id, 'false-positive')} className="p-1.5 bg-gray-50 text-gray-500 cursor-pointer rounded hover:bg-gray-100 text-sm flex items-center transition-colors duration-200" title="Dismiss">
                          <XCircle className="w-4 h-4" />
                        </button>
                        {/* ✅ ADDED: View Details button triggers modal */}
                        <button onClick={() => setSelectedAlert(a)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded cursor-pointer transition-colors duration-200" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {alerts.length > 0 && (
            <div className="bg-white px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mt-auto">
              <div className="flex flex-row items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-700">
                <span className="hidden sm:inline">Rows per page:</span>
                <span className="sm:hidden">Rows:</span>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded-md py-1 pl-1 sm:pl-2 pr-5 sm:pr-6 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500">
                  {[10, 20, 25, 50].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <span className="truncate">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, alerts.length)} of {alerts.length}</span>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 sm:p-1.5 rounded-lg sm:rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                  <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600 cursor-pointer" />
                </button>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 sm:p-1.5 rounded-lg sm:rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                  <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600 cursor-pointer" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ ADDED: Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[95%] sm:w-full max-w-2xl max-h-[90dvh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
            
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900">Alert Details</h3>
              <button onClick={() => setSelectedAlert(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">General Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">User</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base break-all">{selectedAlert.user_id || selectedAlert.user || 'Unknown'}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">Risk Score</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{selectedAlert.riskScore ? `${selectedAlert.riskScore?.toFixed(2)}/100` : 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">Status</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base capitalize">{selectedAlert.status}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">Severity</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base capitalize">{selectedAlert.severity}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Endpoint & Device Metrics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                    <span className="text-[10px] sm:text-xs text-blue-600 font-semibold uppercase tracking-wide block mb-1">USB Connects</span>
                    <span className="text-lg sm:text-xl font-bold text-blue-900">{selectedAlert.device_connect_count || 0}</span>
                  </div>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                    <span className="text-[10px] sm:text-xs text-blue-600 font-semibold uppercase tracking-wide block mb-1">Avg Session (hrs)</span>
                    <span className="text-lg sm:text-xl font-bold text-blue-900">{selectedAlert.avg_session_duration?.toFixed(2) || 0}</span>
                  </div>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                    <span className="text-[10px] sm:text-xs text-blue-600 font-semibold uppercase tracking-wide block mb-1">Unique PCs Used</span>
                    <span className="text-lg sm:text-xl font-bold text-blue-900">{selectedAlert.device_unique_pcs || 0}</span>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-xl border border-purple-100">
                    <span className="text-[10px] sm:text-xs text-purple-600 font-semibold uppercase tracking-wide block mb-1">After-Hours USB</span>
                    <span className="text-lg sm:text-xl font-bold text-purple-900">{selectedAlert.device_after_hours || 0}</span>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-xl border border-purple-100">
                    <span className="text-[10px] sm:text-xs text-purple-600 font-semibold uppercase tracking-wide block mb-1">Weekend USB</span>
                    <span className="text-lg sm:text-xl font-bold text-purple-900">{selectedAlert.device_weekend_usage || 0}</span>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-xl border border-purple-100">
                    <span className="text-[10px] sm:text-xs text-purple-600 font-semibold uppercase tracking-wide block mb-1">Connect/Disconnect</span>
                    <span className="text-lg sm:text-xl font-bold text-purple-900">{selectedAlert.connect_disconnect_ratio?.toFixed(2) || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Explanation</h4>
                <div className="bg-red-50/50 text-red-900 p-4 sm:p-5 rounded-xl border border-red-100 text-sm leading-relaxed break-words">
                  {selectedAlert.description}
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-0 sm:space-x-3">
              <button onClick={() => setSelectedAlert(null)} className="w-full sm:w-auto px-5 py-3 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm font-medium text-gray-700 shadow-sm active:scale-[0.98]">
                Close
              </button>
              <button onClick={() => { updateAlertStatus(selectedAlert.id, 'investigating'); setSelectedAlert(null); }} className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium shadow-sm active:scale-[0.98]">
                Mark as Investigating
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Alerts;
