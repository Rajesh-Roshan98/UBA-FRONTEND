import React from 'react';
import { Activity as ActivityIcon, Server, FileText, Database, ArrowUpRight } from 'lucide-react';

export default function Activity() {
  const timeline = [
    { time: '10:45 AM', action: 'Large data export initiated', details: 'Exported 2.4GB from Customer DB', status: 'warning' },
    { time: '09:30 AM', action: 'Accessed customer database', details: 'Query executed: SELECT * FROM users', status: 'normal' },
    { time: '09:15 AM', action: 'Logged in from SOC terminal', details: 'Verified via 2FA', status: 'normal' },
  ];

  const accessLogs = [
    { resource: 'Customer DB', type: 'SQL Query', count: 124, last: '2h ago', icon: Database },
    { resource: 'S3: logs-archive', type: 'Read', count: 89, last: '5h ago', icon: Server },
    { resource: 'Q1_Report.pdf', type: 'Download', count: 1, last: '1d ago', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <h1 className="text-3xl font-bold text-white mb-8">Activity Monitor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Timeline Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <ActivityIcon className="text-blue-500" size={20} /> Today's Timeline
            </h3>
            
            <div className="relative pl-4 border-l border-gray-700 space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative pl-6">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                    item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  
                  <span className="text-xs font-mono text-gray-500 block mb-1">{item.time}</span>
                  <h4 className="text-gray-200 font-medium">{item.action}</h4>
                  <p className="text-sm text-gray-400 mt-1">{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Access Logs Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Server className="text-purple-500" size={20} /> Resource Access
            </h3>

            <div className="space-y-4">
              {accessLogs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-800 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                      <log.icon size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{log.resource}</p>
                      <p className="text-xs text-gray-500">{log.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-300">{log.count}</p>
                    <p className="text-xs text-gray-500">{log.last}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center justify-center gap-2">
              View Full Logs <ArrowUpRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}