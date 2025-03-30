import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, ChevronRight, Search } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarkContext';
import { getBooks } from '../lib/database';
import type { Book as BookType } from '../types/database';

const BookSummariesPage: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

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

  const categories = ['All', ...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Loading Book Summaries...</h1>
          <div className="animate-pulse">
            <div className="h-10 bg-[#3a2819] rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card aspect-[3/4]"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-red-500">Error Loading Books</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Book Summaries
          </h1>
          <p className="text-lg text-gray-300">
            Discover key insights from the world's best business books
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-input rounded-md"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    selectedCategory === category
                      ? 'gold-button'
                      : 'glass-button'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Link 
                key={book.id} 
                to={`/books/${book.id}`}
                className="block group"
              >
                <div className="bg-[#2d1e14] rounded-xl p-4 transition-transform hover:scale-[1.02]">
                  {/* Card Image */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                        book.is_premium ? 'opacity-50' : ''
                      }`}
                    />
                    {book.is_premium && (
                      <div className="absolute top-2 right-2 bg-[#c9a52c] text-[#2d1e14] px-2 py-1 rounded text-sm font-medium">
                        Premium
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-[#c9a52c] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{book.author}</p>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#c9a52c]">{book.read_time}</span>
                      <ChevronRight size={20} className="text-[#c9a52c]" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookSummariesPage;
