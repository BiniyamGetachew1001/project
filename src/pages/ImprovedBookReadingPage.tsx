import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share2,
  PenLine,
  Maximize,
  Minimize,
  Clock,
  BookOpen,
  X,
  Type, // Icon for font size
  Download,
  Printer,
} from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarkContext';

// Updated mock book data
const defaultBook = {
  id: 'atomic-habits',
  title: 'Atomic Habits',
  author: 'James Clear',
  category: 'Self-Help',
  is_premium: false,
  description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
  read_time: '18 min',
  cover_image: 'https://m.media-amazon.com/images/I/51-nXsSRfZL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg', // Example image URL
  content: {
    summary: 'Atomic Habits offers a practical framework for improving every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    keyPoints: [
      'Habits are the compound interest of self-improvement. Small habits make a big difference over time.',
      'Forget about goals, focus on systems instead. Goals are about the results you want to achieve. Systems are about the processes that lead to those results.',
      'The Four Laws of Behavior Change are a simple set of rules we can use to build better habits: Make it obvious, Make it attractive, Make it easy, Make it satisfying.',
      'To break a bad habit, invert the Four Laws: Make it invisible, Make it unattractive, Make it difficult, Make it unsatisfying.',
      'Environment is the invisible hand that shapes human behavior. Optimize your environment for success.',
      'Identity change is the North Star of habit change. The goal is not to read a book, but to become a reader.'
    ],
    chapters: [
      {
        title: 'The Fundamentals: Why Tiny Changes Make a Big Difference',
        content: 'Focuses on the surprising power of small habits and the concept of aggregation of marginal gains. Explains why systems are more important than goals.'
      },
      {
        title: 'The 1st Law: Make It Obvious',
        content: 'Discusses how to make cues for good habits obvious and visible. Introduces strategies like the Habits Scorecard and implementation intentions (I will [BEHAVIOR] at [TIME] in [LOCATION]).'
      },
      {
        title: 'The 2nd Law: Make It Attractive',
        content: 'Explores how dopamine drives habits and how to use temptation bundling (pairing an action you want to do with an action you need to do) to make habits more attractive.'
      },
      {
        title: 'The 3rd Law: Make It Easy',
        content: 'Covers the law of least effort and how to reduce friction associated with good habits. Introduces the Two-Minute Rule (start a new habit by doing it for less than two minutes).'
      },
      {
        title: 'The 4th Law: Make It Satisfying',
        content: 'Explains the importance of immediate reward for habit reinforcement. Discusses how to use habit trackers and never miss twice.'
      }
    ],
    quotes: [
      'You do not rise to the level of your goals. You fall to the level of your systems.',
      'Every action you take is a vote for the type of person you wish to become.',
      'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.',
      'Success is the product of daily habits—not once-in-a-lifetime transformations.'
    ]
  }
};

const ImprovedBookReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'summary' | 'key-points' | 'actionable-steps' | 'quotes'>('summary');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [notes, setNotes] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  // Removed isMobileMenuOpen state
  const [showShareOptions, setShowShareOptions] = useState(false);
  // Removed likeCount and isLiked state
  const contentRef = useRef<HTMLDivElement>(null);
  const [showFontOptions, setShowFontOptions] = useState(false); // State for font size popover

  // Always use the default book
  const book = defaultBook;

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPosition = element.scrollTop;
        // Ensure totalHeight is not zero to avoid division by zero
        const progress = totalHeight > 0 ? Math.min(Math.round((scrollPosition / totalHeight) * 100), 100) : 0;
        setReadingProgress(progress || 0);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
    }

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle bookmark toggle
  const handleBookmark = () => {
    const bookData = {
      id: book.id,
      title: book.title,
      type: 'book', // Ensure type is 'book'
      author: book.author,
      category: book.category,
      cover_image: book.cover_image,
      description: book.description, // Add description
      progress: readingProgress // Add progress if needed
    };

    if (isBookmarked(book.id)) {
      removeBookmark(book.id);
    } else {
      addBookmark(bookData);
    }
  };


  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    // State update is handled by the 'fullscreenchange' event listener
  };


  // Handle font size
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm md:text-base'; // Adjusted sizes
      case 'large': return 'text-lg md:text-xl'; // Adjusted sizes
      default: return 'text-base md:text-lg'; // Adjusted sizes
    }
  };

  // Removed handleLike function

  // Get content based on active tab
  const getContent = () => {
    switch (activeTab) {
      case 'summary':
        return book.content.summary;
      case 'key-points':
        return book.content.keyPoints;
      case 'actionable-steps': // Changed from 'chapters' to match tab ID
        return book.content.chapters;
      case 'quotes':
        return book.content.quotes;
      default:
        return book.content.summary;
    }
  };

  const content = getContent();

  return (
    <div className={`min-h-screen bg-[#1a1310] text-white ${isFullscreen ? 'pb-0' : 'pb-24'}`}> {/* Add padding-bottom when toolbar is visible */}
      {/* Removed Mobile Menu */}

      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full p-6 rounded-xl bg-[#2d1e14]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Share this book</h2>
              <button
                onClick={() => setShowShareOptions(false)}
                className="p-2 rounded-full hover:bg-[#3a2819]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Simplified Share Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <button className="flex flex-col items-center justify-center p-4 bg-[#3a2819] rounded-lg hover:bg-[#4a2e1c] transition-colors">
                 <Download size={24} className="mb-2 text-[#c9a52c]" />
                 <span>Download PDF</span>
               </button>
               <button className="flex flex-col items-center justify-center p-4 bg-[#3a2819] rounded-lg hover:bg-[#4a2e1c] transition-colors">
                 <Printer size={24} className="mb-2 text-[#c9a52c]" />
                 <span>Print</span>
               </button>
               {/* Add other share options like Facebook, Twitter if needed */}
            </div>


            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Share Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={`https://hara.com/books/${book.id}`} // Replace with actual URL if dynamic
                  readOnly
                  className="flex-1 bg-[#1a1310] rounded-l-lg px-4 py-2 focus:outline-none text-white" // Ensure text is visible
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://hara.com/books/${book.id}`); // Replace with actual URL
                    alert('Link copied to clipboard!');
                  }}
                  className="bg-[#c9a52c] text-black px-4 py-2 rounded-r-lg hover:bg-[#d9b53c] transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Simplified Header */}
        <header className="mb-6 flex items-center gap-4">
           <button
             onClick={() => navigate(-1)} // Or navigate('/book-summaries')
             className="p-2 rounded-full hover:bg-[#2d1e14] text-[#c9a52c]"
             aria-label="Go back"
           >
             <ArrowLeft size={24} />
           </button>
           <div className="flex-grow">
             <h1 className="text-xl md:text-2xl font-bold text-white truncate">{book.title}</h1>
             <p className="text-sm text-gray-400">by {book.author}</p>
           </div>
           {/* Moved controls to the bottom toolbar */}
        </header>


        {/* Reading Progress */}
        {!isFullscreen && ( // Hide progress in fullscreen
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
        )}

        {/* Content Tabs */}
        {!isFullscreen && ( // Hide tabs in fullscreen
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
        )}

        {/* Removed Desktop Reading Controls Section */}

        {/* Main Content */}
        <div
          ref={contentRef}
          className={`prose max-w-none prose-invert ${getFontSizeClass()} ${isFullscreen ? 'h-screen overflow-y-auto' : 'overflow-y-auto max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-300px)]'} mb-8 reading-content`} // Adjust max-height based on fullscreen
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
                    <span className="text-[#c9a52c] font-bold mt-1">•</span>
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

        {/* Removed Book Navigation */}
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
              className="w-full h-40 p-3 rounded-lg mb-4 bg-[#1a1310] text-white focus:outline-none focus:ring-2 focus:ring-[#c9a52c]" // Added focus style
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddingNote(false)}
                className="px-4 py-2 rounded-lg bg-[#3a2819] text-white hover:bg-[#4a2e1c]" // Adjusted hover
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save notes logic would go here (e.g., save to localStorage or API)
                  console.log("Saving notes:", notes);
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

      {/* Reading Toolbar */}
      {!isFullscreen && ( // Hide toolbar in fullscreen
        <div className="fixed bottom-0 left-0 right-0 bg-[#2d1e14]/90 backdrop-blur-md border-t border-[#4a2e1c]/50 z-40">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
            {/* Left side: Font Size */}
            <div className="relative">
              <button
                onClick={() => setShowFontOptions(!showFontOptions)}
                className="toolbar-button p-2 rounded-full hover:bg-[#3a2819] text-gray-300 hover:text-[#c9a52c]"
                aria-label="Adjust font size"
                title="Adjust font size"
              >
                <Type size={20} />
              </button>
              {/* Font Size Popover */}
              {showFontOptions && (
                <div className="absolute bottom-full left-0 mb-2 w-32 bg-[#3a2819] rounded-lg shadow-lg p-2 border border-[#4a2e1c]/50">
                  <button onClick={() => { setFontSize('small'); setShowFontOptions(false); }} className={`block w-full text-left px-3 py-1 rounded ${fontSize === 'small' ? 'bg-[#1a1310] text-[#c9a52c]' : 'hover:bg-[#2d1e14]'}`}>Small</button>
                  <button onClick={() => { setFontSize('medium'); setShowFontOptions(false); }} className={`block w-full text-left px-3 py-1 rounded ${fontSize === 'medium' ? 'bg-[#1a1310] text-[#c9a52c]' : 'hover:bg-[#2d1e14]'}`}>Medium</button>
                  <button onClick={() => { setFontSize('large'); setShowFontOptions(false); }} className={`block w-full text-left px-3 py-1 rounded ${fontSize === 'large' ? 'bg-[#1a1310] text-[#c9a52c]' : 'hover:bg-[#2d1e14]'}`}>Large</button>
                </div>
              )}
            </div>

            {/* Center: Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBookmark}
                className={`toolbar-button p-2 rounded-full hover:bg-[#3a2819] ${isBookmarked(book.id) ? 'text-[#c9a52c]' : 'text-gray-300 hover:text-[#c9a52c]'}`}
                aria-label={isBookmarked(book.id) ? 'Remove bookmark' : 'Add bookmark'}
                title={isBookmarked(book.id) ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked(book.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
              <button
                onClick={() => setIsAddingNote(true)}
                className="toolbar-button p-2 rounded-full hover:bg-[#3a2819] text-gray-300 hover:text-[#c9a52c]"
                aria-label="Add notes"
                title="Add notes"
              >
                <PenLine size={20} />
              </button>
              <button
                onClick={() => setShowShareOptions(true)}
                className="toolbar-button p-2 rounded-full hover:bg-[#3a2819] text-gray-300 hover:text-[#c9a52c]"
                aria-label="Share"
                title="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Right side: Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="toolbar-button p-2 rounded-full hover:bg-[#3a2819] text-gray-300 hover:text-[#c9a52c]"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedBookReadingPage;
