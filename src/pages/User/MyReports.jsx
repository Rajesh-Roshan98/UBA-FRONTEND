import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔥 ADDED: useNavigate
import { FileText, Download, Calendar, Filter, Loader, Shield } from 'lucide-react';
import toast from 'react-hot-toast'; // 🔥 ADDED: Imported react-hot-toast
import api from "../../services/api";


export default function MyReports() {
  const navigate = useNavigate(); // 🔥 ADDED: Initialize navigate hook
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/user/ureports`);
        setReports(response.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        // 🔥 CONVERTED: Replaced inline state error with a toast message
        toast.error("Failed to load your security reports. Please try again later.");
        
        // 🔥 ADDED: Redirection logic based on error status
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/unauthorized');
        } else {
          navigate('/not-found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [navigate]); // 🔥 ADDED: Added navigate to dependency array

  // Helper function to format the ISO date from MongoDB
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-400">
        <Loader className="animate-spin mb-4" size={32} />
        <p>Loading generated reports...</p>
      </div>
    );
  }

  // 🔥 REMOVED: Inline error rendering block has been completely removed

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
        {reports.length > 0 ? (
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
                  <span>{formatDate(report.date)}</span>
                  <span>{report.size}</span>
                </div>

                <a 
                  href={report.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-gray-700/50 hover:bg-indigo-600 hover:text-white rounded-lg text-gray-300 font-medium transition-all duration-300"
                >
                  <Download size={16} /> Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
            <FileText className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-300">No reports found</h3>
            <p className="mt-2 text-sm text-gray-500">You don't have any generated security reports yet.</p>
          </div>
        )}

      </div>
    </div>
  );
}