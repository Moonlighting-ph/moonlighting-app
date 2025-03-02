
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EmptyHospitalJobsList from '@/components/hospital/EmptyHospitalJobsList';
import HospitalJobsLoading from '@/components/hospital/HospitalJobsLoading';
import { formatDate } from '@/utils/jobUtils';
import { BulkActionsHeader } from './job-list/BulkActionsHeader';
import { JobDeleteConfirmDialog } from './job-list/JobDeleteConfirmDialog';
import { BulkActionConfirmDialog } from './job-list/BulkActionConfirmDialog';
import { JobListTable } from './job-list/JobListTable';
import { useBulkActions } from './job-list/useBulkActions';
import { useJobActions } from './job-list/useJobActions';

const HospitalJobList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Job list data fetching
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

  // Individual job actions (delete, duplicate)
  const { 
    jobToDelete, 
    setJobToDelete,
    handleSetJobToDelete,
    deleteJobMutation,
    duplicateJobMutation,
    handleDelete 
  } = useJobActions({ queryClient });

  // Bulk actions (select, delete, archive multiple jobs)
  const {
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
  } = useBulkActions({ jobs, queryClient });

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

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
      ? prev.filter(id => id !== jobId) 
      : [...prev, jobId]
    );
  };

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
          <BulkActionsHeader 
            jobs={jobs}
            selectedJobs={selectedJobs}
            handleSelectAll={handleSelectAll}
            setBulkAction={setBulkAction}
            setBulkActionDialogOpen={setBulkActionDialogOpen}
          />
          
          <JobListTable
            jobs={jobs}
            selectedJobs={selectedJobs}
            toggleJobSelection={toggleJobSelection}
            handleSetJobToDelete={handleSetJobToDelete}
            duplicateJobMutation={duplicateJobMutation}
            formatDate={formatDate}
            navigate={navigate}
          />
        </div>
      ) : (
        <EmptyHospitalJobsList />
      )}

      <JobDeleteConfirmDialog 
        jobToDelete={jobToDelete}
        setJobToDelete={setJobToDelete}
        handleDelete={handleDelete}
      />
      
      <BulkActionConfirmDialog
        bulkActionDialogOpen={bulkActionDialogOpen}
        setBulkActionDialogOpen={setBulkActionDialogOpen}
        bulkAction={bulkAction}
        setBulkAction={setBulkAction}
        selectedJobs={selectedJobs}
        handleBulkAction={handleBulkAction}
      />
    </div>
  );
};

export default HospitalJobList;
