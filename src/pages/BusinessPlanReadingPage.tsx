import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Coffee, Lock, ShoppingBag, TrendingUp, Truck, Utensils, Wifi } from 'lucide-react';
import { businessPlans } from '../data/mockData';
import { useBookmarks } from '../contexts/BookmarkContext';

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee size={24} />,
  ShoppingBag: <ShoppingBag size={24} />,
  Utensils: <Utensils size={24} />,
  Truck: <Truck size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  Wifi: <Wifi size={24} />
};

const BusinessPlanReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'financial' | 'operations'>('overview');

  const plan = businessPlans.find(p => p.id === Number(id));
  if (!plan) {
    return <div className="p-6">Business plan not found</div>;
  }

  const handleBookmark = () => {
    if (isBookmarked(plan.id)) {
      removeBookmark(plan.id);
    } else {
      addBookmark({
        id: plan.id,
        title: plan.title,
        type: 'business-plan',
        category: plan.category,
        description: plan.description
      });
    }
  };

  return (
    <div className="p-6 md:p-10">
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
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#2d1e14] p-2 rounded-lg text-[#c9a52c]">
                {iconMap[plan.icon]}
              </div>
              <span className="text-sm bg-[#2d1e14] text-[#c9a52c] py-1 px-2 rounded-md">
                {plan.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{plan.title}</h1>
          </div>
          <button 
            onClick={handleBookmark}
            className="bg-[#2d1e14] p-3 rounded-lg text-[#c9a52c] hover:bg-[#3a2819] transition-colors"
          >
            {isBookmarked(plan.id) ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
          </button>
        </div>

        {/* Cover Image */}
        {plan.coverImage && (
          <div className="mb-8">
            <img 
              src={plan.coverImage} 
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
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['overview', 'market', 'financial', 'operations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#c9a52c] text-black'
                  : 'bg-[#2d1e14] text-gray-300 hover:bg-[#3a2819]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                  Detailed breakdown of initial investment requirements and startup expenses.
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