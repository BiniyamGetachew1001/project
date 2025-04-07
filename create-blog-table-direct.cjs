// Script to create the blog_posts table in Supabase
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials from supabase.ts
const supabaseUrl = 'https://fczovpgyzcwnvgolwvld.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjem92cGd5emN3bnZnb2x3dmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTk2MTksImV4cCI6MjA1ODkzNTYxOX0.YPEPVHp60u0TOQh1dnwVKXDob6JmYkfyo6gh5tQGKgM';

console.log('Supabase URL:', supabaseUrl);
console.log('Connecting to Supabase...');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL to create the blog_posts table
const createTableSQL = `
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts (category);

-- Add RLS (Row Level Security) policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for public access to published posts
CREATE POLICY "Public can view published blog posts" 
  ON blog_posts 
  FOR SELECT 
  USING (is_published = true);

-- Policy for authenticated users to manage all posts
CREATE POLICY "Authenticated users can manage all blog posts" 
  ON blog_posts 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Add some sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, author, category, tags, is_published, published_at)
VALUES
(
  'Getting Started with Business Planning',
  'getting-started-with-business-planning',
  '{
    "blocks": [
      {
        "type": "paragraph",
        "text": "A solid business plan is the foundation of any successful venture. It serves as a roadmap for your business, helping you navigate challenges and capitalize on opportunities."
      },
      {
        "type": "heading",
        "text": "Why You Need a Business Plan",
        "level": 2
      },
      {
        "type": "paragraph",
        "text": "Business plans help you clarify your vision, set measurable goals, and identify potential obstacles before they arise. They are essential for securing funding and attracting partners or investors."
      },
      {
        "type": "heading",
        "text": "Key Components of a Business Plan",
        "level": 2
      },
      {
        "type": "list",
        "items": [
          "Executive Summary",
          "Company Description",
          "Market Analysis",
          "Organization & Management",
          "Service or Product Line",
          "Marketing & Sales",
          "Financial Projections",
          "Funding Request (if applicable)"
        ],
        "style": "unordered"
      },
      {
        "type": "paragraph",
        "text": "Remember, a business plan is not a static document. It should evolve as your business grows and market conditions change."
      }
    ]
  }',
  'Learn the fundamentals of creating an effective business plan that will guide your venture to success.',
  'Admin',
  'Business Planning',
  ARRAY['business plan', 'entrepreneurship', 'startup'],
  true,
  NOW()
),
(
  'The Power of Book Summaries for Busy Professionals',
  'power-of-book-summaries-for-busy-professionals',
  '{
    "blocks": [
      {
        "type": "paragraph",
        "text": "In today''s fast-paced world, professionals often struggle to find time for reading despite knowing its importance for personal and career growth."
      },
      {
        "type": "heading",
        "text": "Why Book Summaries Are Valuable",
        "level": 2
      },
      {
        "type": "paragraph",
        "text": "Book summaries distill the core ideas and insights from books into concise, digestible formats. They allow you to absorb key concepts quickly without sacrificing comprehension."
      },
      {
        "type": "heading",
        "text": "Benefits of Reading Summaries",
        "level": 2
      },
      {
        "type": "list",
        "items": [
          "Save time while still gaining valuable knowledge",
          "Quickly determine if a book is worth reading in full",
          "Revisit important concepts from books you''ve already read",
          "Expose yourself to a wider range of ideas and perspectives",
          "Improve retention through focused, concise content"
        ],
        "style": "unordered"
      },
      {
        "type": "paragraph",
        "text": "While summaries are powerful tools, they work best as complements to, not replacements for, deep reading when time permits."
      }
    ]
  }',
  'Discover how book summaries can help busy professionals stay informed and continue learning despite time constraints.',
  'Admin',
  'Reading',
  ARRAY['book summaries', 'professional development', 'productivity'],
  true,
  NOW()
);
`;

// Create the blog_posts table
async function createBlogPostsTable() {
  try {
    console.log('Creating blog_posts table...');
    
    // Try to create a simple test blog post first
    console.log('Attempting to create a test blog post...');
    const { data: testData, error: testError } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          content: JSON.stringify({ blocks: [{ type: 'paragraph', text: 'This is a test blog post.' }] }),
          author: 'Admin',
          is_published: true
        }
      ])
      .select();
    
    if (testError) {
      console.error('Error creating test blog post:', testError);
      
      if (testError.code === '42P01') { // Table doesn't exist error
        console.log('Table does not exist. Creating it now...');
        
        // Try to execute SQL directly using the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ sql_query: createTableSQL })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error executing SQL:', errorData);
          
          // If the function doesn't exist, we need to create it
          if (errorData.code === '42883') { // Function doesn't exist
            console.log('execute_sql function does not exist. Creating it...');
            
            const createFunctionSQL = `
            CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
            RETURNS VOID
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
              EXECUTE sql_query;
            END;
            $$;
            `;
            
            // Create the function
            const functionResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
              },
              body: JSON.stringify({ query: createFunctionSQL })
            });
            
            if (!functionResponse.ok) {
              console.error('Error creating execute_sql function:', await functionResponse.json());
            } else {
              console.log('execute_sql function created successfully!');
              
              // Try to execute the SQL again
              const retryResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`
                },
                body: JSON.stringify({ sql_query: createTableSQL })
              });
              
              if (!retryResponse.ok) {
                console.error('Error executing SQL after creating function:', await retryResponse.json());
              } else {
                console.log('SQL executed successfully!');
              }
            }
          }
        } else {
          console.log('SQL executed successfully!');
        }
      }
    } else {
      console.log('Test blog post created successfully!', testData);
    }
    
    // Verify the table was created
    const { data, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
    
    if (fetchError) {
      console.error('Error verifying blog_posts table:', fetchError);
    } else {
      console.log('Verification successful! Found blog posts:', data.length);
      if (data.length > 0) {
        console.log('Sample blog post:', data[0].title);
      }
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Start the process
createBlogPostsTable();
