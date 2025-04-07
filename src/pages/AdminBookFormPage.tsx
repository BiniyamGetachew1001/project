import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash, X, Check, Clock, Upload } from 'lucide-react';
import { getBookById, addBook } from '../lib/database';
import type { Book } from '../types/database';

const AdminBookFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Book, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    author: '',
    category: '',
    is_premium: false,
    description: '',
    read_time: '',
    cover_image: '',
    content: null
  });

  useEffect(() => {
    const fetchBook = async () => {
      if (!isEditMode) {
        setLoading(false);
        return;
      }
      
      try {
        const book = await getBookById(id!);
        setFormData({
          title: book.title,
          author: book.author,
          category: book.category,
          is_premium: book.is_premium,
          description: book.description || '',
          read_time: book.read_time || '',
          cover_image: book.cover_image || '',
          content: book.content
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (isEditMode) {
        // In a real app, you would update the book here
        // For now, we'll just show a success message
        setSuccessMessage('Book updated successfully!');
      } else {
        await addBook(formData);
        setSuccessMessage('Book added successfully!');
        // Clear form after successful add
        setFormData({
          title: '',
          author: '',
          category: '',
          is_premium: false,
          description: '',
          read_time: '',
          cover_image: '',
          content: null
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    // In a real app, you would delete the book here
    // For now, we'll just navigate back to the books page
    setShowDeleteModal(false);
    navigate('/admin/books');
  };

  if (loading && isEditMode) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#3a2819] rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-[#3a2819] rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-12 bg-[#3a2819] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/books" className="text-[#c9a52c] hover:text-[#e6b93d] transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Book' : 'Add New Book'}</h1>
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <X size={20} className="text-red-500" />
              <p className="text-red-400">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Book Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Author*
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category*
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Read Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleChange}
                  placeholder="e.g. 10 min"
                  className="w-full bg-[#2d1e14] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_premium"
                name="is_premium"
                checked={formData.is_premium}
                onChange={handleChange}
                className="mr-2 h-4 w-4 accent-[#c9a52c]"
              />
              <label htmlFor="is_premium" className="text-sm font-medium text-gray-300">
                Premium Content
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
            ></textarea>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Content (Google Docs Link)
            </label>
            <div className="bg-[#2d1e14] rounded-lg p-4 border border-dashed border-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Upload size={18} className="text-gray-400" />
                <span className="text-gray-400">Paste Google Docs link or upload content</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            {isEditMode && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors flex items-center gap-2"
              >
                <Trash size={18} />
                <span>Delete</span>
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <Link
                to="/admin/books"
                className="px-4 py-2 bg-[#3a2819] rounded-lg hover:bg-[#4a2e1c] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="gold-button flex items-center gap-2"
              >
                <Save size={18} />
                <span>{isEditMode ? 'Update' : 'Save'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Preview */}
        {(formData.title || formData.description || formData.cover_image) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Preview</h2>
            <div className="glass-card p-6 rounded-xl">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  {formData.cover_image ? (
                    <img
                      src={formData.cover_image}
                      alt={formData.title}
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-[#3a2819] rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No Cover Image</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-bold mb-2">{formData.title || 'Book Title'}</h3>
                  <p className="text-gray-400 mb-4">by {formData.author || 'Author Name'}</p>
                  
                  <div className="flex gap-2 mb-4">
                    {formData.category && (
                      <span className="px-2 py-1 text-xs rounded-full bg-[#3a2819] text-[#c9a52c]">
                        {formData.category}
                      </span>
                    )}
                    {formData.is_premium && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                        Premium
                      </span>
                    )}
                    {formData.read_time && (
                      <span className="px-2 py-1 text-xs rounded-full bg-[#3a2819] text-[#c9a52c] flex items-center gap-1">
                        <Clock size={12} />
                        {formData.read_time}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300">
                    {formData.description || 'Book description will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2d1e14] rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete <span className="text-[#c9a52c] font-medium">"{formData.title}"</span>? 
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

export default AdminBookFormPage;
