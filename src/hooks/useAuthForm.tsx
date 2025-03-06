
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

// Form validation utilities
const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

const validateName = (name: string, fieldName: string): string | null => {
  if (!name) return `${fieldName} is required`;
  return null;
};

export const useAuthForm = () => {
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

  const validateSignupForm = (): { valid: boolean; errors: {[key: string]: string} } => {
    const errors: {[key: string]: string} = {};
    
    // Check email
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    // Check password
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    // Check names
    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) errors.firstName = firstNameError;
    
    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) errors.lastName = lastNameError;

    return { valid: Object.keys(errors).length === 0, errors };
  };

  const validateSignInForm = (): { valid: boolean; errors: {[key: string]: string} } => {
    const errors: {[key: string]: string} = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    return { valid: Object.keys(errors).length === 0, errors };
  };

  const handleAuthError = (error: any) => {
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
  };

  const handleSignUp = async (): Promise<boolean> => {
    const validation = validateSignupForm();
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return false;
    }

    try {
      console.log('Signing up with user type:', userType);
      
      const { error: signUpError } = await supabase.auth.signUp({
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
      await handleDirectSignIn();
      
      return true;
    } catch (error: any) {
      handleAuthError(error);
      return false;
    }
  };

  const handleDirectSignIn = async (): Promise<boolean> => {
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

  const handleSignIn = async (): Promise<boolean> => {
    const validation = validateSignInForm();
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return false;
    }

    return handleDirectSignIn();
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
