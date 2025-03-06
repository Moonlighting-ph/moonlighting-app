
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useAuthErrors = () => {
  // Handle specific authentication errors
  const handleAuthError = useCallback((error: any, setFormErrors: (errors: {[key: string]: string}) => void) => {
    console.error('Auth error:', error);
    
    const errorMessage = error.message || 'An error occurred during authentication';
    
    // Handle specific error cases
    if (errorMessage.includes('User already registered')) {
      toast.error('This email is already registered. Please sign in instead.');
      setFormErrors({email: 'This email is already registered'});
    } else if (errorMessage.includes('Invalid login credentials')) {
      toast.error('Invalid email or password. Please try again.');
      setFormErrors({
        email: 'Invalid login credentials',
        password: 'Invalid login credentials'
      });
    } else if (errorMessage.includes('Email not confirmed')) {
      toast.error('Please verify your email before signing in.');
      setFormErrors({email: 'Email not verified'});
    } else {
      toast.error(errorMessage);
    }
  }, []);

  return {
    handleAuthError
  };
};
