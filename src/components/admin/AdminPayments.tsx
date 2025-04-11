import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  AlertCircle,
  DollarSign,
  Phone,
  FileText,
  Clock
} from 'lucide-react';

// Mock data for payments
const initialPayments = [
  { 
    id: '1', 
    userPhone: '+251912345678', 
    userName: 'Abebe Kebede',
    item: 'Full Access Subscription', 
    itemType: 'subscription',
    amount: 1200, 
    proofImage: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1',
    transactionId: 'TXN123456789',
    status: 'Pending',
    date: '2023-09-15T14:30:00Z'
  },
  { 
    id: '2', 
    userPhone: '+251923456789', 
    userName: 'Tigist Haile',
    item: 'The Lean Startup', 
    itemType: 'book',
    amount: 150, 
    proofImage: 'https://images.unsplash.com/photo-1564410267841-915d8e4d71ea',
    transactionId: 'TXN987654321',
    status: 'Approved',
    date: '2023-09-14T10:15:00Z'
  },
  { 
    id: '3', 
    userPhone: '+251934567890', 
    userName: 'Dawit Mekonnen',
    item: 'Coffee Export Business', 
    itemType: 'business-idea',
    amount: 300, 
    proofImage: 'https://images.unsplash.com/photo-1616077168712-fc6c788c2efd',
    transactionId: 'TXN456789123',
    status: 'Rejected',
    date: '2023-09-13T16:45:00Z'
  },
  { 
    id: '4', 
    userPhone: '+251945678901', 
    userName: 'Sara Tadesse',
    item: 'Zero to One', 
    itemType: 'book',
    amount: 200, 
    proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
    transactionId: 'TXN789123456',
    status: 'Pending',
    date: '2023-09-16T09:20:00Z'
  },
  { 
    id: '5', 
    userPhone: '+251956789012', 
    userName: 'Yonas Girma',
    item: 'Digital Marketing Agency', 
    itemType: 'business-idea',
    amount: 250, 
    proofImage: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4',
    transactionId: 'TXN321654987',
    status: 'Approved',
    date: '2023-09-12T11:30:00Z'
  }
];

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState(initialPayments);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userPhone.includes(searchTerm) || 
                         payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle approve payment
  const handleApprovePayment = () => {
    try {
      if (selectedPayment) {
        const updatedPayments = payments.map(payment => {
          if (payment.id === selectedPayment.id) {
            return { ...payment, status: 'Approved' };
          }
          return payment;
        });
        
        setPayments(updatedPayments);
        setSuccessMessage('Payment approved successfully!');
      }
      setShowApproveConfirm(false);
      setSelectedPayment(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to approve payment. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Handle reject payment
  const handleRejectPayment = () => {
    try {
      if (selectedPayment) {
        const updatedPayments = payments.map(payment => {
          if (payment.id === selectedPayment.id) {
            return { ...payment, status: 'Rejected' };
          }
          return payment;
        });
        
        setPayments(updatedPayments);
        setSuccessMessage('Payment rejected successfully!');
      }
      setShowRejectConfirm(false);
      setSelectedPayment(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to reject payment. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Open proof modal
  const openProofModal = (payment: any) => {
    setSelectedPayment(payment);
    setShowProofModal(true);
  };

  // Open approve confirmation
  const openApproveConfirm = (payment: any) => {
    setSelectedPayment(payment);
    setShowApproveConfirm(true);
  };

  // Open reject confirmation
  const openRejectConfirm = (payment: any) => {
    setSelectedPayment(payment);
    setShowRejectConfirm(true);
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

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get item type badge color
  const getItemTypeBadgeColor = (itemType: string) => {
    switch (itemType) {
      case 'book':
        return 'bg-blue-100 text-blue-800';
      case 'business-idea':
        return 'bg-green-100 text-green-800';
      case 'subscription':
      default:
        return 'bg-purple-100 text-purple-800';
    }
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Payments</h1>
        <p className="text-gray-600">Review and manage payment requests from users.</p>
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
                placeholder="Search by phone, name or item..."
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-full mr-3">
                          <Phone size={16} className="text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                          <div className="text-sm text-gray-500">{payment.userPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.item}</div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getItemTypeBadgeColor(payment.itemType)}`}>
                        {payment.itemType === 'book' ? 'Book' : 
                         payment.itemType === 'business-idea' ? 'Business Idea' : 'Subscription'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign size={14} className="mr-1 text-gray-500" />
                        {payment.amount} ETB
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {formatDate(payment.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openProofModal(payment)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View Proof"
                        >
                          <Eye size={18} />
                        </button>
                        {payment.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => openApproveConfirm(payment)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => openRejectConfirm(payment)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No payments found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Proof Modal */}
      {showProofModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Payment Proof</h2>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">User</p>
                      <p className="text-sm font-medium">{selectedPayment.userName} ({selectedPayment.userPhone})</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Item</p>
                      <p className="text-sm font-medium">{selectedPayment.item}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-sm font-medium">{selectedPayment.amount} ETB</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="text-sm font-medium">{selectedPayment.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-sm font-medium">{formatDate(selectedPayment.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedPayment.status)}`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Proof</h3>
                  {selectedPayment.proofImage ? (
                    <img 
                      src={selectedPayment.proofImage} 
                      alt="Payment Proof" 
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200">
                      <FileText size={48} className="text-gray-400" />
                      <p className="text-gray-500 ml-2">No proof image available</p>
                    </div>
                  )}
                </div>
              </div>
              {selectedPayment.status === 'Pending' && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowProofModal(false);
                      openRejectConfirm(selectedPayment);
                    }}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setShowProofModal(false);
                      openApproveConfirm(selectedPayment);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveConfirm && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Check size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Confirm Approval</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to approve the payment of {selectedPayment.amount} ETB from {selectedPayment.userName}?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowApproveConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprovePayment}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectConfirm && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <X size={24} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Confirm Rejection</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to reject the payment of {selectedPayment.amount} ETB from {selectedPayment.userName}?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowRejectConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectPayment}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
