
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import MoonlighterDashboardContent from '../components/MoonlighterDashboardContent';

const MoonlighterDashboard: React.FC = () => {
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
