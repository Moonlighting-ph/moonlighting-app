
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavigateFunction } from 'react-router-dom';

interface JobNotFoundProps {
  navigate: NavigateFunction;
}

const JobNotFound: React.FC<JobNotFoundProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The job you're looking for doesn't exist or may have been removed.
      </p>
      <Button onClick={() => navigate('/jobs')}>
        Browse All Jobs
      </Button>
    </div>
  );
};

export default JobNotFound;
