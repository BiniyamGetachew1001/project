import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Coffee, Lock, ShoppingBag, TrendingUp, Truck, Utensils, Wifi } from 'lucide-react';
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

const BusinessPlansPage: React.FC = () => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedInvestment, setSelectedInvestment] = useState('All Investment Ranges');

  const handleBookmark = (e: React.MouseEvent, plan: typeof businessPlans[0]) => {
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
        description: plan.description
      });
    }
  };

  // Get unique categories
  const categories = ['All Categories', ...new Set(businessPlans.map(plan => plan.category))];

  // Filter and process business plans
  const processedPlans = useMemo(() => {
    // First, filter based on selected category and investment range
    let filtered = businessPlans;
    
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(plan => plan.category === selectedCategory);
    }

    if (selectedInvestment !== 'All Investment Ranges') {
      // Add investment range filtering logic here if needed
    }

    // Group by category
    const groupedByCategory = filtered.reduce((acc, plan) => {
      if (!acc[plan.category]) {
        acc[plan.category] = [];
      }
      acc[plan.category].push(plan);
      return acc;
    }, {} as Record<string, typeof businessPlans>);

    // For each category, mark the lowest investment plan as free
    const processedWithFreeFlag = filtered.map(plan => {
      const categoryPlans = groupedByCategory[plan.category];
      const lowestInvestmentPlan = categoryPlans.reduce((lowest, current) => {
        const getMinInvestment = (str: string) => parseInt(str.replace(/[^0-9]/g, ''));
        const currentMin = getMinInvestment(current.investment);
        const lowestMin = getMinInvestment(lowest.investment);
        return currentMin < lowestMin ? current : lowest;
      });

      return {
        ...plan,
        isFree: plan.id === lowestInvestmentPlan.id
      };
    });

    // Sort to show free plans first
    return processedWithFreeFlag.sort((a, b) => {
      if (a.isFree === b.isFree) {
        // If both are free or both are premium, maintain category grouping
        return a.category.localeCompare(b.category);
      }
      // Show free plans first
      return a.isFree ? -1 : 1;
    });
  }, [selectedCategory, selectedInvestment]);

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Business Plans</h1>
          <div className="flex gap-3">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select 
              value={selectedInvestment}
              onChange={(e) => setSelectedInvestment(e.target.value)}
              className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
            >
              <option>All Investment Ranges</option>
              <option>Under $10,000</option>
              <option>$10,000 - $50,000</option>
              <option>$50,000 - $200,000</option>
              <option>$200,000+</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {processedPlans.map(plan => {
            const bookmarked = isBookmarked(plan.id);
            const isLocked = !plan.isFree;
            
            return (
              <Link
                to={plan.isFree ? `/business-plan/${plan.id}` : '/pricing'}
                key={plan.id}
                className={`bg-[#3a2819] rounded-xl overflow-hidden border transition-all duration-200 ${
                  plan.isFree ? 'border-[#7a4528] hover:border-green-500' : 'border-[#7a4528] hover:border-[#c9a52c]'
                }`}
              >
                <div className="h-40 overflow-hidden relative">
                  {plan.coverImage && (
                    <img 
                      src={plan.coverImage} 
                      alt={plan.title} 
                      className={`w-full h-full object-cover ${isLocked ? 'filter brightness-50' : ''}`}
                    />
                  )}
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
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#2d1e14] p-3 rounded-lg text-[#c9a52c]">
                      {iconMap[plan.icon]}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">Investment Range:</div>
                    <div className="text-sm font-medium">{plan.investment}</div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-xs bg-[#2d1e14] text-[#c9a52c] py-1 px-2 rounded-md">{plan.category}</span>
                  </div>
                  
                  <button className={isLocked ? "secondary-button w-full" : "gold-button w-full"}>
                    {isLocked ? "Unlock Business Plan" : "View Business Plan"}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="bg-[#3a2819] rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Business Plan?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our premium plans include access to customizable business plan templates 
            that you can adapt to your specific needs and market conditions.
          </p>
          <Link to="/pricing" className="gold-button">
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlansPage;
