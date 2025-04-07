import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import FeaturesPage from './pages/FeaturesPage';
import BookSummariesPage from './pages/BookSummariesPage';
import BusinessPlansPage from './pages/BusinessPlansPage';
import BookmarksPage from './pages/BookmarksPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';
import OfflineLibraryPage from './pages/OfflineLibraryPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import EnhancedBookReadingPage from './pages/EnhancedBookReadingPage';
import BusinessPlanReadingPage from './pages/BusinessPlanReadingPage';
import ContentManagementPage from './pages/ContentManagementPage';
import SimpleAdminPage from './pages/SimpleAdminPage';
import MockDataPage from './pages/MockDataPage';
import BookDebugPage from './pages/BookDebugPage';
import SimpleBlogForm from './pages/SimpleBlogForm';
import DatabaseTest from './components/DatabaseTest';
import AdminAuth from './components/AdminAuth';
import { BookmarkProvider } from './contexts/BookmarkContext';
import './index.css';

const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <BookmarkProvider>
        <Routes>
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/book-summaries" element={<BookSummariesPage />} />
<Route path="/books/:id" element={<EnhancedBookReadingPage />} />
            <Route path="/business-plans" element={<BusinessPlansPage />} />
            <Route path="/business-plan/:id" element={<BusinessPlanReadingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/offline-library" element={<OfflineLibraryPage />} />
            <Route path="/test-db" element={<DatabaseTest />} />
            <Route path="/business-plans/:id" element={<BusinessPlanReadingPage />} />
          </Route>
          {/* We've removed the duplicate BookReadingPage route to avoid confusion */}

          {/* Hidden admin routes - accessible only by direct URL and password */}
          <Route path="/admin-portal" element={<AdminAuth><ContentManagementPage /></AdminAuth>} />
          <Route path="/simple-admin" element={<SimpleAdminPage />} />
          <Route path="/protected-admin" element={<AdminAuth><SimpleAdminPage /></AdminAuth>} />
          <Route path="/mock-data" element={<MockDataPage />} />
          <Route path="/book-debug" element={<BookDebugPage />} />
          <Route path="/simple-blog" element={<SimpleBlogForm />} />
        </Routes>
      </BookmarkProvider>
    </Router>
  );
};

export default App;
