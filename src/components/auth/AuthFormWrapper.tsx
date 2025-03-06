
import { useAuthForm } from '@/hooks/useAuthForm';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthFormWrapper = () => {
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

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {mode === 'signin' ? (
        <SignInForm
          formData={formData}
          formErrors={formErrors}
          updateFormField={updateFormField}
          handleSubmit={handleSubmit}
          loading={loading}
          onToggleMode={toggleMode}
        />
      ) : (
        <SignUpForm
          formData={formData}
          formErrors={formErrors}
          updateFormField={updateFormField}
          handleSubmit={handleSubmit}
          loading={loading}
          userType={userType}
          onUserTypeChange={setUserType}
          onToggleMode={toggleMode}
        />
      )}
    </div>
  );
};

export default AuthFormWrapper;
