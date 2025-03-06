
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import AuthFormField from './AuthFormField';
import AuthModeToggle from './AuthModeToggle';
import { AuthFormData } from '@/hooks/useAuthForm';

type SignInFormProps = {
  formData: AuthFormData;
  formErrors: {[key: string]: string};
  updateField: (field: keyof AuthFormData, value: string) => void;
  loading: boolean;
  onToggleMode: () => void;
};

const SignInForm = ({
  formData,
  formErrors,
  updateField,
  loading,
  onToggleMode
}: SignInFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The actual submission logic is handled in the parent component
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <AuthFormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            required
            autoComplete="email"
            error={formErrors.email}
          />
          
          <AuthFormField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => updateField('password', value)}
            required
            autoComplete="current-password"
            error={formErrors.password}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
          
          <AuthModeToggle mode="signin" onToggle={onToggleMode} isLoading={loading} />
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignInForm;
