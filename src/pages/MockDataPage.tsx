import React, { useState } from 'react';
import { addMockBooks, getAllBooks } from '../utils/mockData';

const MockDataPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [books, setBooks] = useState<any[]>([]);

  const handleAddMockBooks = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await addMockBooks();
      setMessage('Mock books added successfully!');
      fetchBooks();
    } catch (error) {
      setMessage(`Error adding mock books: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const books = await getAllBooks();
      setBooks(books);
    } catch (error) {
      setMessage(`Error fetching books: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mock Data Utility</h1>
        
        <div className="glass-card p-6 rounded-xl mb-6">
          <h2 className="text-xl font-bold mb-4">Add Mock Books</h2>
          <p className="mb-4">Click the button below to add mock books to the database.</p>
          <button 
            onClick={handleAddMockBooks}
            disabled={loading}
            className="gold-button"
          >
            {loading ? 'Adding...' : 'Add Mock Books'}
          </button>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {message}
            </div>
          )}
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Current Books in Database</h2>
            <button 
              onClick={fetchBooks}
              disabled={loading}
              className="px-4 py-2 bg-[#2d1e14] rounded-lg hover:bg-[#3a2819] transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {books.length > 0 ? (
            <div className="space-y-4">
              {books.map(book => (
                <div key={book.id} className="bg-[#2d1e14] p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold">{book.title}</h3>
                      <p className="text-sm text-gray-400">by {book.author}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#c9a52c]">ID: {book.id}</p>
                      <p className="text-xs text-gray-400">Created: {new Date(book.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No books found. Click "Refresh" to check for books or add mock books.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockDataPage;
