
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import ProviderDashboardContent from '../components/ProviderDashboardContent';

const ProviderDashboard: React.FC = () => {
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
