
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from 'lucide-react';
import HospitalJobCard from './HospitalJobCard';
import EmptyHospitalJobsList from './EmptyHospitalJobsList';
import HospitalJobsLoading from './HospitalJobsLoading';

const HospitalJobList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  // Fetch jobs created by current user
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['hospitalJobs'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('created_by', userData.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('created_by', userData.user.id);
      
      if (error) throw error;
      return jobId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast({
        title: "Job Deleted",
        description: "The job posting has been successfully deleted."
      });
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete);
      setJobToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSetJobToDelete = (jobId: string) => {
    setJobToDelete(jobId);
  };

  if (isLoading) {
    return <HospitalJobsLoading />;
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-muted rounded-lg">
        <h3 className="text-lg font-medium">Error loading jobs</h3>
        <p className="text-muted-foreground mt-2">
          {(error as Error).message || "An unexpected error occurred"}
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] })} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Job Postings</h2>
        <Button onClick={() => navigate('/platform/hospital-jobs/new')}>
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <HospitalJobCard 
              key={job.id}
              job={job}
              onDelete={handleSetJobToDelete}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <EmptyHospitalJobsList />
      )}

      <AlertDialog open={!!jobToDelete} onOpenChange={() => !jobToDelete && setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              this job posting and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setJobToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HospitalJobList;
