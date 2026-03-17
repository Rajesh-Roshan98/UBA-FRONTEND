import { Link } from "react-router-dom"

function Insider() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white">
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-10">
          <div className="text-sm bg-blue-900 text-blue-300 w-fit px-3 py-1 rounded-full mb-4">
            🔒 Cybersecurity
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Insider Threat Detection
          </h1>
          <p className="text-gray-300 text-lg">
            Insider Threat Detection involves monitoring and analyzing user behavior within an 
            organization to identify suspicious activities by authorized personnel. 
            It detects unusual actions like abnormal login times or unauthorized data access.
            Using techniques such as behavior analytics and machine learning,
            it helps prevent internal security breaches and data misuse.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span> How It Works
          </h2>
          <p className="text-gray-300 mb-4">
            The system learns normal behavior for each user and uses AI to detect unusual activities.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-blue-400 font-bold">1</div>
              <div className="text-sm">Learn Normal Behavior</div>
            </div>
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-blue-400 font-bold">2</div>
              <div className="text-sm">Monitor Activities</div>
            </div>
            <div className="bg-gray-900/70 px-4 py-2 rounded-lg">
              <div className="text-blue-400 font-bold">3</div>
              <div className="text-sm">Detect Threats</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-blue-400 font-bold mb-2">👥 User Analytics</div>
              <p className="text-gray-300 text-sm">Track user behavior and access patterns</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-blue-400 font-bold mb-2">⚡ Real-time Monitoring</div>
              <p className="text-gray-300 text-sm">24/7 activity monitoring and alerts</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-blue-400 font-bold mb-2">🤖 AI Detection</div>
              <p className="text-gray-300 text-sm">Machine learning for threat detection</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-blue-400 font-bold mb-2">📊 Cloud Analysis</div>
              <p className="text-gray-300 text-sm">Analyze logs from cloud services</p>
            </div>
          </div>
        </div>

        {/* Why Important */}
        <div className="bg-blue-900/20 rounded-xl p-6 mb-8 border border-blue-800/30">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">Why It's Important</h2>
          <p className="text-gray-300 mb-4">
            Insider threats are hard to detect because the user already has legitimate access. 
            This system helps identify risks before data is compromised.
          </p>
          <div className="bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-blue-200">
              💡 <span className="font-bold">Did you know?</span> Over 60% of data breaches involve insider threats.
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">99%</div>
              <div className="text-gray-400 text-sm">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-gray-400 text-sm">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">50ms</div>
              <div className="text-gray-400 text-sm">Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">100%</div>
              <div className="text-gray-400 text-sm">Coverage</div>
            </div>
          </div>
        </div>

        {/* Action Buttons with Routing */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link to="/learn-more">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors">
              Learn More
            </button>
          </Link>

          <Link to="/view-demo">
            <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 cursor-pointer transition-colors">
              View Demo
            </button>
          </Link>
        </div>

        {/* Back Button */}
        <Link to="/">
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
            ← Back to Home
          </button>
        </Link>

      </div>
    </div>
  )
}

export default Insider
