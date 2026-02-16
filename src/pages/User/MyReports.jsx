import React from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

export default function MyReports() {
  const reports = [
    { id: 101, name: 'Monthly User Activity Report - Jan', date: 'Feb 01, 2024', size: '2.4 MB', type: 'PDF' },
    { id: 102, name: 'Incident Analysis: Data Exfiltration', date: 'Jan 28, 2024', size: '1.1 MB', type: 'PDF' },
    { id: 103, name: 'Access Log Dump (Raw)', date: 'Jan 25, 2024', size: '15.4 MB', type: 'CSV' },
    { id: 104, name: 'Quarterly Risk Assessment', date: 'Jan 15, 2024', size: '4.2 MB', type: 'PDF' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Reports</h1>
            <p className="text-gray-400">Generated security summaries and logs.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all">
              <Calendar size={18} /> Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
              <Filter size={18} /> Generate New
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="group bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-900 rounded-lg text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-900/20 transition-colors">
                  <FileText size={24} />
                </div>
                <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded uppercase font-bold">
                  {report.type}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                {report.name}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-700/50">
                <span>{report.date}</span>
                <span>{report.size}</span>
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-gray-700/50 hover:bg-indigo-600 hover:text-white rounded-lg text-gray-300 font-medium transition-all duration-300">
                <Download size={16} /> Download
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}