
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBulkActions = () => {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkDeleteMutation = useMutation({
    mutationFn: async (jobIds: string[]) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('You must be logged in to delete job postings');
      }
      
      const promises = jobIds.map(jobId => 
        supabase
          .from('jobs')
          .delete()
          .eq('id', jobId)
          .eq('created_by', userData.user!.id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to delete some jobs: ${errors.map(e => e.message).join(', ')}`);
      }
      
      return jobIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast({
        title: "Jobs Deleted",
        description: `${selectedJobs.length} job postings have been successfully deleted.`,
      });
      setSelectedJobs([]);
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete jobs. Please try again.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
    }
  });

  const bulkArchiveMutation = useMutation({
    mutationFn: async (jobIds: string[]) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('You must be logged in to archive job postings');
      }
      
      const promises = jobIds.map(jobId => 
        supabase
          .from('jobs')
          .update({ is_active: false }) // Change 'status' to 'is_active: false' to archive a job
          .eq('id', jobId)
          .eq('created_by', userData.user!.id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to archive some jobs: ${errors.map(e => e.message).join(', ')}`);
      }
      
      return jobIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast({
        title: "Jobs Archived",
        description: `${selectedJobs.length} job postings have been successfully archived.`,
      });
      setSelectedJobs([]);
      setIsArchiveDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Archive Failed",
        description: error.message || "Failed to archive jobs. Please try again.",
        variant: "destructive",
      });
      setIsArchiveDialogOpen(false);
    }
  });

  const handleSelectJob = (jobId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedJobs(prev => [...prev, jobId]);
    } else {
      setSelectedJobs(prev => prev.filter(id => id !== jobId));
    }
  };

  const handleSelectAllJobs = (jobIds: string[], isSelected: boolean) => {
    if (isSelected) {
      setSelectedJobs(jobIds);
    } else {
      setSelectedJobs([]);
    }
  };

  const handleBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedJobs);
  };

  const handleBulkArchive = () => {
    bulkArchiveMutation.mutate(selectedJobs);
  };

  return {
    selectedJobs,
    isArchiveDialogOpen,
    isDeleteDialogOpen,
    setIsArchiveDialogOpen,
    setIsDeleteDialogOpen,
    handleSelectJob,
    handleSelectAllJobs,
    handleBulkDelete,
    handleBulkArchive,
    isDeleting: bulkDeleteMutation.isPending,
    isArchiving: bulkArchiveMutation.isPending
  };
};
