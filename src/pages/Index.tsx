
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import About from '@/components/About';
import SmoothScroll from '@/components/SmoothScroll';

const Index: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    const redirectAuthenticatedUser = async () => {
      if (!session?.user) return;
      
      try {
        // Get user type to redirect appropriately
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching user type:', error);
          return;
        }
        
        // Redirect based on user type
        if (data?.user_type === 'provider') {
          navigate('/provider');
        } else if (data?.user_type === 'moonlighter') {
          navigate('/moonlighter');
        }
      } catch (err) {
        console.error('Unexpected error during redirect:', err);
      }
    };
    
    redirectAuthenticatedUser();
  }, [session, navigate]);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <Features />
        <About />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Index;
