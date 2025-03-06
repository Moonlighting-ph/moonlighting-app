
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AuthFormField from './AuthFormField';
import { AuthFormData } from '@/hooks/useAuthForm';

type SignInFormProps = {
  formData: AuthFormData;
  updateField: (field: keyof AuthFormData, value: string) => void;
  loading: boolean;
};

const SignInForm = ({ formData, updateField, loading }: SignInFormProps) => {
  return (
    <>
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
          'Sign In'
        )}
      </Button>
    </>
  );
};

export default SignInForm;
