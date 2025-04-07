import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Loader2, Mail, BookOpen } from 'lucide-react';
import { getBlogPostById, getBlogPosts } from '../lib/database';
import type { BlogPost } from '../types/database';

// Mock blog post data as fallback
const mockBlogPost = {
  id: '1',
  title: 'How to Start a Successful Business in 2025',
  content: JSON.stringify({
    blocks: [
      {
        type: 'paragraph',
        text: 'Starting a business in 2025 requires careful planning and execution. Here are the key steps to success:'
      },
      {
        type: 'heading',
        text: '1. Market Research',
        level: 3
      },
      {
        type: 'paragraph',
        text: 'Understanding your target market is crucial. Analyze your competitors and identify gaps in the market that your business can fill.'
      },
      {
        type: 'heading',
        text: '2. Business Plan',
        level: 3
      },
      {
        type: 'paragraph',
        text: 'Create a detailed business plan that outlines your goals, strategies, and financial projections. This will serve as your roadmap to success.'
      },
      {
        type: 'heading',
        text: '3. Funding',
        level: 3
      },
      {
        type: 'paragraph',
        text: 'Secure adequate funding through savings, loans, or investors. Make sure you have enough capital to sustain your business through the initial stages.'
      }
    ]
  }),
  author: 'John Doe',
  created_at: '2025-03-30T00:00:00Z',
  read_time: '5 min read',
  category: 'Business Tips',
  excerpt: 'Learn the essential steps to launch your business venture in the current market landscape...',
  is_published: true,
  tags: ['Business', 'Entrepreneurship', 'Startup'],
  cover_image: 'https://images.unsplash.com/photo-1664575599736-c5197c684128?q=80&w=2070'
};

// Mock related posts data
const mockRelatedPosts = [
  {
    id: '2',
    title: 'Top 10 Business Books Every Entrepreneur Should Read',
    author: 'Jane Smith',
    created_at: '2025-03-28T00:00:00Z',
    category: 'Book Reviews',
    excerpt: 'Discover the must-read books that will transform your entrepreneurial journey...',
    is_published: true,
    slug: 'top-10-business-books'
  },
  {
    id: '3',
    title: 'Essential Business Plan Components',
    author: 'Mike Johnson',
    created_at: '2025-03-25T00:00:00Z',
    category: 'Business Planning',
    excerpt: 'Master the art of writing an effective business plan with these key elements...',
    is_published: true,
    slug: 'essential-business-plan-components'
  }
];

const BlogPostPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        navigate('/blog');
        return;
      }

      try {
        console.log(`Fetching blog post with ID: ${id}`);
        const post = await getBlogPostById(id);

        if (post && post.is_published) {
          console.log('Blog post found:', post.title);
          setBlogPost(post);

          // Fetch related posts (posts with the same category)
          try {
            const allPosts = await getBlogPosts();
            const publishedPosts = allPosts.filter(p => p.is_published && p.id !== id);

            // If the post has a category, filter by that category
            const related = post.category
              ? publishedPosts.filter(p => p.category === post.category).slice(0, 2)
              : publishedPosts.slice(0, 2);

            setRelatedPosts(related);
          } catch (relatedErr) {
            console.error('Error fetching related posts:', relatedErr);
            setRelatedPosts(mockRelatedPosts as unknown as BlogPost[]);
          }
        } else {
          console.log('Blog post not found or not published, using mock data');
          setBlogPost(mockBlogPost as unknown as BlogPost);
          setRelatedPosts(mockRelatedPosts as unknown as BlogPost[]);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post from database');

        // Use mock data as fallback
        console.log('Using mock data as fallback');
        setBlogPost(mockBlogPost as unknown as BlogPost);
        setRelatedPosts(mockRelatedPosts as unknown as BlogPost[]);

        // Clear error after a short delay to show the mock data
        setTimeout(() => {
          setError(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1310] to-[#0d0a08]">
      {/* Navigation Bar with Back Button */}
      <div className="sticky top-0 z-10 bg-[#1a1310]/80 backdrop-blur-md border-b border-[#3a2819] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-[#c9a52c] hover:text-[#ffd700] transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Link>

          {/* Right side actions */}
          {blogPost && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-1 text-gray-400 hover:text-[#c9a52c] transition-colors text-sm bg-[#2d1e14] px-3 py-1.5 rounded-full"
              >
                <Share2 size={14} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-[#c9a52c] mb-4" />
            <p className="text-gray-400 text-lg">Loading article...</p>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto py-12">
            <div className="glass-card p-8 text-center rounded-xl border border-red-900/30 bg-red-900/10">
              <p className="text-red-400 text-lg mb-3">{error}</p>
              <p className="text-gray-400">Showing a sample blog post instead.</p>
            </div>
          </div>
        ) : blogPost ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <article className="lg:w-2/3 order-2 lg:order-1">
              {/* Featured Image (if available) */}
              {blogPost.cover_image && typeof blogPost.cover_image === 'string' && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img
                    src={blogPost.cover_image}
                    alt={blogPost.title}
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Content */}
              <div className="glass-card p-6 sm:p-8 rounded-xl mb-8">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-[#3a2819] text-[#c9a52c] text-xs font-medium px-3 py-1 rounded-full">
                    {blogPost.category || 'Uncategorized'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  {blogPost.title}
                </h1>

                {/* Author and Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-[#3a2819]">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#3a2819] flex items-center justify-center mr-3">
                      <User size={18} className="text-[#c9a52c]" />
                    </div>
                    <div>
                      <div className="font-medium">{blogPost.author}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(blogPost.published_at || blogPost.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {blogPost.read_time && (
                    <div className="flex items-center bg-[#2d1e14] px-3 py-1 rounded-full">
                      <Clock size={14} className="mr-1 text-[#c9a52c]" />
                      <span className="text-sm">{blogPost.read_time}</span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                  {(() => {
                    try {
                      // Try to parse the content as JSON
                      let contentObj;

                      try {
                        contentObj = typeof blogPost.content === 'string'
                          ? JSON.parse(blogPost.content)
                          : blogPost.content;
                      } catch (parseError) {
                        console.error('Error parsing content JSON:', parseError);
                        // Return early with plain text rendering
                        return typeof blogPost.content === 'string'
                          ? blogPost.content.split('\n\n').map((paragraph, idx) => (
                              <p key={idx} className="text-gray-300 mb-6 leading-relaxed">{paragraph}</p>
                            ))
                          : <p className="text-gray-300">No content available</p>;
                      }

                      if (contentObj && contentObj.blocks) {
                        // Render structured content
                        return contentObj.blocks.map((block: any, index: number) => {
                          if (block.type === 'paragraph') {
                            return <p key={index} className="text-gray-300 mb-6 leading-relaxed">{block.text}</p>;
                          } else if (block.type === 'heading') {
                            const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                            return <HeadingTag key={index} id={`heading-${index}`} className="font-bold mb-4 text-white">{block.text}</HeadingTag>;
                          } else if (block.type === 'list') {
                            if (block.style === 'ordered') {
                              return (
                                <ol key={index} className="list-decimal pl-6 mb-6 space-y-2">
                                  {block.items.map((item: string, i: number) => (
                                    <li key={i} className="text-gray-300">{item}</li>
                                  ))}
                                </ol>
                              );
                            } else {
                              return (
                                <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
                                  {block.items.map((item: string, i: number) => (
                                    <li key={i} className="text-gray-300">{item}</li>
                                  ))}
                                </ul>
                              );
                            }
                          } else if (block.type === 'quote') {
                            return (
                              <blockquote key={index} className="border-l-4 border-[#c9a52c] pl-4 italic my-6 text-gray-300">
                                {block.text}
                              </blockquote>
                            );
                          } else if (block.type === 'image' && block.url) {
                            return (
                              <figure key={index} className="my-8">
                                <img src={block.url} alt={block.caption || ''} className="rounded-lg w-full" />
                                {block.caption && (
                                  <figcaption className="text-center text-sm text-gray-400 mt-2">{block.caption}</figcaption>
                                )}
                              </figure>
                            );
                          }
                          return null;
                        });
                      }
                    } catch (e) {
                      // If parsing fails, fall back to simple text rendering
                      console.error('Error parsing blog content:', e);
                    }

                    // Fallback for plain text content
                    return typeof blogPost.content === 'string'
                      ? blogPost.content.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="text-gray-300 mb-6 leading-relaxed">{paragraph}</p>
                        ))
                      : <p className="text-gray-300">No content available</p>;
                  })()}
                </div>

                {/* Tags (if available) */}
                {blogPost.tags && Array.isArray(blogPost.tags) && blogPost.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-[#3a2819]">
                    <div className="flex flex-wrap gap-2">
                      {blogPost.tags.map((tag, index) => (
                        <span key={index} className="bg-[#2d1e14] text-gray-300 text-xs px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Author Bio (if available) */}
              <div className="glass-card p-6 sm:p-8 rounded-xl mb-8">
                <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                  <div className="w-16 h-16 rounded-full bg-[#3a2819] flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-[#c9a52c]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">About {blogPost.author}</h3>
                    <p className="text-gray-300">
                      {/* This would come from an author bio field */}
                      Author of insightful articles on business and entrepreneurship. Passionate about helping others succeed in their business ventures.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/3 order-1 lg:order-2">
              {/* Table of Contents */}
              <div className="glass-card p-6 rounded-xl mb-8 sticky top-24">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[#3a2819] flex items-center justify-center mr-2">
                    <span className="text-[#c9a52c] text-xs">📑</span>
                  </span>
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {(() => {
                    try {
                      // Extract headings from content for TOC
                      const contentObj = typeof blogPost.content === 'string'
                        ? JSON.parse(blogPost.content)
                        : blogPost.content;

                      // Safety check for null or undefined content
                      if (!contentObj) {
                        throw new Error('Content object is null or undefined');
                      }

                      if (contentObj && contentObj.blocks) {
                        const headings = contentObj.blocks.filter((block: any) =>
                          block.type === 'heading'
                        );

                        if (headings.length > 0) {
                          return headings.map((heading: any, index: number) => (
                            <a
                              key={index}
                              href={`#heading-${index}`}
                              className="block text-gray-400 hover:text-[#c9a52c] transition-colors py-1 border-l-2 border-[#3a2819] pl-3 hover:border-[#c9a52c]"
                            >
                              {heading.text}
                            </a>
                          ));
                        }
                      }
                    } catch (e) {
                      console.error('Error generating TOC:', e);
                    }

                    // Fallback if no headings or error
                    return (
                      <p className="text-gray-400 text-sm italic">No sections available</p>
                    );
                  })()}
                </nav>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="glass-card p-6 rounded-xl mb-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-[#3a2819] flex items-center justify-center mr-2">
                      <span className="text-[#c9a52c] text-xs">📚</span>
                    </span>
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug || post.id}`}
                        className="block p-4 bg-[#2d1e14] rounded-lg hover:bg-[#3a2819] transition-colors group"
                      >
                        <div className="text-xs text-[#c9a52c] mb-1">{post.category || 'Uncategorized'}</div>
                        <h4 className="font-medium mb-2 group-hover:text-[#c9a52c] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{post.author}</span>
                          <span>
                            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-gray-400 text-sm mb-4">Get the latest articles and business tips delivered to your inbox.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c] text-gray-300"
                  />
                  <button
                    type="button"
                    className="w-full bg-[#c9a52c] hover:bg-[#d9b53c] text-[#1a1310] font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-12">
            <div className="glass-card p-8 text-center rounded-xl">
              <p className="text-gray-400 text-lg mb-4">Blog post not found.</p>
              <Link
                to="/blog"
                className="inline-flex items-center text-[#c9a52c] hover:text-[#ffd700] transition-colors bg-[#2d1e14] px-4 py-2 rounded-lg"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Blog
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#3a2819] mt-12 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#c9a52c] transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-[#c9a52c] transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-[#c9a52c] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPostPage;