import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Eye, 
  Filter, 
  X, 
  Upload, 
  Save,
  Check,
  AlertCircle
} from 'lucide-react';

// Mock data for books
const initialBooks = [
  { 
    id: '1', 
    title: 'The Lean Startup', 
    author: 'Eric Ries', 
    price: 150, 
    access: 'Full', 
    category: 'Entrepreneurship',
    coverImage: 'https://m.media-amazon.com/images/I/51T-sMqSMiL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    summary: 'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses'
  },
  { 
    id: '2', 
    title: 'Zero to One', 
    author: 'Peter Thiel', 
    price: 200, 
    access: 'Individual', 
    category: 'Startups',
    coverImage: 'https://m.media-amazon.com/images/I/4137OkbPQ4L._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    summary: 'Notes on Startups, or How to Build the Future'
  },
  { 
    id: '3', 
    title: 'Rich Dad Poor Dad', 
    author: 'Robert Kiyosaki', 
    price: 0, 
    access: 'Free', 
    category: 'Finance',
    coverImage: 'https://m.media-amazon.com/images/I/51AHZGhzZEL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    summary: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!'
  },
  { 
    id: '4', 
    title: 'Think and Grow Rich', 
    author: 'Napoleon Hill', 
    price: 180, 
    access: 'Full', 
    category: 'Personal Development',
    coverImage: 'https://m.media-amazon.com/images/I/61y04z8SKEL._AC_UY218_.jpg',
    summary: 'The Landmark Bestseller Now Revised and Updated for the 21st Century'
  },
  { 
    id: '5', 
    title: 'Good to Great', 
    author: 'Jim Collins', 
    price: 250, 
    access: 'Individual', 
    category: 'Management',
    coverImage: 'https://m.media-amazon.com/images/I/41vz6xRZlZL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    summary: 'Why Some Companies Make the Leap...And Others Don\'t'
  }
];

interface AdminBooksProps {
  language: 'english' | 'amharic' | 'afaan-oromo';
}

const AdminBooks: React.FC<AdminBooksProps> = ({ language }) => {
  const [books, setBooks] = useState(initialBooks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccess, setFilterAccess] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: '',
    price: 0,
    access: 'Full',
    category: 'Entrepreneurship',
    coverImage: '',
    summary: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseInt(value) || 0 : value
    });
  };

  // Filter books based on search and filters
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccess = filterAccess === 'all' || book.access === filterAccess;
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    
    return matchesSearch && matchesAccess && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(books.map(book => book.category))];

  // Handle add/edit book
  const handleSaveBook = () => {
    try {
      if (formData.id) {
        // Edit existing book
        setBooks(books.map(book => book.id === formData.id ? formData : book));
        setSuccessMessage('Book updated successfully!');
      } else {
        // Add new book
        const newBook = {
          ...formData,
          id: Date.now().toString()
        };
        setBooks([...books, newBook]);
        setSuccessMessage('Book added successfully!');
      }
      setShowAddModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to save book. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Handle delete book
  const handleDeleteBook = () => {
    try {
      if (selectedBook) {
        setBooks(books.filter(book => book.id !== selectedBook.id));
        setSuccessMessage('Book deleted successfully!');
      }
      setShowDeleteConfirm(false);
      setSelectedBook(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to delete book. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      id: '',
      title: '',
      author: '',
      price: 0,
      access: 'Full',
      category: 'Entrepreneurship',
      coverImage: '',
      summary: ''
    });
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (book: any) => {
    setFormData(book);
    setShowAddModal(true);
  };

  // Open preview modal
  const openPreviewModal = (book: any) => {
    setSelectedBook(book);
    setShowPreviewModal(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (book: any) => {
    setSelectedBook(book);
    setShowDeleteConfirm(true);
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

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Manage Books</h1>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" />
          <span>Add New Book</span>
        </button>
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
                placeholder="Search books by title or author..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterAccess}
                onChange={(e) => setFilterAccess(e.target.value)}
              >
                <option value="all">All Access</option>
                <option value="Free">Free</option>
                <option value="Full">Full Access</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
            <div>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (ETB)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-8 flex-shrink-0 mr-3">
                          {book.coverImage ? (
                            <img className="h-10 w-8 object-cover" src={book.coverImage} alt={book.title} />
                          ) : (
                            <div className="h-10 w-8 bg-gray-200 flex items-center justify-center rounded">
                              <Book size={16} className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {book.price === 0 ? 'Free' : `${book.price} ETB`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${book.access === 'Free' ? 'bg-green-100 text-green-800' : 
                          book.access === 'Full' ? 'bg-blue-100 text-blue-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                        {book.access}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openPreviewModal(book)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(book)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(book)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No books found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {formData.id ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (ETB)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for free books</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="access"
                    value={formData.access}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Free">Free</option>
                    <option value="Full">Full Access</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Management">Management</option>
                    <option value="Startups">Startups</option>
                    <option value="Personal Development">Personal Development</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter image URL or upload"
                    />
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-r-lg"
                    >
                      <Upload size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBook}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {formData.id ? 'Update Book' : 'Save Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Book Preview</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 flex justify-center">
                  {selectedBook.coverImage ? (
                    <img 
                      src={selectedBook.coverImage} 
                      alt={selectedBook.title} 
                      className="w-32 h-48 object-cover rounded-md shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-48 bg-gray-200 flex items-center justify-center rounded-md shadow-md">
                      <Book size={32} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedBook.title}</h3>
                  <p className="text-gray-600 mb-4">by {selectedBook.author}</p>
                  
                  <div className="mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${selectedBook.access === 'Free' ? 'bg-green-100 text-green-800' : 
                        selectedBook.access === 'Full' ? 'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'}`}>
                      {selectedBook.access}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {selectedBook.price === 0 ? 'Free' : `${selectedBook.price} ETB`}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {selectedBook.category}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary:</h4>
                    <p className="text-gray-600">{selectedBook.summary}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Confirm Delete</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete the book "{selectedBook.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBook}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
