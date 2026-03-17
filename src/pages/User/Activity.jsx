import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  Activity as ActivityIcon, 
  Server, 
  FileText, 
  Database, 
  ArrowUpRight,
  Loader,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast'; 
import api from "../../services/api";

export default function Activity() {
  const navigate = useNavigate(); 
  const [activityData, setActivityData] = useState({ timeline: [], accessLogs: [] });
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [showFullLogs, setShowFullLogs] = useState(false);

  // 🔥 UPDATED: Targeting html, body, and #root to guarantee ALL scrollbars are hidden
  useEffect(() => {
    const isExpanded = showFullTimeline || showFullLogs;
    const overflowStyle = isExpanded ? "auto" : "hidden";
    
    document.documentElement.style.overflow = overflowStyle;
    document.body.style.overflow = overflowStyle;
    
    // Catch common React root wrappers that might have their own scrollbars
    const rootEl = document.getElementById('root');
    if (rootEl) rootEl.style.overflow = overflowStyle;
    
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      if (rootEl) rootEl.style.overflow = "auto";
    };
  }, [showFullTimeline, showFullLogs]);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/user/uactivity`);
        setActivityData(response.data);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        toast.error("Failed to load activity logs. Please try again later.");
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/unauthorized');
        } else {
          navigate('/not-found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [navigate]); 

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown Time';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const diff = new Date() - new Date(dateString);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getIconForResource = (type) => {
    const typeLower = (type || '').toLowerCase();
    if (typeLower.includes('sql') || typeLower.includes('query')) return Database;
    if (typeLower.includes('download') || typeLower.includes('file')) return FileText;
    return Server; // Fallback icon
  };

  if (loading) {
    return (
      <div className="w-full h-full overflow-hidden bg-gray-900 flex flex-col items-center justify-center text-gray-400">
        <Loader className="animate-spin mb-4" size={32} />
        <p>Loading activity monitor...</p>
      </div>
    );
  }

  const { timeline, accessLogs } = activityData;

  // 🔥 CHANGED HERE: We now look for the specific date group inside the new nested array structure
  const dateGroup = timeline.find(group => group.date === selectedDate);
  const filteredTimeline = dateGroup ? dateGroup.events : [];

  const displayedTimeline = showFullTimeline ? filteredTimeline : filteredTimeline.slice(0, 5);
  const displayedLogs = showFullLogs ? accessLogs : accessLogs.slice(0, 5);

  const getTimelineHeader = () => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toLocaleDateString('en-CA');

    if (selectedDate === todayStr) return "Today's Timeline";
    if (selectedDate === yesterdayStr) return "Yesterday's Timeline";
    
    const formattedSpecificDate = new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${formattedSpecificDate} Timeline`;
  };

  return (
    // 🔥 UPDATED: Added overflow-x-hidden to prevent horizontal scrolling bugs entirely
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <h1 className="text-3xl font-bold text-white mb-8">Activity Monitor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Timeline Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <ActivityIcon className="text-blue-500" size={20} /> 
                {getTimelineHeader()}
              </h3>
              
              <div className="flex gap-2">
                <input 
                  type="date"
                  value={selectedDate}
                  max={new Date().toLocaleDateString('en-CA')} 
                  onChange={(e) => { 
                    setSelectedDate(e.target.value); 
                    setShowFullTimeline(false); 
                    setShowFullLogs(false);     
                  }}
                  className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 transition-colors cursor-pointer"
                />
              </div>
            </div>
            
            {displayedTimeline.length > 0 ? (
              <>
                <div className="relative pl-4 border-l border-gray-700 space-y-4">
                  {displayedTimeline.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      
                      <span className="text-xs font-mono text-gray-500 block mb-1">
                        {/* 🔥 CHANGED HERE: Extracting from item.timestamp instead of item.time */}
                        {formatTime(item.timestamp)}
                      </span>
                      <h4 className="text-gray-200 font-medium">{item.action}</h4>
                      <p className="text-sm text-gray-400 mt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
                
                {filteredTimeline.length > 5 && (
                  <button 
                    onClick={() => setShowFullTimeline(!showFullTimeline)}
                    className="w-full mt-6 py-3 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {showFullTimeline ? 'View Less' : `View Full Timeline (${filteredTimeline.length})`} <ArrowUpRight size={16} />
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">
                No activity detected for this date.
              </p>
            )}
          </div>

          {/* Access Logs Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Server className="text-purple-500" size={20} /> Resource Access
            </h3>

            {displayedLogs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {displayedLogs.map((log, idx) => {
                    const IconComponent = getIconForResource(log.type);
                    
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-800 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">{log.resource}</p>
                            <p className="text-xs text-gray-500">{log.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-300">{log.count}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(log.last)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {accessLogs.length > 5 && (
                  <button 
                    onClick={() => setShowFullLogs(!showFullLogs)}
                    className="w-full mt-6 py-3 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {showFullLogs ? 'View Less' : `View Full Logs (${accessLogs.length})`} <ArrowUpRight size={16} />
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No resource access logs available.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}