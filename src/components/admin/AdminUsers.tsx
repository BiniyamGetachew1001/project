import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  AlertCircle,
  User,
  ShoppingBag,
  Clock,
  Ban,
  UserCheck
} from 'lucide-react';

// Mock data for users
const initialUsers = [
  { 
    id: '1', 
    phone: '+251912345678', 
    name: 'Abebe Kebede',
    email: 'abebe.kebede@example.com',
    purchases: 3,
    status: 'Active',
    registrationDate: '2023-05-10T09:30:00Z',
    lastLogin: '2023-09-15T14:30:00Z',
    purchaseHistory: [
      { id: 'p1', item: 'Full Access Subscription', date: '2023-09-15T14:30:00Z', amount: 1200 },
      { id: 'p2', item: 'The Lean Startup', date: '2023-08-22T10:15:00Z', amount: 150 },
      { id: 'p3', item: 'Coffee Export Business', date: '2023-07-05T16:45:00Z', amount: 300 }
    ]
  },
  { 
    id: '2', 
    phone: '+251923456789', 
    name: 'Tigist Haile',
    email: 'tigist.haile@example.com',
    purchases: 1,
    status: 'Active',
    registrationDate: '2023-06-15T11:20:00Z',
    lastLogin: '2023-09-14T10:15:00Z',
    purchaseHistory: [
      { id: 'p4', item: 'Zero to One', date: '2023-09-14T10:15:00Z', amount: 200 }
    ]
  },
  { 
    id: '3', 
    phone: '+251934567890', 
    name: 'Dawit Mekonnen',
    email: 'dawit.mekonnen@example.com',
    purchases: 2,
    status: 'Suspended',
    registrationDate: '2023-04-20T14:45:00Z',
    lastLogin: '2023-08-30T16:45:00Z',
    purchaseHistory: [
      { id: 'p5', item: 'Digital Marketing Agency', date: '2023-08-30T16:45:00Z', amount: 250 },
      { id: 'p6', item: 'Rich Dad Poor Dad', date: '2023-07-12T09:30:00Z', amount: 0 }
    ]
  },
  { 
    id: '4', 
    phone: '+251945678901', 
    name: 'Sara Tadesse',
    email: 'sara.tadesse@example.com',
    purchases: 0,
    status: 'Active',
    registrationDate: '2023-08-05T10:10:00Z',
    lastLogin: '2023-09-16T09:20:00Z',
    purchaseHistory: []
  },
  { 
    id: '5', 
    phone: '+251956789012', 
    name: 'Yonas Girma',
    email: 'yonas.girma@example.com',
    purchases: 4,
    status: 'Active',
    registrationDate: '2023-03-15T08:30:00Z',
    lastLogin: '2023-09-12T11:30:00Z',
    purchaseHistory: [
      { id: 'p7', item: 'Full Access Subscription', date: '2023-09-12T11:30:00Z', amount: 1200 },
      { id: 'p8', item: 'Good to Great', date: '2023-08-20T14:15:00Z', amount: 250 },
      { id: 'p9', item: 'Textile Manufacturing', date: '2023-07-18T10:45:00Z', amount: 300 },
      { id: 'p10', item: 'Think and Grow Rich', date: '2023-06-05T09:30:00Z', amount: 180 }
    ]
  }
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.phone.includes(searchTerm) || 
                         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle suspend user
  const handleSuspendUser = () => {
    try {
      if (selectedUser) {
        const updatedUsers = users.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, status: 'Suspended' };
          }
          return user;
        });
        
        setUsers(updatedUsers);
        setSuccessMessage('User suspended successfully!');
      }
      setShowSuspendConfirm(false);
      setSelectedUser(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to suspend user. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Handle activate user
  const handleActivateUser = () => {
    try {
      if (selectedUser) {
        const updatedUsers = users.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, status: 'Active' };
          }
          return user;
        });
        
        setUsers(updatedUsers);
        setSuccessMessage('User activated successfully!');
      }
      setShowActivateConfirm(false);
      setSelectedUser(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to activate user. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Open user details modal
  const openUserDetailsModal = (user: any) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  // Open suspend confirmation
  const openSuspendConfirm = (user: any) => {
    setSelectedUser(user);
    setShowSuspendConfirm(true);
  };

  // Open activate confirmation
  const openActivateConfirm = (user: any) => {
    setSelectedUser(user);
    setShowActivateConfirm(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
          <Check size={18} className="mr-2" />
          <span>{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="ml-4 text-green-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
          <AlertCircle size={18} className="mr-2" />
          <span>{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)}
            className="ml-4 text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Users</h1>
        <p className="text-gray-600">View and manage user accounts on the platform.</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by phone, name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchases
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                          {user.email && <div className="text-sm text-gray-500">{user.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <ShoppingBag size={14} className="mr-1 text-gray-500" />
                        {user.purchases}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {formatDate(user.registrationDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openUserDetailsModal(user)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {user.status === 'Active' ? (
                          <button
                            onClick={() => openSuspendConfirm(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Suspend User"
                          >
                            <Ban size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => openActivateConfirm(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Activate User"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.phone}</p>
                    {selectedUser.email && <p className="text-gray-600">{selectedUser.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="text-sm font-medium mt-1">{formatDate(selectedUser.registrationDate)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="text-sm font-medium mt-1">{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Purchase History ({selectedUser.purchases})</h3>
                {selectedUser.purchaseHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedUser.purchaseHistory.map((purchase: any) => (
                          <tr key={purchase.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {purchase.item}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(purchase.date)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                              {purchase.amount === 0 ? 'Free' : `${purchase.amount} ETB`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No purchase history available.</p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-between">
              {selectedUser.status === 'Active' ? (
                <button
                  onClick={() => {
                    setShowUserDetailsModal(false);
                    openSuspendConfirm(selectedUser);
                  }}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  Suspend User
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowUserDetailsModal(false);
                    openActivateConfirm(selectedUser);
                  }}
                  className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
                >
                  Activate User
                </button>
              )}
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {showSuspendConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <Ban size={24} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Confirm Suspension</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to suspend {selectedUser.name}'s account? They will not be able to access the platform until reactivated.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowSuspendConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activate Confirmation Modal */}
      {showActivateConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <UserCheck size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Confirm Activation</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to activate {selectedUser.name}'s account? They will regain access to the platform.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowActivateConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActivateUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
