
import React from 'react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import JobCard from './JobCard';

interface JobListProps {
  jobs: Job[];
  userType: string | null;
  onApply: (job: Job) => void;
  onResetFilters: () => void;
}

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  userType, 
  onApply, 
  onResetFilters 
}) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No jobs found matching your criteria.</p>
        <Button onClick={onResetFilters} variant="link" className="mt-2">
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            userType={userType} 
            onApply={onApply} 
          />
        ))}
      </div>
    </div>
  );
};

export default JobList;
