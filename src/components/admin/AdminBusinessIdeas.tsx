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
  Briefcase
} from 'lucide-react';

// Mock data for business ideas
const initialBusinessIdeas = [
  { 
    id: '1', 
    title: 'Coffee Export Business', 
    category: 'Large', 
    access: 'Full',
    description: 'A comprehensive guide to starting a coffee export business in Ethiopia, including sourcing, processing, and international market access.'
  },
  { 
    id: '2', 
    title: 'Mobile Phone Repair Shop', 
    category: 'Small', 
    access: 'Free',
    description: 'How to start a mobile phone repair business with minimal capital investment. Includes training resources and supplier connections.'
  },
  { 
    id: '3', 
    title: 'Organic Honey Production', 
    category: 'Middle', 
    access: 'Category',
    description: 'A step-by-step guide to starting an organic honey production business, including beekeeping techniques, certification, and marketing strategies.'
  },
  { 
    id: '4', 
    title: 'Digital Marketing Agency', 
    category: 'Small', 
    access: 'Category',
    description: 'How to establish a digital marketing agency focusing on local businesses. Includes service packages, pricing strategies, and client acquisition techniques.'
  },
  { 
    id: '5', 
    title: 'Textile Manufacturing', 
    category: 'Large', 
    access: 'Full',
    description: 'A comprehensive business plan for setting up a textile manufacturing facility, including equipment sourcing, staffing, and export opportunities.'
  }
];

interface AdminBusinessIdeasProps {
  language: 'english' | 'amharic' | 'afaan-oromo';
}

const AdminBusinessIdeas: React.FC<AdminBusinessIdeasProps> = ({ language }) => {
  const [businessIdeas, setBusinessIdeas] = useState(initialBusinessIdeas);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAccess, setFilterAccess] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'Small',
    access: 'Free',
    description: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Filter business ideas based on search and filters
  const filteredIdeas = businessIdeas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || idea.category === filterCategory;
    const matchesAccess = filterAccess === 'all' || idea.access === filterAccess;
    
    return matchesSearch && matchesCategory && matchesAccess;
  });

  // Handle add/edit business idea
  const handleSaveIdea = () => {
    try {
      if (formData.id) {
        // Edit existing idea
        setBusinessIdeas(businessIdeas.map(idea => idea.id === formData.id ? formData : idea));
        setSuccessMessage('Business idea updated successfully!');
      } else {
        // Add new idea
        const newIdea = {
          ...formData,
          id: Date.now().toString()
        };
        setBusinessIdeas([...businessIdeas, newIdea]);
        setSuccessMessage('Business idea added successfully!');
      }
      setShowAddModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to save business idea. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  // Handle delete business idea
  const handleDeleteIdea = () => {
    try {
      if (selectedIdea) {
        setBusinessIdeas(businessIdeas.filter(idea => idea.id !== selectedIdea.id));
        setSuccessMessage('Business idea deleted successfully!');
      }
      setShowDeleteConfirm(false);
      setSelectedIdea(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to delete business idea. Please try again.');
      
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
      category: 'Small',
      access: 'Free',
      description: ''
    });
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (idea: any) => {
    setFormData(idea);
    setShowAddModal(true);
  };

  // Open preview modal
  const openPreviewModal = (idea: any) => {
    setSelectedIdea(idea);
    setShowPreviewModal(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (idea: any) => {
    setSelectedIdea(idea);
    setShowDeleteConfirm(true);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Manage Business Ideas</h1>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" />
          <span>Add New Idea</span>
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
                placeholder="Search business ideas by title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Small">Small</option>
                <option value="Middle">Middle</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterAccess}
                onChange={(e) => setFilterAccess(e.target.value)}
              >
                <option value="all">All Access</option>
                <option value="Free">Free</option>
                <option value="Category">Category</option>
                <option value="Full">Full</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Business Ideas Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIdeas.length > 0 ? (
                filteredIdeas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                          <Briefcase size={16} className="text-green-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{idea.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${idea.category === 'Small' ? 'bg-blue-100 text-blue-800' : 
                          idea.category === 'Middle' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {idea.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${idea.access === 'Free' ? 'bg-green-100 text-green-800' : 
                          idea.access === 'Category' ? 'bg-purple-100 text-purple-800' : 
                          'bg-indigo-100 text-indigo-800'}`}>
                        {idea.access}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openPreviewModal(idea)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(idea)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(idea)}
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
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No business ideas found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Business Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {formData.id ? 'Edit Business Idea' : 'Add New Business Idea'}
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
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Small">Small</option>
                    <option value="Middle">Middle</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="access"
                    value={formData.access}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Free">Free</option>
                    <option value="Category">Category</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
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
                  onClick={handleSaveIdea}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {formData.id ? 'Update Idea' : 'Save Idea'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Business Idea Preview</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <Briefcase size={20} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedIdea.title}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${selectedIdea.category === 'Small' ? 'bg-blue-100 text-blue-800' : 
                      selectedIdea.category === 'Middle' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {selectedIdea.category} Business
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${selectedIdea.access === 'Free' ? 'bg-green-100 text-green-800' : 
                      selectedIdea.access === 'Category' ? 'bg-purple-100 text-purple-800' : 
                      'bg-indigo-100 text-indigo-800'}`}>
                    {selectedIdea.access} Access
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description:</h4>
                <p className="text-gray-600 whitespace-pre-line">{selectedIdea.description}</p>
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
      {showDeleteConfirm && selectedIdea && (
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
                Are you sure you want to delete the business idea "{selectedIdea.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteIdea}
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

export default AdminBusinessIdeas;
