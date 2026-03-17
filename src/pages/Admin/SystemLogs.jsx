import { useEffect, useState } from "react";
import api from "../../services/api";

const API_BASE = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState("");
  const [filterPrediction, setFilterPrediction] = useState("all");
  
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchLogs(true);
  }, []);

  const fetchLogs = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const res = await api.get(`${API_BASE}/api/uba/logs`);
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const sortedLogs = [...logs].sort((a, b) => (a.risk_score || 0) - (b.risk_score || 0));

  const filteredLogs = sortedLogs.filter((log) => {
    const matchesUser = (log.user_id || "")
      .toLowerCase()
      .includes(search.toLowerCase());
      
    const displayPrediction = log.prediction_label || (log.prediction === -1 ? "Anomaly" : log.prediction === 1 ? "Normal" : log.prediction);
    
    const matchesPrediction =
      filterPrediction === "all" ? true : displayPrediction === filterPrediction;
    return matchesUser && matchesPrediction;
  });

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);

  return (
    // ✅ Keep relative here so that children with 'absolute' stay inside this box
    <div className="relative p-6 bg-gray-100 w-full h-full overflow-hidden flex flex-col space-y-4">
      
      {loading && (
        // ✅ Changed 'fixed' to 'absolute' so it doesn't cover the Sidebar
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-30 flex items-center justify-center">
          <div className="h-14 w-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {selectedUser && (
        // ✅ Changed 'fixed' to 'absolute' and 'w-screen/h-screen' to 'inset-0'
        // This ensures the modal stays inside the main content panel only.
        <div className="absolute inset-0 z-50 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10">
              <div>
                <h3 className="text-3xl font-extrabold text-gray-900">{selectedUser.employee_name}</h3>
                <p className="text-indigo-600 font-medium tracking-wide uppercase text-sm">{selectedUser.role} • {selectedUser.user_id}</p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
              >
                <span className="text-3xl font-light cursor-pointer">✕</span>
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DetailBox label="Risk Score" value={`${selectedUser.risk_score || 0}/100`} isRed={selectedUser.risk_score > 70} isOrange={selectedUser.risk_score > 40 && selectedUser.risk_score <= 70} />
                <DetailBox label="Severity" value={selectedUser.severity || "Low"} isSeverity />
                <DetailBox label="Anomaly Score" value={selectedUser.anomaly_score ? selectedUser.anomaly_score.toFixed(2) : 0} />
                <DetailBox label="Prediction Status" value={selectedUser.prediction_label || (selectedUser.prediction === -1 ? 'Anomaly' : selectedUser.prediction === 1 ? 'Normal' : selectedUser.prediction)} isStatus />
                
                <DetailBox label="Email Address" value={selectedUser.email} isBlue />
                <DetailBox label="Days Active" value={selectedUser.days_active} />
                <DetailBox label="Total Activity" value={selectedUser.total_activity} />
                <DetailBox label="Activity/Day" value={selectedUser.activity_per_day} /> 
                <DetailBox label="Login Count" value={selectedUser.login_count} />
                <DetailBox label="Logins/Day" value={selectedUser.login_per_day} />
                
                <DetailBox label="Unique PCs" value={selectedUser.unique_pcs} />
                <DetailBox label="Total Lifetime Hours" value={selectedUser.total_lifetime_hours} />
                <DetailBox label="Active Hours/Day" value={selectedUser.avg_active_hours_per_day} />
                <DetailBox label="Actions/Hour" value={selectedUser.actions_per_hour} />
                
                <DetailBox label="File Access" value={selectedUser.file_access_count} />
                <DetailBox label="File Copy" value={selectedUser.file_copy_count} />
                <DetailBox label="Removable Uploads" value={selectedUser.removable_uploads} isOrange />
                <DetailBox label="Removable Downloads" value={selectedUser.removable_downloads} isOrange />
                <DetailBox label="Decoy Access" value={selectedUser.decoy_access_count} isRed />
                
                <DetailBox label="Emails Sent" value={selectedUser.email_sent_count} isBlue />
                <DetailBox label="Total Email Size" value={`${((selectedUser.total_email_size || 0) / (1024 * 1024)).toFixed(2)} MB`} isBlue />
                <DetailBox label="Avg Email Size" value={`${((selectedUser.avg_email_size || 0) / (1024 * 1024)).toFixed(2)} MB`} isBlue />
                <DetailBox label="Attachments" value={selectedUser.attachment_count} isBlue />
                
                <DetailBox label="After Hours Activity" value={selectedUser.after_hours_activity} isOrange={selectedUser.after_hours_activity > 0} />
                <DetailBox label="Weekend Activity" value={selectedUser.weekend_activity} isOrange={selectedUser.weekend_activity > 0} />

                <DetailBox label="Endpoint Activity" value={selectedUser.device_activity_count} isBlue />
                <DetailBox label="USB Connects" value={selectedUser.device_connect_count} />
                <DetailBox label="Avg Session (hrs)" value={selectedUser.avg_session_duration ? selectedUser.avg_session_duration.toFixed(2) : 0} />
                <DetailBox label="Device Unique PCs" value={selectedUser.device_unique_pcs} />
                <DetailBox label="Device After Hours" value={selectedUser.device_after_hours} isOrange={selectedUser.device_after_hours > 0} />
                <DetailBox label="Device Weekend" value={selectedUser.device_weekend_usage} isOrange={selectedUser.device_weekend_usage > 0} />
                <DetailBox label="Connect/Disconnect Ratio" value={selectedUser.connect_disconnect_ratio} />
                <DetailBox label="Device Usage/Day" value={selectedUser.device_usage_per_day} />
                
                <DetailBox label="Window (7 Days)" value={selectedUser.window_7_days || 0} />
                <DetailBox label="Window (30 Days)" value={selectedUser.window_30_days || 0} />
                <DetailBox label="Baseline (90 Days)" value={selectedUser.baseline_90_days || 0} />
                <DetailBox label="Drift (7D vs 30D)" value={selectedUser.drift_7d_vs_30d || 0} isOrange={selectedUser.drift_7d_vs_30d > 2.0} />
                <DetailBox label="Drift (30D vs 90D)" value={selectedUser.drift_30d_vs_90d || 0} isOrange={selectedUser.drift_30d_vs_90d > 2.0} />
              </div>

              {selectedUser.explanation && (
                <div className={`border rounded-2xl p-6 shadow-sm ${(selectedUser.prediction_label === "Anomaly" || selectedUser.prediction === "Anomaly" || selectedUser.prediction === -1) ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
                  <p className={`text-[10px] uppercase font-bold tracking-widest opacity-80 mb-2 ${(selectedUser.prediction_label === "Anomaly" || selectedUser.prediction === "Anomaly" || selectedUser.prediction === -1) ? "text-red-700" : "text-green-700"}`}>
                    AI Behavioral Explanation
                  </p>
                  <p className={`text-md font-medium leading-relaxed ${(selectedUser.prediction_label === "Anomaly" || selectedUser.prediction === "Anomaly" || selectedUser.prediction === -1) ? "text-red-900" : "text-green-900"}`}>
                    {selectedUser.explanation}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between text-sm text-gray-500 gap-4">
                <p><strong>First Observed:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table View Header */}
      <div className="flex-shrink-0 z-20 bg-gray-100 space-y-3">
        <h2 className="text-2xl font-bold text-gray-800">User Activity Logs</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <select
              className="border rounded-lg px-3 py-1.5 bg-white shadow-sm font-medium text-gray-700 outline-none transition-all hover:bg-gray-100 hover:shadow-md focus:ring-2 focus:ring-indigo-50 cursor-pointer"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              className="border rounded-lg px-3 py-1.5 bg-white shadow-sm font-medium text-gray-700 outline-none transition-all hover:bg-gray-100 hover:shadow-md focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={filterPrediction}
              onChange={(e) => {
                setFilterPrediction(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Predictions</option>
              <option value="Normal">Normal Only</option>
              <option value="Anomaly">Anomaly Only</option>
            </select>
            <input 
              type="text"
              placeholder="Search User ID..."
              className="border rounded-lg px-4 py-1.5 ml-2 bg-white shadow-sm font-medium text-gray-700 outline-none transition-all hover:shadow-md focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1.5 rounded-lg bg-white shadow-sm border font-medium text-gray-700 transition-all hover:bg-gray-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-sm cursor-pointer"
            >
              Prev
            </button>
            <span className="text-sm text-gray-500 font-medium px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-1.5 rounded-lg bg-white shadow-sm border font-medium text-gray-700 transition-all hover:bg-gray-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-sm cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              {["SL. No", "Employee Name", "Role", "Risk Score", "Severity", "Login/Day", "Prediction"].map((h) => (
                <th 
                  key={h} 
                  className="bg-gray-50 p-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs shadow-[inset_0_-1px_0_0_#e5e7eb]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentLogs.length ? (
              currentLogs.map((log, i) => {
                const isAnomaly = log.prediction_label === "Anomaly" || log.prediction === "Anomaly" || log.prediction === -1;
                const displayPrediction = log.prediction_label || (log.prediction === -1 ? "Anomaly" : log.prediction === 1 ? "Normal" : log.prediction);

                return (
                  <tr
                    key={log._id}
                    onClick={() => setSelectedUser(log)}
                    className={`cursor-pointer transition-all duration-200 hover:bg-indigo-50/50 ${
                      isAnomaly ? "bg-red-50/40" : "bg-white"
                    }`}
                  >
                    <td className="p-4 text-gray-500 font-mono">{indexOfFirst + i + 1}</td>
                    <td className="p-4 font-semibold text-gray-900">{log.employee_name}</td>
                    <td className="p-4 text-gray-600 font-medium">{log.role}</td>
                    <td className="p-4">
                      <span className={`font-mono font-bold ${log.risk_score > 70 ? 'text-red-600' : log.risk_score > 40 ? 'text-orange-500' : 'text-gray-600'}`}>
                        {log.risk_score || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        log.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        log.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                        log.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {log.severity || 'Low'}
                      </span>
                    </td>
                    <td className="p-4 text-left font-mono text-gray-600">{log.login_per_day || 0}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        isAnomaly ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {displayPrediction}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-gray-400 italic">No activity logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailBox({ label, value, isBlue, isOrange, isRed, isStatus, isSeverity }) {
  let colorClass = "bg-gray-50 text-gray-900 border-gray-100";
  
  if (isBlue) colorClass = "bg-blue-50 text-blue-700 border-blue-100";
  if (isOrange) colorClass = "bg-orange-50 text-orange-700 border-orange-100";
  if (isRed) colorClass = "bg-red-50 text-red-700 border-red-100";
  
  if (isStatus) {
    colorClass = (value === "Anomaly" || value === "Malicious") ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200";
  }

  if (isSeverity) {
    if (value === "Critical") colorClass = "bg-red-100 text-red-800 border-red-200";
    else if (value === "High") colorClass = "bg-orange-100 text-orange-800 border-orange-200";
    else if (value === "Medium") colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    else colorClass = "bg-green-100 text-green-800 border-green-200";
  }

  return (
    <div className={`p-5 rounded-2xl border ${colorClass} transition-all hover:shadow-sm`}>
      <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">{label}</p>
      <p className="text-lg font-bold truncate">{value || 0}</p>
    </div>
  );
}

export default SystemLogs;