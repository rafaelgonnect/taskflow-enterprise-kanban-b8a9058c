
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: 'admin' | 'employee';
  created_at?: string;
  updated_at?: string;
  skills?: string[];
  languages?: string[];
  experience?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profileData) {
                const mappedProfile: Profile = {
                  id: profileData.id,
                  email: profileData.email,
                  full_name: profileData.full_name,
                  user_type: profileData.user_type === 'company_owner' ? 'admin' : 'employee',
                  created_at: profileData.created_at,
                  updated_at: profileData.updated_at,
                  skills: profileData.skills || [],
                  languages: profileData.languages || [],
                  experience: profileData.experience || ''
                };
                setProfile(mappedProfile);
              }
            } catch (error) {
              console.error('Erro ao buscar perfil:', error);
            }
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (profileData) {
              const mappedProfile: Profile = {
                id: profileData.id,
                email: profileData.email,
                full_name: profileData.full_name,
                user_type: profileData.user_type === 'company_owner' ? 'admin' : 'employee',
                created_at: profileData.created_at,
                updated_at: profileData.updated_at,
                skills: profileData.skills || [],
                languages: profileData.languages || [],
                experience: profileData.experience || ''
              };
              setProfile(mappedProfile);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        experience: data.experience,
        skills: data.skills,
        languages: data.languages,
      })
      .eq('id', user.id);

    if (error) throw error;

    // Atualizar estado local
    if (profile) {
      setProfile({
        ...profile,
        ...data,
      });
    }
  };

  const signOut = async () => {
    try {
      console.log('Iniciando logout...');
      
      // Logout do Supabase primeiro
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout do Supabase:', error);
      }
      
      // Limpar estado local
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Limpar localStorage
      localStorage.clear();
      
      // Limpar sessionStorage
      sessionStorage.clear();
      
      console.log('Logout concluído');
      
      // Forçar redirecionamento
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erro durante logout:', error);
      // Em caso de erro, forçar redirecionamento mesmo assim
      window.location.href = '/auth';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading, 
      signOut, 
      signIn, 
      signUp, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
