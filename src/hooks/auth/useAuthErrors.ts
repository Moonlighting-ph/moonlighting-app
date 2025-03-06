
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useAuthErrors = () => {
  // Handle specific authentication errors
  const handleAuthError = useCallback((error: any, setFormErrors: (errors: {[key: string]: string}) => void) => {
    console.error('Auth error:', error);
    
    const errorMessage = error.message || 'An error occurred during authentication';
    
    // Handle specific error cases
    if (errorMessage.includes('User already registered')) {
      toast('This email is already registered. Please sign in instead.', {
        description: 'If you forgot your password, please use the password reset option.'
      });
      setFormErrors({email: 'This email is already registered'});
    } else if (errorMessage.includes('Invalid login credentials')) {
      toast('Invalid email or password. Please try again.', {
        description: 'Check your credentials and try again'
      });
      setFormErrors({
        email: 'Invalid login credentials',
        password: 'Invalid login credentials'
      });
    } else if (errorMessage.includes('Email not confirmed')) {
      toast('Please verify your email before signing in.', {
        description: 'Check your inbox for a verification email'
      });
      setFormErrors({email: 'Email not verified'});
    } else if (errorMessage.includes('infinite recursion detected')) {
      toast('Database Policy Error: There is an issue with the database access policy. Please contact support.', {
        description: 'Our team has been notified of this issue'
      });
      setFormErrors({general: 'Database access policy error'});
    } else if (errorMessage.includes('Error retrieving user profile')) {
      toast('Unable to retrieve your profile. Please try again later.', {
        description: 'This may be due to a temporary service interruption'
      });
      setFormErrors({general: 'Unable to retrieve profile'});
    } else {
      toast(errorMessage, {
        description: 'Please try again or contact support if the issue persists'
      });
    }
  }, []);

  return {
    handleAuthError
  };
};
