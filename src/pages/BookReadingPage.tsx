import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { getBookById } from '../lib/database';
import { useBookmarks } from '../contexts/BookmarkContext';
import type { Book } from '../types/database';

const BookReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'key-points' | 'chapters' | 'quotes'>('summary');

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBookmark = () => {
    if (!book) return;
    
    if (isBookmarked(book.id)) {
      removeBookmark(book.id);
    } else {
      addBookmark({
        id: book.id,
        title: book.title,
        type: 'book',
        author: book.author,
        category: book.category,
        description: book.description || undefined
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#3a2819] rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-[#3a2819] rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-4 bg-[#3a2819] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-red-500">Error Loading Book</h1>
          <p className="text-red-400">{error || 'Book not found'}</p>
        </div>
      </div>
    );
  }

  const content = book.content || {
    summary: 'Summary not available',
    keyPoints: [],
    chapters: [],
    quotes: []
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/book-summaries')}
            className="text-[#c9a52c] hover:text-[#e6b93d] transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{book.title}</h1>
            <p className="text-gray-400">by {book.author}</p>
          </div>
          <button 
            onClick={handleBookmark}
            className="bg-[#2d1e14] p-3 rounded-lg text-[#c9a52c] hover:bg-[#3a2819] transition-colors"
          >
            {isBookmarked(book.id) ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
          </button>
        </div>

        {/* Cover Image */}
        {book.cover_image && (
          <div className="mb-8">
            <img 
              src={book.cover_image} 
              alt={book.title} 
              className="w-full h-64 md:h-96 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Reading Time */}
        <div className="bg-[#2d1e14] p-4 rounded-lg mb-8">
          <div className="text-sm text-gray-400 mb-1">Estimated Reading Time</div>
          <div className="text-lg font-medium">{book.read_time}</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-8">
          {[
            { id: 'summary', label: 'Summary' },
            { id: 'key-points', label: 'Key Points' },
            { id: 'chapters', label: 'Chapters' },
            { id: 'quotes', label: 'Quotes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#c9a52c] text-black'
                  : 'bg-[#2d1e14] text-gray-300 hover:bg-[#3a2819]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {activeTab === 'summary' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Book Summary</h2>
              <p className="text-gray-300 whitespace-pre-line">{content.summary}</p>
            </div>
          )}

          {activeTab === 'key-points' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Key Points</h2>
              {content.keyPoints?.length > 0 ? (
                <ul className="space-y-4">
                  {content.keyPoints.map((point, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-[#c9a52c] font-bold">•</span>
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No key points available</p>
              )}
            </div>
          )}

          {activeTab === 'chapters' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Chapter Summaries</h2>
              {content.chapters?.length > 0 ? (
                <div className="space-y-8">
                  {content.chapters.map((chapter, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-bold mb-2 text-[#c9a52c]">
                        {chapter.title}
                      </h3>
                      <p className="text-gray-300 whitespace-pre-line">
                        {chapter.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No chapter summaries available</p>
              )}
            </div>
          )}

          {activeTab === 'quotes' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Notable Quotes</h2>
              {content.quotes?.length > 0 ? (
                <div className="space-y-6">
                  {content.quotes.map((quote, index) => (
                    <blockquote 
                      key={index}
                      className="border-l-4 border-[#c9a52c] pl-4 py-1"
                    >
                      <p className="text-gray-300 italic">{quote}</p>
                    </blockquote>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No quotes available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookReadingPage; 