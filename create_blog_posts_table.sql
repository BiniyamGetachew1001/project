-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    read_time TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing published blog posts
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
    FOR SELECT USING (is_published = true);

-- Create policy for admin users to manage all blog posts
CREATE POLICY "Admin users can manage all blog posts" ON blog_posts
    FOR ALL USING (auth.role() = 'authenticated');
