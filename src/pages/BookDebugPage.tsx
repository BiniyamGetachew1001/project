import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Book } from '../types/database';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const BookDebugPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*');
        
        if (error) throw error;
        
        setBooks(data || []);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Function to add a test book
  const addTestBook = async () => {
    try {
      setLoading(true);
      
      const testBook = {
        title: 'Test Book',
        author: 'Test Author',
        category: 'Test',
        is_premium: false,
        description: 'This is a test book for debugging purposes',
        read_time: '5 min',
        cover_image: '',
        content: {
          summary: 'This is a test summary.',
          keyPoints: ['Test point 1', 'Test point 2'],
          chapters: [{ title: 'Test Chapter', content: 'Test content' }],
          quotes: ['Test quote']
        }
      };
      
      const { data, error } = await supabase
        .from('books')
        .insert([testBook])
        .select();
      
      if (error) throw error;
      
      alert(`Test book added with ID: ${data[0].id}`);
      
      // Refresh the book list
      const { data: updatedBooks, error: fetchError } = await supabase
        .from('books')
        .select('*');
      
      if (fetchError) throw fetchError;
      
      setBooks(updatedBooks || []);
    } catch (err) {
      console.error('Error adding test book:', err);
      setError(err instanceof Error ? err.message : 'Failed to add test book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-[#c9a52c] hover:text-[#e6b93d] transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Book Debug Page</h1>
        
        <div className="glass-card p-6 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Books in Database</h2>
            <button 
              onClick={addTestBook}
              disabled={loading}
              className="px-4 py-2 bg-[#c9a52c] text-black rounded-lg hover:bg-[#e6b93d] transition-colors"
            >
              Add Test Book
            </button>
          </div>
          
          {loading ? (
            <p>Loading books...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : books.length === 0 ? (
            <p>No books found in the database.</p>
          ) : (
            <div className="space-y-4">
              {books.map(book => (
                <div key={book.id} className="bg-[#2d1e14] p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{book.title}</h3>
                      <p className="text-sm text-gray-400">by {book.author}</p>
                    </div>
                    <Link 
                      to={`/books/${book.id}`}
                      className="flex items-center gap-1 text-[#c9a52c] hover:text-[#e6b93d] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>View</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  
                  <div className="mt-2 p-2 bg-[#1a1310] rounded text-xs font-mono overflow-x-auto">
                    <p>ID: {book.id}</p>
                    <p>Created: {new Date(book.created_at).toLocaleString()}</p>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a 
                      href={`/books/${book.id}`}
                      className="text-xs bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Original URL
                    </a>
                    <a 
                      href={`/books/${book.id.replace(/[-]/g, '')}`}
                      className="text-xs bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Without Hyphens
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Troubleshooting Steps</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#c9a52c]">1. Check Book IDs</h3>
              <p className="text-sm text-gray-300 mt-1">
                The most common issue is that the book ID in the URL doesn't match any book in the database.
                Compare the ID in your URL with the IDs listed above.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#c9a52c]">2. Try Different ID Formats</h3>
              <p className="text-sm text-gray-300 mt-1">
                Sometimes IDs might be formatted differently (with or without hyphens).
                Try both formats using the links above.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#c9a52c]">3. Add a Test Book</h3>
              <p className="text-sm text-gray-300 mt-1">
                If no books are showing up, you can add a test book using the button above.
                This will create a new book with a valid ID that you can test with.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDebugPage;
