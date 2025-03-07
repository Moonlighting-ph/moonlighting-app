
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
      
      // First, check if we have a session before attempting to sign out
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Even if no session exists, we'll still clear the local state
      setSession(null);
      
      // Only attempt server-side signout if we have an actual session
      if (sessionData.session) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error signing out:', error);
          toast.error('Logout failed: ' + error.message);
        } else {
          toast.success('You have been signed out successfully');
        }
      } else {
        // If no session exists, just inform the user they're signed out
        console.log('No session found, but local state cleared');
        toast.success('You have been signed out successfully');
      }
      
      // Clear any Supabase data from localStorage as a fallback
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.expires_at');
        localStorage.removeItem('supabase.auth.refresh_token');
      }
    } catch (error: any) {
      console.error('Unexpected error signing out:', error);
      // Even if an error occurred, we should still clear the local session state
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
