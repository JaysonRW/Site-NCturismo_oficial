import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bfpwjtdhpxakarsjyklh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcHdqdGRocHhha2Fyc2p5a2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5ODk2NTAsImV4cCI6MjEwNTU2NTY1MH0.lkrwOcej-nkAsy2WeHoXRP7czGa1xSvVnxsd7mLDt3U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  reading_time_minutes: number;
  status: 'draft' | 'published';
  published_at?: string;
  category_id?: string;
  author_id?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  // Joins
  category?: Category;
  author?: Author;
}
