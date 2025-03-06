
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WaitlistHero from '../components/WaitlistHero';
import SmoothScroll from '../components/SmoothScroll';

const Waitlist: React.FC = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <WaitlistHero />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Waitlist;
