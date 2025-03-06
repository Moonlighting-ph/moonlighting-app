
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '../useAuthForm';

export const useAuthService = () => {
  const navigate = useNavigate();

  // Handle signup process
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    userType: UserType
  ) => {
    try {
      console.log('Signing up with user type:', userType);
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Registration successful! Please check your email to verify your account.');
      return { success: true, data };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during signup'
      };
    }
  }, []);

  // Handle signin process
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile to check user type - using maybeSingle instead of single
      // to prevent errors when no profile is found
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Error retrieving user profile');
      }

      // If no profile was found, create a default redirect
      if (!profileData) {
        console.warn('No profile found for user:', data.user.id);
        toast.success('Sign in successful!');
        return { success: true, data, redirectPath: '/' };
      }

      let redirectPath = '/';
      
      if (profileData?.user_type === 'provider') {
        redirectPath = '/provider';
      } else if (profileData?.user_type === 'moonlighter') {
        redirectPath = '/moonlighter';
      }
      
      console.log('Redirecting to:', redirectPath);
      toast.success('Sign in successful!');
      return { success: true, data, redirectPath };
    } catch (error: any) {
      console.error('Signin error:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during sign in'
      };
    }
  }, []);

  return {
    signUp,
    signIn
  };
};
