import React, { useState } from 'react';
import {
  Home,
  Book,
  Briefcase,
  FileText,
  DollarSign,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bell,
  ShoppingCart
} from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminBooks from '../components/admin/AdminBooks';
import AdminBusinessIdeas from '../components/admin/AdminBusinessIdeas';
import AdminBlog from '../components/admin/AdminBlog';
import AdminPayments from '../components/admin/AdminPayments';
import AdminUsers from '../components/admin/AdminUsers';
import AdminSettings from '../components/admin/AdminSettings';
import AdminBookPurchases from '../components/admin/AdminBookPurchases';

type AdminSection = 'dashboard' | 'books' | 'business-ideas' | 'blog' | 'payments' | 'book-purchases' | 'users' | 'settings';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'english' | 'amharic' | 'afaan-oromo'>('english');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New payment received', time: '5 min ago' },
    { id: 2, text: 'New user registered', time: '1 hour ago' },
    { id: 3, text: 'Book update needed', time: '2 hours ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get section title
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard';
      case 'books': return 'Manage Books';
      case 'business-ideas': return 'Manage Business Ideas';
      case 'blog': return 'Manage Blog';
      case 'payments': return 'Manage Payments';
      case 'book-purchases': return 'Manage Book Purchases';
      case 'users': return 'Manage Users';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  // Render active section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard': return <AdminDashboard />;
      case 'books': return <AdminBooks language={language} />;
      case 'business-ideas': return <AdminBusinessIdeas language={language} />;
      case 'blog': return <AdminBlog language={language} />;
      case 'payments': return <AdminPayments />;
      case 'book-purchases': return <AdminBookPurchases />;
      case 'users': return <AdminUsers />;
      case 'settings': return <AdminSettings language={language} setLanguage={setLanguage} />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#1a1310]">
      {/* Sidebar - Desktop */}
      <aside
        className={`bg-[#1a1310] text-white w-64 fixed h-full transition-all duration-300 ease-in-out z-20 ${
          sidebarOpen ? 'left-0' : '-left-64'
        } md:left-0`}
      >
        <div className="p-4 border-b border-[#3a2819]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#c9a52c]">TILkTBEB Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-[#c9a52c]"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="mt-4">
          <ul>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
              { id: 'books', label: 'Books', icon: <Book size={20} /> },
              { id: 'business-ideas', label: 'Business Ideas', icon: <Briefcase size={20} /> },
              { id: 'blog', label: 'Blog', icon: <FileText size={20} /> },
              { id: 'payments', label: 'Payments', icon: <DollarSign size={20} /> },
              { id: 'book-purchases', label: 'Book Purchases', icon: <ShoppingCart size={20} /> },
              { id: 'users', label: 'Users', icon: <Users size={20} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
            ].map((item) => (
              <li key={item.id} className="mb-1">
                <button
                  onClick={() => setActiveSection(item.id as AdminSection)}
                  className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#3a2819] text-[#c9a52c]'
                      : 'text-gray-400 hover:bg-[#2d1e14] hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-[#3a2819]">
          <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#c9a52c] rounded hover:bg-[#d9b53c] transition-colors">
            <LogOut size={16} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-[#2d1e14] shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 text-gray-300 hover:text-[#c9a52c] md:hidden"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold text-white">{getSectionTitle()}</h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-[#3a2819] rounded-md hover:bg-[#4a2e1c]"
                  onClick={() => {
                    const nextLanguage = language === 'english'
                      ? 'amharic'
                      : language === 'amharic'
                        ? 'afaan-oromo'
                        : 'english';
                    setLanguage(nextLanguage);
                  }}
                >
                  <span>
                    {language === 'english' ? 'English' : language === 'amharic' ? 'አማርኛ' : 'Afaan Oromo'}
                  </span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  className="relative p-2 text-gray-300 hover:text-[#c9a52c] rounded-full hover:bg-[#3a2819]"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#c9a52c] text-[#1a1310] text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#2d1e14] rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2 px-3 bg-[#3a2819] border-b border-[#4a2e1c]">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="px-4 py-3 border-b border-[#3a2819] hover:bg-[#1a1310]">
                          <p className="text-sm text-white">{notification.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="py-2 px-3 bg-[#3a2819] text-center">
                      <button className="text-sm text-[#c9a52c] hover:text-[#d9b53c]">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#c9a52c] flex items-center justify-center text-[#1a1310] font-semibold">
                  A
                </div>
                <span className="ml-2 text-sm font-medium text-white hidden sm:inline-block">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 text-white">
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
