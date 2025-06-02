
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
      console.log('Buscando perfil para usuário:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      } 

      if (profileData) {
        console.log('Perfil carregado com sucesso:', profileData);
        return profileData;
      } else {
        console.log('Nenhum perfil encontrado');
        return null;
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar perfil:', err);
      return null;
    }
  };

  const createProfileIfNeeded = async (user: User) => {
    try {
      console.log('Verificando se perfil existe para:', user.email);
      
      // Primeiro verificar se já existe
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar perfil existente:', checkError);
        return null;
      }
      
      if (existingProfile) {
        console.log('Perfil já existe:', existingProfile);
        return existingProfile;
      }
      
      // Se não existe, criar
      console.log('Criando perfil para usuário:', user.id);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'Usuário',
          user_type: 'employee'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Erro ao criar perfil:', createError);
        return null;
      }
      
      console.log('Perfil criado com sucesso:', newProfile);
      return newProfile;
      
    } catch (err) {
      console.error('Erro inesperado ao criar perfil:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Função para processar mudanças de auth
    const handleAuthChange = async (event: string, session: Session | null) => {
      if (!isMounted) return;

      console.log('Auth state change:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && isMounted) {
        // Para novos usuários (signup), criar perfil se necessário
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setTimeout(async () => {
            if (isMounted) {
              const profileData = await createProfileIfNeeded(session.user);
              if (isMounted) {
                setProfile(profileData);
                setLoading(false);
              }
            }
          }, 0);
        } else {
          // Para outros eventos, apenas buscar perfil
          setTimeout(async () => {
            if (isMounted) {
              const profileData = await fetchProfile(session.user.id);
              if (isMounted) {
                setProfile(profileData);
                setLoading(false);
              }
            }
          }, 0);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Verificar sessão existente
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }

        if (session && isMounted) {
          console.log('Sessão existente encontrada:', session.user?.email);
          setSession(session);
          setUser(session.user);
          
          const profileData = await createProfileIfNeeded(session.user);
          if (isMounted) {
            setProfile(profileData);
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro na inicialização da auth:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
