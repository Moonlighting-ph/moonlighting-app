
import { Card } from '@/components/ui/card';
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signin' ? (
          <SignInForm 
            formData={formData}
            formErrors={formErrors}
            updateField={updateFormField}
            loading={loading}
            onToggleMode={handleToggleMode}
            onSubmit={handleSubmit}
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
            onSubmit={handleSubmit}
          />
        )}
      </form>
    </Card>
  );
};

export default AuthForm;
