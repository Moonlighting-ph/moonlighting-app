
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  checkSession: () => Promise<Session | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  checkSession: async () => null,
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
      console.log('Attempting to sign out...');
      
      // Simply call signOut without checking for session first
      // Let supabase handle the case where there's no session
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Logout failed: ' + error.message);
      } else {
        // Always clear the session state regardless of whether signOut succeeded
        setSession(null);
        toast.success('You have been signed out successfully');
      }
    } catch (error: any) {
      console.error('Unexpected error signing out:', error);
      // Even if an error occurred, we should still clear the local session state
      // to allow users to "force logout" on the client side
      setSession(null);
      toast.error('An unexpected error occurred during logout');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkSession();

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          console.log('Auth state changed:', _event, session ? 'User authenticated' : 'No session');
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
