import React, { useState } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, Filter, 
  CheckCircle, XCircle, AlertTriangle, BarChart3,
  Download, Eye, RefreshCw
} from 'lucide-react';

const AnomalyReview = () => {
  const [anomalies, setAnomalies] = useState([
    {
      id: 1,
      type: 'Data Exfiltration',
      user: 'john.doe@company.com',
      score: 92,
      confidence: 85,
      description: 'Unusual large data transfer to external storage',
      timestamp: '2024-01-15 14:30:22',
      status: 'pending',
      details: {
        dataVolume: '5.2 GB',
        source: 'AWS S3',
        destination: 'External Cloud Storage',
        protocol: 'HTTPS',
        sessionDuration: '10 minutes'
      }
    },
    {
      id: 2,
      type: 'Credential Abuse',
      user: 'unknown',
      score: 78,
      confidence: 70,
      description: 'Multiple failed login attempts from same IP',
      timestamp: '2024-01-15 13:15:45',
      status: 'investigating',
      details: {
        attempts: 25,
        sourceIP: '192.168.1.100',
        targetService: 'Admin Panel',
        timeframe: '5 minutes'
      }
    },
    {
      id: 3,
      type: 'Behavioral Anomaly',
      user: 'jane.smith@company.com',
      score: 65,
      confidence: 60,
      description: 'Accessing resources at unusual hours',
      timestamp: '2024-01-15 12:45:10',
      status: 'reviewed',
      details: {
        accessTime: '03:00 AM',
        usualAccessTime: '09:00 AM - 05:00 PM',
        resources: ['Financial Records', 'Customer Database'],
        location: 'Different Country'
      }
    },
    {
      id: 4,
      type: 'Privilege Escalation',
      user: 'contractor@external.com',
      score: 88,
      confidence: 80,
      description: 'Attempt to access admin functions',
      timestamp: '2024-01-15 11:20:33',
      status: 'confirmed',
      details: {
        action: 'Role change request',
        targetRole: 'Administrator',
        justification: 'System maintenance',
        riskLevel: 'High'
      }
    }
  ]);

  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesType = selectedType === 'all' || anomaly.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || anomaly.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsConfirmed = (id) => {
    setAnomalies(anomalies.map(anomaly => 
      anomaly.id === id ? { ...anomaly, status: 'confirmed' } : anomaly
    ));
  };

  const markAsFalsePositive = (id) => {
    setAnomalies(anomalies.map(anomaly => 
      anomaly.id === id ? { ...anomaly, status: 'false-positive' } : anomaly
    ));
  };

  const stats = {
    total: anomalies.length,
    highRisk: anomalies.filter(a => a.score >= 80).length,
    pending: anomalies.filter(a => a.status === 'pending').length,
    confirmed: anomalies.filter(a => a.status === 'confirmed').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Anomaly Review</h1>
          <p className="text-gray-600">Review and validate detected anomalies</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-gray-600">Total Anomalies</div>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{stats.highRisk}</div>
              <div className="text-gray-600">High Risk</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-gray-600">Pending Review</div>
            </div>
            <Eye className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-gray-600">Confirmed Threats</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anomaly Type</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Data Exfiltration">Data Exfiltration</option>
              <option value="Credential Abuse">Credential Abuse</option>
              <option value="Behavioral Anomaly">Behavioral Anomaly</option>
              <option value="Privilege Escalation">Privilege Escalation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="reviewed">Reviewed</option>
              <option value="confirmed">Confirmed</option>
              <option value="false-positive">False Positive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Anomaly</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAnomalies.map((anomaly) => (
                    <tr 
                      key={anomaly.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedAnomaly?.id === anomaly.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedAnomaly(anomaly)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{anomaly.type}</div>
                          <div className="text-sm text-gray-500">{anomaly.description}</div>
                          <div className="text-xs text-gray-400 mt-1">{anomaly.timestamp}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{anomaly.user}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(anomaly.score)}`}>
                            Score: {anomaly.score}
                          </div>
                          <div className={`text-xs ${getConfidenceColor(anomaly.confidence)}`}>
                            Confidence: {anomaly.confidence}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(anomaly.status)}`}>
                          {anomaly.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsConfirmed(anomaly.id);
                            }}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm flex items-center"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirm
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsFalsePositive(anomaly.id);
                            }}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            False Positive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Anomaly Details</h2>
            {selectedAnomaly ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Type</h3>
                  <p className="text-lg font-semibold">{selectedAnomaly.type}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">User</h3>
                  <p>{selectedAnomaly.user}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Description</h3>
                  <p className="text-gray-600">{selectedAnomaly.description}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Risk Assessment</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Anomaly Score</span>
                      <span className={`font-semibold ${getScoreColor(selectedAnomaly.score).split(' ')[1]}`}>
                        {selectedAnomaly.score}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence</span>
                      <span className={`font-semibold ${getConfidenceColor(selectedAnomaly.confidence)}`}>
                        {selectedAnomaly.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {Object.entries(selectedAnomaly.details).map(([key, value]) => (
                        <li key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => markAsConfirmed(selectedAnomaly.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Confirm Threat
                    </button>
                    <button
                      onClick={() => markAsFalsePositive(selectedAnomaly.id)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Mark as False Positive
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select an anomaly to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Metrics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Analysis Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Detection Performance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>True Positive Rate</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-green-600 rounded-full w-85/100" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>False Positive Rate</span>
                  <span className="font-medium">12%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-red-600 rounded-full w-12/100" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Anomaly Types Distribution</h3>
            <div className="space-y-2">
              {['Data Exfiltration', 'Credential Abuse', 'Behavioral Anomaly', 'Privilege Escalation'].map((type) => {
                const count = anomalies.filter(a => a.type === type).length;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">{type}</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(count / anomalies.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyReview;