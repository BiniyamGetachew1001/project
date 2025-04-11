import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Eye, 
  Filter, 
  X, 
  Save,
  Check,
  AlertCircle,
  FileText,
  Calendar,
  Upload,
  Tag
} from 'lucide-react';

// Mock data for blog posts
const initialBlogPosts = [
  { 
    id: '1', 
    title: 'Top 10 Business Ideas for Ethiopian Entrepreneurs', 
    date: '2023-05-15',
    status: 'Published',
    tags: ['Business Ideas', 'Entrepreneurship', 'Ethiopia'],
    coverImage: 'https://images.unsplash.com/photo-1664575599736-c5197c684128',
    content: 'Ethiopia has a growing economy with many opportunities for entrepreneurs. Here are the top 10 business ideas that have potential for success in the Ethiopian market...'
  },
  { 
    id: '2', 
    title: 'How to Secure Funding for Your Startup in Ethiopia', 
    date: '2023-06-22',
    status: 'Published',
    tags: ['Funding', 'Startups', 'Finance'],
    coverImage: 'https://images.unsplash.com/photo-1559526324-593bc073d938',
    content: 'Securing funding is one of the biggest challenges for Ethiopian entrepreneurs. This guide explores various funding options available to startups in Ethiopia...'
  },
  { 
    id: '3', 
    title: 'The Impact of Digital Transformation on Ethiopian Businesses', 
    date: '2023-07-10',
    status: 'Draft',
    tags: ['Digital Transformation', 'Technology', 'Business Growth'],
    coverImage: '',
    content: 'Digital transformation is changing how businesses operate in Ethiopia. This article examines the impact of digital technologies on local businesses and how entrepreneurs can adapt...'
  },
  { 
    id: '4', 
    title: 'Success Stories: Ethiopian Entrepreneurs Who Made It Big', 
    date: '2023-08-05',
    status: 'Published',
    tags: ['Success Stories', 'Inspiration', 'Local Business'],
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
    content: 'Get inspired by these success stories of Ethiopian entrepreneurs who built successful businesses from the ground up. Learn about their challenges, strategies, and lessons learned...'
  },
  { 
    id: '5', 
    title: 'Marketing Strategies for Small Businesses in Ethiopia', 
    date: '2023-09-18',
    status: 'Draft',
    tags: ['Marketing', 'Small Business', 'Strategy'],
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3',
    content: 'Effective marketing is crucial for small business success. This post covers practical marketing strategies tailored for small businesses operating in the Ethiopian market...'
  }
];

interface AdminBlogProps {
  language: 'english' | 'amharic' | 'afaan-oromo';
}

const AdminBlog: React.FC<AdminBlogProps> = ({ language }) => {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Draft',
    tags: [] as string[],
    coverImage: '',
    content: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Filter blog posts based on search and filters
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle add/edit blog post
  const handleSavePost = () => {
    try {
      if (formData.id) {
        // Edit existing post
        setBlogPosts(blogPosts.map(post => post.id === formData.id ? formData : post));
        setSuccessMessage('Blog post updated successfully!');
      } else {
        // Add new post
        const newPost = {
          ...formData,
          id: Date.now().toString()
        };
        setBlogPosts([...blogPosts, newPost]);
        setSuccessMessage('Blog post added successfully!');
      }
      setShowAddModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to save blog post. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Handle delete blog post
  const handleDeletePost = () => {
    try {
      if (selectedPost) {
        setBlogPosts(blogPosts.filter(post => post.id !== selectedPost.id));
        setSuccessMessage('Blog post deleted successfully!');
      }
      setShowDeleteConfirm(false);
      setSelectedPost(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to delete blog post. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Handle publish/unpublish
  const handleTogglePublish = (post: any) => {
    try {
      const updatedPosts = blogPosts.map(p => {
        if (p.id === post.id) {
          const newStatus = p.status === 'Published' ? 'Draft' : 'Published';
          return { ...p, status: newStatus };
        }
        return p;
      });
      
      setBlogPosts(updatedPosts);
      setSuccessMessage(`Blog post ${post.status === 'Published' ? 'unpublished' : 'published'} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to update blog post status. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      id: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Draft',
      tags: [],
      coverImage: '',
      content: ''
    });
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (post: any) => {
    setFormData(post);
    setShowAddModal(true);
  };

  // Open preview modal
  const openPreviewModal = (post: any) => {
    setSelectedPost(post);
    setShowPreviewModal(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (post: any) => {
    setSelectedPost(post);
    setShowDeleteConfirm(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
          <Check size={18} className="mr-2" />
          <span>{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="ml-4 text-green-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
          <AlertCircle size={18} className="mr-2" />
          <span>{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)}
            className="ml-4 text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Manage Blog</h1>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" />
          <span>Add New Post</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blog posts by title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-full mr-3">
                          <FileText size={16} className="text-purple-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(post.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openPreviewModal(post)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(post)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className={`${post.status === 'Published' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                          title={post.status === 'Published' ? 'Unpublish' : 'Publish'}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(post)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No blog posts found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Blog Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {formData.id ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter blog post title"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image URL or upload"
                  />
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-r-lg"
                  >
                    <Upload size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter a URL or upload an image for the blog post cover</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm text-gray-700">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="w-full border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-r-lg"
                  >
                    <Tag size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Press Enter or click the tag icon to add a tag</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Write your blog post content here..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">You can use Markdown formatting for headings, lists, links, etc.</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePost}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {formData.id ? 'Update Post' : 'Save Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Blog Post Preview</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {selectedPost.coverImage && (
                <div className="mb-6">
                  <img 
                    src={selectedPost.coverImage} 
                    alt={selectedPost.title} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedPost.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(selectedPost.date)}</span>
                <span className="mx-2">•</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${selectedPost.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {selectedPost.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag: string, index: number) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{selectedPost.content}</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Confirm Delete</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete the blog post "{selectedPost.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
