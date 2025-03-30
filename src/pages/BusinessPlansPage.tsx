import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Coffee, Lock, ShoppingBag, TrendingUp, Truck, Utensils, Wifi, ChevronRight, Search, Filter } from 'lucide-react';
import { getBusinessPlans } from '../lib/database';
import type { BusinessPlan } from '../types/database';
import { useBookmarks } from '../contexts/BookmarkContext';

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee size={24} />,
  ShoppingBag: <ShoppingBag size={24} />,
  Utensils: <Utensils size={24} />,
  Truck: <Truck size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  Wifi: <Wifi size={24} />
};

const BusinessPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { isBookmarked } = useBookmarks();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getBusinessPlans();
        setPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch business plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Get unique categories and remove 'all'
  const categories = ['all', ...new Set(plans.map(plan => plan.category))].filter(Boolean);

  // Create a map of free plans (one from each category)
  const freePlanIds = useMemo(() => {
    const categoryPlans = new Map<string, string>();
    plans.forEach(plan => {
      if (plan.category && !categoryPlans.has(plan.category)) {
        categoryPlans.set(plan.category, plan.id);
      }
    });
    return new Set(categoryPlans.values());
  }, [plans]);

  // Function to determine if a plan should be free
  const isPlanFree = (planId: string) => freePlanIds.has(planId);

  // Sort plans to show free plans first
  const sortedPlans = [...plans].sort((a, b) => {
    const aIsFree = isPlanFree(a.id);
    const bIsFree = isPlanFree(b.id);
    if (aIsFree === bIsFree) return 0;
    return aIsFree ? -1 : 1;
  });

  const filteredPlans = sortedPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#3a2819] rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 bg-[#3a2819] rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-6">
            <h2 className="text-red-500 text-xl font-bold mb-2">Error Loading Business Plans</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Business Plans</h1>
            <p className="text-gray-400">
              Explore detailed business plans across various industries.
              <span className="text-[#c9a52c]"> One free plan from each category!</span>
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative flex-shrink-0 w-full md:w-64">
            <input
              type="text"
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2d1e14] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-[#c9a52c] text-black'
                  : 'bg-[#2d1e14] text-gray-300 hover:bg-[#3a2819]'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Business Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Link 
              key={plan.id} 
              to={isPlanFree(plan.id) ? `/business-plans/${plan.id}` : '/pricing'}
              className="block group"
            >
              <div className="bg-[#2d1e14] rounded-xl p-4 transition-transform hover:scale-[1.02]">
                {/* Card Image */}
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg mb-4">
                  {plan.cover_image ? (
                    <img
                      src={plan.cover_image}
                      alt={plan.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#3a2819] flex items-center justify-center">
                      <Filter size={32} className="text-gray-600" />
                    </div>
                  )}
                  {!isPlanFree(plan.id) && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center">
                        <Lock size={24} className="mx-auto mb-2 text-[#c9a52c]" />
                        <span className="text-[#c9a52c] font-medium">Premium</span>
                      </div>
                    </div>
                  )}
                  {isPlanFree(plan.id) && (
                    <div className="absolute top-2 right-2 bg-green-500/90 text-white px-2 py-1 rounded text-sm font-medium">
                      Free
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div>
                  <h3 className="font-bold mb-2 group-hover:text-[#c9a52c] transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded">
                      {plan.category}
                    </span>
                    <span className="text-sm text-[#c9a52c]">
                      {plan.investment}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No business plans found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessPlansPage;
