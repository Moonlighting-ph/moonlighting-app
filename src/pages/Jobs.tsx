
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothScroll from '../components/SmoothScroll';
import JobBoard from '../components/JobBoard';

const Jobs: React.FC = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white">
        <Navbar />
        <JobBoard />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Jobs;
