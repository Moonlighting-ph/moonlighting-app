
import { useState } from 'react';
import { useMutation, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseBulkActionsProps {
  jobs: any[] | undefined;
  queryClient: QueryClient;
}

export const useBulkActions = ({ jobs, queryClient }: UseBulkActionsProps) => {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'delete' | 'archive'>('delete');
  const { toast } = useToast();

  const bulkDeleteMutation = useMutation({
    mutationFn: async (jobIds: string[]) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const promises = jobIds.map(jobId => 
        supabase
          .from('jobs')
          .delete()
          .eq('id', jobId)
          .eq('created_by', userData.user!.id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error).map(result => result.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to delete ${errors.length} jobs`);
      }
      
      return jobIds;
    },
    onSuccess: (jobIds) => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast({
        title: "Jobs Deleted",
        description: `Successfully deleted ${jobIds.length} job postings.`
      });
      setSelectedJobs([]);
      setBulkActionDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting jobs:', error);
      toast({
        title: "Error",
        description: "Failed to delete jobs. Please try again.",
        variant: "destructive",
      });
    }
  });

  const bulkArchiveMutation = useMutation({
    mutationFn: async (jobIds: string[]) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const promises = jobIds.map(jobId => 
        supabase
          .from('jobs')
          .update({ status: 'archived' })
          .eq('id', jobId)
          .eq('created_by', userData.user!.id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error).map(result => result.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to archive ${errors.length} jobs`);
      }
      
      return jobIds;
    },
    onSuccess: (jobIds) => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast({
        title: "Jobs Archived",
        description: `Successfully archived ${jobIds.length} job postings.`
      });
      setSelectedJobs([]);
      setBulkActionDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error archiving jobs:', error);
      toast({
        title: "Error",
        description: "Failed to archive jobs. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleBulkAction = () => {
    if (bulkAction === 'delete') {
      bulkDeleteMutation.mutate(selectedJobs);
    } else if (bulkAction === 'archive') {
      bulkArchiveMutation.mutate(selectedJobs);
    }
  };

  const handleSelectAll = () => {
    if (!jobs) return;
    
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(job => job.id));
    }
  };

  return {
    selectedJobs,
    setSelectedJobs,
    bulkActionDialogOpen,
    setBulkActionDialogOpen,
    bulkAction,
    setBulkAction,
    bulkDeleteMutation,
    bulkArchiveMutation,
    handleBulkAction,
    handleSelectAll
  };
};
