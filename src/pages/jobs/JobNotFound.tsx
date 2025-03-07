
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface JobNotFoundProps {
  navigate: ReturnType<typeof useNavigate>;
}

const JobNotFound: React.FC<JobNotFoundProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
        <p className="text-gray-600 mb-8">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/jobs')}>
          Browse All Jobs
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default JobNotFound;
