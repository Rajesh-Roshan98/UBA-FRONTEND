import { Link } from "react-router-dom"

function SecureCloudAnalytics() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white">
      
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="text-sm bg-purple-900 text-purple-300 w-fit px-3 py-1 rounded-full mb-4">
            ☁️ Cloud Security
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Secure Cloud Analytics
          </h1>
          <p className="text-gray-300 text-lg">
            Machine learning models analyze large-scale cloud logs to detect 
            abnormal patterns and prevent unauthorized data exfiltration. 
            The system continuously monitors cloud environments to ensure 
            data integrity, compliance, and security.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span> How It Works
          </h2>
          <p className="text-gray-300 mb-4">
            The platform collects and processes cloud activity logs from 
            various services such as storage systems, databases, and 
            virtual machines. Machine learning algorithms analyze 
            behavioral patterns to detect anomalies.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-purple-400 font-bold">1</div>
              <div className="text-sm">Collect Cloud Logs</div>
            </div>
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-purple-400 font-bold">2</div>
              <div className="text-sm">Analyze with ML Models</div>
            </div>
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-purple-400 font-bold">3</div>
              <div className="text-sm">Detect Data Exfiltration</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-purple-400 font-bold mb-2">📊 Log Aggregation</div>
              <p className="text-gray-300 text-sm">
                Collects logs from multiple cloud platforms in real time.
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-purple-400 font-bold mb-2">🤖 ML-Based Detection</div>
              <p className="text-gray-300 text-sm">
                Uses anomaly detection algorithms to identify suspicious activity.
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-purple-400 font-bold mb-2">🚨 Data Exfiltration Alerts</div>
              <p className="text-gray-300 text-sm">
                Detects unusual data transfers and prevents leakage.
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-purple-400 font-bold mb-2">☁️ Multi-Cloud Support</div>
              <p className="text-gray-300 text-sm">
                Works across AWS, Azure, and Google Cloud environments.
              </p>
            </div>
          </div>
        </div>

        {/* Why Important */}
        <div className="bg-purple-900/20 rounded-xl p-6 mb-8 border border-purple-800/30">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">
            Why It Matters
          </h2>
          <p className="text-gray-300 mb-4">
            As organizations migrate to the cloud, data becomes more 
            distributed and vulnerable. Secure Cloud Analytics ensures 
            continuous monitoring and rapid detection of abnormal 
            data movement to prevent security breaches.
          </p>
          <div className="bg-purple-900/30 p-4 rounded-lg">
            <p className="text-sm text-purple-200">
              💡 <span className="font-bold">Insight:</span> Cloud misconfigurations and 
              insider misuse are leading causes of modern data breaches.
            </p>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            System Capabilities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">98%</div>
              <div className="text-gray-400 text-sm">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-gray-400 text-sm">Cloud Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">Real-Time</div>
              <div className="text-gray-400 text-sm">Threat Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">Multi</div>
              <div className="text-gray-400 text-sm">Cloud Support</div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link to="/">
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
            ← Back to Home
          </button>
        </Link>

      </div>
    </div>
  )
}

export default SecureCloudAnalytics
