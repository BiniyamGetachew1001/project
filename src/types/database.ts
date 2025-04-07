export type Book = {
  id: string;
  title: string;
  slug?: string; // URL-friendly identifier
  author: string;
  category: string;
  is_premium: boolean;
  is_published?: boolean; // Whether the book is published
  published_at?: string | null; // When the book was published
  description: string | null;
  read_time: string | null;
  cover_image: string | null;
  content: any | null;
  created_at: string;
  updated_at: string;
};

export type BusinessPlan = {
  id: string;
  title: string;
  slug?: string; // URL-friendly identifier
  icon: string;
  description: string | null;
  content: any; // Structured content like in BlogPost
  investment: string;
  is_premium: boolean;
  category: string;
  cover_image: string | null;
  read_time?: string | null; // Estimated time to read
  is_published?: boolean; // Whether the plan is published
  published_at?: string | null; // When the plan was published
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug?: string; // This field might not exist in older database schemas
  author: string;
  category: string | null;
  excerpt: string | null;
  content: any; // Can be a string or a JSON object
  cover_image: string | null;
  featured_image?: string | null; // For compatibility with the new schema
  read_time: string | null;
  is_published: boolean;
  published_at?: string | null; // This field might not exist in older database schemas
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'book' | 'business_plan' | 'blog';
  created_at: string;
};