import React, { useEffect, useState } from 'react';
import { getBooks, getBusinessPlans } from '../lib/database';
import { migrateData } from '../lib/migrateData';
import { Book, BusinessPlan } from '../types/database';
import { supabase } from '../lib/supabase';

const DatabaseTest: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // First test the connection
        console.log('Testing Supabase connection...');
        const { data, error: connectionError } = await supabase.from('books').select('count');
        
        if (connectionError) {
          console.error('Connection error:', connectionError);
          throw new Error(`Database connection failed: ${connectionError.message}`);
        }

        console.log('Connection successful, starting data migration...');
        
        // Then migrate the data
        await migrateData();
        console.log('Data migration completed, fetching data...');
        
        // Then fetch the data
        const [booksData, plansData] = await Promise.all([
          getBooks(),
          getBusinessPlans()
        ]);

        console.log('Data fetched:', { books: booksData, plans: plansData });
        setBooks(booksData);
        setBusinessPlans(plansData);
      } catch (err) {
        console.error('Error in DatabaseTest:', err);
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        console.error('Detailed error:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Loading Database Test...</h2>
      <p>Please wait while we set up the database...</p>
    </div>
  );

  if (error) return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Database Test Error</h2>
      <p className="text-red-400 whitespace-pre-wrap">{error}</p>
      <p className="mt-4">Please check the console for more details.</p>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Database Test Results</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Books ({books.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map(book => (
            <div key={book.id} className="glass-card p-4">
              <h4 className="font-bold">{book.title}</h4>
              <p className="text-sm text-gray-300">{book.author}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Business Plans ({businessPlans.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessPlans.map(plan => (
            <div key={plan.id} className="glass-card p-4">
              <h4 className="font-bold">{plan.title}</h4>
              <p className="text-sm text-gray-300">{plan.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest; 