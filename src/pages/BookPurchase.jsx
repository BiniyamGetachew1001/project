import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const BookPurchase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Newest First');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const togglePreviewModal = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <Layout>
      <div className="p-6 md:p-10">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="font-bold text-2xl">Buy Book Summaries</h1>
          <p className="text-gray-600">Get insights from top business books.</p>
          <div className="flex justify-end mt-4">
            <button className="text-sm text-gray-500 hover:text-gray-700 mr-2">Amharic</button>
            <button className="text-sm text-gray-500 hover:text-gray-700">Afaan Oromo</button>
          </div>
        </header>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg p-2"
            aria-label="Filter by category"
          >
            <option>All</option>
            <option>Entrepreneurship</option>
            <option>Finance</option>
            <option>Strategy</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded-lg p-2"
            aria-label="Sort books"
          >
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Title: A-Z</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles"
            className="border rounded-lg p-2 flex-grow"
            aria-label="Search books"
          />
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Book Card */}
          <div className="border rounded-lg p-4 hover:scale-105 transition">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <h2 className="font-semibold text-lg">Book Title</h2>
            <p className="text-xl text-green-600">200 ETB</p>
            <div className="flex gap-2 mt-4">
              <button 
                className="gold-button"
                onClick={togglePreviewModal}
              >
                Preview
              </button>
              <button className="gold-button">Buy Now</button>
            </div>
          </div>
          {/* Add more book cards dynamically */}
        </div>

        {/* Preview Modal */}
        {isPreviewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <button 
                className="absolute top-2 right-2 bg-gray-200 rounded-full p-2" 
                aria-label="Close Preview"
                onClick={togglePreviewModal}
              >
                X
              </button>
              <h2 className="font-bold text-xl mb-4">Book Title</h2>
              <p className="text-gray-600 mb-4">This is a preview of the book summary.</p>
              <button className="bg-green-600 text-white px-6 py-3 rounded">Unlock Summary</button>
            </div>
          </div>
        )}

        {/* Empty State */}
        <div className="text-center mt-6">
          <p className="text-gray-500">No books found. Try again!</p>
        </div>
      </div>
    </Layout>
  );
};

export default BookPurchase;
