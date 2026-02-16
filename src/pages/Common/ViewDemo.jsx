import { Link } from "react-router-dom"

function ViewDemo() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white px-6 py-12">
      
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-400 mb-6">
          Insider Threat Detection – Demo
        </h1>

        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            Live Threat Simulation
          </h2>

          <p className="text-gray-300 mb-4">
            User "Admin01" attempted access to restricted payroll database.
          </p>

          <p className="text-red-400 font-semibold">
            🚨 Alert: Abnormal Access Pattern Detected
          </p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">
            System Response
          </h2>

          <ul className="text-gray-300 space-y-2">
            <li>✔ Access temporarily blocked</li>
            <li>✔ Security team notified</li>
            <li>✔ Activity logged for investigation</li>
          </ul>
        </div>

        <Link to="/insider">
          <button className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
            ← Back
          </button>
        </Link>

      </div>
    </div>
  )
}

export default ViewDemo
