import React from 'react';

const SimpleAdminPage: React.FC = () => {
  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#1a1310]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Portal</h1>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-lg">Welcome to the admin portal. This is a simple test page.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminPage;
