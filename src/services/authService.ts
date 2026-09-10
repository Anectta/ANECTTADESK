import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Operator } from '../types';
import { INITIAL_OPERATORS } from '../data/mockData';

export interface AuthState {
  user: any | null;
  operator: Operator | null;
  isAuthenticated: boolean;
  isMock: boolean;
}

// Retorna o operador padrão para modo de demonstração
const getMockDefaultOperator = (): Operator => {
  return INITIAL_OPERATORS[0] || {
    id: 'op-1',
    name: 'Carlos Amoroso (Dev)',
    email: 'carlos.amoroso@anectta.com',
    role: 'admin',
    status: 'active',
    mfaEnabled: true,
    allowedGroups: ['*'],
    lastActive: 'Agora',
    createdDate: '15/01/2026'
  };
};

export const authService = {
  // Retorna se o Supabase está ativo ou se estamos em modo simulação
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  // Login com e-mail e senha
  async signIn(email: string, password: string): Promise<{ data: any; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // Modo Mock: aceita credenciais de teste
      const found = INITIAL_OPERATORS.find(op => op.email.toLowerCase() === email.toLowerCase());
      const operator = found || getMockDefaultOperator();
      localStorage.setItem('anecttadesk_mock_auth_user', JSON.stringify(operator));
      return { data: { user: { id: operator.id, email: operator.email }, operator }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Erro ao autenticar com Supabase' };
    }
  },

  // Cadastro de novo operador
  async signUp(email: string, password: string, fullName: string): Promise<{ data: any; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: { user: { email } }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'operator',
          },
        },
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Erro ao cadastrar usuário' };
    }
  },

  // Logout
  async signOut(): Promise<void> {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem('anecttadesk_mock_auth_user');
      return;
    }

    await supabase.auth.signOut();
  },

  // Obter operador autenticado atual
  async getCurrentOperator(): Promise<Operator | null> {
    if (!isSupabaseConfigured()) {
      const saved = localStorage.getItem('anecttadesk_mock_auth_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return getMockDefaultOperator();
        }
      }
      return getMockDefaultOperator();
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Busca os dados complementares do perfil em public.users
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        return {
          id: profile.id,
          name: profile.full_name || user.email?.split('@')[0] || 'Operador',
          email: profile.email || user.email || '',
          role: (profile.role as any) || 'operator',
          status: profile.is_active ? 'active' : 'suspended',
          mfaEnabled: !!profile.mfa_enabled,
          allowedGroups: ['*'],
          lastActive: 'Agora',
          createdDate: new Date(profile.created_at).toLocaleDateString('pt-BR')
        };
      }

      // Fallback a partir dos metadados do auth.user
      return {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Operador',
        email: user.email || '',
        role: user.user_metadata?.role || 'admin',
        status: 'active',
        mfaEnabled: false,
        allowedGroups: ['*'],
        lastActive: 'Agora',
        createdDate: new Date(user.created_at).toLocaleDateString('pt-BR')
      };
    } catch (err) {
      console.error('Erro ao obter usuário autenticado:', err);
      return null;
    }
  },

  // Listener para mudanças de estado de autenticação
  onAuthStateChange(callback: (state: AuthState) => void) {
    if (!isSupabaseConfigured()) {
      callback({
        user: { id: 'mock-user', email: 'demo@anecttadesk.com' },
        operator: getMockDefaultOperator(),
        isAuthenticated: true,
        isMock: true
      });
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const operator = await authService.getCurrentOperator();
        callback({
          user: session.user,
          operator,
          isAuthenticated: true,
          isMock: false
        });
      } else {
        callback({
          user: null,
          operator: null,
          isAuthenticated: false,
          isMock: false
        });
      }
    });

    return subscription;
  }
};
