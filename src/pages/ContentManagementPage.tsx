import React, { useState, useEffect } from 'react';
import { Book, LayoutGrid, Plus, X, Upload, Check } from 'lucide-react';
import { addBook, addBusinessPlan, getBooks, getBusinessPlans } from '../lib/database';
import type { Book as BookType, BusinessPlan } from '../types/database';

const ContentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'business-plans'>('books');
  const [books, setBooks] = useState<BookType[]>([]);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Book form state
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: '',
    is_premium: false,
    description: '',
    read_time: '',
    cover_image: '',
    content: null
  });
  
  // Business plan form state
  const [planForm, setPlanForm] = useState({
    title: '',
    icon: 'Coffee', // Default icon
    description: '',
    investment: '',
    is_premium: false,
    category: '',
    cover_image: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, plansData] = await Promise.all([
          getBooks(),
          getBusinessPlans()
        ]);
        setBooks(booksData);
        setBusinessPlans(plansData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setBookForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setBookForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePlanFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPlanForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setPlanForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const newBook = await addBook(bookForm);
      setBooks(prev => [...prev, newBook]);
      setBookForm({
        title: '',
        author: '',
        category: '',
        is_premium: false,
        description: '',
        read_time: '',
        cover_image: '',
        content: null
      });
      setSuccessMessage('Book added successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const newPlan = await addBusinessPlan(planForm);
      setBusinessPlans(prev => [...prev, newPlan]);
      setPlanForm({
        title: '',
        icon: 'Coffee',
        description: '',
        investment: '',
        is_premium: false,
        category: '',
        cover_image: ''
      });
      setSuccessMessage('Business plan added successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add business plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Content Management</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-[#4a2e1c] mb-6">
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'books'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('books')}
          >
            <div className="flex items-center gap-2">
              <Book size={18} />
              <span>Books</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'business-plans'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('business-plans')}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid size={18} />
              <span>Business Plans</span>
            </div>
          </button>
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
        {activeTab === 'books' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
            <form onSubmit={handleBookSubmit} className="glass-card p-6 rounded-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleBookFormChange}
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
                    value={bookForm.author}
                    onChange={handleBookFormChange}
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
                    value={bookForm.category}
                    onChange={handleBookFormChange}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="read_time"
                    value={bookForm.read_time}
                    onChange={handleBookFormChange}
                    placeholder="e.g. 10 min"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    name="cover_image"
                    value={bookForm.cover_image}
                    onChange={handleBookFormChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_premium_book"
                    name="is_premium"
                    checked={bookForm.is_premium}
                    onChange={handleBookFormChange}
                    className="mr-2 h-4 w-4 accent-[#c9a52c]"
                  />
                  <label htmlFor="is_premium_book" className="text-sm font-medium text-gray-300">
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
                  value={bookForm.description}
                  onChange={handleBookFormChange}
                  rows={4}
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                ></textarea>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-button flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span>Add Book</span>
                </button>
              </div>
            </form>
            
            <h2 className="text-2xl font-bold mb-4">Existing Books ({books.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => (
                <div key={book.id} className="bg-[#2d1e14] rounded-xl p-4">
                  <h3 className="font-bold mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">by {book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded">
                      {book.category}
                    </span>
                    {book.is_premium && (
                      <span className="text-sm bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Business Plan Form */}
        {activeTab === 'business-plans' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add New Business Plan</h2>
            <form onSubmit={handlePlanSubmit} className="glass-card p-6 rounded-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={planForm.title}
                    onChange={handlePlanFormChange}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Icon*
                  </label>
                  <select
                    name="icon"
                    value={planForm.icon}
                    onChange={handlePlanFormChange}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="ShoppingBag">Shopping Bag</option>
                    <option value="Utensils">Utensils</option>
                    <option value="Truck">Truck</option>
                    <option value="TrendingUp">Trending Up</option>
                    <option value="Wifi">Wifi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category*
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={planForm.category}
                    onChange={handlePlanFormChange}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Investment Range*
                  </label>
                  <input
                    type="text"
                    name="investment"
                    value={planForm.investment}
                    onChange={handlePlanFormChange}
                    placeholder="e.g. $1,000 - $10,000"
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    name="cover_image"
                    value={planForm.cover_image}
                    onChange={handlePlanFormChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_premium_plan"
                    name="is_premium"
                    checked={planForm.is_premium}
                    onChange={handlePlanFormChange}
                    className="mr-2 h-4 w-4 accent-[#c9a52c]"
                  />
                  <label htmlFor="is_premium_plan" className="text-sm font-medium text-gray-300">
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
                  value={planForm.description}
                  onChange={handlePlanFormChange}
                  rows={4}
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                ></textarea>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-button flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span>Add Business Plan</span>
                </button>
              </div>
            </form>
            
            <h2 className="text-2xl font-bold mb-4">Existing Business Plans ({businessPlans.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessPlans.map(plan => (
                <div key={plan.id} className="bg-[#2d1e14] rounded-xl p-4">
                  <h3 className="font-bold mb-2">{plan.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{plan.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded">
                      {plan.category}
                    </span>
                    <span className="text-sm text-[#c9a52c]">
                      {plan.investment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementPage;
