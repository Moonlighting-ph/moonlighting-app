
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, deleteJobPosting } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useJobActions = () => {
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [jobToEdit, setJobToEdit] = useState<string | null>(null);
  const [isViewingApplications, setIsViewingApplications] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      console.log('Starting deletion process for job:', jobId);
      return await deleteJobPosting(jobId);
    },
    onSuccess: (data) => {
      console.log('Job deleted successfully:', data);
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      
      toast({
        title: "Job Deleted",
        description: "The job posting has been successfully deleted.",
      });
      
      // Reset state
      setJobToDelete(null);
    },
    onError: (error: Error) => {
      console.error('Error deleting job:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete job. Please try again.",
        variant: "destructive",
      });
      
      // Always reset state even on error
      setJobToDelete(null);
    }
  });

  const handleViewApplications = (jobId: string) => {
    setIsViewingApplications(jobId);
  };

  const handleEdit = (jobId: string) => {
    setJobToEdit(jobId);
  };

  const handleDelete = () => {
    if (jobToDelete) {
      console.log('Confirming deletion for job:', jobToDelete);
      deleteJobMutation.mutate(jobToDelete);
    }
  };

  const handleSetJobToDelete = (jobId: string) => {
    console.log('Setting job to delete:', jobId);
    setJobToDelete(jobId);
  };

  return {
    jobToDelete,
    jobToEdit,
    isViewingApplications,
    setJobToDelete: handleSetJobToDelete,
    setJobToEdit,
    setIsViewingApplications,
    handleViewApplications,
    handleEdit,
    handleDelete,
    isDeleting: deleteJobMutation.isPending
  };
};
