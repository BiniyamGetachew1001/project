-- Add all potentially missing columns to the books table
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Generate slugs for existing books that don't have one
UPDATE books
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '-', 'g'), '(-+)', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Set all existing books to published by default
UPDATE books
SET is_published = true,
    published_at = created_at
WHERE is_published IS NULL;

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policies for books table
DROP POLICY IF EXISTS "Allow anonymous select access" ON books;
DROP POLICY IF EXISTS "Allow authenticated full access" ON books;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON books;

-- Create a policy to allow anyone to view published books
CREATE POLICY "Allow anonymous select access" 
ON books 
FOR SELECT 
TO anon 
USING (is_published = true);

-- Create a policy to allow authenticated users to do anything
CREATE POLICY "Allow authenticated full access" 
ON books 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create a policy to allow anonymous users to insert books (for development)
CREATE POLICY "Allow anonymous insert access" 
ON books 
FOR INSERT 
TO anon 
WITH CHECK (true);
