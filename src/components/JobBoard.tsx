import React, { useEffect, useState } from 'react';
import { Job } from '@/types/job';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface JobBoardProps {
  jobs?: Job[];
  loading?: boolean;
}

const JobBoard = ({ jobs: propJobs, loading: propLoading }: JobBoardProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(propLoading || true);

  useEffect(() => {
    if (propJobs) {
      setJobs(propJobs);
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('posted_date', { ascending: false });

        if (error) {
          console.error('Error fetching jobs:', error);
          toast('Failed to load job listings', {
            description: 'Please try again later'
          });
          return;
        }

        setJobs(data || []);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast('An error occurred while loading jobs', {
          description: 'Please refresh the page or try again later'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [propJobs]);

  if (loading) {
    return <div className="p-8 text-center">Loading jobs...</div>;
  }

  if (!jobs || jobs.length === 0) {
    return <div className="p-8 text-center">No jobs found.</div>;
  }

  const handleToast = (message: string) => {
    toast(message);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {jobs.map((job) => (
        <Card key={job.id} className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">{job.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge>{job.type}</Badge>
              {job.specialization && <Badge variant="outline">{job.specialization}</Badge>}
              {job.is_urgent && <Badge variant="destructive">Urgent</Badge>}
            </div>
            {job.location && <p className="mt-2 text-sm text-gray-500">Location: {job.location}</p>}
            {job.salary && <p className="text-sm text-gray-500">Salary: {job.salary}</p>}
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
