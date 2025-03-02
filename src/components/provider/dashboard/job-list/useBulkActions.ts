
import { useState } from 'react';
import { useMutation, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseBulkActionsProps {
  jobs: any[] | undefined;
  queryClient: QueryClient;
  toast: {
    toast: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => void;
  };
}

export const useBulkActions = ({ jobs, queryClient, toast }: UseBulkActionsProps) => {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'delete' | 'archive' | null>(null);

  const bulkDeleteMutation = useMutation({
    mutationFn: async (jobIds: string[]) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      // Delete each job sequentially
      for (const jobId of jobIds) {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', jobId)
          .eq('created_by', userData.user.id);
        
        if (error) throw error;
      }
      
      return jobIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast.toast({
        title: "Jobs Deleted",
        description: `${selectedJobs.length} job postings successfully deleted.`
      });
      setSelectedJobs([]);
    },
    onError: (error) => {
      console.error('Error deleting jobs:', error);
      toast.toast({
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

      // Archive each job sequentially
      for (const jobId of jobIds) {
        const { error } = await supabase
          .from('jobs')
          .update({ is_active: false })
          .eq('id', jobId)
          .eq('created_by', userData.user.id);
        
        if (error) throw error;
      }
      
      return jobIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast.toast({
        title: "Jobs Archived",
        description: `${selectedJobs.length} job postings successfully archived.`
      });
      setSelectedJobs([]);
    },
    onError: (error) => {
      console.error('Error archiving jobs:', error);
      toast.toast({
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
    
    setBulkActionDialogOpen(false);
    setBulkAction(null);
  };

  const handleSelectAll = () => {
    if (jobs) {
      if (selectedJobs.length === jobs.length) {
        setSelectedJobs([]);
      } else {
        setSelectedJobs(jobs.map((job: any) => job.id));
      }
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
