-- Add all potentially missing columns to the business_plans table
ALTER TABLE business_plans 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS read_time TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Generate slugs for existing plans that don't have one
UPDATE business_plans
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '-', 'g'), '(-+)', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Set all existing plans to published by default
UPDATE business_plans
SET is_published = true,
    published_at = created_at
WHERE is_published IS NULL;

-- Enable Row Level Security
ALTER TABLE business_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for business_plans table
DROP POLICY IF EXISTS "Allow anonymous select access" ON business_plans;
DROP POLICY IF EXISTS "Allow authenticated full access" ON business_plans;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON business_plans;

-- Create a policy to allow anyone to view published business plans
CREATE POLICY "Allow anonymous select access" 
ON business_plans 
FOR SELECT 
TO anon 
USING (is_published = true);

-- Create a policy to allow authenticated users to do anything
CREATE POLICY "Allow authenticated full access" 
ON business_plans 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create a policy to allow anonymous users to insert business plans (for development)
CREATE POLICY "Allow anonymous insert access" 
ON business_plans 
FOR INSERT 
TO anon 
WITH CHECK (true);
