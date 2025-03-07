
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const JobDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">Loading job details...</div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetailSkeleton;
