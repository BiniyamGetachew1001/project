// Script to create a test blog post in Supabase
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials from supabase.ts
const supabaseUrl = 'https://fczovpgyzcwnvgolwvld.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjem92cGd5emN3bnZnb2x3dmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTk2MTksImV4cCI6MjA1ODkzNTYxOX0.YPEPVHp60u0TOQh1dnwVKXDob6JmYkfyo6gh5tQGKgM';

console.log('Connecting to Supabase...');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestBlogPost() {
  try {
    console.log('Attempting to create a test blog post...');
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          content: JSON.stringify({ blocks: [{ type: 'paragraph', text: 'This is a test blog post.' }] }),
          author: 'Admin',
          is_published: true
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating test blog post:', error);
      
      if (error.code === '42P01') {
        console.log('The blog_posts table does not exist. You need to create it first.');
        console.log('Please go to the Supabase SQL Editor and run the create_blog_posts_table.sql script.');
      }
    } else {
      console.log('Test blog post created successfully!');
      console.log('Blog post data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Start the process
createTestBlogPost();
