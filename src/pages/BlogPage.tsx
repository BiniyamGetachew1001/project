import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

// Mock blog data - in a real app, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: 'How to Start a Successful Business in 2025',
    excerpt: 'Learn the essential steps to launch your business venture in the current market landscape...',
    author: 'John Doe',
    date: 'Mar 30, 2025',
    readTime: '5 min read',
    category: 'Business Tips'
  },
  {
    id: 2,
    title: 'Top 10 Business Books Every Entrepreneur Should Read',
    excerpt: 'Discover the must-read books that will transform your entrepreneurial journey...',
    author: 'Jane Smith',
    date: 'Mar 28, 2025',
    readTime: '4 min read',
    category: 'Book Reviews'
  },
  {
    id: 3,
    title: 'Essential Business Plan Components',
    excerpt: 'Master the art of writing an effective business plan with these key elements...',
    author: 'Mike Johnson',
    date: 'Mar 25, 2025',
    readTime: '6 min read',
    category: 'Business Planning'
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Business Insights & Tips
          </h1>
          <p className="text-lg text-gray-300">
            Expert advice, industry trends, and practical guides for entrepreneurs
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article key={post.id} className="glass-card overflow-hidden group">
                <div className="p-6">
                  <div className="text-[#c9a52c] text-sm mb-2">{post.category}</div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-[#c9a52c] transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-300 mb-4 text-sm">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <div className="flex items-center mr-4">
                      <User size={14} className="mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center mr-4">
                      <Calendar size={14} className="mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-[#c9a52c] hover:text-[#ffd700] transition-colors"
                  >
                    Read More
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage; 