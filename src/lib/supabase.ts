import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fczovpgyzcwnvgolwvld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjem92cGd5emN3bnZnb2x3dmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTk2MTksImV4cCI6MjA1ODkzNTYxOX0.YPEPVHp60u0TOQh1dnwVKXDob6JmYkfyo6gh5tQGKgM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  }
}); 