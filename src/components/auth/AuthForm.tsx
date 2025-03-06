
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthForm } from '@/hooks/useAuthForm';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import AuthModeToggle from './AuthModeToggle';

const AuthForm = () => {
  const {
    mode,
    setMode,
    loading,
    userType,
    setUserType,
    formData,
    updateFormField,
    handleSubmit,
  } = useAuthForm();

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
              updateField={updateFormField}
              loading={loading}
            />
          ) : (
            <SignUpForm 
              formData={formData}
              updateField={updateFormField}
              userType={userType}
              onUserTypeChange={setUserType}
              loading={loading}
            />
          )}

          <AuthModeToggle 
            mode={mode}
            onToggle={setMode}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
