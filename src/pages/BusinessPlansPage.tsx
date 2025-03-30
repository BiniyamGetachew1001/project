import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Coffee, Lock, ShoppingBag, TrendingUp, Truck, Utensils, Wifi, ChevronRight, Search } from 'lucide-react';
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
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

  const handleBookmark = (e: React.MouseEvent, plan: BusinessPlan) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const categories = ['All', ...new Set(plans.map(plan => plan.category))];

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plan.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Loading Business Plans...</h1>
          <div className="animate-pulse">
            <div className="h-10 bg-[#3a2819] rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card aspect-[3/4]"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-red-500">Error Loading Business Plans</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Business Plans
          </h1>
          <p className="text-lg text-gray-300">
            Explore ready-to-use business plans for various industries
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search business plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-input rounded-md"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    selectedCategory === category
                      ? 'gold-button'
                      : 'glass-button'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Plans Grid */}
      <section className="py-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const bookmarked = isBookmarked(plan.id);
              const isLocked = !plan.is_premium;
              
              return (
                <Link 
                  key={plan.id} 
                  to={`/business-plans/${plan.id}`}
                  className="block group"
                >
                  <div className="bg-[#2d1e14] rounded-xl p-4 transition-transform hover:scale-[1.02]">
                    {/* Card Image */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={plan.cover_image || ''}
                        alt={plan.title}
                        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                          plan.is_premium ? 'opacity-50' : ''
                        }`}
                      />
                      {plan.is_premium && (
                        <div className="absolute top-2 right-2 bg-[#c9a52c] text-[#2d1e14] px-2 py-1 rounded text-sm font-medium">
                          Premium
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-[#c9a52c] transition-colors">
                        {plan.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{plan.category}</p>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#c9a52c]">Investment: {plan.investment}</span>
                        <ChevronRight size={20} className="text-[#c9a52c]" />
                      </div>
                    </div>

                    <button 
                      onClick={(e) => handleBookmark(e, plan)}
                      className="absolute top-3 right-3 bg-[#2d1e14] bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      {bookmarked ? (
                        <BookmarkCheck size={18} className="text-[#c9a52c]" />
                      ) : (
                        <Bookmark size={18} className="text-white" />
                      )}
                    </button>
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="text-center">
                          <Lock size={24} className="mx-auto mb-2 text-[#c9a52c]" />
                          <span className="px-3 py-1 rounded-full bg-[#c9a52c] text-black text-xs font-medium">
                            Premium Plan
                          </span>
                        </div>
                      </div>
                    )}
                    {!isLocked && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1 rounded-full bg-green-500/80 text-white text-xs font-medium">
                          Free Plan
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessPlansPage;
