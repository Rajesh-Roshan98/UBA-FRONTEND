import React, { useState, useEffect } from 'react';
// 🔥 NEW: Imported useNavigate for error redirection
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus, MoreVertical, Edit, Trash2, Shield, Download } from 'lucide-react';

const UserManagement = () => {
  // 🔥 NEW: Initialize navigate
  const navigate = useNavigate();
  
  // 🔥 NEW: Added loading state to match AdminHomePage
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Data Scientist',
      department: 'R&D',
      riskScore: 85,
      status: 'active',
      lastActive: '2024-01-15 14:30',
      accessLevel: 'High'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'System Administrator',
      department: 'IT',
      riskScore: 45,
      status: 'active',
      lastActive: '2024-01-15 15:45',
      accessLevel: 'Critical'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@company.com',
      role: 'Marketing Analyst',
      department: 'Marketing',
      riskScore: 25,
      status: 'inactive',
      lastActive: '2024-01-14 09:20',
      accessLevel: 'Medium'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.w@company.com',
      role: 'Finance Manager',
      department: 'Finance',
      riskScore: 65,
      status: 'suspended',
      lastActive: '2024-01-13 11:15',
      accessLevel: 'High'
    },
    {
      id: 5,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'DevOps Engineer',
      department: 'Engineering',
      riskScore: 90,
      status: 'active',
      lastActive: '2024-01-15 16:50',
      accessLevel: 'Critical'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // 🔥 NEW: Added the data fetching structure with the error routing logic
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        
        // Future API call will go here when you connect it to the backend
        // const res = await api.get('/api/users');
        
      } catch (error) {
        console.error("Failed to fetch users data:", error);
        
        // 🔥 UPDATED: Manual navigation logic removed.
        // Your global api.js interceptor will now automatically handle redirects
        // to /unauthorized?code=... or /server-error?code=... based on HTTP status
        
      } finally {
        setLoading(false); // Removes the loader once data is ready
      }
    };

    fetchUsersData();
  }, [navigate]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRiskColor = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800 border border-red-200';
    if (score >= 60) return 'bg-orange-100 text-orange-800 border border-orange-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    return 'bg-green-100 text-green-800 border border-green-200';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // 🔥 NEW: Clean, static loading animation exactly like AdminHomePage
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white/50 backdrop-blur-md rounded-xl p-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm sm:text-base font-medium text-gray-500 text-center">
          Loading User Management...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gray-50">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor and manage user access and permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:space-x-4">
          <button className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium transition-colors shadow-sm active:scale-[0.98]">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-3 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
            <select
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-3 sm:py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-base sm:text-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="System Administrator">System Administrator</option>
              <option value="Marketing Analyst">Marketing Analyst</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
            <button className="w-full sm:w-auto px-4 py-3 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm font-medium transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Role & Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Access Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">{user.name}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm text-gray-900">{user.role}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{user.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRiskColor(user.riskScore)}`}>
                        {user.riskScore}
                      </div>
                      {user.riskScore >= 80 && (
                        <Shield className="w-4 h-4 ml-2 text-red-500 shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs sm:text-sm text-gray-500 font-medium">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      user.accessLevel === 'Critical' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      user.accessLevel === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                      user.accessLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {user.accessLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="More options">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
             <div className="p-8 text-center text-gray-500">
               No users found matching your search.
             </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">{users.length}</div>
          <div className="text-sm sm:text-base font-medium text-gray-500">Total Users</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm sm:text-base font-medium text-gray-500">Active Users</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">
            {users.filter(u => u.riskScore >= 80).length}
          </div>
          <div className="text-sm sm:text-base font-medium text-gray-500">High Risk Users</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">
            {users.filter(u => u.accessLevel === 'Critical').length}
          </div>
          <div className="text-sm sm:text-base font-medium text-gray-500">Critical Access</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
