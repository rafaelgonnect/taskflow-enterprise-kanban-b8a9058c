
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Tentando buscar perfil para usuário:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Usar maybeSingle ao invés de single para evitar erro quando não há dados
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      } 

      if (profileData) {
        console.log('Perfil carregado:', profileData);
        return profileData;
      } else {
        console.log('Nenhum perfil encontrado, pode ser um usuário novo');
        return null;
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar perfil:', err);
      return null;
    }
  };

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar perfil do usuário
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Sessão existente:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Buscar perfil se já tiver usuário logado
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Tentando cadastrar usuário:', email);
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (error) {
      console.error('Erro no cadastro:', error);
    } else {
      console.log('Cadastro realizado com sucesso');
    }
    
    setLoading(false);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Tentando fazer login:', email);
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Erro no login:', error);
    } else {
      console.log('Login realizado com sucesso');
    }
    
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    console.log('Fazendo logout');
    setLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
