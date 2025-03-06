
import { Button } from '@/components/ui/button';

type AuthModeToggleProps = {
  mode: 'signin' | 'signup';
  onToggle: (mode: 'signin' | 'signup') => void;
  isLoading?: boolean;
};

const AuthModeToggle = ({ mode, onToggle, isLoading = false }: AuthModeToggleProps) => {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {mode === 'signin' ? (
        <>
          Don't have an account?{' '}
          <Button 
            variant="link" 
            className="p-0" 
            onClick={() => onToggle('signup')}
            disabled={isLoading}
          >
            Sign up
          </Button>
        </>
      ) : (
        <>
          Already have an account?{' '}
          <Button 
            variant="link" 
            className="p-0" 
            onClick={() => onToggle('signin')}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </>
      )}
    </p>
  );
};

export default AuthModeToggle;
