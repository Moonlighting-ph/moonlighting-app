
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProviderDashboardContent from '@/components/ProviderDashboardContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

const ProviderDashboard: React.FC = () => {
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
        <ProviderDashboardContent />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default ProviderDashboard;
