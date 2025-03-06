
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import AuthFormField from './AuthFormField';
import AuthModeToggle from './AuthModeToggle';
import UserTypeSelector from './UserTypeSelector';
import { AuthFormData, UserType } from '@/hooks/useAuthForm';

type SignUpFormProps = {
  formData: AuthFormData;
  formErrors: {[key: string]: string};
  updateFormField: (field: keyof AuthFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  userType: UserType;
  onUserTypeChange: (type: UserType) => void;
  onToggleMode: () => void;
};

const SignUpForm = ({
  formData,
  formErrors,
  updateFormField,
  handleSubmit,
  loading,
  userType,
  onUserTypeChange,
  onToggleMode
}: SignUpFormProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthFormField
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={(value) => updateFormField('firstName', value)}
              required
              autoComplete="given-name"
              error={formErrors.firstName}
            />
            
            <AuthFormField
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => updateFormField('lastName', value)}
              required
              autoComplete="family-name"
              error={formErrors.lastName}
            />
          </div>
          
          <AuthFormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => updateFormField('email', value)}
            required
            autoComplete="email"
            error={formErrors.email}
          />
          
          <AuthFormField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => updateFormField('password', value)}
            required
            autoComplete="new-password"
            error={formErrors.password}
          />
          
          <UserTypeSelector 
            userType={userType} 
            onUserTypeChange={onUserTypeChange}
            disabled={loading}
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
          
          <AuthModeToggle mode="signup" onToggle={() => onToggleMode()} isLoading={loading} />
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignUpForm;
