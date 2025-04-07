import React, { useState, useEffect } from 'react';
import { Book, LayoutGrid, Plus, X, Upload, Check, Edit, Trash, Search, Filter, Users, DollarSign, BarChart, Clock, TrendingUp, Eye, ArrowLeft, FileText } from 'lucide-react';
import { addBook, addBusinessPlan, getBooks, getBusinessPlans, getBlogPosts, addBlogPost, testConnection } from '../lib/database';
import type { Book as BookType, BusinessPlan, BlogPost } from '../types/database';

const ContentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'books' | 'business-plans' | 'blog' | 'users' | 'analytics' | 'seo'>('dashboard');
  const [books, setBooks] = useState<BookType[]>([]);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, title: string, type: 'book' | 'business-plan' | 'blog'} | null>(null);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);
  const [editingPlan, setEditingPlan] = useState<BusinessPlan | null>(null);

  // Mock user data
  const [users, setUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    subscription: string;
    joined_date: string;
  }>>([{
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    subscription: 'Premium',
    joined_date: '2023-01-15'
  }, {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active',
    subscription: 'Free',
    joined_date: '2023-02-20'
  }, {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'Inactive',
    subscription: 'Premium',
    joined_date: '2023-03-10'
  }, {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'Active',
    subscription: 'Premium',
    joined_date: '2023-04-05'
  }, {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'User',
    status: 'Active',
    subscription: 'Free',
    joined_date: '2023-05-12'
  }]);

  // Book form state
  const [bookForm, setBookForm] = useState({
    title: '',
    slug: '',
    author: '',
    category: '',
    is_premium: false,
    is_published: false,
    description: '',
    read_time: '',
    cover_image: '',
    content: ''
  });

  // Business plan form state
  const [planForm, setPlanForm] = useState({
    title: '',
    slug: '',
    icon: 'Coffee', // Default icon
    description: '',
    content: '',
    investment: '',
    is_premium: false,
    category: '',
    cover_image: '',
    read_time: '',
    is_published: false
  });

  // Blog post form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    author: '',
    category: '',
    excerpt: '',
    content: '',
    cover_image: '',
    read_time: '',
    is_published: false,
    tags: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books and business plans
        const [booksData, plansData] = await Promise.all([
          getBooks(),
          getBusinessPlans()
        ]);
        setBooks(booksData);
        setBusinessPlans(plansData);

        // Try to fetch blog posts, but handle the case where the table doesn't exist yet
        try {
          const blogData = await getBlogPosts();
          setBlogPosts(blogData);
        } catch (blogErr) {
          console.warn('Failed to fetch blog posts:', blogErr);
          // If the table doesn't exist, we'll just use an empty array
          setBlogPosts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter books and business plans based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredBusinessPlans = businessPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plan.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get categories for filtering
  const bookCategories = ['all', ...new Set(books.map(book => book.category))];
  const planCategories = ['all', ...new Set(businessPlans.map(plan => plan.category))];

  // Calculate statistics for dashboard
  const freeBooks = books.filter(book => !book.is_premium).length;
  const premiumBooks = books.filter(book => book.is_premium).length;

  const smallBusinessPlans = businessPlans.filter(plan => plan.category === 'Small Business').length;
  const mediumBusinessPlans = businessPlans.filter(plan =>
    plan.category === 'Medium Business' || plan.category === 'Tech Startup'
  ).length;
  const largeBusinessPlans = businessPlans.filter(plan =>
    plan.category === 'Large Business' || plan.category === 'Enterprise'
  ).length;

  // Get recent content (last 5 items)
  const recentContent = [...books, ...businessPlans]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.status.toLowerCase().includes(query) ||
      user.subscription.toLowerCase().includes(query)
    );
  });

  const handleBookFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setBookForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setBookForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePlanFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPlanForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setPlanForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Make sure the slug is URL-friendly
      const formattedSlug = bookForm.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Format the content properly
      let formattedContent = bookForm.content;

      // If content is a string but not JSON, convert it to structured format
      if (typeof formattedContent === 'string' && !formattedContent.trim().startsWith('{')) {
        try {
          const paragraphs = formattedContent.split('\n\n').filter(p => p.trim());
          const blocks = paragraphs.map(p => ({
            type: 'paragraph',
            text: p.trim()
          }));
          formattedContent = JSON.stringify({ blocks });
        } catch (err) {
          console.error('Error formatting content:', err);
          // Keep as is if there's an error
        }
      } else if (typeof formattedContent === 'object') {
        // If it's already an object, stringify it
        formattedContent = JSON.stringify(formattedContent);
      }

      // Prepare the book data
      const bookData = {
        ...bookForm,
        slug: formattedSlug,
        content: formattedContent,
        published_at: bookForm.is_published ? new Date().toISOString() : null
      };

      if (editingBook) {
        try {
          // Update the book in the database
          const updatedBook = await updateBook(editingBook.id, bookData);
          // Update the local state
          const updatedBooks = books.map(book =>
            book.id === editingBook.id ? updatedBook : book
          );
          setBooks(updatedBooks);
          setSuccessMessage('Book updated successfully!');
          setEditingBook(null);
        } catch (updateErr) {
          console.error('Error updating book:', updateErr);
          setError(updateErr instanceof Error ? updateErr.message : 'Failed to update book');
        }
      } else {
        try {
          // Add the new book to the database
          const newBook = await addBook(bookData);
          setBooks(prev => [...prev, newBook]);
          setSuccessMessage('Book added successfully!');
        } catch (addErr) {
          console.error('Error adding book:', addErr);
          setError(addErr instanceof Error ? addErr.message : 'Failed to add book');
        }
      }

      setBookForm({
        title: '',
        slug: '',
        author: '',
        category: '',
        is_premium: false,
        is_published: false,
        description: '',
        read_time: '',
        cover_image: '',
        content: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = (book: BookType) => {
    setEditingBook(book);

    // Format the content for editing
    let formattedContent = book.content || '';

    // If content is a string that looks like JSON, try to parse it for better editing
    if (typeof formattedContent === 'string' && formattedContent.trim().startsWith('{')) {
      try {
        // Try to parse and re-stringify with formatting
        const parsed = JSON.parse(formattedContent);
        formattedContent = JSON.stringify(parsed, null, 2);
      } catch (err) {
        console.warn('Could not parse content as JSON:', err);
        // Keep as is if parsing fails
      }
    }

    setBookForm({
      title: book.title,
      slug: book.slug || '',
      author: book.author,
      category: book.category,
      is_premium: book.is_premium,
      is_published: book.is_published || false,
      description: book.description || '',
      read_time: book.read_time || '',
      cover_image: book.cover_image || '',
      content: formattedContent
    });
    setActiveTab('books');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPlan = (plan: BusinessPlan) => {
    setEditingPlan(plan);

    // Format the content for editing
    let formattedContent = plan.content || '';

    // If content is a string that looks like JSON, try to parse it for better editing
    if (typeof formattedContent === 'string' && formattedContent.trim().startsWith('{')) {
      try {
        // Try to parse and re-stringify with formatting
        const parsed = JSON.parse(formattedContent);
        formattedContent = JSON.stringify(parsed, null, 2);
      } catch (err) {
        console.warn('Could not parse content as JSON:', err);
        // Keep as is if parsing fails
      }
    }

    setPlanForm({
      title: plan.title,
      slug: plan.slug || '',
      icon: plan.icon || 'Coffee',
      description: plan.description || '',
      content: formattedContent,
      investment: plan.investment || '',
      is_premium: plan.is_premium,
      category: plan.category,
      cover_image: plan.cover_image || '',
      read_time: plan.read_time || '',
      is_published: plan.is_published || false
    });
    setActiveTab('business-plans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string, title: string, type: 'book' | 'business-plan' | 'blog') => {
    setItemToDelete({ id, title, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // In a real application, you would call an API to delete the item
      if (itemToDelete.type === 'book') {
        setBooks(books.filter(book => book.id !== itemToDelete.id));
      } else if (itemToDelete.type === 'business-plan') {
        setBusinessPlans(businessPlans.filter(plan => plan.id !== itemToDelete.id));
      } else if (itemToDelete.type === 'blog') {
        setBlogPosts(blogPosts.filter(post => post.id !== itemToDelete.id));
      }
      setSuccessMessage(`"${itemToDelete.title}" has been deleted successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Make sure the slug is URL-friendly
      const formattedSlug = planForm.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Format the content properly
      let formattedContent = planForm.content;

      // If content is a string but not JSON, convert it to structured format
      if (typeof formattedContent === 'string' && !formattedContent.trim().startsWith('{')) {
        try {
          const paragraphs = formattedContent.split('\n\n').filter(p => p.trim());
          const blocks = paragraphs.map(p => ({
            type: 'paragraph',
            text: p.trim()
          }));
          formattedContent = JSON.stringify({ blocks });
        } catch (err) {
          console.error('Error formatting content:', err);
          // Keep as is if there's an error
        }
      } else if (typeof formattedContent === 'object') {
        // If it's already an object, stringify it
        formattedContent = JSON.stringify(formattedContent);
      }

      // Prepare the business plan data
      const planData = {
        ...planForm,
        slug: formattedSlug,
        content: formattedContent,
        published_at: planForm.is_published ? new Date().toISOString() : null
      };

      if (editingPlan) {
        try {
          // Update the business plan in the database
          const updatedPlan = await updateBusinessPlan(editingPlan.id, planData);
          // Update the local state
          const updatedPlans = businessPlans.map(plan =>
            plan.id === editingPlan.id ? updatedPlan : plan
          );
          setBusinessPlans(updatedPlans);
          setSuccessMessage('Business plan updated successfully!');
          setEditingPlan(null);
        } catch (updateErr) {
          console.error('Error updating business plan:', updateErr);
          setError(updateErr instanceof Error ? updateErr.message : 'Failed to update business plan');
        }
      } else {
        try {
          // Add the new business plan to the database
          const newPlan = await addBusinessPlan(planData);
          setBusinessPlans(prev => [...prev, newPlan]);
          setSuccessMessage('Business plan added successfully!');
        } catch (addErr) {
          console.error('Error adding business plan:', addErr);
          setError(addErr instanceof Error ? addErr.message : 'Failed to add business plan');
        }
      }

      setPlanForm({
        title: '',
        slug: '',
        icon: 'Coffee',
        description: '',
        content: '',
        investment: '',
        is_premium: false,
        category: '',
        cover_image: '',
        read_time: '',
        is_published: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add business plan');
    } finally {
      setLoading(false);
    }
  };

  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  // Test Supabase connection
  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await testConnection();
      if (result.success) {
        setSuccessMessage('Connection to Supabase successful!');
      } else {
        setError(`Connection to Supabase failed: ${JSON.stringify(result.error)}`);
      }
    } catch (err) {
      setError(`Connection test error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Make sure the slug is URL-friendly
      const formattedSlug = blogForm.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Format the content properly
      let formattedContent = blogForm.content;

      // If content is a string but not JSON, convert it to structured format
      if (typeof formattedContent === 'string' && !formattedContent.trim().startsWith('{')) {
        try {
          const paragraphs = formattedContent.split('\n\n').filter(p => p.trim());
          const blocks = paragraphs.map(p => ({
            type: 'paragraph',
            text: p.trim()
          }));
          formattedContent = JSON.stringify({ blocks });
        } catch (err) {
          console.error('Error formatting content:', err);
          // Keep as is if there's an error
        }
      } else if (typeof formattedContent === 'object') {
        // If it's already an object, stringify it
        formattedContent = JSON.stringify(formattedContent);
      }

      // Prepare the blog post data with the content
      // Create a base object without potentially problematic fields
      let blogData = {
        title: blogForm.title,
        author: blogForm.author,
        category: blogForm.category || '',
        excerpt: blogForm.excerpt || '',
        content: formattedContent,
        cover_image: blogForm.cover_image || '',
        read_time: blogForm.read_time || '',
        is_published: blogForm.is_published
      };

      if (editingBlogPost) {
        try {
          // Update the blog post in the database
          const updatedPost = await updateBlogPost(editingBlogPost.id, blogData);
          // Update the local state
          const updatedPosts = blogPosts.map(post =>
            post.id === editingBlogPost.id ? updatedPost : post
          );
          setBlogPosts(updatedPosts);
          setSuccessMessage('Blog post updated successfully!');
          setEditingBlogPost(null);
        } catch (updateErr) {
          console.error('Error updating blog post:', updateErr);
          setError(updateErr instanceof Error ? updateErr.message : 'Failed to update blog post');
        }
      } else {
        try {
          // Add the new blog post to the database
          const newPost = await addBlogPost(blogData);
          setBlogPosts(prev => [...prev, newPost]);
          setSuccessMessage('Blog post added successfully!');
        } catch (addErr) {
          // If the table doesn't exist, show a more helpful error message
          if (addErr instanceof Error && addErr.message.includes('does not exist')) {
            setError('The blog_posts table does not exist yet. Please run the SQL script to create it.');
          } else if (addErr instanceof Error && addErr.message.includes('violates row-level security policy')) {
            setError('Failed to add blog post: Row-level security policy violation. Please run the fix_blog_posts_rls.sql script.');
          } else if (addErr instanceof Error && addErr.message.includes('Failed to fetch')) {
            setError('Network error: Could not connect to Supabase. Please check your internet connection and Supabase configuration. Try the "Test Supabase Connection" button on the Dashboard tab.');
          } else {
            console.error('Error adding blog post:', addErr);
            setError(addErr instanceof Error ? addErr.message : 'Failed to add blog post');
          }
        }
      }

      setBlogForm({
        title: '',
        slug: '',
        author: '',
        category: '',
        excerpt: '',
        content: '',
        cover_image: '',
        read_time: '',
        is_published: false,
        tags: []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Content Management</h1>

        {/* Tabs */}
        <div className="flex border-b border-[#4a2e1c] mb-6 overflow-x-auto">
          <button
            className={`py-3 px-6 font-medium whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="flex items-center gap-2">
              <BarChart size={18} />
              <span>Dashboard</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium whitespace-nowrap ${
              activeTab === 'books'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('books')}
          >
            <div className="flex items-center gap-2">
              <Book size={18} />
              <span>Books</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium whitespace-nowrap ${
              activeTab === 'business-plans'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('business-plans')}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid size={18} />
              <span>Business Plans</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium whitespace-nowrap ${
              activeTab === 'blog'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('blog')}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <span>Blog</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>Users</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            <div className="flex items-center gap-2">
              <BarChart size={18} />
              <span>Analytics</span>
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium whitespace-nowrap ${
              activeTab === 'seo'
                ? 'text-[#c9a52c] border-b-2 border-[#c9a52c]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('seo')}
          >
            <div className="flex items-center gap-2">
              <Search size={18} />
              <span>SEO</span>
            </div>
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-green-500" />
              <p className="text-green-400">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-400 hover:text-green-300"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <X size={20} className="text-red-500" />
              <p className="text-red-400">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Connection Test Button */}
            <div className="mb-6">
              <button
                onClick={handleTestConnection}
                className="gold-button flex items-center gap-2"
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test Supabase Connection'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-[#3a2819] p-3 rounded-lg">
                    <Book size={24} className="text-[#c9a52c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Book Summaries</h3>
                    <div className="flex gap-2 text-sm text-gray-300">
                      <span>Free: {freeBooks}</span>
                      <span>•</span>
                      <span>Premium: {premiumBooks}</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{books.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-[#3a2819] p-3 rounded-lg">
                    <LayoutGrid size={24} className="text-[#c9a52c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Business Plans</h3>
                    <div className="flex gap-2 text-sm text-gray-300">
                      <span>S: {smallBusinessPlans}</span>
                      <span>•</span>
                      <span>M: {mediumBusinessPlans}</span>
                      <span>•</span>
                      <span>L: {largeBusinessPlans}</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{businessPlans.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-[#3a2819] p-3 rounded-lg">
                    <Users size={24} className="text-[#c9a52c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Users</h3>
                    <div className="flex gap-2 text-sm text-gray-300">
                      <span>Active: 84</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">128</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-[#3a2819] p-3 rounded-lg">
                    <DollarSign size={24} className="text-[#c9a52c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Revenue</h3>
                    <div className="flex gap-2 text-sm text-gray-300">
                      <span>Recent: 17 purchases</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">$4,250</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions section removed as requested */}

            {/* Content Overview */}
            <div className="glass-card p-6 rounded-xl mb-8">
              <h2 className="text-xl font-bold mb-4">Content Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">Book Categories</h3>
                  <div className="space-y-3">
                    {Array.from(new Set(books.map(book => book.category))).map(category => {
                      const count = books.filter(book => book.category === category).length;
                      const percentage = Math.round((count / books.length) * 100);
                      return (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{category}</span>
                            <span className="text-sm">{count} books ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-[#2d1e14] rounded-full h-2">
                            <div
                              className="bg-[#c9a52c] h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Content Distribution</h3>
                  <div className="bg-[#2d1e14] rounded-lg p-6 h-[200px] flex items-center justify-center">
                    <div className="flex gap-8">
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-2">
                          <div className="absolute inset-0 rounded-full border-8 border-[#c9a52c] opacity-25"></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#c9a52c]"
                            style={{
                              transform: `rotate(${Math.round((books.length / (books.length + businessPlans.length)) * 360)}deg)`,
                              transition: 'transform 1s ease-in-out'
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{Math.round((books.length / (books.length + businessPlans.length)) * 100)}%</span>
                          </div>
                        </div>
                        <span className="text-sm">Books</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-2">
                          <div className="absolute inset-0 rounded-full border-8 border-[#c9a52c] opacity-25"></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#c9a52c]"
                            style={{
                              transform: `rotate(${Math.round((businessPlans.length / (books.length + businessPlans.length)) * 360)}deg)`,
                              transition: 'transform 1s ease-in-out'
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{Math.round((businessPlans.length / (books.length + businessPlans.length)) * 100)}%</span>
                          </div>
                        </div>
                        <span className="text-sm">Business Plans</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>





            {/* System Status */}
            <div className="glass-card p-6 rounded-xl mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">System Status</h2>
                <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">All Systems Operational</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Database</h3>
                    <span className="flex items-center gap-1 text-green-400 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      Healthy
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Response Time</span>
                    <span>42ms</span>
                  </div>
                </div>

                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">API</h3>
                    <span className="flex items-center gap-1 text-green-400 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      Healthy
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Response Time</span>
                    <span>87ms</span>
                  </div>
                </div>

                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Storage</h3>
                    <span className="flex items-center gap-1 text-green-400 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      Healthy
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Usage</span>
                    <span>42% of 10GB</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Recent System Events</h3>
                <div className="space-y-2">
                  <div className="bg-[#2d1e14] rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm">Database backup completed</span>
                    </div>
                    <span className="text-xs text-gray-400">Today, 03:15 AM</span>
                  </div>

                  <div className="bg-[#2d1e14] rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-sm">API response time increased temporarily</span>
                    </div>
                    <span className="text-xs text-gray-400">Yesterday, 2:42 PM</span>
                  </div>

                  <div className="bg-[#2d1e14] rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm">System update completed</span>
                    </div>
                    <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 rounded-xl md:col-span-2">
                <h2 className="text-xl font-bold mb-4">Recent Content</h2>
                <div className="space-y-4">
                  {recentContent.map(item => {
                    const isBook = 'author' in item;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-[#2d1e14] rounded-lg">
                        <div className="flex items-center gap-3">
                          {isBook ? (
                            <Book size={18} className="text-[#c9a52c]" />
                          ) : (
                            <LayoutGrid size={18} className="text-[#c9a52c]" />
                          )}
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-400">
                              {isBook
                                ? `Book by ${(item as BookType).author}`
                                : `Business Plan - ${item.category}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteClick(item.id, item.title, isBook ? 'book' : 'business-plan')}
                            className="p-2 bg-[#3a2819] rounded-full hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <Trash size={14} className="text-red-400" />
                          </button>
                          {isBook && (
                            <button
                              onClick={() => handleEditBook(item as BookType)}
                              className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} className="text-[#c9a52c]" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-[#2d1e14] rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-[#c9a52c]" />
                      <span>Avg. Reading Time</span>
                    </div>
                    <span className="font-medium">12 min</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-[#2d1e14] rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-[#c9a52c]" />
                      <span>Most Popular Category</span>
                    </div>
                    <span className="font-medium">Business</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-[#2d1e14] rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-[#c9a52c]" />
                      <span>Avg. Revenue/User</span>
                    </div>
                    <span className="font-medium">$33.20</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Management Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setActiveTab('books')}
                className="glass-card p-6 rounded-xl hover:bg-[#2d1e14] transition-colors flex items-center gap-4"
              >
                <div className="bg-[#3a2819] p-3 rounded-lg">
                  <Book size={24} className="text-[#c9a52c]" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Manage Books</h3>
                  <p className="text-sm text-gray-400">Add, edit, or delete book summaries</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('business-plans')}
                className="glass-card p-6 rounded-xl hover:bg-[#2d1e14] transition-colors flex items-center gap-4"
              >
                <div className="bg-[#3a2819] p-3 rounded-lg">
                  <LayoutGrid size={24} className="text-[#c9a52c]" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Manage Business Plans</h3>
                  <p className="text-sm text-gray-400">Add, edit, or delete business plans</p>
                </div>
              </button>

              <div className="glass-card p-6 rounded-xl flex items-center gap-4">
                <div className="bg-[#3a2819] p-3 rounded-lg">
                  <Users size={24} className="text-[#c9a52c]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Manage Users</h3>
                  <p className="text-sm text-gray-400">View and manage user accounts</p>
                </div>
              </div>
            </div>

            {/* Subscription Analytics */}
            <div className="glass-card p-6 rounded-xl mb-8">
              <h2 className="text-xl font-bold mb-4">Subscription Analytics</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Monthly Subscriptions</h3>
                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Jan</span>
                    <span className="text-sm text-gray-400">Feb</span>
                    <span className="text-sm text-gray-400">Mar</span>
                    <span className="text-sm text-gray-400">Apr</span>
                    <span className="text-sm text-gray-400">May</span>
                    <span className="text-sm text-gray-400">Jun</span>
                  </div>
                  <div className="flex items-end h-24 gap-1">
                    <div style={{ height: '40%' }} className="flex-1 bg-[#c9a52c] rounded-t"></div>
                    <div style={{ height: '60%' }} className="flex-1 bg-[#c9a52c] rounded-t"></div>
                    <div style={{ height: '45%' }} className="flex-1 bg-[#c9a52c] rounded-t"></div>
                    <div style={{ height: '70%' }} className="flex-1 bg-[#c9a52c] rounded-t"></div>
                    <div style={{ height: '85%' }} className="flex-1 bg-[#c9a52c] rounded-t"></div>
                    <div style={{ height: '75%' }} className="flex-1 bg-[#c9a52c] rounded-t"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Active Subscriptions</h4>
                  <p className="text-2xl font-bold">84</p>
                  <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                    <TrendingUp size={14} />
                    <span>+12% this month</span>
                  </div>
                </div>

                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Avg. Subscription Length</h4>
                  <p className="text-2xl font-bold">4.2 months</p>
                  <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                    <TrendingUp size={14} />
                    <span>+0.5 from last quarter</span>
                  </div>
                </div>

                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <h4 className="text-sm text-gray-400 mb-1">Monthly Recurring Revenue</h4>
                  <p className="text-2xl font-bold">$2,520</p>
                  <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                    <TrendingUp size={14} />
                    <span>+18% this month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Growth */}
            <div className="glass-card p-6 rounded-xl mb-8">
              <h2 className="text-xl font-bold mb-4">Subscription Growth</h2>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Monthly Subscriptions</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <TrendingUp size={12} />
                      +24% from last month
                    </span>
                  </div>
                </div>

                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <div className="flex justify-between items-end h-40 gap-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                      // Generate random heights for the bars with an upward trend
                      const baseHeight = 20 + index * 5;
                      const randomVariation = Math.floor(Math.random() * 15);
                      const height = baseHeight + randomVariation;

                      return (
                        <div key={month} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full bg-[#c9a52c] rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="text-xs text-gray-400 mt-2">{month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-1">New Subscribers</h3>
                  <p className="text-2xl font-bold">24</p>
                  <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                    <TrendingUp size={12} />
                    <span>+8 from last week</span>
                  </div>
                </div>

                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-1">Renewal Rate</h3>
                  <p className="text-2xl font-bold">92%</p>
                  <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                    <TrendingUp size={12} />
                    <span>+3% from last month</span>
                  </div>
                </div>

                <div className="bg-[#2d1e14] rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-1">Avg. Subscription Value</h3>
                  <p className="text-2xl font-bold">$42.50</p>
                  <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                    <TrendingUp size={12} />
                    <span>+$2.75 from last month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Book Form */}
        {activeTab === 'books' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
              {editingBook && (
                <button
                  onClick={() => {
                    setEditingBook(null);
                    setBookForm({
                      title: '',
                      slug: '',
                      author: '',
                      category: '',
                      is_premium: false,
                      is_published: false,
                      description: '',
                      read_time: '',
                      cover_image: '',
                      content: ''
                    });
                  }}
                  className="text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <X size={16} />
                  <span>Cancel Edit</span>
                </button>
              )}
            </div>
            <form onSubmit={handleBookSubmit} className="glass-card p-6 rounded-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      // Auto-generate slug from title if slug is empty
                      const slug = bookForm.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setBookForm({ ...bookForm, title, slug });
                    }}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={bookForm.slug}
                    onChange={(e) => setBookForm({ ...bookForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                    placeholder="enter-url-friendly-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={bookForm.author}
                    onChange={handleBookFormChange}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={bookForm.category}
                    onChange={handleBookFormChange}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="read_time"
                    value={bookForm.read_time}
                    onChange={handleBookFormChange}
                    placeholder="e.g. 10 min"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    name="cover_image"
                    value={bookForm.cover_image}
                    onChange={handleBookFormChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_premium_book"
                      name="is_premium"
                      checked={bookForm.is_premium}
                      onChange={handleBookFormChange}
                      className="mr-2 h-4 w-4 accent-[#c9a52c]"
                    />
                    <label htmlFor="is_premium_book" className="text-sm font-medium text-gray-300">
                      Premium Content
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published_book"
                      name="is_published"
                      checked={bookForm.is_published}
                      onChange={handleBookFormChange}
                      className="mr-2 h-4 w-4 accent-[#c9a52c]"
                    />
                    <label htmlFor="is_published_book" className="text-sm font-medium text-gray-300">
                      Publish Immediately
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={bookForm.description}
                  onChange={handleBookFormChange}
                  rows={4}
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  placeholder="Enter a brief summary of the book"
                ></textarea>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={typeof bookForm.content === 'string' ? bookForm.content : JSON.stringify(bookForm.content, null, 2)}
                  onChange={(e) => {
                    try {
                      // Try to parse as JSON first
                      if (e.target.value.trim().startsWith('{')) {
                        const jsonContent = JSON.parse(e.target.value);
                        setBookForm({ ...bookForm, content: jsonContent });
                      } else {
                        // If not JSON, treat as plain text and convert to structured format
                        const paragraphs = e.target.value.split('\n\n').filter(p => p.trim());
                        const blocks = paragraphs.map(p => ({
                          type: 'paragraph',
                          text: p.trim()
                        }));

                        // Store as JSON string
                        setBookForm({
                          ...bookForm,
                          content: JSON.stringify({ blocks }, null, 2)
                        });
                      }
                    } catch (err) {
                      // If JSON parsing fails, just store as plain text
                      setBookForm({ ...bookForm, content: e.target.value });
                    }
                  }}
                  required
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c] h-64 font-mono"
                  placeholder="Write your book content here..."
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">You can use structured JSON content with blocks for paragraphs, headings, and lists. Example:</p>
                <pre className="text-xs text-gray-400 mt-1 bg-[#2d1e14] p-2 rounded overflow-auto">{`{
  "blocks": [
    { "type": "paragraph", "text": "Your paragraph text here" },
    { "type": "heading", "text": "Your heading", "level": 2 },
    { "type": "list", "style": "unordered", "items": ["Item 1", "Item 2"] }
  ]
}`}</pre>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-button flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span>{editingBook ? 'Update Book' : 'Add Book'}</span>
                </button>
              </div>
            </form>

            <div className="glass-card p-6 rounded-xl mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Existing Books ({filteredBooks.length})</h2>

                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="gold-button flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span>Add New Book</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Search Bar */}
                <div className="relative col-span-1 md:col-span-2">
                  <input
                    type="text"
                    placeholder="Search by title, author, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#2d1e14] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                >
                  {bookCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'all' ? 'bg-[#c9a52c] text-black' : 'bg-[#2d1e14] text-gray-300'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('Business')}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'Business' ? 'bg-[#c9a52c] text-black' : 'bg-[#2d1e14] text-gray-300'}`}
                >
                  Business
                </button>
                <button
                  onClick={() => setSelectedCategory('Self-Help')}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'Self-Help' ? 'bg-[#c9a52c] text-black' : 'bg-[#2d1e14] text-gray-300'}`}
                >
                  Self-Help
                </button>
                <button
                  onClick={() => setSelectedCategory('Marketing')}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'Marketing' ? 'bg-[#c9a52c] text-black' : 'bg-[#2d1e14] text-gray-300'}`}
                >
                  Marketing
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm bg-[#2d1e14] text-gray-300`}
                >
                  + Add Category
                </button>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <span className="text-sm text-gray-400">Filter:</span>
                  <button className="px-3 py-1 rounded-full text-sm bg-[#2d1e14] text-gray-300 flex items-center gap-1">
                    <span>Premium</span>
                    <X size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex bg-[#2d1e14] rounded-lg overflow-hidden">
                    <button className="px-3 py-1 bg-[#c9a52c] text-black text-sm">
                      Grid
                    </button>
                    <button className="px-3 py-1 text-gray-300 text-sm">
                      Table
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Sort by:</span>
                    <select className="bg-[#2d1e14] rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a52c]">
                      <option>Newest First</option>
                      <option>Oldest First</option>
                      <option>Title A-Z</option>
                      <option>Title Z-A</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Batch Operations */}
              <div className="flex items-center justify-between p-3 bg-[#2d1e14] rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#c9a52c]" />
                  <span className="text-sm">Select All</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-[#3a2819] rounded-lg hover:bg-[#4a2e1c] transition-colors">
                    Bulk Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors">
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="glass-card p-8 rounded-xl text-center">
                <Book size={32} className="mx-auto text-gray-500 mb-2" />
                <p className="text-gray-400 mb-2">No books found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-[#c9a52c] hover:text-[#e6b93d] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map(book => (
                  <div key={book.id} className="glass-card rounded-xl p-4 relative group hover:bg-[#2d1e14] transition-colors border-2 border-transparent hover:border-[#3a2819]">
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 left-3 z-10">
                      <input type="checkbox" className="h-4 w-4 accent-[#c9a52c]" />
                    </div>
                    {/* Book Cover */}
                    <div className="aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-[#3a2819] flex items-center justify-center">
                      {book.cover_image ? (
                        <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <Book size={32} className="text-gray-600" />
                      )}
                    </div>

                    {/* Book Info */}
                    <h3 className="font-bold mb-1 pr-16">{book.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">by {book.author}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded">
                        {book.category}
                      </span>
                      {book.is_premium && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 py-1 px-2 rounded">
                          Premium
                        </span>
                      )}
                      {book.read_time && (
                        <span className="text-xs bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded flex items-center gap-1">
                          <Clock size={10} />
                          {book.read_time}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`/books/${book.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                        title="View"
                      >
                        <Eye size={16} className="text-[#c9a52c]" />
                      </a>
                      <button
                        onClick={() => handleEditBook(book)}
                        className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} className="text-[#c9a52c]" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(book.id, book.title, 'book')}
                        className="p-2 bg-[#3a2819] rounded-full hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Business Plan Form */}
        {activeTab === 'business-plans' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingPlan ? 'Edit Business Plan' : 'Add New Business Plan'}</h2>
              {editingPlan && (
                <button
                  onClick={() => {
                    setEditingPlan(null);
                    setPlanForm({
                      title: '',
                      slug: '',
                      icon: 'Coffee',
                      description: '',
                      content: '',
                      investment: '',
                      is_premium: false,
                      category: '',
                      cover_image: '',
                      read_time: '',
                      is_published: false
                    });
                  }}
                  className="text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <X size={16} />
                  <span>Cancel Edit</span>
                </button>
              )}
            </div>
            <form onSubmit={handlePlanSubmit} className="glass-card p-6 rounded-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={planForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      // Auto-generate slug from title if slug is empty
                      const slug = planForm.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setPlanForm({ ...planForm, title, slug });
                    }}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={planForm.slug}
                    onChange={(e) => setPlanForm({ ...planForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                    placeholder="enter-url-friendly-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Icon <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="icon"
                    value={planForm.icon}
                    onChange={handlePlanFormChange}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="ShoppingBag">Shopping Bag</option>
                    <option value="Utensils">Utensils</option>
                    <option value="Truck">Truck</option>
                    <option value="TrendingUp">Trending Up</option>
                    <option value="Wifi">Wifi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={planForm.category}
                    onChange={handlePlanFormChange}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Investment Range <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="investment"
                    value={planForm.investment}
                    onChange={handlePlanFormChange}
                    placeholder="e.g. $1,000 - $10,000"
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="read_time"
                    value={planForm.read_time}
                    onChange={handlePlanFormChange}
                    placeholder="E.g., 5 min read"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    name="cover_image"
                    value={planForm.cover_image}
                    onChange={handlePlanFormChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_premium_plan"
                      name="is_premium"
                      checked={planForm.is_premium}
                      onChange={handlePlanFormChange}
                      className="mr-2 h-4 w-4 accent-[#c9a52c]"
                    />
                    <label htmlFor="is_premium_plan" className="text-sm font-medium text-gray-300">
                      Premium Content
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published_plan"
                      name="is_published"
                      checked={planForm.is_published}
                      onChange={handlePlanFormChange}
                      className="mr-2 h-4 w-4 accent-[#c9a52c]"
                    />
                    <label htmlFor="is_published_plan" className="text-sm font-medium text-gray-300">
                      Publish Immediately
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={planForm.description}
                  onChange={handlePlanFormChange}
                  rows={4}
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  placeholder="Enter a brief summary of the business plan"
                ></textarea>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={typeof planForm.content === 'string' ? planForm.content : JSON.stringify(planForm.content, null, 2)}
                  onChange={(e) => {
                    try {
                      // Try to parse as JSON first
                      if (e.target.value.trim().startsWith('{')) {
                        const jsonContent = JSON.parse(e.target.value);
                        setPlanForm({ ...planForm, content: jsonContent });
                      } else {
                        // If not JSON, treat as plain text and convert to structured format
                        const paragraphs = e.target.value.split('\n\n').filter(p => p.trim());
                        const blocks = paragraphs.map(p => ({
                          type: 'paragraph',
                          text: p.trim()
                        }));

                        // Store as JSON string
                        setPlanForm({
                          ...planForm,
                          content: JSON.stringify({ blocks }, null, 2)
                        });
                      }
                    } catch (err) {
                      // If JSON parsing fails, just store as plain text
                      setPlanForm({ ...planForm, content: e.target.value });
                    }
                  }}
                  required
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c] h-64 font-mono"
                  placeholder="Write your business plan content here..."
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">You can use structured JSON content with blocks for paragraphs, headings, and lists. Example:</p>
                <pre className="text-xs text-gray-400 mt-1 bg-[#2d1e14] p-2 rounded overflow-auto">{`{
  "blocks": [
    { "type": "paragraph", "text": "Your paragraph text here" },
    { "type": "heading", "text": "Your heading", "level": 2 },
    { "type": "list", "style": "unordered", "items": ["Item 1", "Item 2"] }
  ]
}`}</pre>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-button flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span>{editingPlan ? 'Update Business Plan' : 'Add Business Plan'}</span>
                </button>
              </div>
            </form>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Existing Business Plans ({filteredBusinessPlans.length})</h2>

              <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search plans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#2d1e14] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                >
                  {planCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredBusinessPlans.length === 0 ? (
              <div className="glass-card p-8 rounded-xl text-center">
                <LayoutGrid size={32} className="mx-auto text-gray-500 mb-2" />
                <p className="text-gray-400 mb-2">No business plans found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-[#c9a52c] hover:text-[#e6b93d] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinessPlans.map(plan => (
                  <div key={plan.id} className="bg-[#2d1e14] rounded-xl p-4 relative group">
                    {/* Plan Icon */}
                    <div className="w-16 h-16 mb-3 bg-[#3a2819] rounded-lg flex items-center justify-center">
                      <LayoutGrid size={32} className="text-[#c9a52c]" />
                    </div>

                    {/* Plan Info */}
                    <h3 className="font-bold mb-1 pr-16">{plan.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{plan.description}</p>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="text-xs bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded">
                        {plan.category}
                      </span>
                      <span className="text-xs bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded">
                        {plan.investment}
                      </span>
                      {plan.read_time && (
                        <span className="text-xs bg-[#3a2819] text-gray-400 py-1 px-2 rounded flex items-center">
                          <Clock size={12} className="mr-1" />
                          {plan.read_time}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      {plan.is_premium && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 py-1 px-2 rounded">
                          Premium
                        </span>
                      )}
                      {plan.is_published ? (
                        <span className="text-xs bg-green-500/20 text-green-400 py-1 px-2 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 py-1 px-2 rounded">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} className="text-[#c9a52c]" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(plan.id, plan.title, 'business-plan')}
                        className="p-2 bg-[#3a2819] rounded-full hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>

              <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#2d1e14] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-xl overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#2d1e14]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3a2819]">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#2d1e14]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#3a2819] rounded-full overflow-hidden flex items-center justify-center">
                              <Users size={18} className="text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-[#3a2819] text-[#c9a52c]">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'Active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.subscription === 'Premium'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.subscription}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.joined_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} className="text-[#c9a52c]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users size={32} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-400">No users found matching your criteria.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-[#c9a52c] hover:text-[#e6b93d] transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Active Users</h3>
                <p className="text-3xl font-bold">{users.filter(user => user.status === 'Active').length}</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Premium Users</h3>
                <p className="text-3xl font-bold">{users.filter(user => user.subscription === 'Premium').length}</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Free Users</h3>
                <p className="text-3xl font-bold">{users.filter(user => user.subscription === 'Free').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Content Analytics</h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Total Views</h3>
                <p className="text-3xl font-bold">12,458</p>
                <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                  <TrendingUp size={14} />
                  <span>+18% this month</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Avg. Time on Page</h3>
                <p className="text-3xl font-bold">4:32</p>
                <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                  <TrendingUp size={14} />
                  <span>+2:15 from last month</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
                <p className="text-3xl font-bold">8.7%</p>
                <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                  <TrendingUp size={14} />
                  <span>+1.2% this month</span>
                </div>
              </div>
            </div>

            {/* Content Performance */}
            <div className="glass-card p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold mb-4">Top Performing Content</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#2d1e14]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Content</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Avg. Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3a2819]">
                    {books.slice(0, 3).map((book) => (
                      <tr key={book.id} className="hover:bg-[#2d1e14]">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#3a2819] rounded-md overflow-hidden">
                              {book.cover_image ? (
                                <img src={book.cover_image} alt={book.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Book size={18} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{book.title}</div>
                              <div className="text-sm text-gray-400">{book.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-[#3a2819] text-[#c9a52c]">
                            Book
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">{Math.floor(Math.random() * 1000) + 500}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">{Math.floor(Math.random() * 5) + 2}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">{(Math.random() * 10).toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Blog Post Form */}
        {activeTab === 'blog' && (
          <div>
            {/* Table Creation Message */}
            {blogPosts.length === 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-2">Blog Posts Table Not Found</h3>
                <p className="text-gray-300 mb-4">
                  It appears that the <code className="bg-[#2d1e14] px-1 py-0.5 rounded">blog_posts</code> table doesn't exist in your database yet.
                  You need to create this table before you can add blog posts.
                </p>
                <p className="text-gray-300 mb-4">
                  I've created a SQL script for you: <code className="bg-[#2d1e14] px-1 py-0.5 rounded">create_blog_posts_table.sql</code>.
                  Please run this script in your Supabase SQL Editor to create the necessary table.
                </p>
                <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
                  <li>Go to your <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer" className="text-[#c9a52c] hover:underline">Supabase Dashboard</a></li>
                  <li>Select your project</li>
                  <li>Go to the SQL Editor</li>
                  <li>Copy the contents of the <code className="bg-[#2d1e14] px-1 py-0.5 rounded">create_blog_posts_table.sql</code> file</li>
                  <li>Paste it into the SQL Editor and run the query</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingBlogPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
              {editingBlogPost && (
                <button
                  onClick={() => {
                    setEditingBlogPost(null);
                    setBlogForm({
                      title: '',
                      slug: '',
                      author: '',
                      category: '',
                      excerpt: '',
                      content: '',
                      cover_image: '',
                      read_time: '',
                      is_published: false,
                      tags: []
                    });
                  }}
                  className="text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <X size={16} />
                  <span>Cancel Edit</span>
                </button>
              )}
            </div>

            <form onSubmit={handleBlogSubmit} className="glass-card p-6 rounded-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      // Auto-generate slug from title if slug is empty
                      const slug = blogForm.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setBlogForm({ ...blogForm, title, slug });
                    }}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                    placeholder="Enter blog post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                    placeholder="enter-url-friendly-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    required
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                    placeholder="E.g., Business Tips, Marketing, Leadership"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={blogForm.read_time}
                    onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                    placeholder="E.g., 5 min read"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={blogForm.cover_image || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, cover_image: e.target.value })}
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={blogForm.is_published}
                    onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-[#c9a52c] focus:ring-[#c9a52c]"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium text-gray-300">
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Excerpt / Summary
                </label>
                <textarea
                  value={blogForm.excerpt || ''}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c] h-24"
                  placeholder="Enter a brief summary of the blog post"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={typeof blogForm.content === 'string' ? blogForm.content : JSON.stringify(blogForm.content, null, 2)}
                  onChange={(e) => {
                    try {
                      // Try to parse as JSON first
                      if (e.target.value.trim().startsWith('{')) {
                        const jsonContent = JSON.parse(e.target.value);
                        setBlogForm({ ...blogForm, content: jsonContent });
                      } else {
                        // If not JSON, treat as plain text and convert to structured format
                        const paragraphs = e.target.value.split('\n\n').filter(p => p.trim());
                        const blocks = paragraphs.map(p => ({
                          type: 'paragraph',
                          text: p.trim()
                        }));

                        // Store as JSON string
                        setBlogForm({
                          ...blogForm,
                          content: JSON.stringify({ blocks }, null, 2)
                        });
                      }
                    } catch (err) {
                      // If JSON parsing fails, just store as plain text
                      setBlogForm({ ...blogForm, content: e.target.value });
                    }
                  }}
                  required
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c] h-64 font-mono"
                  placeholder="Write your blog post content here..."
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">You can use structured JSON content with blocks for paragraphs, headings, and lists. Example:</p>
                <pre className="text-xs text-gray-400 mt-1 bg-[#2d1e14] p-2 rounded overflow-auto">{`{
  "blocks": [
    { "type": "paragraph", "text": "Your paragraph text here" },
    { "type": "heading", "text": "Your heading", "level": 2 },
    { "type": "list", "style": "unordered", "items": ["Item 1", "Item 2"] }
  ]
}`}</pre>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-button flex items-center gap-2"
                >
                  {loading ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      {editingBlogPost ? <Save size={18} /> : <Plus size={18} />}
                      <span>{editingBlogPost ? 'Update Blog Post' : 'Add Blog Post'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="glass-card p-6 rounded-xl mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Existing Blog Posts ({blogPosts.length})</h2>

                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="gold-button flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span>Add New Post</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3a2819]">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Author</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="border-b border-[#3a2819] hover:bg-[#2d1e14]">
                        <td className="py-3 px-4">{post.title}</td>
                        <td className="py-3 px-4">{post.author}</td>
                        <td className="py-3 px-4">{post.category}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${post.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(post.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingBlogPost(post);
                                // Format the content for editing
                                let formattedContent = post.content || '';

                                // If content is a string that looks like JSON, try to parse it for better editing
                                if (typeof formattedContent === 'string' && formattedContent.trim().startsWith('{')) {
                                  try {
                                    // Try to parse and re-stringify with formatting
                                    const parsed = JSON.parse(formattedContent);
                                    formattedContent = JSON.stringify(parsed, null, 2);
                                  } catch (err) {
                                    console.warn('Could not parse content as JSON:', err);
                                    // Keep as is if parsing fails
                                  }
                                }

                                setBlogForm({
                                  title: post.title,
                                  slug: post.slug || '',
                                  author: post.author,
                                  category: post.category || '',
                                  excerpt: post.excerpt || '',
                                  content: formattedContent,
                                  cover_image: post.cover_image || '',
                                  read_time: post.read_time || '',
                                  is_published: post.is_published,
                                  tags: post.tags || []
                                });
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} className="text-[#c9a52c]" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(post.id, post.title, 'blog')}
                              className="p-2 bg-[#3a2819] rounded-full hover:bg-red-900/30 transition-colors"
                              title="Delete"
                            >
                              <Trash size={14} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SEO Settings */}
        {activeTab === 'seo' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">SEO Settings</h2>

            <div className="glass-card p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold mb-4">Website SEO</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Site Title
                  </label>
                  <input
                    type="text"
                    defaultValue="LaunchPad - Book Summaries & Business Plans"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    defaultValue="LaunchPad provides concise book summaries and ready-to-use business plans to help entrepreneurs and business professionals save time and accelerate growth."
                    rows={3}
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  ></textarea>
                  <p className="text-xs text-gray-400 mt-1">155 characters (recommended: 150-160)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    defaultValue="book summaries, business plans, entrepreneurship, startup ideas, business growth"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                  <p className="text-xs text-gray-400 mt-1">Separate keywords with commas</p>
                </div>

                <div className="flex justify-end">
                  <button className="gold-button">
                    Save Website SEO
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold mb-4">Content SEO</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Select Content Type
                </label>
                <select
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                >
                  <option>Book Summaries</option>
                  <option>Business Plans</option>
                  <option>Blog Posts</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Select Content
                </label>
                <select
                  className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                >
                  {books.map(book => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    defaultValue="The Lean Startup Summary - Key Insights & Takeaways | LaunchPad"
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  />
                  <p className="text-xs text-gray-400 mt-1">58 characters (recommended: 50-60)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    defaultValue="Our concise summary of The Lean Startup by Eric Ries covers all key concepts, methodologies, and actionable insights to help you implement lean principles in your business."
                    rows={3}
                    className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                  ></textarea>
                  <p className="text-xs text-gray-400 mt-1">158 characters (recommended: 150-160)</p>
                </div>

                <div className="flex justify-end">
                  <button className="gold-button">
                    Save Content SEO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2d1e14] rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete <span className="text-[#c9a52c] font-medium">"{itemToDelete.title}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-[#3a2819] rounded-lg hover:bg-[#4a2e1c] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagementPage;
