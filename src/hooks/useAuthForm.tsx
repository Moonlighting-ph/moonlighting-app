import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type AuthFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthMode = 'signin' | 'signup';
export type UserType = 'provider' | 'moonlighter';

export const useAuthForm = () => {
  // ... keep existing code (navigate, mode, loading, userType state definitions)
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('moonlighter');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const updateFormField = (field: keyof AuthFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field when user types
    if (formErrors[field]) {
      const updatedErrors = {...formErrors};
      delete updatedErrors[field];
      setFormErrors(updatedErrors);
    }
  };

  // ... keep existing code (validateSignupForm, validateSignInForm, handleSignUp, handleSignIn, handleAuthError functions)

  const validateSignupForm = (): { valid: boolean; errors: {[key: string]: string} } => {
    const errors: {[key: string]: string} = {};
    
    // Check for required fields
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';

    // If any required field is missing, return early
    if (Object.keys(errors).length > 0) {
      return { valid: false, errors };
    }

    // Ensure valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Check password length
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  };

  const validateSignInForm = (): { valid: boolean; errors: {[key: string]: string} } => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    
    return { valid: Object.keys(errors).length === 0, errors };
  };

  const handleSignUp = async (): Promise<boolean> => {
    const validation = validateSignupForm();
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return false;
    }

    try {
      console.log('Signing up with user type:', userType);
      
      const { error: signUpError, data } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            user_type: userType,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      toast.success('Registration successful! Please check your email to verify your account.');
      
      // For demo purposes, auto sign in after registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (signInError) throw signInError;
      
      // Redirect based on user type
      if (userType === 'provider') {
        navigate('/provider');
      } else {
        navigate('/moonlighter');
      }
      
      return true;
    } catch (error: any) {
      handleAuthError(error);
      return false;
    }
  };

  const handleSignIn = async (): Promise<boolean> => {
    const validation = validateSignInForm();
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return false;
    }

    try {
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      // Get user profile to check user type
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .single();

      if (profileData?.user_type === 'provider') {
        navigate('/provider');
      } else if (profileData?.user_type === 'moonlighter') {
        navigate('/moonlighter');
      } else {
        navigate('/');
      }
      
      toast.success('Sign in successful!');
      return true;
    } catch (error: any) {
      handleAuthError(error);
      return false;
    }
  };

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    
    // Handle specific error cases
    if (error.message.includes('User already registered')) {
      toast.error('This email is already registered. Please sign in instead.');
      setFormErrors({email: 'This email is already registered'});
    } else if (error.message.includes('Invalid login credentials')) {
      toast.error('Invalid email or password. Please try again.');
      setFormErrors({
        email: 'Invalid login credentials',
        password: 'Invalid login credentials'
      });
    } else if (error.message.includes('Email not confirmed')) {
      toast.error('Please verify your email before signing in.');
      setFormErrors({email: 'Email not verified'});
    } else {
      toast.error(error.message || 'An error occurred during authentication');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        await handleSignUp();
      } else {
        await handleSignIn();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    setMode,
    loading,
    userType,
    setUserType,
    formData,
    formErrors,
    updateFormField,
    handleSubmit,
  };
};
