
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const redirectLoggedInUser = async () => {
      if (!session?.user) return;
      
      setIsRedirecting(true);
      
      try {
        // Get user type to redirect appropriately
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user type:', error);
          navigate('/');
          return;
        }
        
        // Redirect based on user type
        if (data.user_type === 'provider') {
          navigate('/provider');
        } else if (data.user_type === 'moonlighter') {
          navigate('/moonlighter');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Unexpected error during redirect:', err);
        navigate('/');
      } finally {
        setIsRedirecting(false);
      }
    };
    
    redirectLoggedInUser();
  }, [session, navigate]);

  if (isRedirecting) {
    return (
      <SmoothScroll>
        <div className="min-h-screen bg-white">
          <Navbar />
          <section className="py-20 px-4 md:py-32 bg-gradient-to-b from-white to-blue-50">
            <div className="container mx-auto max-w-6xl text-center">
              <p>Redirecting to your dashboard...</p>
            </div>
          </section>
          <Footer />
        </div>
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <section className="py-20 px-4 md:py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md">
                <AuthForm />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Login;
