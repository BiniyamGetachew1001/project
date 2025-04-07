import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Lock, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { getBooks } from '../lib/database';
import { useBookmarks } from '../contexts/BookmarkContext';
import type { Book } from '../types/database';

// Mock books data for demonstration
const mockBooks: Book[] = [
  {
    id: 'book-1',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    is_premium: false,
    description: 'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses',
    read_time: '15 min',
    cover_image: 'https://m.media-amazon.com/images/I/51T-sMqSMiL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    content: {
      summary: 'The Lean Startup provides a scientific approach to creating and managing startups and getting a desired product to customers\' hands faster. The Lean Startup method teaches you how to drive a startup—how to steer, when to turn, and when to persevere—and grow a business with maximum acceleration.',
      keyPoints: [
        'Build-Measure-Learn feedback loop is the core of the Lean Startup methodology',
        'Validated learning is the process of demonstrating empirically that a team has discovered valuable truths about a startup\'s present and future business prospects',
        'Minimum Viable Product (MVP) helps entrepreneurs start the process of learning as quickly as possible',
        'Innovation accounting allows startups to objectively prove they are learning how to grow a sustainable business'
      ],
      chapters: [
        {
          title: 'Chapter 1: Start',
          content: 'The Lean Startup method is based on lean manufacturing principles, agile development methodologies, and the scientific method. It aims to eliminate waste and increase value-creating practices during the product development phase.'
        },
        {
          title: 'Chapter 2: Define',
          content: 'A startup is a human institution designed to create a new product or service under conditions of extreme uncertainty. The goal of a startup is to figure out the right thing to build—the thing customers want and will pay for—as quickly as possible.'
        },
        {
          title: 'Chapter 3: Learn',
          content: 'The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere. All successful startup processes should be geared to accelerate that feedback loop.'
        }
      ],
      quotes: [
        'The only way to win is to learn faster than anyone else.',
        'Success is not delivering a feature; success is learning how to solve the customer\'s problem.',
        'As you consider building your own minimum viable product, let this simple rule suffice: remove any feature, process, or effort that does not contribute directly to the learning you seek.'
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'book-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    is_premium: false,
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    read_time: '12 min',
    cover_image: 'https://m.media-amazon.com/images/I/51-nXsSRfZL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    content: {
      summary: 'Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
      keyPoints: [
        'Small habits make a big difference over time',
        'Focus on your identity, not just your goals',
        'The four laws of behavior change: make it obvious, make it attractive, make it easy, make it satisfying',
        'Environment design is more important than motivation'
      ],
      chapters: [
        {
          title: 'Chapter 1: The Surprising Power of Atomic Habits',
          content: 'Habits are the compound interest of self-improvement. Getting 1 percent better every day counts for a lot in the long-run. Small changes often appear to make no difference until you cross a critical threshold.'
        },
        {
          title: 'Chapter 2: How Your Habits Shape Your Identity',
          content: 'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become. Your identity emerges out of your habits.'
        },
        {
          title: 'Chapter 3: How to Build Better Habits',
          content: 'The process of building a habit can be divided into four simple steps: cue, craving, response, and reward. Understanding these steps is the key to understanding how habits work.'
        }
      ],
      quotes: [
        'You do not rise to the level of your goals. You fall to the level of your systems.',
        'Every action you take is a vote for the type of person you wish to become.',
        'Habits are the compound interest of self-improvement.'
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'book-3',
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business',
    is_premium: false,
    description: 'Notes on Startups, or How to Build the Future',
    read_time: '10 min',
    cover_image: 'https://m.media-amazon.com/images/I/41puRJbtwkL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    content: {
      summary: 'Zero to One presents at once an optimistic view of the future of progress in America and a new way of thinking about innovation: it starts by learning to ask the questions that lead you to find value in unexpected places.',
      keyPoints: [
        'Creating something new is going from 0 to 1, while copying things that work is going from 1 to n',
        'The most valuable businesses solve unique problems',
        'Competition is overrated; monopolies drive progress',
        'Successful people find value in unexpected places'
      ],
      chapters: [
        {
          title: 'Chapter 1: The Challenge of the Future',
          content: 'Progress can take two forms: horizontal progress (copying things that work) or vertical progress (doing new things). Horizontal progress is easy but vertical progress is difficult.'
        },
        {
          title: 'Chapter 2: Party Like It\'s 1999',
          content: 'The dot-com crash taught entrepreneurs the wrong lessons. Instead of learning to be bold and have vision, they learned to be unoriginal and incremental.'
        },
        {
          title: 'Chapter 3: All Happy Companies Are Different',
          content: 'Monopolies drive progress because they can think long-term and invest in innovation. Competition, on the other hand, leads to commoditization and lack of profits.'
        }
      ],
      quotes: [
        'What important truth do very few people agree with you on?',
        'The most contrarian thing of all is not to oppose the crowd but to think for yourself.',
        'Monopoly is the condition of every successful business.'
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const BookSummariesPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('BookSummariesPage - Starting to fetch books...');
        // Try to fetch books from the database
        try {
          console.log('Attempting to fetch books from database...');
          const data = await getBooks();
          console.log('Database response:', data);
          if (data && data.length > 0) {
            console.log('Using books from database:', data.length, 'books found');
            setBooks(data);
            return;
          } else {
            console.log('No books found in database');
          }
        } catch (dbError) {
          console.warn('Error fetching books from database:', dbError);
          console.error('Error details:', JSON.stringify(dbError, null, 2));
        }

        // If database fetch fails or returns no books, use mock data
        console.log('Using mock books data:', mockBooks.length, 'mock books available');
        setBooks(mockBooks);
      } catch (err) {
        console.error('Unexpected error in fetchBooks:', err);
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
            <div key={book.id} className="relative">
              <Link
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
              {/* Bookmark Button */}
              <button
                onClick={() => {
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
                }}
                className="absolute top-4 left-4 bg-[#2d1e14] p-2 rounded-full hover:bg-[#3a2819] transition-colors z-10"
                aria-label={isBookmarked(book.id) ? "Remove from bookmarks" : "Add to bookmarks"}
              >
                {isBookmarked(book.id) ? (
                  <BookmarkCheck size={18} className="text-[#c9a52c]" />
                ) : (
                  <Bookmark size={18} className="text-white" />
                )}
              </button>
            </div>
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
