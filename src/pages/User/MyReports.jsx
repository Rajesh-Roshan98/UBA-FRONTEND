import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔥 ADDED: useNavigate
import { FileText, Download, Calendar, Filter, Loader, Shield } from 'lucide-react';
import toast from 'react-hot-toast'; // 🔥 ADDED: Imported react-hot-toast
import api from "../../services/api";

const MyReports = () => {
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
        
        // 🔥 UPDATED: Manual navigation logic removed.
        // Your global api.js interceptor will now automatically handle redirects
        // to /unauthorized?code=... or /server-error?code=... based on HTTP status
        
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

  // 🎨 UI MATCH: Updated loading spinner to exactly match the Dashboard
  if (loading) {
    return (
      <>
        {/* CSS injection to hide the parent scrollbar visually */}
        <style>{`
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="flex flex-col items-center justify-center h-[80vh] w-full bg-white/50 backdrop-blur-md rounded-xl">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading reports...
          </p>
        </div>
      </>
    );
  }

  // 🔥 REMOVED: Inline error rendering block has been completely removed

  return (
    <>
      {/* CSS injection to hide the parent scrollbar visually while maintaining scroll functionality */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Responsive Padding: smaller padding on mobile (p-4), larger on bigger screens (sm:p-6 lg:p-8) */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-gray-100 min-h-full w-full">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Header with Filters - Stacks vertically on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-8">
            <div>
              {/* 🎨 UI MATCH: Dark bold text for headers */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Reports</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Generated security summaries and logs.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              {/* 🎨 UI MATCH: Light theme secondary button, flex-1 on mobile to share width evenly */}
              <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 shadow-sm transition-all font-medium text-xs sm:text-sm">
                <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" /> Last 30 Days
              </button>
              {/* 🎨 UI MATCH: Primary blue button to match dashboard */}
              <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm font-medium text-xs sm:text-sm">
                <Filter size={16} className="sm:w-[18px] sm:h-[18px]" /> Generate New
              </button>
            </div>
          </div>

          {/* Reports Grid */}
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reports.map((report) => (
                // 🎨 UI MATCH: Changed to white card with shadow-sm and hover lift effect
                <div key={report.id} className="group bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    {/* 🎨 UI MATCH: Blue tinted icon box */}
                    <div className="p-2.5 sm:p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <FileText size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    {/* 🎨 UI MATCH: Light theme badge */}
                    <span className="px-2 sm:px-2.5 py-1 bg-gray-100 border border-gray-200 text-[10px] sm:text-xs text-gray-600 rounded font-bold uppercase tracking-wider">
                      {report.type}
                    </span>
                  </div>
                  
                  {/* 🎨 UI MATCH: Dark bold text with adaptive size */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem]">
                    {report.name}
                  </h3>
                  
                  {/* 🎨 UI MATCH: Light theme divider and text */}
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-500 mt-4 pt-4 border-t border-gray-100">
                    <span>{formatDate(report.date)}</span>
                    <span>{report.size}</span>
                  </div>

                  {/* 🎨 UI MATCH: Light theme download button with blue hover */}
                  <a 
                    href={report.downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-lg text-gray-600 text-sm font-medium transition-all duration-300 shadow-sm"
                  >
                    <Download size={16} /> Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            // 🎨 UI MATCH: Light theme empty state with dashed borders
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-4">
              <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-bold text-gray-800">No reports found</h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-500">You don't have any generated security reports yet.</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MyReports;