import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = ({ logs }) => {
  const labels = logs.map((l) => l.user_id || `User-${l.id}`);

  // ✅ Include all numeric metrics from your CSV
  const metrics = [
    { key: "employee_name", label: "Employee Name", color: "rgba(16,185,129,1)" },
    { key: "role", label: "Role", color: "rgba(59,130,246,1)" },
    { key: "days_active", label: "Days Active", color: "rgba(244,63,94,1)" },
    { key: "login_count", label: "Login Count", color: "rgba(251,191,36,1)" },
    { key: "login_per_day", label: "Login/Day", color: "rgba(239,68,68,1)" },
    { key: "unique_pcs", label: "Unique PCs", color: "rgba(16,185,129,1)" },
    { key: "total_lifetime_hours", label: "Total Hours", color: "rgba(59,130,246,1)" },
    { key: "total_activity", label: "Total Activity", color: "rgba(139,92,246,1)" },
    { key: "activity_per_day", label: "Activity/Day", color: "rgba(244,63,94,1)" }, // ✅ NEW
    { key: "avg_active_hours_per_day", label: "Avg Active Hours/Day", color: "rgba(59,130,246,1)" }, // ✅ FIXED
    { key: "actions_per_hour", label: "Actions/Hour", color: "rgba(16,185,129,1)" },
    { key: "file_access_count", label: "File Access Count", color: "rgba(139,92,246,1)" },
    { key: "file_copy_count", label: "File Copy Count", color: "rgba(6,182,212,1)" },
    { key: "removable_uploads", label: "Removable Uploads", color: "rgba(234,179,8,1)" },
    { key: "removable_downloads", label: "Removable Downloads", color: "rgba(244,63,94,1)" },
    { key: "decoy_access_count", label: "Decoy Access Count", color: "rgba(239,68,68,1)" },
    
    // ✅ Email Metrics
    { key: "email_sent_count", label: "Emails Sent", color: "rgba(59,130,246,1)" },
    { key: "total_email_size", label: "Total Email Size", color: "rgba(139,92,246,1)" },
    { key: "avg_email_size", label: "Avg Email Size", color: "rgba(16,185,129,1)" },
    { key: "attachment_count", label: "Attachments", color: "rgba(244,63,94,1)" },
    
    // 🚀 Temporal Behavior Metrics
    { key: "after_hours_activity", label: "After Hours Activity", color: "rgba(251,191,36,1)" },
    { key: "weekend_activity", label: "Weekend Activity", color: "rgba(234,179,8,1)" },
    
    // ✅ Device Security Metrics
    { key: "device_activity_count", label: "Endpoint Activity", color: "rgba(6,182,212,1)" },
    { key: "device_connect_count", label: "USB Connects", color: "rgba(16,185,129,1)" },
    { key: "device_disconnect_count", label: "USB Disconnects", color: "rgba(239,68,68,1)" },
    { key: "device_unique_pcs", label: "Device Unique PCs", color: "rgba(59,130,246,1)" },
    { key: "device_after_hours", label: "Device After Hours", color: "rgba(244,63,94,1)" },
    { key: "device_weekend_usage", label: "Device Weekend Usage", color: "rgba(234,179,8,1)" },
    { key: "connect_disconnect_ratio", label: "Connect/Disconnect Ratio", color: "rgba(139,92,246,1)" },
    { key: "avg_session_duration", label: "Avg Session Duration (hrs)", color: "rgba(6,182,212,1)" },
    { key: "device_usage_per_day", label: "Device Usage/Day", color: "rgba(16,185,129,1)" },
  ];

  // Only include metrics with some non-zero value
  const lineMetrics = metrics.filter((m) =>
    logs.some((l) => Number(l[m.key]) > 0)
  );

  const lineOptions = {
    responsive: true,
    // 🔥 UPDATED: Crucial for allowing the chart to resize freely inside its responsive container
    maintainAspectRatio: false, 
    plugins: {
      legend: { position: "bottom" },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
      x: { grid: { color: "#e5e7eb" } },
    },
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Anomalies (1 = Anomaly)",
        // ✅ FIXED: Support for both prediction_label text or numeric prediction value
        data: logs.map((l) => (l.prediction_label === "Anomaly" || l.prediction === "Anomaly" || l.prediction === -1 ? 1 : 0)),
        backgroundColor: "rgba(239,68,68,0.8)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
      {/* Individual line charts */}
      {lineMetrics.length > 0 ? (
        lineMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white p-4 sm:p-5 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow w-full"
          >
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">{metric.label}</h4>
            {/* 🔥 UPDATED: Added relative wrapper with fixed height to control chart scaling on mobile */}
            <div className="relative w-full h-[250px] sm:h-[300px]">
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: metric.label,
                      data: logs.map((l) => l[metric.key]),
                      borderColor: metric.color,
                      backgroundColor: metric.color.replace("1)", "0.2)"),
                      tension: 0.3,
                      fill: true,
                      pointRadius: window.innerWidth < 640 ? 2 : 3, // Slightly smaller points on mobile
                      pointHoverRadius: 5,
                    },
                  ],
                }}
                options={lineOptions}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-xl border border-gray-200 col-span-1 lg:col-span-2">
          <p className="text-center text-gray-500 text-sm sm:text-base">
            No metrics available for line charts
          </p>
        </div>
      )}

      {/* Bar chart for anomalies */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-shadow w-full">
        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Detected Anomalies</h4>
        {/* 🔥 UPDATED: Added relative wrapper with fixed height to control chart scaling on mobile */}
        <div className="relative w-full h-[250px] sm:h-[300px]">
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Crucial for responsive height
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
                x: { grid: { color: "#e5e7eb" } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Charts;