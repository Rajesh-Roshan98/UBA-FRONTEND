import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the Context
const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  /**
   * Add a new alert to the stack.
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {string} message - The text to display
   * @param {number} timeout - Duration in ms (default 5000)
   */
  const addAlert = useCallback((type, message, timeout = 5000) => {
    const id = Date.now() + Math.random(); // Unique ID
    
    // Add alert to state
    setAlerts((prev) => [...prev, { id, type, message }]);

    // Auto-remove after timeout
    if (timeout) {
      setTimeout(() => {
        removeAlert(id);
      }, timeout);
    }
  }, []);

  /**
   * Remove a specific alert by ID (useful for manual close buttons)
   */
  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
      
      {/* GLOBAL TOAST CONTAINER */}
      {/* This renders the alerts on top of your app automatically */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`
              pointer-events-auto px-4 py-3 rounded shadow-lg text-white text-sm font-medium transition-all duration-300 transform translate-x-0
              ${alert.type === 'error' ? 'bg-red-600' : 
                alert.type === 'warning' ? 'bg-orange-500' : 
                alert.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}
            `}
          >
            <div className="flex items-center gap-3">
              <span>{alert.message}</span>
              <button 
                onClick={() => removeAlert(alert.id)} 
                className="ml-2 text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

    </AlertContext.Provider>
  );
};

// Custom Hook for easy usage
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};