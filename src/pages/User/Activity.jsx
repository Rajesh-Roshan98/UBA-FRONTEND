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

const Activity = () => {
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
        
        // 🔥 FIX: Grab the browser's local timezone (e.g., "Asia/Kolkata" or "America/New_York")
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // 🔥 FIX: Send the timezone to the backend
        const response = await api.get(`/api/user/uactivity?tz=${userTz}`);
        
        setActivityData(response.data);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        toast.error("Failed to load activity logs. Please try again later.");
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/unauthorized');
        } else {
          navigate('/server-error');
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

  // 🎨 UI MATCH: Updated loading spinner to match the Dashboard's blue/white styling perfectly
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full bg-white/50 backdrop-blur-md rounded-xl">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading activity monitor...
        </p>
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
    // 🎨 UI MATCH: Updated main background to bg-gray-100 and text to dark colors
    <div className="min-h-screen bg-gray-100 p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 🎨 UI MATCH: Header styling */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Activity Monitor</h1>
            <p className="text-gray-600 mt-1">Track your recent actions and resource usage.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Timeline Section */}
          {/* 🎨 UI MATCH: Changed to white card with shadow-md */}
          <div className="bg-white rounded-xl shadow-md p-6 w-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ActivityIcon className="text-blue-600" size={20} /> 
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
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  // 🎨 UI MATCH: Updated to light theme input, removed [color-scheme:dark]
                  className="bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 transition-all duration-200 ease-in-out cursor-pointer shadow-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
            </div>
            
            {displayedTimeline.length > 0 ? (
              <>
                <div className="relative pl-4 border-l border-gray-200 space-y-6 mt-4">
                  {displayedTimeline.map((item, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      
                      <span className="text-xs font-mono text-gray-500 block mb-1">
                        {/* 🔥 CHANGED HERE: Extracting from item.timestamp instead of item.time */}
                        {formatTime(item.timestamp)}
                      </span>
                      <h4 className="text-gray-800 font-bold">{item.action}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
                
                {filteredTimeline.length > 5 && (
                  <button 
                    onClick={() => setShowFullTimeline(!showFullTimeline)}
                    // 🎨 UI MATCH: Light theme button styling with blue hover text
                    className="w-full mt-8 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-blue-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    {showFullTimeline ? 'View Less' : `View Full Timeline (${filteredTimeline.length})`} <ArrowUpRight size={16} />
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-4">
                <ActivityIcon size={32} className="mb-3 text-gray-300" />
                <p className="text-sm font-medium">No activity detected for this date.</p>
              </div>
            )}
          </div>

          {/* Access Logs Section */}
          {/* 🎨 UI MATCH: Changed to white card with shadow-md */}
          <div className="bg-white rounded-xl shadow-md p-6 w-full relative overflow-hidden">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Server className="text-purple-600" size={20} /> Resource Access
            </h3>

            {displayedLogs.length > 0 ? (
              <>
                <div className="space-y-3">
                  {displayedLogs.map((log, idx) => {
                    const IconComponent = getIconForResource(log.type);
                    
                    return (
                      // 🎨 UI MATCH: Updated hover states and card styling for inner lists
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-500 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                            <IconComponent size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{log.resource}</p>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">{log.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">{log.count}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(log.last)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {accessLogs.length > 5 && (
                  <button 
                    onClick={() => setShowFullLogs(!showFullLogs)}
                    // 🎨 UI MATCH: Light theme button styling
                    className="w-full mt-6 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-purple-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    {showFullLogs ? 'View Less' : `View Full Logs (${accessLogs.length})`} <ArrowUpRight size={16} />
                  </button>
                )}
              </>
            ) : (
               <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-4">
                 <Server size={32} className="mb-3 text-gray-300" />
                 <p className="text-sm font-medium">No resource access logs available.</p>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Activity;