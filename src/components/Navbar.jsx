import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link to="/home" className="hover:text-gray-300">Home</Link></li>
        <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
        <li><Link to="/services" className="hover:text-gray-300">Services</Link></li>
        <li><Link to="/business-plans" className="hover:text-gray-300">Business Plans</Link></li>
        <li><Link to="/book-purchase" className="hover:text-gray-300">Book Purchase</Link></li> {/* New link */}
        <li><Link to="/blog" className="hover:text-gray-300">Blog</Link></li>
        <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;