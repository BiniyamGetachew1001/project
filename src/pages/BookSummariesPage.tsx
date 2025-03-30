import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Lock, Clock } from 'lucide-react';
import { getBooks } from '../lib/database';
import { useBookmarks } from '../contexts/BookmarkContext';
import type { Book } from '../types/database';

const BookSummariesPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { isBookmarked } = useBookmarks();

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

  // Sort books to show free books first
  const sortedBooks = [...books].sort((a, b) => {
    if (a.is_premium === b.is_premium) return 0;
    return a.is_premium ? 1 : -1;
  });

  const filteredBooks = sortedBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to determine if a book should be free (first 3 non-premium books)
  const isBookFree = (index: number) => index < 3;

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Book Summaries</h1>
            <p className="text-gray-400">
              Explore summaries of best-selling business books.
              <span className="text-[#c9a52c]"> First 3 books are free!</span>
            </p>
          </div>
          
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
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
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

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => (
            <Link 
              key={book.id} 
              to={isBookFree(index) ? `/books/${book.id}` : '/pricing'}
              className="block group"
            >
              <div className="bg-[#2d1e14] rounded-xl p-4 transition-transform hover:scale-[1.02]">
                {/* Card Image */}
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg mb-4">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#3a2819] flex items-center justify-center">
                      <Filter size={32} className="text-gray-600" />
                    </div>
                  )}
                  {!isBookFree(index) && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center">
                        <Lock size={24} className="mx-auto mb-2 text-[#c9a52c]" />
                        <span className="text-[#c9a52c] font-medium">Premium</span>
                      </div>
                    </div>
                  )}
                  {isBookFree(index) && (
                    <div className="absolute top-2 right-2 bg-green-500/90 text-white px-2 py-1 rounded text-sm font-medium">
                      Free
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div>
                  <h3 className="font-bold mb-2 group-hover:text-[#c9a52c] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded">
                      {book.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-[#c9a52c]">
                      <Clock size={14} />
                      <span>{book.read_time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSummariesPage;
