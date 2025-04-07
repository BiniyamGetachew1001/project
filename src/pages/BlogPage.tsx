import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { getBlogPosts } from '../lib/database';
import type { BlogPost } from '../types/database';

// Fallback mock data in case the database fetch fails
const mockBlogPosts = [
  {
    id: '1',
    title: 'How to Start a Successful Business in 2025',
    excerpt: 'Learn the essential steps to launch your business venture in the current market landscape...',
    author: 'John Doe',
    created_at: '2025-03-30T00:00:00Z',
    read_time: '5 min read',
    category: 'Business Tips'
  },
  {
    id: '2',
    title: 'Top 10 Business Books Every Entrepreneur Should Read',
    excerpt: 'Discover the must-read books that will transform your entrepreneurial journey...',
    author: 'Jane Smith',
    created_at: '2025-03-28T00:00:00Z',
    read_time: '4 min read',
    category: 'Book Reviews'
  },
  {
    id: '3',
    title: 'Essential Business Plan Components',
    excerpt: 'Master the art of writing an effective business plan with these key elements...',
    author: 'Mike Johnson',
    created_at: '2025-03-25T00:00:00Z',
    read_time: '6 min read',
    category: 'Business Planning'
  }
];

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        console.log('Fetching blog posts from database...');
        const data = await getBlogPosts();

        // Only show published blog posts
        const publishedPosts = data.filter(post => post.is_published);

        if (publishedPosts.length > 0) {
          console.log(`Found ${publishedPosts.length} published blog posts`);
          setBlogPosts(publishedPosts);
        } else {
          console.log('No published blog posts found, using mock data');
          setBlogPosts(mockBlogPosts as unknown as BlogPost[]);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
        setBlogPosts(mockBlogPosts as unknown as BlogPost[]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={40} className="animate-spin text-[#c9a52c] mb-4" />
              <p className="text-gray-400">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="glass-card p-6 text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <p className="text-gray-400">Showing sample blog posts instead.</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-gray-400">No blog posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <article key={post.id} className="glass-card overflow-hidden group">
                  <div className="p-6">
                    <div className="text-[#c9a52c] text-sm mb-2">{post.category || 'Uncategorized'}</div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-[#c9a52c] transition-colors">
                      <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                    </h2>
                    <p className="text-gray-300 mb-4 text-sm">
                      {post.excerpt || 'Click to read this blog post...'}
                    </p>
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <div className="flex items-center mr-4">
                        <User size={14} className="mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center mr-4">
                        <Calendar size={14} className="mr-1" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      {post.read_time && (
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {post.read_time}
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="inline-flex items-center text-[#c9a52c] hover:text-[#ffd700] transition-colors"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;