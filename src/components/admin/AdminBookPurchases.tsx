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
  Book,
  Clock,
  Download,
  ShoppingCart
} from 'lucide-react';

// Mock data for book purchases
const initialBookPurchases = [
  { 
    id: '1', 
    userPhone: '+251912345678', 
    userName: 'Abebe Kebede',
    bookTitle: 'The Lean Startup',
    bookAuthor: 'Eric Ries',
    amount: 150, 
    paymentMethod: 'Telebirr',
    transactionId: 'TXN123456789',
    status: 'Completed',
    purchaseDate: '2023-09-15T14:30:00Z',
    deliveryMethod: 'Digital Download'
  },
  { 
    id: '2', 
    userPhone: '+251923456789', 
    userName: 'Tigist Haile',
    bookTitle: 'Zero to One',
    bookAuthor: 'Peter Thiel',
    amount: 200, 
    paymentMethod: 'CBE',
    transactionId: 'TXN987654321',
    status: 'Pending',
    purchaseDate: '2023-09-14T10:15:00Z',
    deliveryMethod: 'Digital Download'
  },
  { 
    id: '3', 
    userPhone: '+251934567890', 
    userName: 'Dawit Mekonnen',
    bookTitle: 'Rich Dad Poor Dad',
    bookAuthor: 'Robert Kiyosaki',
    amount: 0, 
    paymentMethod: 'Free',
    transactionId: 'FREE456789123',
    status: 'Completed',
    purchaseDate: '2023-09-13T16:45:00Z',
    deliveryMethod: 'Digital Download'
  },
  { 
    id: '4', 
    userPhone: '+251945678901', 
    userName: 'Sara Tadesse',
    bookTitle: 'Think and Grow Rich',
    bookAuthor: 'Napoleon Hill',
    amount: 180, 
    paymentMethod: 'Telebirr',
    transactionId: 'TXN789123456',
    status: 'Failed',
    purchaseDate: '2023-09-16T09:20:00Z',
    deliveryMethod: 'Digital Download'
  },
  { 
    id: '5', 
    userPhone: '+251956789012', 
    userName: 'Yonas Girma',
    bookTitle: 'Good to Great',
    bookAuthor: 'Jim Collins',
    amount: 250, 
    paymentMethod: 'CBE',
    transactionId: 'TXN321654987',
    status: 'Completed',
    purchaseDate: '2023-09-12T11:30:00Z',
    deliveryMethod: 'Digital Download'
  }
];

const AdminBookPurchases: React.FC = () => {
  const [bookPurchases, setBookPurchases] = useState(initialBookPurchases);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter book purchases based on search and filters
  const filteredPurchases = bookPurchases.filter(purchase => {
    const matchesSearch = purchase.userPhone.includes(searchTerm) || 
                         purchase.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || purchase.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle complete purchase
  const handleCompletePurchase = () => {
    try {
      if (selectedPurchase) {
        const updatedPurchases = bookPurchases.map(purchase => {
          if (purchase.id === selectedPurchase.id) {
            return { ...purchase, status: 'Completed' };
          }
          return purchase;
        });
        
        setBookPurchases(updatedPurchases);
        setSuccessMessage('Purchase marked as completed successfully!');
      }
      setShowCompleteConfirm(false);
      setSelectedPurchase(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to update purchase status. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Handle cancel purchase
  const handleCancelPurchase = () => {
    try {
      if (selectedPurchase) {
        const updatedPurchases = bookPurchases.map(purchase => {
          if (purchase.id === selectedPurchase.id) {
            return { ...purchase, status: 'Failed' };
          }
          return purchase;
        });
        
        setBookPurchases(updatedPurchases);
        setSuccessMessage('Purchase cancelled successfully!');
      }
      setShowCancelConfirm(false);
      setSelectedPurchase(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to cancel purchase. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Open details modal
  const openDetailsModal = (purchase: any) => {
    setSelectedPurchase(purchase);
    setShowDetailsModal(true);
  };

  // Open complete confirmation
  const openCompleteConfirm = (purchase: any) => {
    setSelectedPurchase(purchase);
    setShowCompleteConfirm(true);
  };

  // Open cancel confirmation
  const openCancelConfirm = (purchase: any) => {
    setSelectedPurchase(purchase);
    setShowCancelConfirm(true);
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
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
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
        <h1 className="text-2xl font-bold text-[#c9a52c] mb-2">Manage Book Purchases</h1>
        <p className="text-gray-300">Track and manage book purchases from users.</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#2d1e14] rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by phone, name, book title or author..."
                className="w-full pl-10 pr-4 py-2 bg-[#1a1310] border border-[#3a2819] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a52c] focus:border-[#c9a52c] text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              className="bg-[#1a1310] border border-[#3a2819] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c] focus:border-[#c9a52c] text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Purchases Table */}
      <div className="bg-[#2d1e14] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#3a2819]">
            <thead className="bg-[#3a2819]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Book
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#2d1e14] divide-y divide-[#3a2819]">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-[#3a2819]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-[#c9a52c]/20 rounded-full mr-3">
                          <Phone size={16} className="text-[#c9a52c]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{purchase.userName}</div>
                          <div className="text-sm text-gray-400">{purchase.userPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                          <Book size={16} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{purchase.bookTitle}</div>
                          <div className="text-sm text-gray-400">{purchase.bookAuthor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-white">
                        <DollarSign size={14} className="mr-1 text-gray-400" />
                        {purchase.amount === 0 ? 'Free' : `${purchase.amount} ETB`}
                      </div>
                      <div className="text-xs text-gray-400">{purchase.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock size={14} className="mr-1" />
                        {formatDate(purchase.purchaseDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openDetailsModal(purchase)}
                          className="text-gray-400 hover:text-[#c9a52c]"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {purchase.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => openCompleteConfirm(purchase)}
                              className="text-green-400 hover:text-green-500"
                              title="Mark as Completed"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => openCancelConfirm(purchase)}
                              className="text-red-400 hover:text-red-500"
                              title="Cancel Purchase"
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
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                    No book purchases found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Details Modal */}
      {showDetailsModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2d1e14] rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-[#3a2819]">
              <h2 className="text-xl font-semibold text-[#c9a52c]">Purchase Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-[#c9a52c] mb-4">User Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="text-sm font-medium text-white">{selectedPurchase.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-white">{selectedPurchase.userPhone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#c9a52c] mb-4">Book Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Title</p>
                      <p className="text-sm font-medium text-white">{selectedPurchase.bookTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Author</p>
                      <p className="text-sm font-medium text-white">{selectedPurchase.bookAuthor}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-[#c9a52c] mb-4">Payment Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="text-sm font-medium text-white">{selectedPurchase.amount === 0 ? 'Free' : `${selectedPurchase.amount} ETB`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Payment Method</p>
                      <p className="text-sm font-medium text-white">{selectedPurchase.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Transaction ID</p>
                      <p className="text-sm font-medium text-white">{selectedPurchase.transactionId}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#c9a52c] mb-4">Purchase Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="text-sm font-medium text-white">{formatDate(selectedPurchase.purchaseDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedPurchase.status)}`}>
                        {selectedPurchase.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Delivery Method</p>
                      <p className="text-sm font-medium text-white">{selectedPurchase.deliveryMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                {selectedPurchase.status === 'Completed' && (
                  <button
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download size={18} className="mr-2" />
                    Send Download Link
                  </button>
                )}
                
                {selectedPurchase.status === 'Pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        openCancelConfirm(selectedPurchase);
                      }}
                      className="px-4 py-2 border border-red-300 text-red-400 rounded-lg hover:bg-red-900/20"
                    >
                      Cancel Purchase
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        openCompleteConfirm(selectedPurchase);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-[#3a2819] text-white rounded-lg hover:bg-[#4a2e1c]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteConfirm && selectedPurchase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2d1e14] rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Check size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-2">Confirm Completion</h3>
              <p className="text-gray-300 text-center mb-6">
                Are you sure you want to mark the purchase of "{selectedPurchase.bookTitle}" by {selectedPurchase.userName} as completed?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowCompleteConfirm(false)}
                  className="px-4 py-2 border border-[#3a2819] text-gray-300 rounded-lg hover:bg-[#3a2819]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompletePurchase}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && selectedPurchase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2d1e14] rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <X size={24} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-2">Confirm Cancellation</h3>
              <p className="text-gray-300 text-center mb-6">
                Are you sure you want to cancel the purchase of "{selectedPurchase.bookTitle}" by {selectedPurchase.userName}?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 border border-[#3a2819] text-gray-300 rounded-lg hover:bg-[#3a2819]"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleCancelPurchase}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookPurchases;
