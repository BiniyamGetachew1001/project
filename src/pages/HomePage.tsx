import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Check, Coffee, Star, Facebook, Twitter, Instagram, Sparkles, Target, Clock, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-[#2d1e14] text-white">
      {/* Hero Section */}
      <section className="py-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="col-span-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Access Business Wisdom <br />
              <span className="gold-text">with Free Summaries</span>
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              Start with 3 free book summaries and 1 business idea per category.
              Unlock premium content with a one-time payment.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check size={20} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                <span>Read 3 premium book summaries for free</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                <span>Access 1 business idea per category (small, middle, large)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                <span>Unlock all content with a one-time payment</span>
              </li>
            </ul>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/book-summaries" className="gold-button">
                Read Free Summaries
              </Link>
              <Link to="/business-plans" className="secondary-button">
                View Business Ideas
              </Link>
            </div>
          </div>
          
          <div className="col-span-1 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#c9a52c] to-[#ffd700] rounded-lg blur opacity-25"></div>
              <div className="relative bg-[#2d1e14] p-6 rounded-lg border border-[#c9a52c]">
                <h3 className="text-xl font-semibold mb-4">Free Content Preview</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Book size={20} className="text-[#c9a52c]" />
                    <span>3 Premium Book Summaries</span>
              </div>
                  <div className="flex items-center gap-3">
                    <Coffee size={20} className="text-[#c9a52c]" />
                    <span>1 Business Idea per Category</span>
            </div>
                  <div className="flex items-center gap-3">
                    <Star size={20} className="text-[#c9a52c]" />
                    <span>No Sign Up Required</span>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose TilkTibeb</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We provide carefully curated business knowledge and practical insights to help you succeed in your entrepreneurial journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quality Content */}
            <div className="text-center">
              <div className="bg-[#1a130d] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-[#c9a52c]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Content</h3>
              <p className="text-gray-300">
                Expert-curated summaries and business plans that focus on actionable insights.
              </p>
            </div>

            {/* Targeted Learning */}
            <div className="text-center">
              <div className="bg-[#1a130d] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={28} className="text-[#c9a52c]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Targeted Learning</h3>
              <p className="text-gray-300">
                Content organized by industry and business size for efficient learning.
              </p>
            </div>

            {/* Time-Saving */}
            <div className="text-center">
              <div className="bg-[#1a130d] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-[#c9a52c]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Time-Saving</h3>
              <p className="text-gray-300">
                Get key business insights in minutes instead of hours or days.
              </p>
            </div>

            {/* Community Driven */}
            <div className="text-center">
              <div className="bg-[#1a130d] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-[#c9a52c]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-gray-300">
                Join a community of entrepreneurs sharing knowledge and experiences.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/features" className="gold-button">
              Explore All Features
            </Link>
          </div>
        </div>
      </section>
      
      {/* Free Content Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Reading Now</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Begin your journey with our free content and discover the value we provide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Free Book Summaries */}
            <div className="bg-[#1a130d] rounded-xl p-6 border border-[#4a2e1c] hover:border-[#c9a52c] transition-all duration-200">
              <div className="bg-[#2d1e14] p-3 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                <Book size={24} className="text-[#c9a52c]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Free Book Summaries</h3>
              <p className="text-gray-300 mb-6">Access 3 premium book summaries instantly</p>
              <Link 
                to="/book-summaries" 
                className="inline-flex items-center text-[#c9a52c] hover:text-[#ffd700] transition-colors"
              >
                Read Now 
                <span className="ml-2">→</span>
              </Link>
            </div>
            
            {/* Free Business Ideas */}
            <div className="bg-[#1a130d] rounded-xl p-6 border border-[#4a2e1c] hover:border-[#c9a52c] transition-all duration-200">
              <div className="bg-[#2d1e14] p-3 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                <Coffee size={24} className="text-[#c9a52c]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Free Business Ideas</h3>
              <p className="text-gray-300 mb-6">Get 1 business idea from each category</p>
              <Link 
                to="/business-plans" 
                className="inline-flex items-center text-[#c9a52c] hover:text-[#ffd700] transition-colors"
              >
                View Ideas 
                <span className="ml-2">→</span>
              </Link>
            </div>
            
            {/* Premium Access */}
            <div className="bg-[#1a130d] rounded-xl p-6 border border-[#4a2e1c] hover:border-[#c9a52c] transition-all duration-200">
              <div className="bg-[#2d1e14] p-3 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                <Star size={24} className="text-[#c9a52c]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Unlock All Content</h3>
              <p className="text-gray-300 mb-6">Get lifetime access to all content</p>
              <Link 
                to="/pricing" 
                className="inline-flex items-center text-[#c9a52c] hover:text-[#ffd700] transition-colors"
              >
                View Pricing 
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14] border-t border-[#4a2e1c]/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Book className="text-[#c9a52c]" size={24} />
                <h2 className="text-xl font-bold text-white">TILKTIBEB</h2>
              </div>
              <p className="text-sm text-gray-400">
                Premium business book summaries and business plans with a one-time payment.
              </p>
            </div>
            
            {/* Resources Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/book-summaries" className="text-gray-400 hover:text-[#c9a52c]">
                    Book Summaries
                  </Link>
                </li>
                <li>
                  <Link to="/business-plans" className="text-gray-400 hover:text-[#c9a52c]">
                    Business Plans
                  </Link>
                </li>
                <li>
                  <Link to="/free-business-ideas" className="text-gray-400 hover:text-[#c9a52c]">
                    Free Business Ideas
              </Link>
                </li>
              </ul>
            </div>
            
            {/* Company Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-[#c9a52c]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-[#c9a52c]">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-[#c9a52c]">
                    FAQ
              </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-[#c9a52c]">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-[#c9a52c]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/refund" className="text-gray-400 hover:text-[#c9a52c]">
                    Refund Policy
              </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#4a2e1c]/50">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 TILKTIBEB. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#c9a52c]" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#c9a52c]" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#c9a52c]" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
