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
        
        // Error handling navigation logic (Matching AdminHomePage)
        if (error.response) {
          const status = error.response.status;
          // Route authentication/authorization errors to unauthorized page
          if (status === 401 || status === 403 || status === 404) {
            navigate('/unauthorized');
          } 
          // Route server errors to not found page
          else if (status >= 500) {
            navigate('/server-error');
          }
        }
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
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 🔥 NEW: Clean, static loading animation exactly like AdminHomePage
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full bg-white/50 backdrop-blur-md rounded-xl">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          Loading User Management...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Monitor and manage user access and permissions</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role & Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Risk Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Active</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Access Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{user.role}</div>
                    <div className="text-sm text-gray-500">{user.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(user.riskScore)}`}>
                        {user.riskScore}
                      </div>
                      {user.riskScore >= 80 && (
                        <Shield className="w-4 h-4 ml-2 text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.accessLevel === 'Critical' ? 'bg-purple-100 text-purple-800' :
                      user.accessLevel === 'High' ? 'bg-red-100 text-red-800' :
                      user.accessLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.accessLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-gray-800">{users.length}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-gray-600">Active Users</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-red-600">
            {users.filter(u => u.riskScore >= 80).length}
          </div>
          <div className="text-gray-600">High Risk Users</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.accessLevel === 'Critical').length}
          </div>
          <div className="text-gray-600">Critical Access</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;