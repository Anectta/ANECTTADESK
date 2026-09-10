import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verifica se as credenciais do Supabase foram configuradas no ambiente
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim() !== '' &&
    !supabaseUrl.includes('seu-projeto') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseAnonKey.includes('sua-chave-anon')
  );
};

// Instância segura do cliente Supabase: usa chaves reais ou valores dummy para evitar crashes
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
