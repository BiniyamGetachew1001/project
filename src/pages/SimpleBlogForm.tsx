import React, { useState } from 'react';
import { addBlogPost, testConnection } from '../lib/database';

const SimpleBlogForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: 'Test Blog Post',
    author: 'Admin',
    content: 'This is a test blog post content.',
    is_published: true
  });

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await testConnection();
      if (result.success) {
        setSuccess('Connection to Supabase successful!');
      } else {
        setError(`Connection to Supabase failed: ${JSON.stringify(result.error)}`);
      }
    } catch (err) {
      setError(`Connection test error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await addBlogPost(formData);
      setSuccess(`Blog post added successfully with ID: ${result.id}`);
    } catch (err) {
      console.error('Error adding blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to add blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Blog Post Form</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
          <p className="text-green-400">{success}</p>
        </div>
      )}
      
      <div className="mb-6">
        <button 
          onClick={handleTestConnection} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Supabase Connection'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 h-32"
            required
          ></textarea>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_published"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="is_published">Publish immediately</label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {loading ? 'Saving...' : 'Add Simple Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default SimpleBlogForm;
