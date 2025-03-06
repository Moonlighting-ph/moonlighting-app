
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  checkSession: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      return data.session;
    } catch (error) {
      console.error('Error checking session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkSession();

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session);
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, checkSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
