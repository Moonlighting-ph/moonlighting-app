
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const JobNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto max-w-4xl py-20 px-4 text-center">
      <div className="flex flex-col items-center space-y-6">
        <FileQuestion className="h-24 w-24 text-gray-400" />
        
        <h1 className="text-3xl font-bold text-gray-900">Job Not Found</h1>
        
        <p className="text-gray-600 max-w-md">
          The job posting you're looking for doesn't exist or may have been removed.
        </p>
        
        <div className="flex space-x-4 pt-4">
          <Button onClick={() => navigate('/jobs')}>
            Browse Available Jobs
          </Button>
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobNotFound;
