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
import { motion, AnimatePresence } from 'framer-motion';

const Activity = () => {
  const navigate = useNavigate(); 
  const [activityData, setActivityData] = useState({ timeline: [], accessLogs: [] });
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  
  // 🔥 UPDATED: Replaced inline expand states with Modal states
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  // (Removed the old overflow useEffect completely as requested, 
  // since the modal overlay will naturally trap the focus and the page won't stretch anymore)

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        
        // 🔥 FIX: Grab the browser's local timezone (e.g., "Asia/Kolkata" or "America/New_York")
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // 🔥 FIX: Send the timezone to the backend
        const response = await api.get(`/api/v1/user/uactivity?tz=${userTz}`);
        
        setActivityData(response.data);
      } catch (err) {
        console.error("Error fetching activity data:", err);
        toast.error("Failed to load activity logs. Please try again later.");
        
        // 🔥 UPDATED: Manual navigation logic removed.
        // Your global api.js interceptor will now automatically handle redirects
        // to /unauthorized?code=... or /server-error?code=... based on HTTP status
        
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

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
  };

  // 🎨 UI MATCH: Updated loading spinner to match the Dashboard's blue/white styling perfectly
  if (loading) {
    return (
      <>
        {/* CSS injection to hide the parent scrollbar visually */}
        <style>{`
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-[80vh] w-full bg-white/50 backdrop-blur-md rounded-xl"
        >
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading activity monitor...
          </p>
        </motion.div>
      </>
    );
  }

  const { timeline, accessLogs } = activityData;

  // 🔥 CHANGED HERE: We now look for the specific date group inside the new nested array structure
  const dateGroup = timeline.find(group => group.date === selectedDate);
  const filteredTimeline = dateGroup ? dateGroup.events : [];

  // 🔥 UPDATED: Strict slice of 5 items for the main page. Expanding happens in the modal now.
  const displayedTimeline = filteredTimeline.slice(0, 5);
  const displayedLogs = accessLogs.slice(0, 5);

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
    <>
      {/* CSS injection to hide the parent scrollbar visually while maintaining scroll functionality */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Responsive Padding: perfectly synced with dashboard layout */}
      <div className="w-full h-full flex-1 flex flex-col px-4 sm:px-8 lg:px-[50px] overflow-y-auto overflow-x-hidden scroll-smooth">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full py-8 space-y-4 sm:space-y-6"
        >
          
          {/* 🎨 UI MATCH: Header styling - Stacks vertically on mobile */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2 sm:mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Activity Monitor</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Track your recent actions and resource usage.</p>
            </div>
          </motion.div>

          {/* Adaptive grid spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-start">
            
            {/* Timeline Section */}
            {/* 🎨 UI MATCH: Changed to white card with shadow-md and adaptive padding */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full relative overflow-hidden border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <ActivityIcon className="text-blue-600 shrink-0" size={20} /> 
                  <span className="truncate">{getTimelineHeader()}</span>
                </h3>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <input 
                    type="date"
                    value={selectedDate}
                    max={new Date().toLocaleDateString('en-CA')} 
                    onChange={(e) => { 
                      setSelectedDate(e.target.value); 
                      // Close modals if date changes
                      setIsTimelineModalOpen(false); 
                      setIsLogsModalOpen(false);     
                    }}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    // 🎨 UI MATCH: Updated to light theme input, full width on mobile
                    className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 transition-all duration-200 ease-in-out cursor-pointer shadow-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
              
              {displayedTimeline.length > 0 ? (
                <>
                  <div className="mt-4 flex flex-col pl-2">
                    {displayedTimeline.map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 group"
                      >
                        {/* Timeline Line & Dot Column */}
                        <div className="flex flex-col items-center">
                          {/* 🔥 FIX: Changed w-4 h-4 to w-3 h-3 for a smaller dot, adjusted margin to align visually */}
                          <div className={`w-3 h-3 rounded-full shadow-sm mt-1.5 shrink-0 transition-transform group-hover:scale-125 ${
                            item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          {/* Only show the connecting line if it's NOT the last item */}
                          {idx !== displayedTimeline.length - 1 && (
                            <div className="w-[2px] h-full bg-gray-200 mt-1.5 group-hover:bg-blue-200 transition-colors"></div>
                          )}
                        </div>
                        
                        {/* Content Column */}
                        <div className="pb-6">
                          <span className="text-xs font-mono text-gray-500 block mb-0.5">
                            {formatTime(item.timestamp)}
                          </span>
                          <h4 className="text-gray-800 font-bold text-sm group-hover:text-blue-600 transition-colors">{item.action}</h4>
                          <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{item.details}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {filteredTimeline.length > 5 && (
                    <button 
                      // 🔥 UPDATED: Opens the Modal instead of stretching the card
                      onClick={() => setIsTimelineModalOpen(true)}
                      className="w-full mt-2 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-blue-600 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                    >
                      View Full Timeline ({filteredTimeline.length}) <ArrowUpRight size={16} />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-4">
                  <ActivityIcon size={32} className="mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No activity detected for this date.</p>
                </div>
              )}
            </motion.div>

            {/* Access Logs Section */}
            {/* 🎨 UI MATCH: Changed to white card with shadow-md and adaptive padding */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full relative overflow-hidden border border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <Server className="text-purple-600 shrink-0" size={20} /> Resource Access
              </h3>

              {displayedLogs.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {displayedLogs.map((log, idx) => {
                      const IconComponent = getIconForResource(log.type);
                      
                      return (
                        <motion.div 
                          key={idx} 
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group cursor-default"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 truncate mr-2">
                            <div className="p-2 sm:p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-500 group-hover:text-purple-600 group-hover:scale-110 transition-all shrink-0">
                              <IconComponent size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-gray-800 text-sm sm:text-base truncate group-hover:text-purple-700 transition-colors">{log.resource}</p>
                              <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">{log.type}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm sm:text-base font-bold text-gray-800">{log.count}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{formatTimeAgo(log.last)}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {accessLogs.length > 5 && (
                    <button 
                      // 🔥 UPDATED: Opens the Modal instead of stretching the card
                      onClick={() => setIsLogsModalOpen(true)}
                      className="w-full mt-6 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-purple-600 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                    >
                      View Full Logs ({accessLogs.length}) <ArrowUpRight size={16} />
                    </button>
                  )}
                </>
              ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-4">
                   <Server size={32} className="mb-3 text-gray-300" />
                   <p className="text-sm font-medium">No resource access logs available.</p>
                 </div>
              )}
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* 🔥 ADDED: Timeline Modal View */}
      <AnimatePresence>
        {isTimelineModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            // Close when clicking outside the modal
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsTimelineModalOpen(false);
            }}
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <ActivityIcon className="text-blue-600" size={20} />
                  Full Activity Timeline
                </h2>
                <button 
                  onClick={() => setIsTimelineModalOpen(false)}
                  className="text-gray-500 hover:text-red-500 text-xl font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[60vh] overflow-y-auto pr-4 flex flex-col pl-2">
                {filteredTimeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    {/* Timeline Line & Dot Column */}
                    <div className="flex flex-col items-center">
                      {/* 🔥 FIX: Changed w-4 h-4 to w-3 h-3 for a smaller dot, adjusted margin to align visually */}
                      <div className={`w-3 h-3 rounded-full shadow-sm mt-1.5 shrink-0 transition-transform group-hover:scale-125 ${
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      {/* Only show the connecting line if it's NOT the last item */}
                      {idx !== filteredTimeline.length - 1 && (
                        <div className="w-[2px] h-full bg-gray-200 mt-1.5 group-hover:bg-blue-200 transition-colors"></div>
                      )}
                    </div>
                    
                    {/* Content Column */}
                    <div className="pb-8">
                      <span className="text-xs font-mono text-gray-500 block mb-1">
                        {formatTime(item.timestamp)}
                      </span>
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                        {item.action}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔥 ADDED: Access Logs Modal View */}
      <AnimatePresence>
        {isLogsModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            // Close when clicking outside the modal
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLogsModalOpen(false);
            }}
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Server className="text-purple-600" size={20} />
                  Full Resource Access Logs
                </h2>
                <button 
                  onClick={() => setIsLogsModalOpen(false)}
                  className="text-gray-500 hover:text-red-500 text-xl font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                {accessLogs.map((log, idx) => {
                  const IconComponent = getIconForResource(log.type);
                  
                  return (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.01, x: 2 }}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-300 transition-all group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 truncate mr-2">
                        <div className="p-2 sm:p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-500 group-hover:text-purple-600 group-hover:scale-110 transition-all shrink-0">
                          <IconComponent size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-gray-800 text-sm sm:text-base truncate group-hover:text-purple-700 transition-colors">{log.resource}</p>
                          <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">{log.type}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm sm:text-base font-bold text-gray-800">{log.count}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{formatTimeAgo(log.last)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Activity;