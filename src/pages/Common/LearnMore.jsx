import { Link } from "react-router-dom"

function LearnMore() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white px-6 py-12">
      
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-400 mb-6">
          Insider Threat Detection – Detailed Overview
        </h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          Insider Threat Detection focuses on identifying malicious or risky 
          activities performed by authorized users within an organization. 
          Unlike external cyberattacks, insider threats originate from 
          employees, contractors, or partners who already have access.
        </p>

        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
          Detection Techniques
        </h2>

        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8">
          <li>User Behavior Analytics (UBA)</li>
          <li>Machine Learning-based anomaly detection</li>
          <li>Real-time log monitoring</li>
          <li>Access control analysis</li>
        </ul>

        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
          Benefits
        </h2>

        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-8">
          <li>Prevents data leakage</li>
          <li>Detects suspicious login patterns</li>
          <li>Reduces internal fraud risk</li>
          <li>Enhances organizational security</li>
        </ul>

        <Link to="/insider">
          <button className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
            ← Back
          </button>
        </Link>

      </div>
    </div>
  )
}

export default LearnMore
