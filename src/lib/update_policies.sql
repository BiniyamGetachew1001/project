-- Drop existing policies
DROP POLICY IF EXISTS "Books are viewable by everyone" ON books;
DROP POLICY IF EXISTS "Business plans are viewable by everyone" ON business_plans;
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON bookmarks;

-- Create new policies that allow all operations for now (we'll restrict this later)
CREATE POLICY "Enable all operations for books"
ON books FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all operations for business plans"
ON business_plans FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all operations for bookmarks"
ON bookmarks FOR ALL
USING (true)
WITH CHECK (true); 