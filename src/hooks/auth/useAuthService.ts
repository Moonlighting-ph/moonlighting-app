
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
      
      toast('Registration successful! Please check your email to verify your account.');
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
      console.log('Attempting to sign in with email:', email);
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log('Sign in successful, fetching user profile...');

      // Get user profile to check user type - using maybeSingle to avoid errors
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Use toast instead of throwing an error to improve user experience
        toast('Error retrieving user profile. Redirecting to home page.', {
          description: 'This may be due to a temporary database issue'
        });
        return { success: true, data, redirectPath: '/' };
      }

      // If no profile was found, create a default redirect
      if (!profileData) {
        console.warn('No profile found for user:', data.user.id);
        toast('Sign in successful!');
        return { success: true, data, redirectPath: '/' };
      }

      let redirectPath = '/';
      
      if (profileData?.user_type === 'provider') {
        redirectPath = '/provider';
      } else if (profileData?.user_type === 'moonlighter') {
        redirectPath = '/moonlighter';
      }
      
      console.log('Sign in complete, redirecting to:', redirectPath);
      toast('Sign in successful!');
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
