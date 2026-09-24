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

export interface TermsAcceptance {
  id: string;
  document_version: string;
  accepted_at: string;
  user_agent: string;
  ip_address?: string;
  target_url: string;
  source: string;
}

export const recordTermsAcceptance = async (acceptance: Omit<TermsAcceptance, 'id'>): Promise<TermsAcceptance> => {
  const localRecord: TermsAcceptance = {
    id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    ...acceptance,
  };

  // 1. Always save to localStorage for client-side audit durability
  try {
    const existing = JSON.parse(localStorage.getItem('nc_terms_acceptances') || '[]');
    localStorage.setItem('nc_terms_acceptances', JSON.stringify([localRecord, ...existing]));
    localStorage.setItem('nc_current_accepted_version', acceptance.document_version);
    localStorage.setItem('nc_last_accepted_at', acceptance.accepted_at);
  } catch (e) {
    console.error('Erro ao salvar aceite em localStorage:', e);
  }

  // 2. Also try to persist in Supabase if table exists
  try {
    const { error } = await supabase
      .from('terms_acceptances')
      .insert([localRecord]);
    if (error) {
      console.warn('Registro no Supabase (aviso de tabela/schema):', error.message);
    }
  } catch (err) {
    console.warn('Erro ao persistir no Supabase:', err);
  }

  return localRecord;
};

export const getTermsAcceptances = async (): Promise<TermsAcceptance[]> => {
  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('terms_acceptances')
      .select('*')
      .order('accepted_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    // ignore
  }

  // Fallback to localStorage
  try {
    return JSON.parse(localStorage.getItem('nc_terms_acceptances') || '[]');
  } catch {
    return [];
  }
};
