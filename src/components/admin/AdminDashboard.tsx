import React from 'react';
import { Book, Briefcase, FileText, DollarSign, Users, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = [
    { id: 1, title: 'Total Books', value: 25, icon: <Book size={24} />, color: 'bg-blue-100 text-blue-800' },
    { id: 2, title: 'Business Ideas', value: 18, icon: <Briefcase size={24} />, color: 'bg-green-100 text-green-800' },
    { id: 3, title: 'Blog Posts', value: 12, icon: <FileText size={24} />, color: 'bg-purple-100 text-purple-800' },
    { id: 4, title: 'Pending Payments', value: 3, icon: <DollarSign size={24} />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 5, title: 'Active Users', value: 150, icon: <Users size={24} />, color: 'bg-indigo-100 text-indigo-800' },
    { id: 6, title: 'This Month Revenue', value: '4,500 ETB', icon: <DollarSign size={24} />, color: 'bg-pink-100 text-pink-800' },
  ];

  const recentActivity = [
    { id: 1, action: 'Added new book', item: 'The Lean Startup', user: 'Admin', time: '10 minutes ago' },
    { id: 2, action: 'Approved payment', item: 'Full Access Subscription', user: 'Admin', time: '1 hour ago' },
    { id: 3, action: 'Published blog post', item: 'Top 10 Business Ideas for 2023', user: 'Admin', time: '3 hours ago' },
    { id: 4, action: 'Updated business idea', item: 'Coffee Export Business', user: 'Admin', time: '5 hours ago' },
    { id: 5, action: 'New user registered', item: 'Abebe Kebede', user: 'System', time: '1 day ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the TILkTBEB admin panel. Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className={`${stat.color} rounded-lg shadow-sm p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white bg-opacity-30 mr-4">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{activity.item}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{activity.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      {activity.time}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
            <Book size={18} />
            <span>Add New Book</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors">
            <Briefcase size={18} />
            <span>Add Business Idea</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors">
            <FileText size={18} />
            <span>Create Blog Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
