import { useEffect, useState } from "react";
import axios from "axios";
import Charts from "./Charts";

const API_BASE = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    anomalies: 0,
    safePercent: 0,
  });
  const [logs, setLogs] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Load data ONCE
  useEffect(() => {
    loadStats();
  }, []);

  // Disable scroll ONLY while charts are rendering
  useEffect(() => {
    document.body.style.overflow = chartLoading ? "hidden" : "auto";
  }, [chartLoading]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/uba/logs`);
      const logsData = res.data;

      setLogs(logsData);

      const total = logsData.length;
      const anomalies = logsData.filter((l) => l.prediction === "Anomaly").length;

      const safePercent = total ? Math.round(((total - anomalies) / total) * 100) : 0;

      setStats({ total, anomalies, safePercent });
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (card) => {
    if (loading) return;
    setActiveCard(card);
    setCurrentPage(1); // Reset to first page
    setChartLoading(true);
    setTimeout(() => setChartLoading(false), 400);
  };

  const chartLogs =
    activeCard === "anomalies"
      ? logs.filter((l) => l.prediction === "Anomaly")
      : activeCard === "total"
      ? logs
      : [];

  // Paginate logs for charts and table
  const paginatedLogs = chartLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(chartLogs.length / rowsPerPage);

  return (
    <div className="relative p-6 bg-gray-100 space-y-6">

      {/* 🔄 DB LOADER */}
      {loading && (
        <div className="fixed inset-0 bg-white/1 backdrop-blur-xs z-40 flex items-center justify-center">
          <div className="h-14 w-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 🔢 TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div
          className={`bg-white p-6 rounded-2xl shadow transition ${
            loading ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:shadow-lg"
          }`}
          onClick={() => handleCardClick("total")}
        >
          <h4 className="text-gray-500 mb-2">Total Activities</h4>
          <p className="text-3xl font-bold text-indigo-600">{loading ? "—" : stats.total}</p>
          <p className="text-sm text-gray-400 mt-2">Click to view charts</p>
        </div>

        <div
          className={`bg-white p-6 rounded-2xl shadow transition ${
            loading ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:shadow-lg"
          }`}
          onClick={() => handleCardClick("anomalies")}
        >
          <h4 className="text-gray-500 mb-2">Anomalies</h4>
          <p className="text-3xl font-bold text-red-600">{loading ? "—" : stats.anomalies}</p>
          <p className="text-sm text-gray-400 mt-2">Click to view chart</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="text-gray-500 mb-2">Safe Percentage</h4>
          <p className="text-3xl font-bold text-green-600">{loading ? "—" : `${stats.safePercent}%`}</p>
        </div>
      </div>

      {/* 📊 CHARTS + RECENT ACTIVITY */}
      {activeCard && (
        <div className="relative space-y-6">

          {/* Chart loader */}
          {chartLoading && (
            <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-2xl">
              <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Charts */}
          <div className="bg-white p-6 rounded-2xl shadow min-h-137.5">
            <h4 className="text-xl font-semibold mb-4">
              {activeCard === "total" ? "Total Activities Overview" : "Detected Anomalies Overview"}
            </h4>

            {paginatedLogs.length > 0 ? (
              <Charts logs={paginatedLogs} />
            ) : (
              <p className="text-center text-gray-500 py-20">No data available</p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}

          {/* 🧾 RECENT ACTIVITIES TABLE */}
          {paginatedLogs.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow overflow-auto">
              <h4 className="text-lg font-semibold mb-4">Recent Activities</h4>

              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    {["User ID", "Actions/Hr", "Login Count", "File Access", "Decoy Access", "Prediction"].map(
                      (h) => (
                        <th key={h} className="px-4 py-2 text-gray-600">{h}</th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {paginatedLogs.map((log, i) => (
                    <tr
                      key={i}
                      className={`border-b ${
                        log.prediction === "Anomaly" ? "bg-red-50" : "bg-white"
                      } hover:bg-gray-50`}
                    >
                      <td className="px-4 py-2">{log.user_id}</td>
                      <td className="px-4 py-2">{log.actions_per_hour}</td>
                      <td className="px-4 py-2">{log.login_count}</td>
                      <td className="px-4 py-2">{log.file_access_count}</td>
                      <td className="px-4 py-2">{log.decoy_access_count}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          log.prediction === "Anomaly" ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {log.prediction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;