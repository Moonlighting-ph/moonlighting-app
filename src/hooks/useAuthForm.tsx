
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
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('moonlighter');
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const updateFormField = (field: keyof AuthFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateSignupForm = (): { valid: boolean; error?: string } => {
    // Check for required fields
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return { valid: false, error: 'Please fill in all required fields' };
    }

    // Ensure valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { valid: false, error: 'Please enter a valid email address' };
    }

    // Check password length
    if (formData.password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters long' };
    }

    return { valid: true };
  };

  const handleSignUp = async (): Promise<boolean> => {
    const validation = validateSignupForm();
    if (!validation.valid) {
      toast.error(validation.error);
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
    } else if (error.message.includes('Invalid login credentials')) {
      toast.error('Invalid email or password. Please try again.');
    } else if (error.message.includes('Email not confirmed')) {
      toast.error('Please verify your email before signing in.');
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
    updateFormField,
    handleSubmit,
  };
};
