import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link to="/home" className="hover:text-gray-300">Home</Link></li>
        <li><Link to="/book-summaries" className="hover:text-gray-300">Book Summaries</Link></li>
        <li><Link to="/book-purchase" className="hover:text-gray-300"><span className="icon-class">📚</span> Book Purchase</Link></li>
        <li><Link to="/business-plans" className="hover:text-gray-300">Business Plans</Link></li>
        <li><Link to="/blog" className="hover:text-gray-300">Blog</Link></li>
        <li><Link to="/bookmarks" className="hover:text-gray-300">Bookmarks</Link></li>
        <li><Link to="/offline-library" className="hover:text-gray-300">Offline Library</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;