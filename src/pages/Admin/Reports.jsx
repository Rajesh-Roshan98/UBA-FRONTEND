import React, { useState, useEffect } from 'react';
// 🔥 NEW: Imported useNavigate for error redirection
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, Calendar, Filter, Printer,
  BarChart, PieChart, TrendingUp, Eye, Share2,
  Clock, Users, Shield, Database, CheckCircle
} from 'lucide-react';

const Reports = () => {
  // 🔥 NEW: Initialize navigate
  const navigate = useNavigate();
  
  // 🔥 NEW: Added loading state to match AdminHomePage
  const [loading, setLoading] = useState(true);

  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Weekly Security Report',
      type: 'Security',
      period: 'Jan 8 - Jan 14, 2024',
      generatedBy: 'System Admin',
      generatedDate: '2024-01-15',
      size: '2.4 MB',
      status: 'completed',
      downloads: 45,
      lastAccessed: '2 hours ago'
    },
    {
      id: 2,
      title: 'User Behavior Analysis',
      type: 'Analytics',
      period: 'January 2024',
      generatedBy: 'Data Analyst',
      generatedDate: '2024-01-10',
      size: '1.8 MB',
      status: 'completed',
      downloads: 32,
      lastAccessed: '1 day ago'
    },
    {
      id: 3,
      title: 'Compliance Audit Report',
      type: 'Compliance',
      period: 'Q4 2023',
      generatedBy: 'Compliance Officer',
      generatedDate: '2024-01-05',
      size: '3.2 MB',
      status: 'completed',
      downloads: 28,
      lastAccessed: '3 days ago'
    },
    {
      id: 4,
      title: 'Anomaly Detection Summary',
      type: 'Security',
      period: 'Daily - Jan 15, 2024',
      generatedBy: 'System',
      generatedDate: '2024-01-15',
      size: '850 KB',
      status: 'processing',
      downloads: 0,
      lastAccessed: 'Never'
    },
    {
      id: 5,
      title: 'Access Control Review',
      type: 'Audit',
      period: 'Monthly - Dec 2023',
      generatedBy: 'Security Admin',
      generatedDate: '2024-01-03',
      size: '1.5 MB',
      status: 'completed',
      downloads: 21,
      lastAccessed: '1 week ago'
    }
  ]);

  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      title: 'Daily Security Brief',
      frequency: 'Daily',
      nextRun: 'Tomorrow, 06:00',
      recipients: ['security@company.com', 'admin@company.com'],
      format: 'PDF',
      status: 'active'
    },
    {
      id: 2,
      title: 'Weekly Analytics',
      frequency: 'Weekly',
      nextRun: 'Monday, 08:00',
      recipients: ['analytics@company.com'],
      format: 'Excel',
      status: 'active'
    },
    {
      id: 3,
      title: 'Monthly Compliance',
      frequency: 'Monthly',
      nextRun: 'Feb 1, 09:00',
      recipients: ['compliance@company.com', 'legal@company.com'],
      format: 'PDF',
      status: 'paused'
    }
  ]);

  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  // 🔥 NEW: Added the data fetching structure with the error routing logic
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        
        // Future API call will go here when you connect it to the backend
        // const res = await api.get('/api/reports');
        
      } catch (error) {
        console.error("Failed to fetch reports data:", error);
        
        // Error handling navigation logic (Matching AdminHomePage)
        if (error.response) {
          const status = error.response.status;
          // Route authentication/authorization errors to unauthorized page
          if (status === 401 || status === 403 || status === 404) {
            navigate('/unauthorized');
          } 
          // Route server errors to not found page
          else if (status >= 500) {
            navigate('/server-error');
          }
        }
      } finally {
        setLoading(false); // Removes the loader once data is ready
      }
    };

    fetchReportsData();
  }, [navigate]);

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const reportStats = {
    total: reports.length,
    security: reports.filter(r => r.type === 'Security').length,
    completed: reports.filter(r => r.status === 'completed').length,
    totalDownloads: reports.reduce((sum, report) => sum + report.downloads, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Security': return <Shield className="w-5 h-5" />;
      case 'Analytics': return <BarChart className="w-5 h-5" />;
      case 'Compliance': return <FileText className="w-5 h-5" />;
      case 'Audit': return <Eye className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Security': return 'bg-red-100 text-red-800';
      case 'Analytics': return 'bg-blue-100 text-blue-800';
      case 'Compliance': return 'bg-green-100 text-green-800';
      case 'Audit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 🔥 NEW: Clean, static loading animation exactly like AdminHomePage
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full bg-white/50 backdrop-blur-md rounded-xl">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading Reports...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage security reports</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={() => setShowNewReportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800">{reportStats.total}</div>
              <div className="text-gray-600">Total Reports</div>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{reportStats.security}</div>
              <div className="text-gray-600">Security Reports</div>
            </div>
            <Shield className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{reportStats.completed}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">{reportStats.totalDownloads}</div>
              <div className="text-gray-600">Total Downloads</div>
            </div>
            <Download className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Security">Security</option>
              <option value="Analytics">Analytics</option>
              <option value="Compliance">Compliance</option>
              <option value="Audit">Audit</option>
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
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Generated Reports</h2>
              <button className="text-blue-600 hover:text-blue-800">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Report</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Period</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-gray-500">
                            Generated on {report.generatedDate} by {report.generatedBy}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${getTypeColor(report.type).split(' ')[0]}`}>
                            {getTypeIcon(report.type)}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{report.period}</div>
                        <div className="text-xs text-gray-500">{report.size}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="Share">
                            <Share2 className="w-4 h-4" />
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

        {/* Scheduled Reports */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Scheduled Reports</h2>
              <button className="text-blue-600 hover:text-blue-800">+ Add</button>
            </div>
            <div className="space-y-4">
              {scheduledReports.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{schedule.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      schedule.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="w-3 h-3 mr-2 text-gray-400" />
                      {schedule.frequency} • Next: {schedule.nextRun}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-3 h-3 mr-2 text-gray-400" />
                      {schedule.recipients.length} recipient(s)
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="w-3 h-3 mr-2 text-gray-400" />
                      Format: {schedule.format}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between">
                    <button className="text-blue-600 text-sm hover:text-blue-800">
                      Edit
                    </button>
                    <button className={`text-sm ${
                      schedule.status === 'active' 
                        ? 'text-red-600 hover:text-red-800' 
                        : 'text-green-600 hover:text-green-800'
                    }`}>
                      {schedule.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Report Types */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold">Security Summary</h3>
            <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
          </button>
          <button className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <BarChart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">User Activity</h3>
            <p className="text-sm text-gray-500 mt-1">Current month</p>
          </button>
          <button className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Data Access</h3>
            <p className="text-sm text-gray-500 mt-1">Audit trail</p>
          </button>
          <button className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Performance</h3>
            <p className="text-sm text-gray-500 mt-1">Model metrics</p>
          </button>
        </div>
      </div>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generate New Report</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter report title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select type</option>
                  <option value="security">Security Summary</option>
                  <option value="analytics">User Analytics</option>
                  <option value="compliance">Compliance</option>
                  <option value="audit">Access Audit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <span className="self-center">to</span>
                  <input
                    type="date"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="format" value="pdf" className="mr-2" />
                    PDF
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="excel" className="mr-2" />
                    Excel
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="format" value="csv" className="mr-2" />
                    CSV
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Include Sections
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Executive Summary
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Threat Analysis
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    User Behavior Metrics
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Recommendations
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewReportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;