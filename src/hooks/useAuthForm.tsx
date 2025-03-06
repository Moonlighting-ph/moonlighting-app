
import { useState, useCallback, useMemo, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFormValidation } from './auth/useFormValidation';
import { useAuthService } from './auth/useAuthService';
import { useAuthErrors } from './auth/useAuthErrors';

export type AuthFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthMode = 'signin' | 'signup';
export type UserType = 'provider' | 'moonlighter';

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
  const { handleAuthError } = useAuthErrors();

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
      handleAuthError(result.error, setFormErrors);
      return false;
    }
    
    // For demo purposes, auto sign in after registration
    return await handleDirectSignIn();
  }, [formData, userType, validateSignupForm, signUp, handleAuthError]);

  // Direct sign in without validation (used after registration)
  const handleDirectSignIn = useCallback(async () => {
    const result = await signIn(formData.email, formData.password);
    
    if (!result.success) {
      handleAuthError(result.error, setFormErrors);
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
  const handleSubmit = useCallback((e: FormEvent) => {
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
