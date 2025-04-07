import { supabase } from './supabase';
import { Book, BusinessPlan, User, Bookmark, BlogPost } from '../types/database';

// Test Supabase connection
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('books').select('count').limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      return { success: false, error };
    }

    console.log('Connection test successful:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Connection test exception:', err);
    return { success: false, error: err };
  }
};

// Books
export const getBooks = async () => {
  console.log('Attempting to fetch books from Supabase...');
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*');

    if (error) {
      console.error('Error fetching books:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to fetch books: ${error.message}`);
    }

    console.log(`Successfully fetched ${data?.length || 0} books from Supabase`);
    return data as Book[];
  } catch (err) {
    console.error('Unexpected error in getBooks:', err);
    throw err;
  }
};

export const getBookById = async (id: string) => {
  console.log('Fetching book with ID:', id);

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching book:', error);
    throw new Error(`Failed to fetch book: ${error.message}`);
  }

  console.log('Book found:', data);
  return data as Book;
};

// Business Plans
export const getBusinessPlans = async () => {
  const { data, error } = await supabase
    .from('business_plans')
    .select('*');

  if (error) {
    console.error('Error fetching business plans:', error);
    throw new Error(`Failed to fetch business plans: ${error.message}`);
  }
  return data as BusinessPlan[];
};

export const getBusinessPlanById = async (id: string) => {
  const { data, error } = await supabase
    .from('business_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching business plan:', error);
    throw new Error(`Failed to fetch business plan: ${error.message}`);
  }
  return data as BusinessPlan;
};

// Bookmarks
export const getBookmarks = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching bookmarks:', error);
    throw new Error(`Failed to fetch bookmarks: ${error.message}`);
  }
  return data as Bookmark[];
};

export const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([bookmark])
    .select()
    .single();

  if (error) {
    console.error('Error adding bookmark:', error);
    throw new Error(`Failed to add bookmark: ${error.message}`);
  }
  return data as Bookmark;
};

export const removeBookmark = async (id: string) => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error removing bookmark:', error);
    throw new Error(`Failed to remove bookmark: ${error.message}`);
  }
};

// Add a new book
export const addBook = async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('books')
    .insert([book])
    .select()
    .single();

  if (error) {
    console.error('Error adding book:', error);
    throw new Error(`Failed to add book: ${error.message}`);
  }
  return data as Book;
};

// Add a new business plan
export const addBusinessPlan = async (plan: Omit<BusinessPlan, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('business_plans')
    .insert([plan])
    .select()
    .single();

  if (error) {
    console.error('Error adding business plan:', error);
    throw new Error(`Failed to add business plan: ${error.message}`);
  }
  return data as BusinessPlan;
};

// Blog Posts
export const getBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*');

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }
  return data as BlogPost[];
};

export const getBlogPostById = async (id: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }
  return data as BlogPost;
};

// Add a new blog post
export const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
  console.log('Attempting to add blog post with data:', JSON.stringify(post, null, 2));
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) {
      console.error('Error adding blog post:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to add blog post: ${error.message}`);
    }

    console.log('Successfully added blog post:', data);
    return data as BlogPost;
  } catch (err) {
    console.error('Unexpected error in addBlogPost:', err);
    throw err;
  }
};

// Update a blog post
export const updateBlogPost = async (id: string, post: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog post:', error);
    throw new Error(`Failed to update blog post: ${error.message}`);
  }
  return data as BlogPost;
};

// Delete a blog post
export const deleteBlogPost = async (id: string) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog post:', error);
    throw new Error(`Failed to delete blog post: ${error.message}`);
  }
};
