import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Settings, Bell, User, Database, BarChart3,
  Shield, FileText, Server, Lock, LogOut
} from 'lucide-react';
import AdminDashboard from "../Admin/AdminDashboard";
import UserManagement from "../Admin/UserManagement";
import AccessControl from "../Admin/AccessControl";
import Alerts from "../Admin/Alerts";
import AnomalyReview from "../Admin/AnomalyReview";
import ModelResults from "../Admin/ModelResults";
import Reports from "../Admin/Reports";
import SystemLogs from "../Admin/SystemLogs";


const AdminPanel = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/users', icon: User, label: 'User Management' },
    { path: '/admin/access-control', icon: Lock, label: 'Access Control' },
    { path: '/admin/alerts', icon: Bell, label: 'Alerts' },
    { path: '/admin/anomalies', icon: Shield, label: 'Anomaly Review' },
    { path: '/admin/model-results', icon: Database, label: 'Model Results' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
    { path: '/admin/logs', icon: Server, label: 'System Logs' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">UBA Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white ${
                location.pathname === item.path ? 'bg-blue-900 text-white' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button className="flex items-center text-red-300 hover:text-red-100 w-full">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                A
              </div>
              <span className="text-gray-700">Admin User</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/access-control" element={<AccessControl />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/anomalies" element={<AnomalyReview />} />
            <Route path="/model-results" element={<ModelResults />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/logs" element={<SystemLogs />} />
            <Route path="/settings" element={<div>Settings Page</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;