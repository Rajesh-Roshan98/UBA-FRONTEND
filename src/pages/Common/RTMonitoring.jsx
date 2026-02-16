import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function RealTimeMonitoring() {
  // --- LOGIC FROM CODE A (Pie Chart & Real-time generation) ---
  const generatePieData = () => {
    return [
      { name: "Logins", value: Math.floor(Math.random() * 40) + 10 },
      { name: "File Access", value: Math.floor(Math.random() * 30) + 10 },
      { name: "Downloads", value: Math.floor(Math.random() * 30) + 10 },
      { name: "DB Queries", value: Math.floor(Math.random() * 30) + 10 },
    ]
  }

  const [pieData, setPieData] = useState(generatePieData())
  const [alertIndex, setAlertIndex] = useState(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generatePieData()
      setPieData(newData)

      const totalValue = newData.reduce((acc, item) => acc + item.value, 0)
      setTotal(totalValue)

      const maxIndex = newData.findIndex(
        item => item.value === Math.max(...newData.map(d => d.value))
      )
      setAlertIndex(maxIndex)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7"]

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white">

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* --- COMMON HEADER --- */}
        <div className="mb-10">
          <div className="text-sm bg-green-900 text-green-300 w-fit px-3 py-1 rounded-full mb-4 animate-pulse">
            📡 Live Security
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Real-Time Monitoring
          </h1>
          <p className="text-gray-300 text-lg">
            Continuously tracks user actions, login behavior, access frequency,
            and data movement to prevent security threats instantly.
          </p>
        </div>

        {/* --- SECTION 1: ANIMATED PIE CHART (Side-by-Side Layout) --- */}
        <div className="bg-gray-800/50 rounded-xl p-8 mb-10 border border-gray-700">
          
          {/* Title with Live Indicator */}
          <div className="w-full flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-3">
               Activity Distribution Overview
               <span className="text-xs bg-red-600 px-2 py-1 rounded animate-pulse">
              LIVE
            </span>
             </h2>
             <span className="text-xs text-gray-400 uppercase tracking-widest">Updating every 2s</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* LEFT SIDE: The Chart */}
            <div className="relative w-full md:w-1/2 h-87.5 flex justify-center items-center">
              {/* Glowing Pulse Ring */}
              <div className="absolute w-64 h-64 rounded-full bg-green-500/10 blur-3xl animate-pulse"></div>
              
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={65}
                    paddingAngle={4}
                    animationDuration={1200}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === alertIndex
                            ? "#ef4444"
                            : PIE_COLORS[index % PIE_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "10px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Animated Percentage */}
              <div className="absolute text-center pointer-events-none">
                <div className="text-4xl font-bold text-green-400">
                  {total}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">
                  Events
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: The Details (Legend) */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
               {pieData.map((entry, index) => {
                  const currentColor = index === alertIndex ? "#ef4444" : PIE_COLORS[index % PIE_COLORS.length];
                  const percentage = Math.round((entry.value / total) * 100) || 0;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors border-b border-gray-700/50 last:border-0">
                       <div className="flex items-center gap-3">
                          {/* Colored Indicator Dot */}
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ 
                              backgroundColor: currentColor,
                              boxShadow: `0 0 10px ${currentColor}`
                            }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-gray-200">{entry.name}</div>
                            <div className="text-xs text-gray-500">{percentage}% of traffic</div>
                          </div>
                       </div>
                       
                       {/* Value */}
                       <div className="text-right">
                          <div className="text-lg font-mono font-bold text-white">{entry.value}</div>
                          {index === alertIndex && (
                            <div className="text-[10px] text-red-400 animate-pulse font-bold">HIGH TRAFFIC</div>
                          )}
                       </div>
                    </div>
                  );
               })}
            </div>
          </div>
        </div>

        {/* --- ALERT INFO (From Code A) --- */}
        {alertIndex !== null && (
          <div className="bg-red-900/30 border border-red-500/40 p-4 rounded-lg mb-8 animate-pulse flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
               <div className="font-bold text-red-400">Security Alert Triggered</div>
               <div className="text-sm text-red-200">
                  Abnormal spike detected in <span className="font-bold underline">{pieData[alertIndex].name}</span>.
               </div>
            </div>
          </div>
        )}

        {/* --- SECTION 3: TEXT INFO (From Code B) --- */}
        
        {/* How It Works */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span> How It Works
          </h2>
          <p className="text-gray-300 mb-4">
            The system continuously monitors system logs and user activities in real time.
            Any unusual pattern triggers instant alerts and security actions.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-green-400 font-bold">1</div>
              <div className="text-sm">Capture User Activity</div>
            </div>
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-green-400 font-bold">2</div>
              <div className="text-sm">Analyze Patterns</div>
            </div>
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-green-400 font-bold">3</div>
              <div className="text-sm">Trigger Alerts</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-green-400 font-bold mb-2">🔐 Login Tracking</div>
              <p className="text-gray-300 text-sm">Monitors login time, device, and location</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-green-400 font-bold mb-2">📁 Access Monitoring</div>
              <p className="text-gray-300 text-sm">Tracks file and database access frequency</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-green-400 font-bold mb-2">📊 Activity Logs</div>
              <p className="text-gray-300 text-sm">Maintains real-time system logs</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-green-400 font-bold mb-2">🚨 Instant Alerts</div>
              <p className="text-gray-300 text-sm">Sends alerts for suspicious behavior</p>
            </div>
          </div>
        </div>

        {/* Why Important */}
        <div className="bg-green-900/20 rounded-xl p-6 mb-8 border border-green-800/30">
          <h2 className="text-2xl font-bold text-green-300 mb-4">Why It Matters</h2>
          <p className="text-gray-300 mb-4">
            Real-time monitoring helps organizations detect threats immediately 
            instead of discovering them after data damage occurs.
          </p>
          <div className="bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm text-green-200">
              💡 <span className="font-bold">Pro Insight:</span> Faster detection reduces breach impact by up to 70%.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Link to="/">
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
            <span>←</span> Back to Home
          </button>
        </Link>

      </div>
    </div>
  )
}

export default RealTimeMonitoring