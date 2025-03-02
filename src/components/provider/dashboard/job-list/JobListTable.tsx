
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { NavigateFunction } from 'react-router-dom';
import { UseMutationResult } from '@tanstack/react-query';
import HospitalJobCard from '@/components/hospital/HospitalJobCard';

interface JobListTableProps {
  jobs: any[];
  selectedJobs: string[];
  toggleJobSelection: (jobId: string) => void;
  handleSetJobToDelete: (jobId: string) => void;
  duplicateJobMutation: UseMutationResult<any, Error, string, unknown>;
  formatDate: (dateString: string) => string;
  navigate: NavigateFunction;
}

export const JobListTable: React.FC<JobListTableProps> = ({
  jobs,
  selectedJobs,
  toggleJobSelection,
  handleSetJobToDelete,
  duplicateJobMutation,
  formatDate,
  navigate
}) => {
  const handleDuplicateJob = (jobId: string) => {
    duplicateJobMutation.mutate(jobId);
  };
  
  return (
    <div className="space-y-4">
      {jobs.map((job: any) => (
        <div key={job.id} className="flex items-center gap-4">
          <Checkbox 
            checked={selectedJobs.includes(job.id)}
            onCheckedChange={() => toggleJobSelection(job.id)}
            className="mt-6"
          />
          <div className="flex-1">
            <HospitalJobCard 
              job={job}
              onDelete={handleSetJobToDelete}
              onDuplicate={handleDuplicateJob}
              formatDate={formatDate}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
