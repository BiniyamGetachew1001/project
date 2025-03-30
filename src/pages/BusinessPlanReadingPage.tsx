import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { getBusinessPlanById } from '../lib/database';
import { useBookmarks } from '../contexts/BookmarkContext';
import type { BusinessPlan } from '../types/database';

const BusinessPlanReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'financial' | 'operations'>('overview');

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
      try {
        const data = await getBusinessPlanById(id);
        setPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch business plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleBookmark = () => {
    if (!plan) return;
    
    if (isBookmarked(plan.id)) {
      removeBookmark(plan.id);
    } else {
      addBookmark({
        id: plan.id,
        title: plan.title,
        type: 'business-plan',
        category: plan.category,
        description: plan.description || undefined
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#3a2819] rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-[#3a2819] rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-4 bg-[#3a2819] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-red-500">Error Loading Business Plan</h1>
          <p className="text-red-400">{error || 'Business plan not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/business-plans')}
            className="text-[#c9a52c] hover:text-[#e6b93d] transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{plan.title}</h1>
            <p className="text-gray-400">{plan.category}</p>
          </div>
          <button 
            onClick={handleBookmark}
            className="bg-[#2d1e14] p-3 rounded-lg text-[#c9a52c] hover:bg-[#3a2819] transition-colors"
          >
            {isBookmarked(plan.id) ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
          </button>
        </div>

        {/* Cover Image */}
        {plan.cover_image && (
          <div className="mb-8">
            <img 
              src={plan.cover_image} 
              alt={plan.title} 
              className="w-full h-64 md:h-96 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Investment Range */}
        <div className="bg-[#2d1e14] p-4 rounded-lg mb-8">
          <div className="text-sm text-gray-400 mb-1">Investment Range</div>
          <div className="text-lg font-medium">{plan.investment}</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'market', label: 'Market Analysis' },
            { id: 'financial', label: 'Financial Plan' },
            { id: 'operations', label: 'Operations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#c9a52c] text-black'
                  : 'bg-[#2d1e14] text-gray-300 hover:bg-[#3a2819]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Business Overview</h2>
              <p className="text-gray-300 mb-4">{plan.description}</p>
              <div className="bg-[#2d1e14] p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Key Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Comprehensive market analysis</li>
                  <li>Detailed financial projections</li>
                  <li>Operational strategies</li>
                  <li>Marketing and sales plans</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Market Analysis</h2>
              <div className="bg-[#2d1e14] p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Target Market</h3>
                <p className="text-gray-300 mb-4">
                  Detailed analysis of your target market, including demographics, 
                  psychographics, and market size.
                </p>
                <h3 className="text-lg font-bold mb-3">Competition</h3>
                <p className="text-gray-300">
                  Analysis of key competitors, market positioning, and competitive advantages.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Financial Projections</h2>
              <div className="bg-[#2d1e14] p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Startup Costs</h3>
                <p className="text-gray-300 mb-4">
                  Initial investment required: {plan.investment}
                </p>
                <h3 className="text-lg font-bold mb-3">Revenue Projections</h3>
                <p className="text-gray-300">
                  Three-year financial projections including revenue, expenses, and profit margins.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Operations Plan</h2>
              <div className="bg-[#2d1e14] p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Day-to-Day Operations</h3>
                <p className="text-gray-300 mb-4">
                  Detailed operational procedures, staffing requirements, and management structure.
                </p>
                <h3 className="text-lg font-bold mb-3">Quality Control</h3>
                <p className="text-gray-300">
                  Standards and procedures for maintaining quality and consistency.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanReadingPage; 