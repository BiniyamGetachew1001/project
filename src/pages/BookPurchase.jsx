import React from 'react';

const BookPurchase = () => {
  return (
    <div className="bg-[#071E22] text-white min-h-screen">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">Purchase Book Summaries</h1>
        <p className="text-lg mt-2">Unlock handpicked business wisdom — one book at a time.</p>
      </header>
      <div className="container mx-auto px-4">
        {/* Filter/Sort Bar */}
        <div className="sticky top-0 bg-[#071E22] py-4 flex justify-between items-center">
          <div>
            <select className="bg-[#F4C095] text-black px-4 py-2 rounded">
              <option>Category</option>
              <option>Strategy</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Personal Growth</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search by title, author, or topic"
              className="bg-gray-200 px-4 py-2 rounded"
            />
          </div>
        </div>
        {/* Book Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {/* Example Book Card */}
          <div className="bg-white text-black p-4 rounded shadow">
            <img src="/path/to/book-cover.jpg" alt="Book Cover" className="w-full h-48 object-cover rounded" />
            <h2 className="text-lg font-bold mt-2">Book Title</h2>
            <p className="text-sm mt-1">Short subtitle or description.</p>
            <p className="text-lg font-bold mt-2">50 ETB</p>
            <div className="flex justify-between mt-4">
              <button className="bg-[#F4C095] px-4 py-2 rounded">Preview</button>
              <button className="bg-[#EE2E31] text-white px-4 py-2 rounded">Buy Now</button>
            </div>
          </div>
          {/* Repeat for more books */}
        </div>
      </div>
    </div>
  );
};

export default BookPurchase;
