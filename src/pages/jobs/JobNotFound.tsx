
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavigateFunction } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface JobNotFoundProps {
  navigate: NavigateFunction;
}

const JobNotFound: React.FC<JobNotFoundProps> = ({ navigate }) => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Job Not Found</h1>
        <p className="text-gray-600">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Button 
          onClick={() => navigate('/jobs')}
          className="inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    </div>
  );
};

export default JobNotFound;
