import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Key,
  Palette,
  HelpCircle,
  LogOut,
  User,
  Smartphone,
  Moon,
  Sun,
  Globe,
  Trash2,
  Mail,
  Lock
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    // Account
    email: 'alex.johnson@example.com',
    fname: 'Alex Johnson',
    phone: '+1 (555) 123-4567',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    marketingEmails: false,
    
    // Privacy
    profileVisibility: 'public', // public, friends, private
    searchEngineIndexing: false,
    dataSharing: true,
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    
    // Appearance
    theme: 'system', // light, dark, system
    language: 'en',
    compactMode: false,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
            
            {/* Avatar Section */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                AJ
              </div>
              <div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Change Avatar
                </button>
                <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={settings.fname}
                  onChange={(e) => handleChange('fname', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">Delete Account</p>
                  <p className="text-sm text-red-600">Once you delete your account, there is no going back.</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive daily digests and updates' },
                { id: 'pushNotifications', label: 'Push Notifications', desc: 'Real-time alerts on your device' },
                { id: 'securityAlerts', label: 'Security Alerts', desc: 'Notify me of suspicious activity' },
                { id: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive offers and promotions' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[item.id] ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Privacy & Data</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block font-medium text-gray-900 mb-2">Profile Visibility</label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleChange('profileVisibility', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public (Everyone can see)</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private (Only me)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Search Engine Indexing</p>
                  <p className="text-sm text-gray-500">Allow search engines to show your profile</p>
                </div>
                <button
                  onClick={() => handleToggle('searchEngineIndexing')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.searchEngineIndexing ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.searchEngineIndexing ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Data Sharing</p>
                  <p className="text-sm text-gray-500">Share usage data to help us improve</p>
                </div>
                <button
                  onClick={() => handleToggle('dataSharing')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.dataSharing ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.dataSharing ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                   <div className="bg-blue-100 p-2 rounded-lg mr-4"><Smartphone className="text-blue-600" size={20} /></div>
                   <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Secure your account with 2FA</p>
                   </div>
                </div>
                <button
                  onClick={() => handleToggle('twoFactorAuth')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-4"><Lock className="text-yellow-600" size={20} /></div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Active Sessions</h4>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                   <div className="flex items-center">
                     <Globe className="text-green-600 mr-3" size={18} />
                     <div>
                       <p className="font-medium text-sm text-green-900">Chrome on MacOS</p>
                       <p className="text-xs text-green-700">San Francisco, US • Current Session</p>
                     </div>
                   </div>
                   <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Appearance & Interface</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               {['light', 'dark', 'system'].map((themeMode) => (
                 <button 
                   key={themeMode}
                   onClick={() => handleChange('theme', themeMode)}
                   className={`p-4 border rounded-xl flex flex-col items-center justify-center space-y-2 transition ${settings.theme === themeMode ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                 >
                   {themeMode === 'light' && <Sun size={24} />}
                   {themeMode === 'dark' && <Moon size={24} />}
                   {themeMode === 'system' && <Settings size={24} />}
                   <span className="capitalize font-medium">{themeMode}</span>
                 </button>
               ))}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block font-medium text-gray-900 mb-2">Interface Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English (United States)</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Help & Support</h3>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <HelpCircle className="text-purple-600" size={24} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Help Center</p>
                  <p className="text-sm text-gray-500">Browse tutorials and guides</p>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Contact Support</p>
                  <p className="text-sm text-gray-500">Get help from our team</p>
                </div>
              </button>
            </div>
            <div className="text-center pt-8 border-t">
               <p className="text-sm text-gray-400">App Version 2.4.0</p>
               <div className="flex justify-center space-x-4 mt-2">
                 <a href="#" className="text-xs text-blue-500 hover:underline">Terms of Service</a>
                 <a href="#" className="text-xs text-blue-500 hover:underline">Privacy Policy</a>
               </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account details and preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="flex flex-col p-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={18} className={`mr-3 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    {tab.label}
                  </button>
                ))}
              </nav>
              
              <div className="p-4 border-t border-gray-100 mt-2">
                 <button className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium w-full px-2 py-2 rounded-lg hover:bg-red-50 transition">
                    <LogOut size={18} className="mr-3" />
                    Sign Out
                 </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;