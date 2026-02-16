import React, { useState } from 'react';
import {
  Search, Filter, Download, RefreshCw, Clock,
  AlertTriangle, User, Database, Server, Shield,
  Eye, Copy, ExternalLink
} from 'lucide-react';

const SystemLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2024-01-15 14:30:22',
      level: 'ERROR',
      component: 'Authentication Service',
      message: 'Multiple failed login attempts from IP: 192.168.1.100',
      user: 'unknown',
      ip: '192.168.1.100',
      sessionId: 'SESS_001',
      details: '15 attempts in 5 minutes'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:25:18',
      level: 'INFO',
      component: 'Data Access Service',
      message: 'User accessed sensitive financial records',
      user: 'john.doe@company.com',
      ip: '10.0.1.50',
      sessionId: 'SESS_002',
      details: 'File: financial_report_2024.pdf'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:20:45',
      level: 'WARNING',
      component: 'File Transfer Service',
      message: 'Large data transfer detected',
      user: 'jane.smith@company.com',
      ip: '10.0.1.75',
      sessionId: 'SESS_003',
      details: '5.2GB transferred to external storage'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:15:33',
      level: 'ERROR',
      component: 'API Gateway',
      message: 'Rate limit exceeded for API endpoint',
      user: 'contractor@external.com',
      ip: '203.0.113.25',
      sessionId: 'SESS_004',
      details: '/api/v1/users exceeded 1000 requests/min'
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:10:12',
      level: 'INFO',
      component: 'UBA Model',
      message: 'Anomaly detected with high confidence',
      user: 'admin@company.com',
      ip: '10.0.1.100',
      sessionId: 'SESS_005',
      details: 'Behavioral anomaly score: 92'
    },
    {
      id: 6,
      timestamp: '2024-01-15 14:05:55',
      level: 'WARNING',
      component: 'Access Control',
      message: 'Privilege escalation attempt',
      user: 'robert.j@company.com',
      ip: '10.0.1.60',
      sessionId: 'SESS_006',
      details: 'Attempted admin role assignment'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.includes(searchTerm);
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesComponent = selectedComponent === 'all' || log.component === selectedComponent;
    return matchesSearch && matchesLevel && matchesComponent;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'ERROR': return <AlertTriangle className="w-4 h-4" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4" />;
      case 'INFO': return <Shield className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const components = Array.from(new Set(logs.map(log => log.component)));

  const logStats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'ERROR').length,
    warnings: logs.filter(l => l.level === 'WARNING').length,
    info: logs.filter(l => l.level === 'INFO').length
  };

  const handleCopyLog = (log) => {
    const logText = JSON.stringify(log, null, 2);
    navigator.clipboard.writeText(logText);
    // You could add a toast notification here
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Logs</h1>
          <p className="text-gray-600">Monitor system activities and security events</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-800">{logStats.total}</div>
              <div className="text-gray-600">Total Logs</div>
            </div>
            <Server className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{logStats.errors}</div>
              <div className="text-gray-600">Errors</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">{logStats.warnings}</div>
              <div className="text-gray-600">Warnings</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{logStats.info}</div>
              <div className="text-gray-600">Info</div>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs by message, user, or IP..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
            >
              <option value="all">All Components</option>
              {components.map(component => (
                <option key={component} value={component}>{component}</option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh (30s)
            </label>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logs List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Level</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Component</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Message</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedLog?.id === log.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm">{log.timestamp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${getLevelColor(log.level).split(' ')[0]}`}>
                            {getLevelIcon(log.level)}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(log.level)}`}>
                            {log.level}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{log.component}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">{log.message}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{log.user}</div>
                        <div className="text-xs text-gray-500">{log.ip}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLog(log);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Copy Log"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
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

        {/* Log Details Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Log Details</h2>
            {selectedLog ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Timestamp</h3>
                  <p>{selectedLog.timestamp}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Level</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedLog.level)}`}>
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Component</h3>
                  <p>{selectedLog.component}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Message</h3>
                  <p className="text-gray-600">{selectedLog.message}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">User Information</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">User:</span>
                      <span className="font-medium">{selectedLog.user}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IP Address:</span>
                      <span className="font-medium">{selectedLog.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session ID:</span>
                      <span className="font-medium">{selectedLog.sessionId}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Additional Details</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <pre className="text-sm whitespace-pre-wrap">{selectedLog.details}</pre>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleCopyLog(selectedLog)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Investigate
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a log entry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Log Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Log Distribution by Level</h3>
            <div className="space-y-2">
              {['ERROR', 'WARNING', 'INFO'].map((level) => {
                const count = logs.filter(l => l.level === level).length;
                return (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-sm">{level}</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                        <div 
                          className={`h-full rounded-full ${
                            level === 'ERROR' ? 'bg-red-600' :
                            level === 'WARNING' ? 'bg-yellow-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${(count / logs.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Top Components</h3>
            <div className="space-y-2">
              {components.slice(0, 5).map((component) => {
                const count = logs.filter(l => l.component === component).length;
                return (
                  <div key={component} className="flex items-center justify-between">
                    <span className="text-sm truncate">{component}</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                        <div 
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${(count / logs.length) * 100}%` }}
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

export default SystemLogs;