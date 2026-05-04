import { useEffect, useState } from "react";
// 🔥 NEW: Imported useNavigate for error redirection
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Charts from "../../components/ui/Charts";
import {
  AlertTriangle,
  Users,
  Database,
  Activity,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

const AdminDashboard = () => {
  // 🔥 NEW: Initialize navigate
  const navigate = useNavigate();

  // === Existing UBA Stats State ===
  const [stats, setStats] = useState({
    total: 0,
    anomalies: 0,
    safePercent: 0,
  });

  // === NEW Admin Stats State ===
  const [adminStats, setAdminStats] = useState({
    activeSessions: 0,
    criticalAlerts: 0,
    dataTransferred: "0 KB",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Disable scroll ONLY while charts are rendering
  useEffect(() => {
    document.body.style.overflow = chartLoading ? "hidden" : "auto";
  }, [chartLoading]);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Fetch both UBA logs and Admin stats concurrently
      const [ubaRes, adminRes] = await Promise.all([
        api.get(`/api/v1/uba/logs`),
        api.get(`/api/v1/admin/stats`).catch(() => null),
      ]);

      // --- Process UBA Logs ---
      const logsData = ubaRes.data;
      setLogs(logsData);

      const total = logsData.length;
      // ✅ FIX: Check for the new prediction_label or -1 Number from Python
      const anomalies = logsData.filter(
        (l) =>
          l.prediction_label === "Anomaly" ||
          l.prediction === "Anomaly" ||
          l.prediction === -1,
      ).length;
      const safePercent = total
        ? Math.round(((total - anomalies) / total) * 100)
        : 0;
      setStats({ total, anomalies, safePercent });

      // --- Process Admin Stats ---
      if (adminRes && adminRes.data && adminRes.data.success) {
        setAdminStats({
          activeSessions: adminRes.data.stats.activeSessions || 0,
          criticalAlerts: adminRes.data.stats.criticalAlerts || 0,
          dataTransferred: adminRes.data.stats.dataTransferred || "0 KB",
        });
      }
    } catch (err) {
      console.error("Failed to load stats:", err);

      // 🔥 UPDATED: Manual navigation logic removed.
      // Your global api.js interceptor will now automatically handle redirects
      // to /unauthorized?code=... or /server-error?code=... based on HTTP status
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
      ? // ✅ FIX: Use safe checks for the new schema format
        logs.filter(
          (l) =>
            l.prediction_label === "Anomaly" ||
            l.prediction === "Anomaly" ||
            l.prediction === -1,
        )
      : activeCard === "total"
        ? logs
        : [];

  // Paginate logs for charts and table
  const paginatedLogs = chartLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const totalPages = Math.ceil(chartLogs.length / rowsPerPage);

  // === ENHANCED StatCard Component ===
  const StatCard = ({
    icon: Icon,
    title,
    value,
    colorClass,
    bgClass,
    isClickable,
    isActive,
    onClick,
    hoverEffect,
  }) => {
    const shouldHover = isClickable || hoverEffect;

    // Explicitly map colors to fix Tailwind JIT purging issues and make beautiful active borders
    const activeBorder = colorClass.includes("red")
      ? "border-red-400 ring-4 ring-red-50"
      : colorClass.includes("blue")
        ? "border-blue-400 ring-4 ring-blue-50"
        : colorClass.includes("green")
          ? "border-green-400 ring-4 ring-green-50"
          : colorClass.includes("indigo")
            ? "border-indigo-400 ring-4 ring-indigo-50"
            : colorClass.includes("orange")
              ? "border-orange-400 ring-4 ring-orange-50"
              : colorClass.includes("emerald")
                ? "border-emerald-400 ring-4 ring-emerald-50"
                : "border-gray-400 ring-4 ring-gray-50";

    return (
      <div
        onClick={isClickable && !loading ? onClick : undefined}
        className={`group bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-all duration-300 ease-out
          ${isActive ? `border-2 ${activeBorder} shadow-md` : "border border-gray-200 shadow-sm"}
          ${shouldHover && !isActive ? "hover:shadow-xl hover:border-gray-300 hover:-translate-y-1.5 hover:scale-[1.02]" : ""} 
          ${isClickable ? "cursor-pointer" : ""}
          ${loading ? "opacity-75 cursor-not-allowed" : ""}
        `}
      >
        <div>
          <h4 className="text-gray-500 font-medium mb-1 text-xs sm:text-sm transition-colors duration-300 group-hover:text-gray-800">
            {title}
          </h4>
          <p className={`text-xl sm:text-2xl font-bold ${colorClass}`}>
            {loading ? "—" : value}
          </p>
          {isClickable && (
            <p className="text-[9px] sm:text-[11px] text-gray-400 mt-1 font-medium tracking-wide opacity-80 transition-opacity duration-300 group-hover:opacity-100">
              CLICK TO VIEW CHARTS 📈
            </p>
          )}
        </div>
        <div
          className={`p-2.5 sm:p-3 rounded-xl ${bgClass} bg-opacity-20 transition-all duration-300 ease-out
          ${shouldHover && !isActive ? "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-sm" : ""}
        `}
        >
          <Icon
            className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClass} transition-transform duration-300`}
            strokeWidth={2.5}
          />
        </div>
      </div>
    );
  };

  return (
    // 🔥 REMOVED min-h-screen to prevent PC scrollbars and replaced with w-full h-full
    <div className="relative w-full h-full p-4 sm:p-6 lg:p-8 bg-gray-50 font-sans space-y-6 sm:space-y-8">
      {/* 🔄 DB LOADER */}
      {loading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="h-12 w-12 sm:h-14 sm:w-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 📊 MAIN DASHBOARD HEADER & CONSOLIDATED CARDS */}
      <div>
        <h1 className="font-extrabold text-gray-800 text-2xl sm:text-3xl lg:text-4xl tracking-tight">
          UBA Security Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6 mt-1 font-medium">
          Real-time monitoring of user behavior and threat detection
        </p>

        {/* All 6 cards in a single grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 relative z-10">
          <StatCard
            icon={Activity}
            title="Total Activities"
            value={stats.total}
            colorClass="text-indigo-600"
            bgClass="bg-indigo-100"
            isClickable={true}
            isActive={activeCard === "total"}
            onClick={() => handleCardClick("total")}
          />
          <StatCard
            icon={ShieldAlert}
            title="Anomalies"
            value={stats.anomalies}
            colorClass="text-orange-600"
            bgClass="bg-orange-100"
            isClickable={true}
            isActive={activeCard === "anomalies"}
            onClick={() => handleCardClick("anomalies")}
          />
          <StatCard
            icon={ShieldCheck}
            title="Safe Percentage"
            value={`${stats.safePercent}%`}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-100"
            isClickable={false}
            hoverEffect={true}
          />
        </div>
      </div>

      {/* 📊 CHARTS + RECENT ACTIVITY */}
      {activeCard && (
        <div className="relative space-y-5 sm:space-y-6 mt-6 sm:mt-8 animate-in fade-in duration-500">
          {/* Chart loader */}
          {chartLoading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center rounded-2xl backdrop-blur-sm">
              <div className="h-8 w-8 sm:h-10 sm:w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Charts */}
          {/* 🔥 Replaced min-h-137.5 with responsive standard classes */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 min-h-[300px] sm:min-h-[400px] lg:min-h-[550px] w-full overflow-hidden">
            <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6">
              {activeCard === "total"
                ? "Total Activities Overview"
                : "Detected Anomalies Overview"}
            </h4>

            {paginatedLogs.length > 0 ? (
              <div className="w-full overflow-x-auto pb-2">
                <Charts logs={paginatedLogs} />
              </div>
            ) : (
              <p className="text-center text-sm sm:text-base text-gray-500 py-12 sm:py-20">
                No data available for this view.
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 shadow-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs sm:text-sm font-medium"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>

              <span className="text-gray-600 text-xs sm:text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 shadow-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs sm:text-sm font-medium"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
