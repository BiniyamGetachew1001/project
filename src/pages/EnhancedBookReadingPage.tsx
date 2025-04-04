import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sun,
  Moon,
  PenLine,
  Save,
  Type,
  ChevronUp,
  ChevronDown,
  Maximize,
  Minimize,
  Clock,
  BookOpen,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarkContext';

// Default book content that will always be displayed
const defaultBook = {
  id: 'default-book',
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
      'Build-Measure-Learn: The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere.',
      'Validated Learning: Startups exist to learn how to build a sustainable business. This learning can be validated scientifically by running frequent experiments.',
      'Innovation Accounting: To improve entrepreneurial outcomes and hold innovators accountable, focus on how to measure progress, how to set up milestones, and how to prioritize work.',
      'Minimum Viable Product (MVP): The version of a new product that allows a team to collect the maximum amount of validated learning about customers with the least effort.',
      'Pivot: A structured course correction designed to test a new fundamental hypothesis about the product, strategy, and engine of growth.'
    ],
    chapters: [
      {
        title: 'Step 1: Start with Lean Principles',
        content: 'The Lean Startup method is based on lean manufacturing principles, focusing on eliminating waste and optimizing efficiency. It applies these principles to the context of entrepreneurship, emphasizing validated learning, scientific experimentation, and iterative product releases.'
      },
      {
        title: 'Step 2: Define Your Startup',
        content: 'A startup is a human institution designed to create a new product or service under conditions of extreme uncertainty. The goal of a startup is to figure out the right thing to build—the thing customers want and will pay for—as quickly as possible.'
      },
      {
        title: 'Step 3: Implement the Build-Measure-Learn Loop',
        content: 'The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere. All successful startup processes should be geared to accelerate that feedback loop.'
      }
    ],
    quotes: [
      'The only way to win is to learn faster than anyone else.',
      'Success is not delivering a feature; success is learning how to solve the customer\'s problem.',
      'As you consider building your own minimum viable product, let this simple rule suffice: remove any feature, process, or effort that does not contribute directly to the learning you seek.'
    ]
  }
};

const EnhancedBookReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'summary' | 'key-points' | 'actionable-steps' | 'quotes'>('summary');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [theme, setTheme] = useState<'dark'>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [notes, setNotes] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Always use the default book
  const book = defaultBook;

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPosition = element.scrollTop;
        const progress = Math.min(Math.round((scrollPosition / totalHeight) * 100), 100);
        setReadingProgress(progress || 0);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);



  // Handle bookmark toggle
  const handleBookmark = () => {
    if (isBookmarked(book.id)) {
      removeBookmark(book.id);
    } else {
      addBookmark({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        cover_image: book.cover_image,
        progress: readingProgress
      });
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };



  // Handle font size
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-base';
      case 'large': return 'text-xl';
      default: return 'text-lg';
    }
  };

  // Get content based on active tab
  const getContent = () => {
    switch (activeTab) {
      case 'summary':
        return book.content.summary;
      case 'key-points':
        return book.content.keyPoints;
      case 'actionable-steps':
        return book.content.chapters;
      case 'quotes':
        return book.content.quotes;
      default:
        return book.content.summary;
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-[#1a1310] text-white">
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black/80 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`h-full w-4/5 max-w-xs bg-[#2d1e14] transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-[#3a2819]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#c9a52c]">Reading Options</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-[#3a2819]"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm uppercase text-gray-400 mb-2">Font Size</h3>
              <div className="flex bg-[#3a2819] rounded-full p-1">
                <button
                  onClick={() => setFontSize('small')}
                  className={`flex-1 py-2 rounded-full ${fontSize === 'small' ? 'bg-[#1a1310] text-[#c9a52c]' : 'text-gray-300'}`}
                >
                  Small
                </button>
                <button
                  onClick={() => setFontSize('medium')}
                  className={`flex-1 py-2 rounded-full ${fontSize === 'medium' ? 'bg-[#1a1310] text-[#c9a52c]' : 'text-gray-300'}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`flex-1 py-2 rounded-full ${fontSize === 'large' ? 'bg-[#1a1310] text-[#c9a52c]' : 'text-gray-300'}`}
                >
                  Large
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase text-gray-400 mb-2">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#3a2819]"
                >
                  <span>Add Notes</span>
                  <PenLine size={20} />
                </button>
                <button
                  onClick={handleBookmark}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#3a2819]"
                >
                  <span>{isBookmarked(book.id) ? 'Remove Bookmark' : 'Add Bookmark'}</span>
                  {isBookmarked(book.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-[#2d1e14] text-[#c9a52c]"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full ${isBookmarked(book.id) ? 'text-[#c9a52c]' : 'text-gray-400'} hover:bg-[#2d1e14]`}
                aria-label={isBookmarked(book.id) ? 'Remove bookmark' : 'Add bookmark'}
                title={isBookmarked(book.id) ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked(book.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-gray-400 hover:bg-[#2d1e14]"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-full text-gray-400 hover:bg-[#2d1e14]"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{book.title}</h1>
              <p className="text-gray-400 text-lg">by {book.author}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={16} />
              <span>{book.read_time}</span>
              <span className="mx-2">•</span>
              <BookOpen size={16} />
              <span>{book.category}</span>
            </div>
          </div>
        </header>

        {/* Reading Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400">Reading Progress</span>
            <span className="text-sm font-medium text-[#c9a52c]">{readingProgress}%</span>
          </div>
          <div className="h-1 w-full bg-[#2d1e14] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a52c] transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-6 border-b border-[#2d1e14]">
          <div className="flex overflow-x-auto hide-scrollbar">
            {[
              { id: 'summary', label: 'Summary' },
              { id: 'key-points', label: 'Key Points' },
              { id: 'actionable-steps', label: 'Actionable Steps' },
              { id: 'quotes', label: 'Quotes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#c9a52c] text-[#c9a52c]'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reading Controls - Desktop */}
        <div className="hidden md:flex items-center justify-between mb-6 p-3 rounded-lg bg-[#2d1e14]">
          <div className="flex items-center gap-4">
            <div className="flex bg-[#1a1310] rounded-full p-1">
              <button
                onClick={() => setFontSize('small')}
                className={`px-3 py-1 rounded-full text-sm ${fontSize === 'small' ? 'bg-[#3a2819] text-[#c9a52c]' : 'text-gray-400'}`}
              >
                Small
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`px-3 py-1 rounded-full text-sm ${fontSize === 'medium' ? 'bg-[#3a2819] text-[#c9a52c]' : 'text-gray-400'}`}
              >
                Medium
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-3 py-1 rounded-full text-sm ${fontSize === 'large' ? 'bg-[#3a2819] text-[#c9a52c]' : 'text-gray-400'}`}
              >
                Large
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsAddingNote(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3a2819] text-white hover:bg-[#4a2e1c] transition-colors"
          >
            <PenLine size={16} />
            <span>Add Notes</span>
          </button>
        </div>

        {/* Main Content */}
        <div
          ref={contentRef}
          className={`prose max-w-none prose-invert ${getFontSizeClass()} overflow-y-auto max-h-[60vh] mb-8 reading-content`}
          style={{ scrollBehavior: 'smooth' }}
        >
          {activeTab === 'summary' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#c9a52c]">Book Summary</h2>
              <p className="whitespace-pre-line">{content}</p>
            </div>
          )}

          {activeTab === 'key-points' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#c9a52c]">Key Points</h2>
              <ul className="space-y-4">
                {Array.isArray(content) && content.map((point, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-[#c9a52c] font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'actionable-steps' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#c9a52c]">Actionable Steps</h2>
              {Array.isArray(content) && content.length > 0 ? (
                <div className="space-y-8">
                  {content.map((step, index) => (
                    <div key={index} className="p-4 rounded-lg bg-[#2d1e14]">
                      <h3 className="text-lg font-bold mb-2 text-[#c9a52c]">
                        {step.title}
                      </h3>
                      <p className="whitespace-pre-line">
                        {step.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No actionable steps available</p>
              )}
            </div>
          )}

          {activeTab === 'quotes' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#c9a52c]">Notable Quotes</h2>
              {Array.isArray(content) && content.length > 0 ? (
                <div className="space-y-4">
                  {content.map((quote, index) => (
                    <blockquote key={index} className="border-l-4 border-[#c9a52c] pl-4 py-2 italic">
                      "{quote}"
                    </blockquote>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No quotes available</p>
              )}
            </div>
          )}
        </div>

        {/* Book Navigation */}
        <div className="flex items-center justify-between py-4 border-t border-[#2d1e14]">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d1e14] text-gray-300 hover:bg-[#3a2819] transition-colors"
            disabled={true} // Would be dynamic in a real implementation
          >
            <ChevronLeft size={16} />
            <span>Previous Book</span>
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d1e14] text-gray-300 hover:bg-[#3a2819] transition-colors"
            disabled={true} // Would be dynamic in a real implementation
          >
            <span>Next Book</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Notes Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="max-w-lg w-full p-6 rounded-xl bg-[#2d1e14]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add Notes for {book.title}</h2>
              <button
                onClick={() => setIsAddingNote(false)}
                className="p-2 rounded-full hover:bg-[#3a2819]"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              className="w-full h-40 p-3 rounded-lg mb-4 bg-[#1a1310] text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddingNote(false)}
                className="px-4 py-2 rounded-lg bg-[#3a2819] text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save notes logic would go here
                  setIsAddingNote(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#c9a52c] text-black hover:bg-[#d9b53c] transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBookReadingPage;
