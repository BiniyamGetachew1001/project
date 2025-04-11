import React, { useState } from 'react';

const IndividualBookPurchasePage: React.FC = () => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const togglePreviewModal = () => {
    setIsPreviewModalOpen(!isPreviewModalOpen);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#c9a52c]">Purchase Book Summaries</h1>
        <p className="text-gray-400 mt-2">Browse and buy individual book summaries anytime</p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <select className="border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-[#c9a52c]">
          <option>All Categories</option>
          <option>Business</option>
          <option>Self-Help</option>
          <option>Technology</option>
        </select>
        <input
          type="text"
          placeholder="Search books..."
          className="border border-gray-300 p-3 rounded-md shadow-sm w-full md:w-1/3 focus:ring-2 focus:ring-[#c9a52c]"
        />
        <select className="border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-[#c9a52c]">
          <option>Sort by: Popularity</option>
          <option>Sort by: Price</option>
          <option>Sort by: Newest</option>
        </select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((book) => (
          <div key={book} className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img
              src="https://via.placeholder.com/150"
              alt="Book Cover"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">Book Title {book}</h3>
            <p className="text-gray-500 mt-1">$9.99</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                onClick={togglePreviewModal}
              >
                Preview
              </button>
              <button className="bg-[#c9a52c] hover:bg-[#b89225] text-white py-2 px-4 rounded-md">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Book Preview</h2>
            <p className="text-gray-600 mb-6">
              This is a sample of the book summary. Unlock the full summary to gain complete insights.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-[#c9a52c] hover:bg-[#b89225] text-white py-2 px-4 rounded-md"
                onClick={togglePreviewModal}
              >
                Unlock Full Summary
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                onClick={togglePreviewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Books</h3>
        <div className="flex justify-center gap-6">
          <a href="/blog" className="text-[#c9a52c] hover:underline">
            Blog
          </a>
          <a href="/business-plans" className="text-[#c9a52c] hover:underline">
            Business Plans
          </a>
        </div>
      </footer>
    </div>
  );
};

export default IndividualBookPurchasePage;
