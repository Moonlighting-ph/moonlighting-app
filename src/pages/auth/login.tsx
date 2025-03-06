
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (session) {
      // Check user type to redirect to appropriate dashboard
      navigate('/');
    }
  }, [session, navigate]);

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
