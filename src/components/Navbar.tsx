
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = React.useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = React.useState<boolean>(false);

  React.useEffect(() => {
    const getUserType = async () => {
      if (!session?.user) return;
      
      try {
        console.log('Fetching user type for user:', session.user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user type:', error);
          return;
        }
        
        if (data) {
          setUserType(data.user_type);
          console.log('User type set to:', data.user_type);
        }
      } catch (err) {
        console.error('Unexpected error fetching user type:', err);
      }
    };
    
    getUserType();
  }, [session]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error in Navbar:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const getDashboardLink = () => {
    if (userType === 'provider') return '/provider';
    if (userType === 'moonlighter') return '/moonlighter';
    return '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Moonlighting.ph
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link to="/jobs" className="text-gray-700 hover:text-primary">
            Find Jobs
          </Link>
          
          {!session ? (
            <Link to="/auth/login">
              <Button variant="default" size="sm">Sign In</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User size={16} />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
