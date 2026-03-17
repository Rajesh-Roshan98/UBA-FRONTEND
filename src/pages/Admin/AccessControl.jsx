import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, Filter, Plus, Search, Download } from 'lucide-react';

const AccessControl = () => {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Access Control</h1>
          <p className="text-gray-600">Manage permissions and access policies</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Grant Access
        </button>
      </div>

      {/* Policies Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Access Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {policies.map((policy) => (
            <div key={policy.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{policy.name}</h3>
                  <p className="text-sm text-gray-600">{policy.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  policy.status === 'enabled' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {policy.status}
                </span>
              </div>
              <div className="space-y-2">
                {policy.rules.map((rule, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Lock className="w-3 h-3 mr-2 text-gray-400" />
                    {rule}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between">
                <button className="text-blue-600 text-sm hover:text-blue-800">
                  Edit Policy
                </button>
                <button className="text-gray-600 text-sm hover:text-gray-800">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Access Permissions</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search permissions..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resource</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Access Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Justification</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{perm.resource}</div>
                    <div className="text-sm text-gray-500">
                      Granted: {perm.grantedDate} | Expires: {perm.expiryDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{perm.user}</div>
                    <div className="text-sm text-gray-500">By: {perm.grantedBy}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      perm.accessType === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : perm.accessType === 'Read/Write'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {perm.accessType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate">{perm.justification}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      perm.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : perm.status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {perm.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Review
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">{permissions.length}</div>
              <div className="text-gray-600">Active Permissions</div>
            </div>
            <Unlock className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {permissions.filter(p => p.status === 'expired').length}
              </div>
              <div className="text-gray-600">Expired Permissions</div>
            </div>
            <Lock className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {permissions.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-gray-600">Pending Reviews</div>
            </div>
            <Eye className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Add Permission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Grant New Access</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newPermission.resource}
                  onChange={(e) => setNewPermission({...newPermission, resource: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newPermission.user}
                  onChange={(e) => setNewPermission({...newPermission, user: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newPermission.accessType}
                  onChange={(e) => setNewPermission({...newPermission, accessType: e.target.value})}
                >
                  <option value="Read Only">Read Only</option>
                  <option value="Read/Write">Read/Write</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justification
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                  value={newPermission.justification}
                  onChange={(e) => setNewPermission({...newPermission, justification: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newPermission.expiryDate}
                  onChange={(e) => setNewPermission({...newPermission, expiryDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPermission}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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