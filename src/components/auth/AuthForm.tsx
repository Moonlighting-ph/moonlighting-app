
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthForm } from '@/hooks/useAuthForm';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthForm = () => {
  const {
    mode,
    setMode,
    loading,
    userType,
    setUserType,
    formData,
    formErrors,
    updateFormField,
    handleSubmit,
  } = useAuthForm();

  // Function to toggle auth mode (signin/signup)
  const handleToggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'signin' ? 'Sign In' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Welcome back! Sign in to access your account.' 
            : 'Join Moonlighting.ph as a healthcare provider or professional.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signin' ? (
            <SignInForm 
              formData={formData}
              formErrors={formErrors}
              updateField={updateFormField}
              loading={loading}
              onToggleMode={handleToggleMode}
            />
          ) : (
            <SignUpForm 
              formData={formData}
              formErrors={formErrors}
              updateField={updateFormField}
              userType={userType}
              onUserTypeChange={setUserType}
              loading={loading}
              onToggleMode={handleToggleMode}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
