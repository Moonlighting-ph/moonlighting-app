
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
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Moon } from './icons/Moon';

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
      
      // Clear any Supabase data from localStorage first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        // Remove any other Supabase auth-related items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.auth.')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      await signOut();
      navigate('/');
      
      // Force refresh the page to ensure all state is cleared
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error('Sign out error in Navbar:', error);
      toast.error('Failed to sign out. Please try again.');
      
      // Force client-side logout even if server-side logout failed
      navigate('/');
      window.location.reload();
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
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative p-1">
            <div className="absolute inset-0 rounded-full bg-primary opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Moon className="h-8 w-8 text-primary relative z-10" />
          </div>
          <span className="hidden sm:inline-block font-display font-bold text-lg sm:text-xl">moonlighting.ph</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link to="/jobs" className="text-gray-700 hover:text-primary transition-colors">
            Browse Jobs
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
