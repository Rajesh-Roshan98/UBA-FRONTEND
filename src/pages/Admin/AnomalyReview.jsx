import React, { useState, useEffect } from 'react';
// 🔥 NEW: Imported useNavigate for error redirection
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Eye, CheckCircle, XCircle, Download, RefreshCw, ChevronLeft, ChevronRight, HardDrive } from 'lucide-react';
import api from "../../services/api"; // 🔥 Imported centralized API instance

const API_BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:5000";

const SCORE_COLORS = (s) => s >= 80 ? 'bg-red-100 text-red-800' : s >= 60 ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800';
const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-800', open: 'bg-yellow-100 text-yellow-800', investigating: 'bg-blue-100 text-blue-800', reviewed: 'bg-purple-100 text-purple-800', confirmed: 'bg-green-100 text-green-800', 'false-positive': 'bg-gray-100 text-gray-800' };

const AnomalyReview = () => {
  // 🔥 NEW: Initialize navigate
  const navigate = useNavigate();

  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      // 🔥 Switched from fetch to api.get
      const res = await api.get(`${API_BASE}/api/uba/alerts/anomalies`);
      const data = res.data; // 🔥 Axios automatically parses JSON into the .data property
      
      if (data.success) {
        const formatted = data.anomalies.map(a => ({
          id: a.id, 
          type: a.anomaly, 
          user: a.email, 
          score: a.riskScore, 
          description: a.reason, 
          status: a.status, 
          timestamp: new Date(a.timestamp).toLocaleString(),
          // ✅ ADDED: Capture new device metrics from API
          device_connect_count: a.device_connect_count || 0,
          avg_session_duration: a.avg_session_duration || 0,
          device_after_hours: a.device_after_hours || 0,
          device_weekend_usage: a.device_weekend_usage || 0
        }));
        setAnomalies(formatted);
        if (selectedAnomaly) setSelectedAnomaly(formatted.find(a => a.id === selectedAnomaly.id) || null);
      }
    } catch (err) { 
      console.error(err); 
      
      // 🔥 UPDATED: Manual navigation logic removed.
      // Your global api.js interceptor will now automatically handle redirects
      // to /unauthorized?code=... or /server-error?code=... based on HTTP status
      
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAnomalies(); }, []);
  useEffect(() => { setCurrentPage(1); setSelectedAnomaly(null); }, [selectedType, selectedStatus]);

  const updateStatus = async (id, status) => {
    try {
      // Optimistic UI update
      setAnomalies(anomalies.map(a => a.id === id ? { ...a, status } : a));
      if (selectedAnomaly?.id === id) setSelectedAnomaly({ ...selectedAnomaly, status });
      
      // 🔥 Switched from fetch to api.put
      await api.put(`${API_BASE}/api/uba/alerts/${id}/status`, { status });
    } catch (err) { 
      // Revert on failure
      fetchAnomalies(); 
    }
  };

  const filtered = anomalies.filter(a => (selectedType === 'all' || a.type === selectedType) && (selectedStatus === 'all' || a.status === selectedStatus));
  const idxLast = currentPage * itemsPerPage, idxFirst = idxLast - itemsPerPage;
  const currentAnomalies = filtered.slice(idxFirst, idxLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const stats = {
    total: anomalies.length, highRisk: anomalies.filter(a => a.score >= 80).length,
    pending: anomalies.filter(a => ['pending', 'open'].includes(a.status?.toLowerCase())).length,
    confirmed: anomalies.filter(a => a.status === 'confirmed').length
  };
  const uniqueTypes = [...new Set(anomalies.map(a => a.type))];

  // 🔥 NEW: Clean, static loading animation exactly like AdminHomePage
  if (loading && anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white/50 backdrop-blur-md rounded-xl p-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm sm:text-base font-medium text-gray-500 text-center">
          Loading Anomaly Review...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full overflow-x-hidden bg-gray-50">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Anomaly Review</h1>
          <p className="text-sm text-gray-600 mt-1">Review and validate detected anomalies</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:space-x-4">
          <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button onClick={fetchAnomalies} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg flex justify-center cursor-pointer items-center hover:bg-blue-700 transition-colors">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { v: stats.total, l: 'Total Anomalies', i: Activity, c: 'text-blue-600' }, { v: stats.highRisk, l: 'High Risk', i: AlertTriangle, c: 'text-red-600', vc: 'text-red-600' },
          { v: stats.pending, l: 'Pending Review', i: Eye, c: 'text-yellow-600', vc: 'text-yellow-600' }, { v: stats.confirmed, l: 'Confirmed', i: CheckCircle, c: 'text-green-600', vc: 'text-green-600' }
        ].map((s, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
            <div>
              <div className={`text-3xl font-bold mb-1 ${s.vc || 'text-gray-800'}`}>{s.v}</div>
              <div className="text-gray-600">{s.l}</div>
            </div>
            <s.i className={`w-8 h-8 ${s.c} shrink-0`} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row flex-wrap gap-4">
        <div className="w-full sm:w-auto flex-1 sm:flex-none">
          <label className="block text-sm font-medium text-gray-700 mb-1">Anomaly Type</label>
          <select className="w-full border border-gray-300 cursor-pointer rounded-lg px-4 py-2 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">All Types</option>{uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-auto flex-1 sm:flex-none">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="w-full border border-gray-300 cursor-pointer rounded-lg px-4 py-2 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            {['all', 'open', 'investigating', 'reviewed', 'confirmed', 'false-positive'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`order-2 lg:order-1 ${selectedAnomaly ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-gray-50">
                  <tr>
                    {["Anomaly", "User Email", "Risk Score", "Status", "Actions"].map(h => <th key={h} className="px-4 sm:px-6 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentAnomalies.length === 0 ? <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No anomalies found.</td></tr> :
                   currentAnomalies.map(a => (
                    <tr key={a.id} className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedAnomaly?.id === a.id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedAnomaly(a)}>
                      <td className="px-4 sm:px-6 py-4"><div><div className="font-medium text-sm sm:text-base">{a.type}</div><div className="text-xs text-gray-400 mt-1">{a.timestamp}</div></div></td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-800 break-all sm:break-normal">{a.user}</td>
                      <td className="px-4 sm:px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-bold ${SCORE_COLORS(a.score)}`}>{a.score.toFixed(2)}</span></td>
                      <td className="px-4 sm:px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium uppercase whitespace-nowrap ${STATUS_COLORS[a.status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{a.status}</span></td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex space-x-2">
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(a.id, 'confirmed'); }} className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer"><CheckCircle className="w-5 h-5" /></button>
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(a.id, 'false-positive'); }} className="p-1 text-gray-500 hover:bg-gray-100 rounded cursor-pointer"><XCircle className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 🔥 PAGINATION ROW UPDATED TO FLEX-ROW ON MOBILE */}
            {filtered.length > 0 && (
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-row items-center justify-between mt-auto gap-4">
                <div className="flex flex-row items-center space-x-4">
                  <div className="flex items-center space-x-2 hidden sm:flex">
                    <span className="text-sm text-gray-700">Rows:</span>
                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); setSelectedAnomaly(null); }} className="border border-gray-300 rounded-md text-sm py-1.5 sm:py-1 pl-2 pr-6 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer bg-white">
                      {[10, 20, 25, 50].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700">
                    Showing {idxFirst + 1}-{Math.min(idxLast, filtered.length)} of {filtered.length}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); setSelectedAnomaly(null); }} disabled={currentPage === 1} className="p-1.5 rounded-lg sm:rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                  <button onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); setSelectedAnomaly(null); }} disabled={currentPage === totalPages} className="p-1.5 rounded-lg sm:rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedAnomaly && (
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:sticky lg:top-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h2 className="text-lg sm:text-xl font-semibold">Anomaly Details</h2>
                <button onClick={() => setSelectedAnomaly(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"><XCircle className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6">
                <div><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Type</h3><p className="text-base sm:text-lg font-bold break-words">{selectedAnomaly.type}</p></div>
                <div><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">User</h3><p className="text-sm sm:text-md text-gray-800 break-all sm:break-normal">{selectedAnomaly.user}</p></div>
                
                {/* ✅ ADDED: Mini Endpoint Security Card */}
                {selectedAnomaly.device_connect_count > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <HardDrive className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                      <h3 className="text-[10px] sm:text-xs font-bold text-blue-800 uppercase tracking-wider">Endpoint Activity Detected</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm mt-2">
                      <div><span className="text-blue-600/70 text-xs block">USB Connects</span><span className="font-semibold text-blue-900">{selectedAnomaly.device_connect_count}</span></div>
                      <div><span className="text-blue-600/70 text-xs block">Avg Session</span><span className="font-semibold text-blue-900">{selectedAnomaly.avg_session_duration?.toFixed(1)} hrs</span></div>
                      {selectedAnomaly.device_after_hours > 0 && <div><span className="text-red-500/70 text-xs block">After Hours</span><span className="font-semibold text-red-700">{selectedAnomaly.device_after_hours} events</span></div>}
                      {selectedAnomaly.device_weekend_usage > 0 && <div><span className="text-orange-500/70 text-xs block">Weekend Usage</span><span className="font-semibold text-orange-700">{selectedAnomaly.device_weekend_usage} events</span></div>}
                    </div>
                  </div>
                )}

                <div><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reason</h3><div className="bg-gray-50 p-4 rounded-lg border border-gray-200"><p className="text-sm text-gray-700 break-words">{selectedAnomaly.description}</p></div></div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4"><h3 className="text-sm font-bold text-gray-600">Risk Score</h3><span className={`px-4 py-2 rounded-lg font-bold ${SCORE_COLORS(selectedAnomaly.score)}`}>{selectedAnomaly.score.toFixed(2)}</span></div>
                <div className="pt-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button onClick={() => updateStatus(selectedAnomaly.id, 'confirmed')} className="w-full sm:flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex justify-center items-center cursor-pointer transition-colors"><CheckCircle className="w-4 h-4 mr-2" /> Confirm</button>
                  <button onClick={() => updateStatus(selectedAnomaly.id, 'false-positive')} className="w-full sm:flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 flex justify-center items-center cursor-pointer transition-colors"><XCircle className="w-4 h-4 mr-2" /> Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Analysis Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div><h3 className="font-medium mb-3">Detection Performance</h3>
            <div className="space-y-4">
              <div><div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700">True Positive Rate</span><span className="font-medium text-gray-900">85%</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-green-600 rounded-full" style={{ width: '85%' }} /></div></div>
              <div><div className="flex justify-between text-sm mb-1.5"><span className="text-gray-700">False Positive Rate</span><span className="font-medium text-gray-900">12%</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-red-600 rounded-full" style={{ width: '12%' }} /></div></div>
            </div>
          </div>
          <div><h3 className="font-medium mb-3">Anomaly Types</h3>
            <div className="space-y-3">
              {uniqueTypes.length === 0 ? <p className="text-sm text-gray-500">No data</p> : uniqueTypes.map((t) => {
                const count = anomalies.filter(a => a.type === t).length;
                return (
                  <div key={t} className="flex justify-between text-sm items-center"><span className="truncate w-[40%] pr-2 text-gray-700" title={t}>{t}</span><div className="flex items-center w-[60%] justify-end"><div className="w-full max-w-[120px] h-2 bg-gray-200 rounded-full mr-3 overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${(count / anomalies.length) * 100}%` }} /></div><span className="font-medium w-8 text-right text-gray-900">{count}</span></div></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnomalyReview;