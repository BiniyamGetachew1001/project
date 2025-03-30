import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Lock, Search } from 'lucide-react';
import { mockSummaries, getUserReadingProgress } from '../data/mockData';
import { useBookmarks } from '../contexts/BookmarkContext';

// Get unique categories from mock data
const categories = ['All Categories', ...new Set(mockSummaries.map(book => book.category))];

const BookSummariesPage: React.FC = () => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');

  const handleBookmark = (e: React.MouseEvent, summary: typeof mockSummaries[0]) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookmarked(summary.id)) {
      removeBookmark(summary.id);
    } else {
      addBookmark({
        id: summary.id,
        title: summary.title,
        type: 'book',
        author: summary.author,
        category: summary.category,
        description: summary.description
      });
    }
  };

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    // First filter books based on search and category
    const filtered = mockSummaries.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort books
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.id - b.id;
        case 'popular':
          return (getUserReadingProgress(b.id) || 0) - (getUserReadingProgress(a.id) || 0);
        case 'readTime':
          return parseInt(a.readTime) - parseInt(b.readTime);
        default: // newest
          return b.id - a.id;
      }
    });

    // Mark first 3 books as free and rest as premium
    return sorted.map((book, index) => ({
      ...book,
      isFree: index < 3
    }));
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Book Summaries</h1>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#3a2819] text-white rounded-md pl-10 pr-4 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
              />
            </div>

            {/* Category Filter */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="popular">Sort by: Most Popular</option>
              <option value="readTime">Sort by: Read Time</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
            {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          </div>
        </div>
        
        {/* Book Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((summary) => {
            const progress = getUserReadingProgress(summary.id);
            const bookmarked = isBookmarked(summary.id);
            
            return (
              <Link
                to={summary.isFree ? `/book-reading/${summary.id}` : '/pricing'}
                key={summary.id}
                className={`bg-[#3a2819] rounded-lg overflow-hidden border transition-all duration-200 ${
                  summary.isFree ? 'border-[#7a4528] hover:border-green-500' : 'border-[#7a4528] hover:border-[#c9a52c]'
                }`}
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={summary.coverImage}
                    alt={summary.title}
                    className={`w-full h-full object-cover ${!summary.isFree ? 'filter brightness-50' : ''}`}
                  />
                  <div className="absolute top-0 right-0 p-2">
                    <button
                      onClick={(e) => handleBookmark(e, summary)}
                      className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      {bookmarked ? (
                        <BookmarkCheck size={20} className="text-[#c9a52c]" />
                      ) : (
                        <Bookmark size={20} className="text-white" />
                      )}
                    </button>
                  </div>
                  {!summary.isFree && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="text-center">
                        <Lock size={24} className="mx-auto mb-2 text-[#c9a52c]" />
                        <span className="px-3 py-1 rounded-full bg-[#c9a52c] text-black text-xs font-medium">
                          Premium Content
                        </span>
                      </div>
                    </div>
                  )}
                  {summary.isFree && (
                    <div className="absolute bottom-0 right-0 p-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/80 text-white text-xs font-medium">
                        Free
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg leading-tight">{summary.title}</h3>
                    {progress > 0 && summary.isFree && (
                      <div className="shrink-0 w-8 h-8 rounded-full bg-[#7a4528] flex items-center justify-center">
                        <span className="text-xs font-medium">{progress}%</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">by {summary.author}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-[#7a4528] text-gray-300">
                      {summary.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {summary.readTime} min read
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-300 line-clamp-2">
                    {summary.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Load More Button */}
        {filteredBooks.length > 0 && (
          <div className="text-center mt-12">
            <button className="secondary-button">Load More</button>
          </div>
        )}

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
