
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface JobNotFoundProps {
  navigate: ReturnType<typeof useNavigate>;
}

const JobNotFound: React.FC<JobNotFoundProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-gray-600 mb-6">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/jobs')} className="w-full">
          Browse All Jobs
        </Button>
      </div>
    </div>
  );
};

export default JobNotFound;
