export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  is_premium: boolean;
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
  icon: string;
  description: string | null;
  investment: string;
  is_premium: boolean;
  category: string;
  cover_image: string | null;
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
  item_type: 'book' | 'business_plan';
  created_at: string;
}; 