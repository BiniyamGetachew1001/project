import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Volume2, VolumeX, Share2, Sun, Moon, PenLine, Save, Type, ChevronUp, ChevronDown, Maximize, Minimize } from 'lucide-react';
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
  }
};

const BookReadingPageNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'summary' | 'key-points' | 'chapters' | 'quotes'>('summary');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [notes, setNotes] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Always use the default book
  const book = defaultBook;

  // Log the book ID for debugging
  useEffect(() => {
    console.log('BookReadingPageNew - Book ID from URL:', id);
    console.log('Using default book:', defaultBook.title);
  }, [id]);

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

  // Handle fullscreen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // Text-to-speech functionality
  const toggleSpeech = () => {
    if (isSpeaking) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    const content = book.content;
    const text = activeTab === 'summary' ? content.summary :
      activeTab === 'key-points' ? content.keyPoints.join('. ') :
      activeTab === 'chapters' ? content.chapters.map(c => `${c.title}. ${c.content}`).join('. ') :
      content.quotes.join('. ');

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower than default
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Share functionality
  const shareContent = async () => {
    const shareData = {
      title: book.title,
      text: `Check out this summary of "${book.title}" by ${book.author}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Change font size
  const changeFontSize = (direction: 'increase' | 'decrease') => {
    setFontSize(prev => {
      if (direction === 'increase' && prev !== 'large') {
        return prev === 'small' ? 'medium' : 'large';
      } else if (direction === 'decrease' && prev !== 'small') {
        return prev === 'large' ? 'medium' : 'small';
      }
      return prev;
    });
  };

  const handleBookmark = () => {
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

  // Get font size class
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      default: return 'text-base';
    }
  };

  // Handle note saving
  const saveNote = () => {
    // In a real app, you would save this to a database
    console.log('Saving note:', notes);
    setIsAddingNote(false);
    alert('Note saved successfully!');
  };

  const content = book.content;

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-[#1a1310] text-white'}`}>
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="text-[#c9a52c] hover:text-[#e6b93d] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-[#2d1e14] text-[#c9a52c]'} hover:bg-[#3a2819] hover:text-[#c9a52c] transition-colors`}
              aria-label={isBookmarked(book.id) ? 'Remove bookmark' : 'Add bookmark'}
              title={isBookmarked(book.id) ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked(book.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{book.title}</h1>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>by {book.author}</p>
          </div>
          <button
            onClick={toggleSpeech}
            className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-[#2d1e14] text-[#c9a52c]'} hover:bg-[#3a2819] hover:text-[#c9a52c] transition-colors`}
            aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
            title={isSpeaking ? 'Stop reading' : 'Read aloud'}
          >
            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Reading Controls */}
        <div className={`flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg mb-6 ${theme === 'light' ? 'bg-gray-200' : 'bg-[#2d1e14]'}`}>
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c9a52c]"
                style={{ width: `${readingProgress}%` }}
              ></div>
            </div>
            <span className="text-sm">{readingProgress}%</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeFontSize('decrease')}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#3a2819]'} transition-colors`}
              aria-label="Decrease font size"
              title="Decrease font size"
              disabled={fontSize === 'small'}
            >
              <Type size={16} className={fontSize === 'small' ? 'opacity-50' : ''} />
            </button>
            <button
              onClick={() => changeFontSize('increase')}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#3a2819]'} transition-colors`}
              aria-label="Increase font size"
              title="Increase font size"
              disabled={fontSize === 'large'}
            >
              <Type size={20} className={fontSize === 'large' ? 'opacity-50' : ''} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#3a2819]'} transition-colors`}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setIsAddingNote(true)}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#3a2819]'} transition-colors`}
              aria-label="Add note"
              title="Add note"
            >
              <PenLine size={18} />
            </button>
            <button
              onClick={shareContent}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#3a2819]'} transition-colors`}
              aria-label="Share"
              title="Share"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#3a2819]'} transition-colors`}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
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
        <div
          ref={contentRef}
          className={`prose max-w-none ${theme === 'light' ? 'prose-slate' : 'prose-invert'} ${getFontSizeClass()} overflow-y-auto max-h-[60vh]`}
          style={{ scrollBehavior: 'smooth' }}
        >
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

        {/* Notes Modal */}
        {isAddingNote && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className={`max-w-lg w-full p-6 rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-[#2d1e14]'}`}>
              <h2 className="text-xl font-bold mb-4">Add Notes for {book.title}</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here..."
                className={`w-full h-40 p-3 rounded-lg mb-4 ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-[#1a1310] text-white'}`}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddingNote(false)}
                  className={`px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-[#3a2819] text-white'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveNote}
                  className="px-4 py-2 bg-[#c9a52c] text-black rounded-lg flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReadingPageNew;
