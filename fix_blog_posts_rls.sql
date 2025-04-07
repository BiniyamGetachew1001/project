-- First, let's check the existing policies
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';

-- Drop any existing policies that might be causing issues
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage all blog posts" ON blog_posts;

-- Create a new policy that allows anyone to do anything with the blog_posts table
-- This is a permissive policy for development purposes
CREATE POLICY "Allow all operations on blog_posts" 
  ON blog_posts 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Alternatively, if you want more restrictive policies:
-- 1. Policy for public access to published posts
CREATE POLICY "Public can view published blog posts" 
  ON blog_posts 
  FOR SELECT 
  USING (is_published = true);

-- 2. Policy for authenticated users to manage all posts
CREATE POLICY "Authenticated users can manage all blog posts" 
  ON blog_posts 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- 3. Policy to allow anonymous users to insert posts (for development)
CREATE POLICY "Allow anonymous users to insert posts" 
  ON blog_posts 
  FOR INSERT 
  WITH CHECK (true);

-- Make sure RLS is enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';
