
import { useCallback } from 'react';
import { AuthFormData } from '../useAuthForm';

export const useFormValidation = () => {
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
