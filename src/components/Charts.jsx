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
    { key: "login_count", label: "Login Count", color: "rgba(251,191,36,1)" },
    { key: "unique_pcs", label: "Unique PCs", color: "rgba(16,185,129,1)" },
    { key: "active_hours", label: "Active Hours", color: "rgba(59,130,246,1)" },
    { key: "actions_per_hour", label: "Actions/Hour", color: "rgba(16,185,129,1)" },
    { key: "file_access_count", label: "File Access Count", color: "rgba(139,92,246,1)" },
    { key: "file_copy_count", label: "File Copy Count", color: "rgba(6,182,212,1)" },
    { key: "removable_uploads", label: "Removable Uploads", color: "rgba(234,179,8,1)" },
    { key: "removable_downloads", label: "Removable Downloads", color: "rgba(244,63,94,1)" },
    { key: "decoy_access_count", label: "Decoy Access Count", color: "rgba(239,68,68,1)" },
  ];

  // Only include metrics with some non-zero value
  const lineMetrics = metrics.filter((m) =>
    logs.some((l) => Number(l[m.key]) > 0)
  );

  const lineOptions = {
    responsive: true,
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
        data: logs.map((l) => (l.prediction === "Anomaly" ? 1 : 0)),
        backgroundColor: "rgba(239,68,68,0.8)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Individual line charts */}
      {lineMetrics.length > 0 ? (
        lineMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <h4 className="text-lg font-semibold mb-3">{metric.label}</h4>
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
                    pointRadius: 3,
                    pointHoverRadius: 5,
                  },
                ],
              }}
              options={lineOptions}
            />
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-2">
          No metrics available for line charts
        </p>
      )}

      {/* Bar chart for anomalies */}
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow">
        <h4 className="text-lg font-semibold mb-3">Detected Anomalies</h4>
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
              x: { grid: { color: "#e5e7eb" } },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Charts;