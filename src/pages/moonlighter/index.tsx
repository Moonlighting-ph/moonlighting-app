
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MoonlighterDashboardContent from '@/components/MoonlighterDashboardContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

const MoonlighterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth/login');
    }
  }, [session, loading, navigate]);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <MoonlighterDashboardContent />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default MoonlighterDashboard;
