import React from 'react';
import { Job } from '@/types/job';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface JobBoardProps {
  jobs: Job[];
  loading: boolean;
}

const JobBoard = ({ jobs, loading }: JobBoardProps) => {
  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (!jobs || jobs.length === 0) {
    return <div>No jobs found.</div>;
  }

  const handleToast = (message: string) => {
    toast(message);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{job.description}</p>
            <Badge>{job.type}</Badge>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleToast(`Applied for ${job.title} at ${job.company}`)}>Apply Now</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default JobBoard;
