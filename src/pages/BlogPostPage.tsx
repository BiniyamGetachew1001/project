import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';

// Mock blog post data - in a real app, this would come from an API
const blogPost = {
  id: 1,
  title: 'How to Start a Successful Business in 2025',
  content: `Starting a business in 2025 requires careful planning and execution. Here are the key steps to success:

1. Market Research
Understanding your target market is crucial. Analyze your competitors and identify gaps in the market that your business can fill.

2. Business Plan
Create a detailed business plan that outlines your goals, strategies, and financial projections. This will serve as your roadmap to success.

3. Funding
Secure adequate funding through savings, loans, or investors. Make sure you have enough capital to sustain your business through the initial stages.`,
  author: 'John Doe',
  date: 'Mar 30, 2025',
  readTime: '5 min read',
  category: 'Business Tips'
};

// Mock related posts data
const relatedPosts = [
  {
    id: 2,
    title: 'Top 10 Business Books Every Entrepreneur Should Read',
    author: 'Jane Smith',
    date: 'Mar 28, 2025',
    category: 'Book Reviews'
  },
  {
    id: 3,
    title: 'Essential Business Plan Components',
    author: 'Mike Johnson',
    date: 'Mar 25, 2025',
    category: 'Business Planning'
  }
];

const BlogPostPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-[#c9a52c] hover:text-[#ffd700] transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="text-[#c9a52c] text-sm mb-2">{blogPost.category}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blogPost.title}</h1>
          
          <div className="flex items-center text-sm text-gray-400 mb-8">
            <div className="flex items-center mr-4">
              <User size={14} className="mr-1" />
              {blogPost.author}
            </div>
            <div className="flex items-center mr-4">
              <Calendar size={14} className="mr-1" />
              {blogPost.date}
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              {blogPost.readTime}
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-gold max-w-none mb-8">
          {blogPost.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-300 mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share section */}
        <div className="border-t border-[#4a2e1c] pt-6 mt-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 flex items-center">
              <Share2 size={16} className="mr-2" />
              Share this post:
            </span>
            <button 
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="text-[#c9a52c] hover:text-[#ffd700] transition-colors text-sm"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Related Posts Section */}
        <div className="border-t border-[#4a2e1c] pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`}
                className="glass-card p-6 hover:border-[#c9a52c] transition-colors group"
              >
                <div className="text-[#c9a52c] text-sm mb-2">{post.category}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#c9a52c] transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center text-sm text-gray-400">
                  <div className="flex items-center mr-4">
                    <User size={14} className="mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage; 