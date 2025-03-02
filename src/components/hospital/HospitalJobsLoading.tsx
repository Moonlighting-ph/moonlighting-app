
import React from 'react';
import { Loader2 } from 'lucide-react';

const HospitalJobsLoading: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="text-muted-foreground">Loading job postings...</span>
    </div>
  );
};

export default HospitalJobsLoading;
