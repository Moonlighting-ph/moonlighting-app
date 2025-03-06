
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useAuthErrors = () => {
  // Handle specific authentication errors
  const handleAuthError = useCallback((error: any, setFormErrors: (errors: {[key: string]: string}) => void) => {
    console.error('Auth error:', error);
    
    const errorMessage = error.message || 'An error occurred during authentication';
    
    // Handle specific error cases
    if (errorMessage.includes('User already registered')) {
      toast({
        description: 'This email is already registered. Please sign in instead.',
        variant: "destructive"
      });
      setFormErrors({email: 'This email is already registered'});
    } else if (errorMessage.includes('Invalid login credentials')) {
      toast({
        description: 'Invalid email or password. Please try again.',
        variant: "destructive"
      });
      setFormErrors({
        email: 'Invalid login credentials',
        password: 'Invalid login credentials'
      });
    } else if (errorMessage.includes('Email not confirmed')) {
      toast({
        description: 'Please verify your email before signing in.',
        variant: "destructive"
      });
      setFormErrors({email: 'Email not verified'});
    } else if (errorMessage.includes('infinite recursion detected')) {
      toast({
        title: "Database Policy Error",
        description: 'There is an issue with the database access policy. Please contact support.',
        variant: "destructive"
      });
      setFormErrors({general: 'Database access policy error'});
    } else if (errorMessage.includes('Error retrieving user profile')) {
      toast({
        description: 'Unable to retrieve your profile. Please try again later.',
        variant: "destructive"
      });
      setFormErrors({general: 'Unable to retrieve profile'});
    } else {
      toast({
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, []);

  return {
    handleAuthError
  };
};
