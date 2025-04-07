import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real application, you would use a more secure authentication method
  // This is just a simple example for demonstration purposes
  const adminPassword = 'admin123'; // This should be stored securely in a real app

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError(null);

      // Store authentication in session storage
      // This will be cleared when the browser is closed
      sessionStorage.setItem('adminAuthenticated', 'true');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  // Check if already authenticated from session storage
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#1a1310]">
      <div className="max-w-md mx-auto">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-[#3a2819] p-4 rounded-full">
              <Lock size={32} className="text-[#c9a52c]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">Admin Authentication</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2d1e14] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a52c]"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full gold-button py-2 mt-2"
            >
              Access Admin Portal
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white text-sm"
            >
              Return to site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
