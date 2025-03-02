
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import JobListItem from '@/components/jobs/JobListItem';
import EmptyJobsList from '@/components/jobs/EmptyJobsList';

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  urgent: boolean;
  created_at: string;
  applicants?: number;
}

interface JobsListProps {
  isLoading: boolean;
  error: unknown;
  filteredJobs: Job[];
  savedJobs: string[];
  toggleSaved: (jobId: string) => void;
  resetFilters: () => void;
  formatDeadline: (deadline: string) => string;
}

const JobsList: React.FC<JobsListProps> = ({ 
  isLoading, 
  error, 
  filteredJobs, 
  savedJobs, 
  toggleSaved, 
  resetFilters,
  formatDeadline 
}) => {
  const [visibleJobs, setVisibleJobs] = useState(5);

  const loadMoreJobs = () => {
    setVisibleJobs(prev => prev + 5);
  };

  if (error) {
    return (
      <div className="container px-4 py-6 md:py-8">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Jobs</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading job listings. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading jobs...</span>
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return <EmptyJobsList resetFilters={resetFilters} />;
  }

  const displayedJobs = filteredJobs.slice(0, visibleJobs);
  const hasMoreJobs = visibleJobs < filteredJobs.length;

  return (
    <>
      {displayedJobs.map((job: Job) => (
        <JobListItem 
          key={job.id}
          job={job}
          isSaved={savedJobs.includes(job.id)}
          toggleSaved={toggleSaved}
          formatDeadline={formatDeadline}
        />
      ))}
      
      {hasMoreJobs && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            className="text-xs md:text-sm h-8 md:h-9"
            onClick={loadMoreJobs}
          >
            Load More Jobs
          </Button>
        </div>
      )}
    </>
  );
};

export default JobsList;
