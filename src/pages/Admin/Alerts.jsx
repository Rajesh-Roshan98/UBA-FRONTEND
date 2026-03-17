import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, XCircle, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import api from "../../services/api"; // 🔥 Imported centralized API instance

const API_BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:5000";

// Extracting color maps to save space and remove bulky switch statements
const SEV_COLORS = { critical: 'bg-red-100 text-red-800', high: 'bg-orange-100 text-orange-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-blue-100 text-blue-800' };
const STAT_COLORS = { open: 'bg-red-100 text-red-800', 'in-progress': 'bg-yellow-100 text-yellow-800', investigating: 'bg-yellow-100 text-yellow-800', pending: 'bg-yellow-100 text-yellow-800', resolved: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800', 'false-positive': 'bg-gray-100 text-gray-800' };

const Alerts = () => {
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
      const res = await api.get(`${API_BASE}/api/uba/alerts${queryString}`);
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
      const res = await api.put(`${API_BASE}/api/uba/alerts/${id}/status`, { status: newStatus });
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
    <div className="p-6 space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Security Alerts</h1>
          <p className="text-gray-600">Monitor and respond to security incidents</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center transition-colors duration-200">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200 hover:shadow-lg">
            <Bell className="w-4 h-4 mr-2" /> Configure Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default">
            <div>
              <div className={`text-3xl font-bold ${s.valCol}`}>{s.count}</div>
              <div className="text-gray-600">{s.label}</div>
            </div>
            <s.icon className={`w-8 h-8 ${s.icnCol}`} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 flex flex-wrap gap-4 transition-all duration-300 hover:shadow-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
          <select className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all" value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)}>
            {['all', 'Critical', 'High', 'Medium'].map(s => <option key={s} value={s}>{s === 'all' ? 'All Severities' : s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="border border-gray-300 rounded-lg px-4 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="false-positive">False Positive</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quick Actions</label>
          <button onClick={fetchAlerts} className="px-4 py-2 border border-gray-300 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center transition-colors duration-200">
            Refresh Data
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading alerts...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Alert", "User ID", "Severity", "Source", "Status", "Assigned To", "Actions"].map(th => (
                    <th key={th} className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentAlerts.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No alerts found.</td></tr>
                ) : (
                  currentAlerts.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-gray-500">{a.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(a.timestamp).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{a.user_id || a.user || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${SEV_COLORS[a.severity?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{a.severity?.toUpperCase() || "UNKNOWN"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{a.source || 'UBA Model'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STAT_COLORS[a.status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{a.status?.replace(/-/g, ' ')}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{a.assignedTo || 'Security Team'}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button onClick={() => updateAlertStatus(a.id, 'resolved')} className="px-3 py-1 bg-green-100 text-green-700 cursor-pointer rounded-lg hover:bg-green-200 text-sm flex items-center transition-colors duration-200">
                          <CheckCircle className="w-3 h-3 mr-1" /> Resolve
                        </button>
                        <button onClick={() => updateAlertStatus(a.id, 'false-positive')} className="px-3 py-1 bg-gray-100 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-200 text-sm flex items-center transition-colors duration-200">
                          <XCircle className="w-3 h-3 mr-1" /> Dismiss
                        </button>
                        {/* ✅ ADDED: View Details button triggers modal */}
                        <button onClick={() => setSelectedAlert(a)} className="p-1 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"><Eye className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {alerts.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-700">
                <span>Rows per page:</span>
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded-md py-1 pl-2 pr-6 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500">
                  {[10, 20, 25, 50].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, alerts.length)} of {alerts.length}</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200">
                  <ChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
                </button>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200">
                  <ChevronRight className="w-5 h-5 text-gray-600 cursor-pointer" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Alert Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Alert Distribution by Severity</h3>
              <div className="space-y-2">
                {distBars.map((d, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="text-sm">{d.label}</span>
                    <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${(d.count / Math.max(stats.total, 1)) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Response Time Statistics</h3>
              <div className="flex justify-between text-sm">
                <span>Resolution Rate</span>
                <span className="font-medium">{stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ADDED: Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Alert Details</h3>
              <button onClick={() => setSelectedAlert(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">General Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-500 block">User</span>
                    <span className="font-medium text-gray-900">{selectedAlert.user_id || selectedAlert.user || 'Unknown'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-500 block">Risk Score</span>
                    <span className="font-medium text-gray-900">{selectedAlert.riskScore ? `${selectedAlert.riskScore}/100` : 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-500 block">Status</span>
                    <span className="font-medium text-gray-900 capitalize">{selectedAlert.status}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-500 block">Severity</span>
                    <span className="font-medium text-gray-900 capitalize">{selectedAlert.severity}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Endpoint & Device Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="text-xs text-blue-600 block mb-1">USB Connects</span>
                    <span className="text-xl font-bold text-blue-900">{selectedAlert.device_connect_count || 0}</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="text-xs text-blue-600 block mb-1">Avg Session (hrs)</span>
                    <span className="text-xl font-bold text-blue-900">{selectedAlert.avg_session_duration?.toFixed(2) || 0}</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="text-xs text-blue-600 block mb-1">Unique PCs Used</span>
                    <span className="text-xl font-bold text-blue-900">{selectedAlert.device_unique_pcs || 0}</span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <span className="text-xs text-purple-600 block mb-1">After-Hours USB</span>
                    <span className="text-xl font-bold text-purple-900">{selectedAlert.device_after_hours || 0}</span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <span className="text-xs text-purple-600 block mb-1">Weekend USB</span>
                    <span className="text-xl font-bold text-purple-900">{selectedAlert.device_weekend_usage || 0}</span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <span className="text-xs text-purple-600 block mb-1">Connect/Disconnect Ratio</span>
                    <span className="text-xl font-bold text-purple-900">{selectedAlert.connect_disconnect_ratio || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Explanation</h4>
                <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 italic text-sm">
                  {selectedAlert.description}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setSelectedAlert(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                Close
              </button>
              <button onClick={() => { updateAlertStatus(selectedAlert.id, 'investigating'); setSelectedAlert(null); }} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium shadow-sm">
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