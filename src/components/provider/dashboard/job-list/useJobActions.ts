
import { useState } from 'react';
import { useMutation, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseJobActionsProps {
  queryClient: QueryClient;
  toast: {
    toast: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => void;
  };
}

export const useJobActions = ({ queryClient, toast }: UseJobActionsProps) => {
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

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
      toast.toast({
        title: "Job Deleted",
        description: "The job posting has been successfully deleted."
      });
      setJobToDelete(null); // Reset the job to delete state
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      toast.toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
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
      toast.toast({
        title: "Job Duplicated",
        description: "The job posting has been successfully duplicated."
      });
    },
    onError: (error) => {
      console.error('Error duplicating job:', error);
      toast.toast({
        title: "Error",
        description: "Failed to duplicate job. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete);
    }
  };

  const handleSetJobToDelete = (jobId: string) => {
    setJobToDelete(jobId);
  };

  return {
    jobToDelete,
    handleSetJobToDelete,
    deleteJobMutation,
    duplicateJobMutation,
    handleDelete
  };
};
