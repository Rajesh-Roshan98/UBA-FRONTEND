import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  // Navigation Icons
  BarChart3, Users, Lock, Bell, Activity, 
  Cpu, FileText, Database, 
  // UI Icons
  Menu, X, Search, ChevronDown, LogOut, Settings
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // This menu matches your AdminHomePage modules
  const menuItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: BarChart3 },
    { name: 'User Management', path: '/user-management', icon: Users },
    { name: 'Access Control', path: '/access-control', icon: Lock },
    { name: 'Security Alerts', path: '/alerts', icon: Bell },
    { name: 'Anomaly Review', path: '/anomaly-review', icon: Activity },
    { name: 'Model Results', path: '/model-results', icon: Cpu },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'System Logs', path: '/system-logs', icon: Database },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand / Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SecuriGuard
            </h1>
          ) : (
             <Shield className="w-8 h-8 text-blue-500" />
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                    {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {!isSidebarOpen && (
                      <div className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Snippet (Bottom of Sidebar) */}
        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              AD
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-slate-400">admin@company.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>


      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global Search */}
            <div className="ml-4 relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search across platform..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all focus:w-80"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <button className="p-2 rounded-full hover:bg-gray-100 relative">
               <Bell className="w-5 h-5 text-gray-600" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <button className="p-2 rounded-full hover:bg-gray-100">
               <Settings className="w-5 h-5 text-gray-600" />
             </button>
             <div className="h-6 w-px bg-gray-300 mx-2"></div>
             <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
               <LogOut className="w-4 h-4 mr-2" />
               Logout
             </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {/* This renders your Dashboard, Users, Alerts, etc. */}
            {children} 
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;