import { supabase } from './supabase';
import { Book, BusinessPlan, User, Bookmark } from '../types/database';

// Books
export const getBooks = async () => {
  const { data, error } = await supabase
    .from('books')
    .select('*');
  
  if (error) {
    console.error('Error fetching books:', error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }
  return data as Book[];
};

export const getBookById = async (id: string) => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching book:', error);
    throw new Error(`Failed to fetch book: ${error.message}`);
  }
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