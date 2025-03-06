
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AuthFormField from './AuthFormField';
import UserTypeSelector from './UserTypeSelector';
import { AuthFormData, UserType } from '@/hooks/useAuthForm';

type SignUpFormProps = {
  formData: AuthFormData;
  updateField: (field: keyof AuthFormData, value: string) => void;
  userType: UserType;
  onUserTypeChange: (type: UserType) => void;
  loading: boolean;
};

const SignUpForm = ({ 
  formData, 
  updateField, 
  userType, 
  onUserTypeChange, 
  loading 
}: SignUpFormProps) => {
  return (
    <>
      <UserTypeSelector 
        userType={userType} 
        onUserTypeChange={onUserTypeChange} 
      />

      <AuthFormField
        id="firstName"
        label="First Name"
        required
        value={formData.firstName}
        onChange={(value) => updateField('firstName', value)}
      />

      <AuthFormField
        id="lastName"
        label="Last Name"
        required
        value={formData.lastName}
        onChange={(value) => updateField('lastName', value)}
      />

      <AuthFormField
        id="email"
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(value) => updateField('email', value)}
      />

      <AuthFormField
        id="password"
        label="Password"
        type="password"
        required
        value={formData.password}
        onChange={(value) => updateField('password', value)}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </>
  );
};

export default SignUpForm;
