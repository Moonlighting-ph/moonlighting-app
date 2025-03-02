import { useState } from 'react';
import { useMutation, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseJobActionsProps {
  queryClient: QueryClient;
}

export const useJobActions = ({ queryClient }: UseJobActionsProps) => {
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      console.log('Deleting job with ID:', jobId);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('created_by', userData.user.id);
      
      if (error) {
        console.error('Supabase deletion error:', error);
        throw error;
      }
      
      return jobId;
    },
    onSuccess: (jobId) => {
      console.log('Job deleted successfully:', jobId);
      // Immediately invalidate the query to refresh the job list
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast({
        title: "Job Deleted",
        description: "The job posting has been successfully deleted."
      });
      setJobToDelete(null); // Reset the job to delete state
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
      // Always reset the state even on error
      setJobToDelete(null);
    }
  });

  const duplicateJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      // First, get the job to duplicate
      const { data: jobToDuplicate, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('created_by', userData.user.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (!jobToDuplicate) {
        throw new Error('Job not found');
      }
      
      // Create a new job with the same data
      const { id, created_at, ...jobData } = jobToDuplicate;
      
      // Update the title to indicate it's a copy
      jobData.title = `${jobData.title} (Copy)`;
      
      const { data: newJob, error: createError } = await supabase
        .from('jobs')
        .insert([jobData])
        .select();
      
      if (createError) throw createError;
      
      return newJob?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast({
        title: "Job Duplicated",
        description: "The job posting has been successfully duplicated."
      });
    },
    onError: (error) => {
      console.error('Error duplicating job:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate job. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (jobToDelete) {
      console.log('Handling delete for job:', jobToDelete);
      deleteJobMutation.mutate(jobToDelete);
    }
  };

  const handleSetJobToDelete = (jobId: string) => {
    console.log('Setting job to delete:', jobId);
    setJobToDelete(jobId);
  };

  return {
    jobToDelete,
    setJobToDelete,
    handleSetJobToDelete,
    deleteJobMutation,
    duplicateJobMutation,
    handleDelete
  };
};
