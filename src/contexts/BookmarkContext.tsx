import React, { createContext, useContext, useState, useEffect } from 'react';

export type BookmarkItem = {
  id: string;
  title: string;
  type: 'book' | 'business-plan';
  author?: string;
  category?: string;
  description?: string;
};

type BookmarkContextType = {
  bookmarks: BookmarkItem[];
  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    // Load from localStorage
    const savedBookmarks = localStorage.getItem('bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  useEffect(() => {
    // Save to localStorage when bookmarks change
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (item: BookmarkItem) => {
    setBookmarks(prev => [...prev, item]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(item => item.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some(item => item.id === id);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export default BookmarkProvider;
