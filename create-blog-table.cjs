// Script to create the blog_posts table in Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read the supabase.ts file to extract the URL and key
const supabaseFilePath = path.join(__dirname, 'src', 'lib', 'supabase.ts');
const supabaseFileContent = fs.readFileSync(supabaseFilePath, 'utf8');

// Extract URL and key using regex
const urlMatch = supabaseFileContent.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = supabaseFileContent.match(/supabaseKey\s*=\s*['"]([^'"]+)['"]/);

if (!urlMatch || !keyMatch) {
  console.error('Could not extract Supabase URL and key from supabase.ts');
  process.exit(1);
}

const supabaseUrl = urlMatch[1];
const supabaseKey = keyMatch[1];

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
    
    // Try to execute the SQL directly
    const { error } = await supabase.rpc('execute_sql', { sql_query: createTableSQL });
    
    if (error) {
      console.error('Error executing SQL:', error);
      console.log('Trying alternative approach...');
      
      // Try to create the table directly
      const { error: createError } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: 'Test Blog Post',
            slug: 'test-blog-post',
            content: JSON.stringify({ blocks: [{ type: 'paragraph', text: 'This is a test blog post.' }] }),
            author: 'Admin',
            is_published: true
          }
        ]);
      
      if (createError) {
        console.error('Error creating test blog post:', createError);
      } else {
        console.log('Test blog post created successfully!');
      }
    } else {
      console.log('SQL executed successfully!');
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
