import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import FeaturesPage from './pages/FeaturesPage';
import BookSummariesPage from './pages/BookSummariesPage';
import BusinessPlansPage from './pages/BusinessPlansPage';
import BookDetailPage from './pages/BookDetailPage';
import BookmarksPage from './pages/BookmarksPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';
import OfflineLibraryPage from './pages/OfflineLibraryPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BookReadingPage from './pages/BookReadingPage';
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
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/business-plans" element={<BusinessPlansPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/offline-library" element={<OfflineLibraryPage />} />
          </Route>
          {/* Book Reading Page without Layout */}
          <Route path="/book-reading/:id" element={<BookReadingPage />} />
        </Routes>
      </BookmarkProvider>
    </Router>
  );
};

export default App;
