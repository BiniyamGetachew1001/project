import { createClient } from '@supabase/supabase-js';

// Configuration for cloud Supabase instance
const cloudSupabaseUrl = 'https://fczovpgyzcwnvgolwvld.supabase.co';
const cloudSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjem92cGd5emN3bnZnb2x3dmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTk2MTksImV4cCI6MjA1ODkzNTYxOX0.YPEPVHp60u0TOQh1dnwVKXDob6JmYkfyo6gh5tQGKgM';

// Configuration for local Supabase instance
const localSupabaseUrl = 'http://localhost:54321';
// This is the default anon key for local Supabase instances
const localSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Choose which configuration to use
const useLocalSupabase = false; // Set to false to use cloud instance

const supabaseUrl = useLocalSupabase ? localSupabaseUrl : cloudSupabaseUrl;
const supabaseAnonKey = useLocalSupabase ? localSupabaseAnonKey : cloudSupabaseAnonKey;

console.log(`Using Supabase instance at: ${supabaseUrl}`);


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
  },
  // Add additional options for local development
  ...(useLocalSupabase ? {
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  } : {})
});