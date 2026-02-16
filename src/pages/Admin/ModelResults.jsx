import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Brain, TrendingUp, TrendingDown, Cpu, Activity,
  Target, CheckCircle, AlertTriangle, Download,
  RefreshCw, Zap, BarChart3
} from 'lucide-react';

const ModelResults = () => {
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 92.5,
    precision: 89.3,
    recall: 91.8,
    f1Score: 90.5,
    falsePositiveRate: 4.2,
    modelVersion: 'v2.1.4'
  });

  const [performanceData, setPerformanceData] = useState([
    { day: 'Mon', accuracy: 88, precision: 85, recall: 87 },
    { day: 'Tue', accuracy: 90, precision: 87, recall: 89 },
    { day: 'Wed', accuracy: 92, precision: 89, recall: 91 },
    { day: 'Thu', accuracy: 91, precision: 88, recall: 90 },
    { day: 'Fri', accuracy: 93, precision: 90, recall: 92 },
    { day: 'Sat', accuracy: 89, precision: 86, recall: 88 },
    { day: 'Sun', accuracy: 92, precision: 89, recall: 91 }
  ]);

  const [detectionData, setDetectionData] = useState([
    { hour: '00:00', normal: 1200, anomalies: 45, detected: 40 },
    { hour: '04:00', normal: 800, anomalies: 32, detected: 28 },
    { hour: '08:00', normal: 1500, anomalies: 65, detected: 60 },
    { hour: '12:00', normal: 2200, anomalies: 120, detected: 110 },
    { hour: '16:00', normal: 1800, anomalies: 95, detected: 88 },
    { hour: '20:00', normal: 1300, anomalies: 55, detected: 50 }
  ]);

  const [featureImportance, setFeatureImportance] = useState([
    { feature: 'Data Transfer Rate', importance: 25, color: '#FF6B6B' },
    { feature: 'Access Frequency', importance: 20, color: '#4ECDC4' },
    { feature: 'Time of Access', importance: 18, color: '#FFD166' },
    { feature: 'Geographic Location', importance: 15, color: '#06D6A0' },
    { feature: 'User Role', importance: 12, color: '#118AB2' },
    { feature: 'Device Type', importance: 10, color: '#9B5DE5' }
  ]);

  const [recentPredictions, setRecentPredictions] = useState([
    { id: 1, user: 'john.doe@company.com', prediction: 'Malicious', confidence: 92, actual: 'Malicious', status: 'correct' },
    { id: 2, user: 'jane.smith@company.com', prediction: 'Benign', confidence: 85, actual: 'Benign', status: 'correct' },
    { id: 3, user: 'admin@company.com', prediction: 'Malicious', confidence: 78, actual: 'Benign', status: 'false-positive' },
    { id: 4, user: 'contractor@external.com', prediction: 'Benign', confidence: 65, actual: 'Malicious', status: 'false-negative' },
    { id: 5, user: 'robert.j@company.com', prediction: 'Malicious', confidence: 91, actual: 'Malicious', status: 'correct' }
  ]);

  const MetricCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}%</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Model Results & Analytics</h1>
          <p className="text-gray-600">Machine learning model performance and predictions</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retrain Model
          </button>
        </div>
      </div>

      {/* Model Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Target}
          title="Accuracy"
          value={modelMetrics.accuracy}
          change={1.2}
          color="text-blue-600"
        />
        <MetricCard
          icon={CheckCircle}
          title="Precision"
          value={modelMetrics.precision}
          change={0.8}
          color="text-green-600"
        />
        <MetricCard
          icon={Activity}
          title="Recall"
          value={modelMetrics.recall}
          change={1.5}
          color="text-purple-600"
        />
        <MetricCard
          icon={Brain}
          title="F1 Score"
          value={modelMetrics.f1Score}
          change={0.9}
          color="text-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Model Performance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#4ECDC4" strokeWidth={2} name="Accuracy" />
              <Line type="monotone" dataKey="precision" stroke="#FF6B6B" strokeWidth={2} name="Precision" />
              <Line type="monotone" dataKey="recall" stroke="#FFD166" strokeWidth={2} name="Recall" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Importance */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Feature Importance</h2>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={300}>
              <PieChart>
                <Pie
                  data={featureImportance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ feature, importance }) => `${feature}: ${importance}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="importance"
                >
                  {featureImportance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-8 space-y-3">
              {featureImportance.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.feature}</span>
                  <span className="ml-auto font-medium">{item.importance}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detection Performance */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Real-time Detection Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={detectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="normal" stackId="1" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.6} />
            <Area type="monotone" dataKey="anomalies" stackId="2" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.6} />
            <Area type="monotone" dataKey="detected" stackId="3" stroke="#06D6A0" fill="#06D6A0" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Predictions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Predictions</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <span className="text-sm">Correct</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <span className="text-sm">False Positive</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
              <span className="text-sm">False Negative</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prediction</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Confidence</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actual</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPredictions.map((prediction) => (
                <tr key={prediction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{prediction.user}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prediction.prediction === 'Malicious' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {prediction.prediction}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            prediction.confidence >= 80 ? 'bg-green-600' :
                            prediction.confidence >= 60 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${prediction.confidence}%` }}
                        />
                      </div>
                      <span className="ml-3 font-medium">{prediction.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prediction.actual === 'Malicious' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {prediction.actual}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prediction.status === 'correct' 
                        ? 'bg-green-100 text-green-800' 
                        : prediction.status === 'false-positive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {prediction.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Review
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <Cpu className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="font-semibold">Model Information</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">{modelMetrics.modelVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Algorithm</span>
              <span className="font-medium">XGBoost + LSTM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Trained</span>
              <span className="font-medium">2 days ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Training Samples</span>
              <span className="font-medium">1.2M</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
            <h3 className="font-semibold">Error Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">False Positive Rate</span>
              <span className="font-medium">{modelMetrics.falsePositiveRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">False Negatives</span>
              <span className="font-medium">3.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Detection Latency</span>
              <span className="font-medium">2.3s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model Drift</span>
              <span className="font-medium text-green-600">Low (1.2%)</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <Zap className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="font-semibold">Performance Targets</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Accuracy Target</span>
                <span>90%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    modelMetrics.accuracy >= 90 ? 'bg-green-600' : 'bg-yellow-600'
                  } rounded-full`}
                  style={{ width: `${Math.min(100, (modelMetrics.accuracy / 90) * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>False Positive Target</span>
                <span>{"<"}5%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    modelMetrics.falsePositiveRate <= 5 ? 'bg-green-600' : 'bg-red-600'
                  } rounded-full`}
                  style={{ width: `${(modelMetrics.falsePositiveRate / 5) * 100}%` }}
                />
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Adjust Thresholds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelResults;