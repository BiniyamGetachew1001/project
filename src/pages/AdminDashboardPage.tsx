import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, LayoutGrid, Users, DollarSign, Clock, TrendingUp, Edit, Plus } from 'lucide-react';
import { getBooks, getBusinessPlans } from '../lib/database';
import type { Book as BookType, BusinessPlan } from '../types/database';

const AdminDashboardPage: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockStats = {
    totalUsers: 128,
    totalRevenue: 4250,
    recentPurchases: 17,
    activeSubscriptions: 84
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, plansData] = await Promise.all([
          getBooks(),
          getBusinessPlans()
        ]);
        setBooks(booksData);
        setBusinessPlans(plansData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
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

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#3a2819] rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-32 bg-[#3a2819] rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-[#3a2819] rounded-xl"></div>
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
            <h2 className="text-red-500 text-xl font-bold mb-2">Error Loading Dashboard</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link to="/admin/books/new" className="gold-button flex items-center gap-2">
              <Plus size={18} />
              <span>Add Book</span>
            </Link>
            <Link to="/admin/business-plans/new" className="secondary-button flex items-center gap-2">
              <Plus size={18} />
              <span>Add Business Plan</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
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
                  <span>Active: {mockStats.activeSubscriptions}</span>
                </div>
                <p className="text-2xl font-bold mt-1">{mockStats.totalUsers}</p>
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
                  <span>Recent: {mockStats.recentPurchases} purchases</span>
                </div>
                <p className="text-2xl font-bold mt-1">${mockStats.totalRevenue}</p>
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
                      <Link 
                        to={isBook ? `/admin/books/edit/${item.id}` : `/admin/business-plans/edit/${item.id}`}
                        className="p-2 bg-[#3a2819] rounded-full hover:bg-[#4a2e1c] transition-colors"
                      >
                        <Edit size={14} className="text-[#c9a52c]" />
                      </Link>
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
            
            <div className="mt-6">
              <Link to="/admin/analytics" className="secondary-button w-full justify-center">
                View Full Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/books" className="glass-card p-6 rounded-xl hover:bg-[#2d1e14] transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-[#3a2819] p-3 rounded-lg">
                <Book size={24} className="text-[#c9a52c]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Manage Books</h3>
                <p className="text-sm text-gray-400">Add, edit, or delete book summaries</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/business-plans" className="glass-card p-6 rounded-xl hover:bg-[#2d1e14] transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-[#3a2819] p-3 rounded-lg">
                <LayoutGrid size={24} className="text-[#c9a52c]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Manage Business Plans</h3>
                <p className="text-sm text-gray-400">Add, edit, or delete business plans</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/users" className="glass-card p-6 rounded-xl hover:bg-[#2d1e14] transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-[#3a2819] p-3 rounded-lg">
                <Users size={24} className="text-[#c9a52c]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Manage Users</h3>
                <p className="text-sm text-gray-400">View and manage user accounts</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
