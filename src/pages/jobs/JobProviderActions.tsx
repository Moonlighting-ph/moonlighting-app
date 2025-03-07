
import React from 'react';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';

interface JobProviderActionsProps {
  job: Job;
  onEdit: () => void;
}

const JobProviderActions: React.FC<JobProviderActionsProps> = ({ job, onEdit }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <p className="text-blue-700 font-medium mb-2">
        You posted this job
      </p>
      <Button 
        onClick={onEdit} 
        className="w-full"
      >
        Edit Job Post
      </Button>
    </div>
  );
};

export default JobProviderActions;
