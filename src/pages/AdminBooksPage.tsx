import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Plus, Search, Filter, Edit, Trash, Eye, ArrowLeft, Check, X } from 'lucide-react';
import { getBooks } from '../lib/database';
import type { Book as BookType } from '../types/database';

const AdminBooksPage: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookType | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const categories = ['all', ...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (book: BookType) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    
    // In a real application, you would call an API to delete the book
    // For now, we'll just remove it from the local state
    setBooks(books.filter(book => book.id !== bookToDelete.id));
    setShowDeleteModal(false);
    setBookToDelete(null);
    setSuccessMessage(`"${bookToDelete.title}" has been deleted successfully.`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#3a2819] rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 bg-[#3a2819] rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-6">
            <h2 className="text-red-500 text-xl font-bold mb-2">Error Loading Books</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="text-[#c9a52c] hover:text-[#e6b93d] transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">Manage Books</h1>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-green-500" />
              <p className="text-green-400">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-green-400 hover:text-green-300"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-shrink-0 w-full md:w-64">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2d1e14] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-[#c9a52c] text-black'
                      : 'bg-[#2d1e14] text-gray-300 hover:bg-[#3a2819]'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Add Book Button */}
          <Link to="/admin/books/new" className="gold-button flex items-center gap-2 whitespace-nowrap">
            <Plus size={18} />
            <span>Add New Book</span>
          </Link>
        </div>
        
        {/* Books Table */}
        <div className="glass-card rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2d1e14]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a2819]">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-[#2d1e14]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#3a2819] rounded-md overflow-hidden">
                          {book.cover_image ? (
                            <img src={book.cover_image} alt={book.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Book size={18} className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{book.title}</div>
                          <div className="text-sm text-gray-400">{book.read_time || 'No read time'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-[#3a2819] text-[#c9a52c]">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        book.is_premium 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {book.is_premium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/books/${book.id}`} 
                          className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                          title="View"
                        >
                          <Eye size={16} className="text-[#c9a52c]" />
                        </Link>
                        <Link 
                          to={`/admin/books/edit/${book.id}`} 
                          className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-[#c9a52c]" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(book)}
                          className="p-2 bg-[#3a2819] rounded-full hover:bg-red-900/30 transition-colors"
                          title="Delete"
                        >
                          <Trash size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBooks.length === 0 && (
            <div className="text-center py-8">
              <Book size={32} className="mx-auto text-gray-500 mb-2" />
              <p className="text-gray-400">No books found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-[#c9a52c] hover:text-[#e6b93d] transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Total Books</h3>
            <p className="text-3xl font-bold">{books.length}</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Free Books</h3>
            <p className="text-3xl font-bold">{books.filter(book => !book.is_premium).length}</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Premium Books</h3>
            <p className="text-3xl font-bold">{books.filter(book => book.is_premium).length}</p>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && bookToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2d1e14] rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete <span className="text-[#c9a52c] font-medium">"{bookToDelete.title}"</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-[#3a2819] rounded-lg hover:bg-[#4a2e1c] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooksPage;
