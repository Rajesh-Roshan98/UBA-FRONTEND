import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState("");
  const [filterPrediction, setFilterPrediction] = useState("all");

  // Fetch logs once on mount
  useEffect(() => {
    fetchLogs(true);
  }, []);

  const fetchLogs = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const res = await axios.get(`${API_BASE}/api/uba/logs`);
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesUser = (log.user_id || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPrediction =
      filterPrediction === "all" ? true : log.prediction === filterPrediction;

    return matchesUser && matchesPrediction;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);

  return (
    <div className="relative p-6 bg-gray-100 space-y-4">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="h-14 w-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-gray-100 pb-3 space-y-3">
        <h2 className="text-2xl font-bold">User Activity Logs</h2>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <select
              className="border rounded px-2 py-1"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={filterPrediction}
              onChange={(e) => {
                setFilterPrediction(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="Normal">Normal</option>
              <option value="Anomaly">Anomaly</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 sticky top-0 z-30">
            <tr>
              {[
                "SL. No",
                "User ID",
                "Login Count",
                "Unique PCs",
                "Active Hours",
                "Actions/Hr",
                "File Access Count",
                "File Copy Count",
                "Removable Uploads",
                "Removable Downloads",
                "Decoy Access Count",
                "Prediction",
                "Created At",
                "Updated At",
              ].map((h) => (
                <th key={h} className="p-3 text-left text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentLogs.length ? (
              currentLogs.map((log, i) => (
                <tr
                  key={log._id}
                  className={`border-b ${
                    log.prediction === "Anomaly" ? "bg-red-50" : "bg-white"
                  }`}
                >
                  <td className="p-3">{indexOfFirst + i + 1}</td>
                  <td className="p-3">{log.user_id}</td>
                  <td className="p-3">{log.login_count || 0}</td>
                  <td className="p-3">{log.unique_pcs || 0}</td>
                  <td className="p-3">{log.active_hours || 0}</td>
                  <td className="p-3">{log.actions_per_hour || 0}</td>
                  <td className="p-3">{log.file_access_count || 0}</td>
                  <td className="p-3">{log.file_copy_count || 0}</td>
                  <td className="p-3">{log.removable_uploads || 0}</td>
                  <td className="p-3">{log.removable_downloads || 0}</td>
                  <td className="p-3">{log.decoy_access_count || 0}</td>
                  <td
                    className={`p-3 font-semibold ${
                      log.prediction === "Anomaly"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {log.prediction}
                  </td>
                  <td className="p-3">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    {log.updatedAt
                      ? new Date(log.updatedAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="p-6 text-center text-gray-500">
                  No activity logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogsTable;
