import React, { useState, useEffect } from 'react';
// 🔥 NEW: Imported useNavigate for error redirection
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, Eye, EyeOff, Filter, Plus, Search, Download } from 'lucide-react';

const AccessControl = () => {
  // 🔥 NEW: Initialize navigate
  const navigate = useNavigate();

  // 🔥 NEW: Added loading state to match AdminHomePage
  const [loading, setLoading] = useState(true);

  const [permissions, setPermissions] = useState([
    {
      id: 1,
      resource: 'Customer Database',
      user: 'john.doe@company.com',
      accessType: 'Read/Write',
      justification: 'Data analysis for campaign',
      grantedBy: 'admin@company.com',
      grantedDate: '2024-01-10',
      expiryDate: '2024-04-10',
      status: 'active'
    },
    {
      id: 2,
      resource: 'Financial Records',
      user: 'sarah.w@company.com',
      accessType: 'Read Only',
      justification: 'Quarterly audit',
      grantedBy: 'admin@company.com',
      grantedDate: '2024-01-05',
      expiryDate: '2024-03-05',
      status: 'expired'
    },
    {
      id: 3,
      resource: 'Source Code Repository',
      user: 'mike.chen@company.com',
      accessType: 'Admin',
      justification: 'DevOps maintenance',
      grantedBy: 'security@company.com',
      grantedDate: '2024-01-12',
      expiryDate: '2024-07-12',
      status: 'active'
    },
    {
      id: 4,
      resource: 'Sensitive Documents',
      user: 'jane.smith@company.com',
      accessType: 'Read/Write',
      justification: 'Security review',
      grantedBy: 'admin@company.com',
      grantedDate: '2024-01-08',
      expiryDate: '2024-02-08',
      status: 'pending'
    }
  ]);

  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: 'Finance Data Access',
      description: 'Controls access to financial data',
      rules: ['MFA Required', 'Time-based access', 'Geo-fencing'],
      status: 'enabled'
    },
    {
      id: 2,
      name: 'Customer PII Policy',
      description: 'Protects customer personally identifiable information',
      rules: ['Encryption required', 'Audit logging', 'Data masking'],
      status: 'enabled'
    },
    {
      id: 3,
      name: 'Developer Access',
      description: 'Developer environment access controls',
      rules: ['VPN required', 'Session timeout', 'IP whitelisting'],
      status: 'enabled'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newPermission, setNewPermission] = useState({
    resource: '',
    user: '',
    accessType: 'Read Only',
    justification: '',
    expiryDate: ''
  });

  // 🔥 NEW: Added the data fetching structure with the error routing logic
  useEffect(() => {
    const fetchAccessData = async () => {
      try {
        setLoading(true);
        
        // Future API call will go here when you connect it to the backend
        // const res = await api.get('/api/access-control');
        
      } catch (error) {
        console.error("Failed to fetch access control data:", error);
        
        // 🔥 UPDATED: Manual navigation logic removed.
        // Your global api.js interceptor will now automatically handle redirects
        // to /unauthorized?code=... or /server-error?code=... based on HTTP status
        
      } finally {
        setLoading(false); // Removes the loader once data is ready
      }
    };

    fetchAccessData();
  }, [navigate]);

  const handleAddPermission = () => {
    const permission = {
      id: permissions.length + 1,
      ...newPermission,
      grantedBy: 'admin@company.com',
      grantedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setPermissions([...permissions, permission]);
    setShowModal(false);
    setNewPermission({
      resource: '',
      user: '',
      accessType: 'Read Only',
      justification: '',
      expiryDate: ''
    });
  };

  // 🔥 NEW: Clean, static loading animation exactly like AdminHomePage
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white/50 backdrop-blur-md rounded-xl p-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm sm:text-base font-medium text-gray-500 text-center">
          Loading Access Control...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gray-50">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Access Control</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage permissions and access policies</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium transition-colors shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
          Grant Access
        </button>
      </div>

      {/* Policies Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5">Access Policies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {policies.map((policy) => (
            <div key={policy.id} className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow bg-gray-50/50">
              <div className="flex justify-between items-start gap-3 mb-3 sm:mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{policy.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">{policy.description}</p>
                </div>
                <span className={`px-2.5 py-1 text-[10px] sm:text-xs rounded-full font-bold uppercase tracking-wider shrink-0 ${
                  policy.status === 'enabled' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {policy.status}
                </span>
              </div>
              <div className="space-y-2.5">
                {policy.rules.map((rule, index) => (
                  <div key={index} className="flex items-center text-xs sm:text-sm text-gray-700">
                    <Lock className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center">
                <button className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-800 transition-colors">
                  Edit Policy
                </button>
                <button className="text-gray-600 text-xs sm:text-sm font-medium hover:text-gray-900 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Access Permissions</h2>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search permissions..."
                className="w-full sm:w-64 pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm font-medium transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        {/* Horizontal scroll wrapper for mobile */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Resource</th>
                <th className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Access Type</th>
                <th className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Justification</th>
                <th className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-semibold text-sm text-gray-900">{perm.resource}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-1">
                      Granted: {perm.grantedDate} | Expires: {perm.expiryDate}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{perm.user}</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-1">By: {perm.grantedBy}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      perm.accessType === 'Admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : perm.accessType === 'Read/Write'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {perm.accessType}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="max-w-[150px] sm:max-w-xs truncate text-sm text-gray-600" title={perm.justification}>
                      {perm.justification}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      perm.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : perm.status === 'expired'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {perm.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex space-x-3 sm:space-x-4">
                      <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-semibold transition-colors">
                        Review
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-semibold transition-colors">
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Access Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{permissions.length}</div>
              <div className="text-sm sm:text-base font-medium text-gray-500">Active Permissions</div>
            </div>
            <div className="bg-green-100 p-3 sm:p-4 rounded-xl">
              <Unlock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">
                {permissions.filter(p => p.status === 'expired').length}
              </div>
              <div className="text-sm sm:text-base font-medium text-gray-500">Expired Permissions</div>
            </div>
            <div className="bg-red-100 p-3 sm:p-4 rounded-xl">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-1">
                {permissions.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm sm:text-base font-medium text-gray-500">Pending Reviews</div>
            </div>
            <div className="bg-yellow-100 p-3 sm:p-4 rounded-xl">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Permission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6 max-h-[90dvh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Grant New Access</h2>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Resource
                </label>
                {/* text-base on mobile prevents iOS Safari auto-zoom */}
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={newPermission.resource}
                  onChange={(e) => setNewPermission({...newPermission, resource: e.target.value})}
                  placeholder="e.g. Financial Database"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  User Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={newPermission.user}
                  onChange={(e) => setNewPermission({...newPermission, user: e.target.value})}
                  placeholder="user@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Access Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow bg-white"
                  value={newPermission.accessType}
                  onChange={(e) => setNewPermission({...newPermission, accessType: e.target.value})}
                >
                  <option value="Read Only">Read Only</option>
                  <option value="Read/Write">Read/Write</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Justification
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
                  rows="3"
                  placeholder="Briefly explain why access is needed..."
                  value={newPermission.justification}
                  onChange={(e) => setNewPermission({...newPermission, justification: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={newPermission.expiryDate}
                  onChange={(e) => setNewPermission({...newPermission, expiryDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-3 sm:gap-0 mt-6 sm:mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPermission}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98]"
              >
                Grant Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl;
