
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface JobNotFoundProps {
  navigate: NavigateFunction;
}

const JobNotFound: React.FC<JobNotFoundProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Job not found</p>
          <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobNotFound;
