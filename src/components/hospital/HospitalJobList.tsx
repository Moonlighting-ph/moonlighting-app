
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Copy, Archive, MoreHorizontal, Trash2 } from 'lucide-react';
import HospitalJobCard from './HospitalJobCard';
import EmptyHospitalJobsList from './EmptyHospitalJobsList';
import HospitalJobsLoading from './HospitalJobsLoading';
import { formatDate } from '@/utils/jobUtils';

const HospitalJobList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'delete' | 'archive' | null>(null);

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
      toast({
        title: "Jobs Deleted",
        description: `${selectedJobs.length} job postings successfully deleted.`
      });
      setSelectedJobs([]);
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
      toast({
        title: "Jobs Archived",
        description: `${selectedJobs.length} job postings successfully archived.`
      });
      setSelectedJobs([]);
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
    onSuccess: (newJob) => {
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
      deleteJobMutation.mutate(jobToDelete);
      setJobToDelete(null);
    }
  };

  const handleSetJobToDelete = (jobId: string) => {
    setJobToDelete(jobId);
  };

  const handleBulkAction = () => {
    if (bulkAction === 'delete') {
      bulkDeleteMutation.mutate(selectedJobs);
    } else if (bulkAction === 'archive') {
      bulkArchiveMutation.mutate(selectedJobs);
    }
    
    setBulkActionDialogOpen(false);
    setBulkAction(null);
  };

  const handleDuplicateJob = (jobId: string) => {
    duplicateJobMutation.mutate(jobId);
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
      ? prev.filter(id => id !== jobId) 
      : [...prev, jobId]
    );
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
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="selectAll"
                checked={jobs && selectedJobs.length === jobs.length && jobs.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="selectAll" className="text-sm font-medium">
                Select All ({jobs.length})
              </label>
            </div>
            
            {selectedJobs.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions ({selectedJobs.length}) <MoreHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    setBulkAction('archive');
                    setBulkActionDialogOpen(true);
                  }}>
                    <Archive className="mr-2 h-4 w-4" /> Archive Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setBulkAction('delete');
                    setBulkActionDialogOpen(true);
                  }}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {jobs.map((job: any) => (
            <div key={job.id} className="flex items-center gap-4">
              <Checkbox 
                checked={selectedJobs.includes(job.id)}
                onCheckedChange={() => toggleJobSelection(job.id)}
                className="mt-6"
              />
              <div className="flex-1">
                <HospitalJobCard 
                  job={job}
                  onDelete={handleSetJobToDelete}
                  onDuplicate={handleDuplicateJob}
                  formatDate={formatDate}
                />
              </div>
            </div>
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
      
      <AlertDialog 
        open={bulkActionDialogOpen} 
        onOpenChange={setBulkActionDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {bulkAction === 'delete' ? 'Deletion' : 'Archive'}</AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction === 'delete' 
                ? `Are you sure you want to delete ${selectedJobs.length} job postings? This action cannot be undone.`
                : `Are you sure you want to archive ${selectedJobs.length} job postings? They will no longer be visible to applicants.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setBulkActionDialogOpen(false);
              setBulkAction(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkAction}>
              {bulkAction === 'delete' ? 'Delete' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HospitalJobList;
