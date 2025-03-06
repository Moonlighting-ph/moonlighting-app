
import { useState, useCallback, useMemo } from 'react';
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

// Separate validation functions for better maintainability
const useFormValidation = () => {
  const validateEmail = useCallback((email: string): string | null => {
    if (!email) return 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  }, []);

  const validatePassword = useCallback((password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return null;
  }, []);

  const validateName = useCallback((name: string, fieldName: string): string | null => {
    if (!name) return `${fieldName} is required`;
    return null;
  }, []);

  // Form validation for signup
  const validateSignupForm = useCallback((formData: AuthFormData): { valid: boolean; errors: {[key: string]: string} } => {
    const errors: {[key: string]: string} = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) errors.firstName = firstNameError;
    
    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) errors.lastName = lastNameError;

    return { valid: Object.keys(errors).length === 0, errors };
  }, [validateEmail, validatePassword, validateName]);

  // Form validation for signin
  const validateSignInForm = useCallback((formData: AuthFormData): { valid: boolean; errors: {[key: string]: string} } => {
    const errors: {[key: string]: string} = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    return { valid: Object.keys(errors).length === 0, errors };
  }, [validateEmail, validatePassword]);

  return {
    validateSignupForm,
    validateSignInForm
  };
};

// Separate authentication functions
const useAuthService = () => {
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

      // Get user profile to check user type
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', data.user.id)
        .maybeSingle(); // Using maybeSingle instead of single to avoid errors when no data is found

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Error retrieving user profile');
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

// Main auth form hook
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

  const { validateSignupForm, validateSignInForm } = useFormValidation();
  const { signUp, signIn } = useAuthService();

  // Update form field with error clearing
  const updateFormField = useCallback((field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user types
    if (formErrors[field]) {
      setFormErrors(prev => {
        const updated = {...prev};
        delete updated[field];
        return updated;
      });
    }
  }, [formErrors]);

  // Handle specific authentication errors
  const handleAuthError = useCallback((error: any) => {
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

  // Handle the signup process
  const handleSignUp = useCallback(async () => {
    const validation = validateSignupForm(formData);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return false;
    }

    const result = await signUp(
      formData.email, 
      formData.password, 
      formData.firstName, 
      formData.lastName, 
      userType
    );

    if (!result.success) {
      handleAuthError(result.error);
      return false;
    }
    
    // For demo purposes, auto sign in after registration
    return await handleDirectSignIn();
  }, [formData, userType, validateSignupForm, signUp, handleAuthError]);

  // Direct sign in without validation (used after registration)
  const handleDirectSignIn = useCallback(async () => {
    const result = await signIn(formData.email, formData.password);
    
    if (!result.success) {
      handleAuthError(result.error);
      return false;
    }

    navigate(result.redirectPath);
    return true;
  }, [formData.email, formData.password, signIn, handleAuthError, navigate]);

  // Handle the sign in process
  const handleSignIn = useCallback(async () => {
    const validation = validateSignInForm(formData);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return false;
    }

    return handleDirectSignIn();
  }, [formData, validateSignInForm, handleDirectSignIn]);

  // Main submit handler
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault(); // Ensure this is called to prevent page refresh
    setLoading(true);

    console.log('Form submitted in mode:', mode);

    try {
      if (mode === 'signup') {
        handleSignUp();
      } else {
        handleSignIn();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [mode, handleSignUp, handleSignIn]);

  // Memoize returned values to prevent unnecessary re-renders
  return useMemo(() => ({
    mode,
    setMode,
    loading,
    userType,
    setUserType,
    formData,
    formErrors,
    updateFormField,
    handleSubmit,
  }), [
    mode, 
    loading, 
    userType, 
    formData, 
    formErrors, 
    updateFormField, 
    handleSubmit
  ]);
};
