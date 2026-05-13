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
        
        // 🔥 UPDATED: Manual navigation logic removed.
        // Your global api.js interceptor will now automatically handle redirects
        // to /unauthorized?code=... or /server-error?code=... based on HTTP status
        
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
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Security': return <Shield className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Analytics': return <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Compliance': return <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Audit': return <Eye className="w-4 h-4 sm:w-5 sm:h-5" />;
      default: return <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white/50 backdrop-blur-md rounded-xl p-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm sm:text-base font-medium text-gray-500 text-center">
          Loading Reports...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gray-50">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Generate and manage security reports</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:space-x-4">
          <button className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center font-medium transition-colors shadow-sm active:scale-[0.98]">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={() => setShowNewReportModal(true)}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium transition-colors shadow-sm active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">{reportStats.total}</div>
              <div className="text-sm sm:text-base font-medium text-gray-500">Total Reports</div>
            </div>
            <div className="bg-blue-100 p-3 sm:p-4 rounded-xl">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">{reportStats.security}</div>
              <div className="text-sm sm:text-base font-medium text-gray-500">Security Reports</div>
            </div>
            <div className="bg-red-100 p-3 sm:p-4 rounded-xl">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">{reportStats.completed}</div>
              <div className="text-sm sm:text-base font-medium text-gray-500">Completed</div>
            </div>
            <div className="bg-green-100 p-3 sm:p-4 rounded-xl">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">{reportStats.totalDownloads}</div>
              <div className="text-sm sm:text-base font-medium text-gray-500">Total Downloads</div>
            </div>
            <div className="bg-purple-100 p-3 sm:p-4 rounded-xl">
              <Download className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <div className="w-full sm:w-auto flex-1 sm:flex-none">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Report Type</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
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
          <div className="w-full sm:w-auto flex-1 sm:flex-none">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="w-full sm:w-auto flex items-end">
            <button className="w-full sm:w-auto px-4 py-3 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center font-medium transition-colors text-sm sm:text-base">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Reports List */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Generated Reports</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">View All →</button>
            </div>
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Report</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{report.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Generated on {report.generatedDate} by {report.generatedBy}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-2.5 ${getTypeColor(report.type).split(' ')[0]}`}>
                            {getTypeIcon(report.type)}
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{report.period}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{report.size}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-1.5 sm:space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
                            <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No reports found matching your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 h-full">
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Scheduled Reports</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">+ Add</button>
            </div>
            <div className="space-y-4">
              {scheduledReports.map((schedule) => (
                <div key={schedule.id} className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow bg-gray-50/50">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">{schedule.title}</h3>
                    <span className={`px-2.5 py-1 text-[10px] sm:text-xs rounded-full font-bold uppercase tracking-wider border shrink-0 ${
                      schedule.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Clock className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
                      <span className="font-medium">{schedule.frequency}</span><span className="mx-1">•</span> Next: {schedule.nextRun}
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Users className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
                      {schedule.recipients.length} recipient(s)
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <FileText className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
                      Format: {schedule.format}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <button className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-800 transition-colors">
                      Edit
                    </button>
                    <button className={`text-xs sm:text-sm font-medium transition-colors ${
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5">Quick Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <button className="border border-gray-200 rounded-xl p-5 sm:p-6 text-center hover:shadow-md transition-all hover:-translate-y-1 bg-gray-50/50 hover:bg-white active:scale-[0.98]">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Security Summary</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Last 7 days</p>
          </button>
          <button className="border border-gray-200 rounded-xl p-5 sm:p-6 text-center hover:shadow-md transition-all hover:-translate-y-1 bg-gray-50/50 hover:bg-white active:scale-[0.98]">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <BarChart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">User Activity</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Current month</p>
          </button>
          <button className="border border-gray-200 rounded-xl p-5 sm:p-6 text-center hover:shadow-md transition-all hover:-translate-y-1 bg-gray-50/50 hover:bg-white active:scale-[0.98]">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Data Access</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Audit trail</p>
          </button>
          <button className="border border-gray-200 rounded-xl p-5 sm:p-6 text-center hover:shadow-md transition-all hover:-translate-y-1 bg-gray-50/50 hover:bg-white active:scale-[0.98]">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Performance</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Model metrics</p>
          </button>
        </div>
      </div>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5 sm:p-6 max-h-[90dvh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Generate New Report</h2>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Report Title
                </label>
                {/* text-base prevents iOS Safari auto-zoom */}
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  placeholder="Enter report title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Report Type
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow bg-white">
                  <option value="">Select type</option>
                  <option value="security">Security Summary</option>
                  <option value="analytics">User Analytics</option>
                  <option value="compliance">Compliance</option>
                  <option value="audit">Access Audit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Date Range
                </label>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <input
                    type="date"
                    className="w-full sm:flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  />
                  <span className="hidden sm:block self-center text-gray-500 font-medium">to</span>
                  <input
                    type="date"
                    className="w-full sm:flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Format
                </label>
                <div className="flex flex-wrap gap-4 sm:space-x-4">
                  <label className="flex items-center text-sm sm:text-base text-gray-700 cursor-pointer">
                    <input type="radio" name="format" value="pdf" className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" defaultChecked />
                    PDF
                  </label>
                  <label className="flex items-center text-sm sm:text-base text-gray-700 cursor-pointer">
                    <input type="radio" name="format" value="excel" className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                    Excel
                  </label>
                  <label className="flex items-center text-sm sm:text-base text-gray-700 cursor-pointer">
                    <input type="radio" name="format" value="csv" className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                    CSV
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Include Sections
                </label>
                <div className="space-y-3 sm:space-y-2">
                  <label className="flex items-center text-sm sm:text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" className="mr-3 sm:mr-2 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" defaultChecked />
                    Executive Summary
                  </label>
                  <label className="flex items-center text-sm sm:text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" className="mr-3 sm:mr-2 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" defaultChecked />
                    Threat Analysis
                  </label>
                  <label className="flex items-center text-sm sm:text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" className="mr-3 sm:mr-2 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
                    User Behavior Metrics
                  </label>
                  <label className="flex items-center text-sm sm:text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" className="mr-3 sm:mr-2 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" defaultChecked />
                    Recommendations
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3 sm:gap-0 mt-6 sm:mt-8">
              <button
                onClick={() => setShowNewReportModal(false)}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98]">
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
