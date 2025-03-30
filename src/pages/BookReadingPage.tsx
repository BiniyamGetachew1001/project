import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Search } from 'lucide-react';
import { mockSummaries, getUserReadingProgress, setUserReadingProgress } from '../data/mockData';
import { useBookmarks } from '../contexts/BookmarkContext';

const BookReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');

  // Find the book from mock data
  const book = mockSummaries.find(book => book.id === Number(id));

  if (!book) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Book not found</p>
      </div>
    );
  }

  const progress = getUserReadingProgress(book.id);
  const bookmarked = isBookmarked(book.id);

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(book.id);
    } else {
      addBookmark({
        id: book.id,
        title: book.title,
        type: 'book',
        author: book.author,
        category: book.category,
        description: book.description
      });
    }
  };

  // Update progress as user scrolls
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setUserReadingProgress(book.id, Math.round(scrollPercentage));
  };

  return (
    <div className="min-h-screen bg-[#2d1e14]">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-[#2d1e14] border-b border-[#7a4528]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/book-summaries" className="text-gray-400 hover:text-white">
                <ArrowLeft size={20} />
              </Link>
              <span className="text-gray-400">Back to Book Summaries</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in summary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-[#3a2819] text-white rounded-md pl-10 pr-4 py-1.5 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                />
              </div>
              <button
                onClick={handleBookmark}
                className="p-2 rounded-full hover:bg-[#3a2819] transition-colors"
              >
                <Bookmark
                  size={20}
                  className={bookmarked ? 'text-[#c9a52c]' : 'text-gray-400'}
                  fill={bookmarked ? '#c9a52c' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="sticky top-[57px] z-10 h-1 bg-[#3a2819]">
        <div
          className="h-full bg-[#c9a52c] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div 
        className="max-w-3xl mx-auto px-4 py-8"
        onScroll={handleScroll}
      >
        {/* Book Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>{book.category}</span>
            <span>•</span>
            <span>{book.readTime}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-400">by {book.author}</p>
        </div>

        {/* Summary Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-300 leading-relaxed">{book.content?.summary}</p>
        </div>

        {/* Key Points Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Key Points</h2>
          <ul className="space-y-4">
            {book.content?.keyPoints.map((point, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3a2819] text-[#c9a52c] flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <p className="text-gray-300 leading-relaxed">{point}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Chapters Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Chapters</h2>
          <div className="space-y-6">
            {book.content?.chapters.map((chapter, index) => (
              <div key={index} className="bg-[#3a2819] rounded-lg p-4">
                <h3 className="font-semibold mb-2">{chapter.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{chapter.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notable Quotes Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Notable Quotes</h2>
          <div className="space-y-4">
            {book.content?.quotes.map((quote, index) => (
              <div key={index} className="border-l-2 border-[#c9a52c] pl-4">
                <p className="text-gray-300 italic">"{quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReadingPage; 