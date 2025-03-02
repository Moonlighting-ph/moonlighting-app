
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchHospitalJobs } from '@/integrations/supabase/client';
import { JobListTable } from './job-list/JobListTable';
import { BulkActionsHeader } from './job-list/BulkActionsHeader';
import { JobDeleteConfirmDialog } from './job-list/JobDeleteConfirmDialog';
import { BulkActionConfirmDialog } from './job-list/BulkActionConfirmDialog';
import { useJobActions } from './job-list/useJobActions';
import { useBulkActions } from './job-list/useBulkActions';
import HospitalJobsLoading from '@/components/hospital/HospitalJobsLoading';
import EmptyHospitalJobsList from '@/components/hospital/EmptyHospitalJobsList';
import { formatDate } from '@/utils/formatters';

const HospitalJobList = () => {
  const navigate = useNavigate();
  
  // Fetch jobs
  const {
    data: jobs,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['hospitalJobs'],
    queryFn: fetchHospitalJobs
  });
  
  // Job actions state management
  const {
    jobToDelete,
    jobToEdit,
    isViewingApplications,
    setJobToDelete,
    setJobToEdit,
    setIsViewingApplications,
    handleViewApplications,
    handleEdit,
    handleDelete,
    isDeleting
  } = useJobActions();
  
  // Bulk actions state management
  const {
    selectedJobs,
    isArchiveDialogOpen,
    isDeleteDialogOpen,
    setIsArchiveDialogOpen,
    setIsDeleteDialogOpen,
    handleSelectJob,
    handleSelectAllJobs,
    handleBulkDelete,
    handleBulkArchive,
    isDeleting: isBulkDeleting,
    isArchiving
  } = useBulkActions();

  // Duplicate job mutation
  const duplicateJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      // Mock implementation since we don't have the actual function
      console.log("Duplicating job:", jobId);
      return jobId;
    },
    onSuccess: () => {
      refetch();
    }
  });
  
  // Navigate to edit page when job is set to edit
  React.useEffect(() => {
    if (jobToEdit) {
      navigate(`/platform/provider-jobs/edit/${jobToEdit}`);
      setJobToEdit(null);
    }
  }, [jobToEdit, navigate, setJobToEdit]);
  
  // Navigate to applications page when viewing applications
  React.useEffect(() => {
    if (isViewingApplications) {
      navigate(`/platform/provider-jobs/${isViewingApplications}/applications`);
      setIsViewingApplications(null);
    }
  }, [isViewingApplications, navigate, setIsViewingApplications]);
  
  // Loading state
  if (isLoading) {
    return <HospitalJobsLoading />;
  }
  
  // Error state
  if (error) {
    console.error("Error fetching hospital jobs:", error);
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Error loading job postings</p>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Empty state
  if (!jobs || jobs.length === 0) {
    return <EmptyHospitalJobsList />;
  }
  
  return (
    <div className="space-y-6">
      {/* Bulk Actions Header */}
      <BulkActionsHeader 
        jobs={jobs}
        selectedJobs={selectedJobs}
        handleSelectAll={() => handleSelectAllJobs(jobs.map(job => job.id), selectedJobs.length !== jobs.length)}
        setBulkAction={(action) => {
          if (action === 'delete') setIsDeleteDialogOpen(true);
          if (action === 'archive') setIsArchiveDialogOpen(true);
        }}
        setBulkActionDialogOpen={(isOpen) => {
          setIsDeleteDialogOpen(isOpen);
          setIsArchiveDialogOpen(isOpen);
        }}
      />
      
      {/* Jobs Table */}
      <JobListTable 
        jobs={jobs}
        selectedJobs={selectedJobs}
        toggleJobSelection={handleSelectJob}
        handleSetJobToDelete={setJobToDelete}
        duplicateJobMutation={duplicateJobMutation}
        formatDate={formatDate}
        navigate={navigate}
      />
      
      {/* Confirmation Dialogs */}
      <JobDeleteConfirmDialog 
        jobToDelete={jobToDelete}
        setJobToDelete={setJobToDelete}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
      />
      
      <BulkActionConfirmDialog 
        bulkActionDialogOpen={isArchiveDialogOpen}
        setBulkActionDialogOpen={setIsArchiveDialogOpen}
        bulkAction="archive"
        setBulkAction={() => {}}
        selectedJobs={selectedJobs}
        handleBulkAction={handleBulkArchive}
      />
      
      <BulkActionConfirmDialog 
        bulkActionDialogOpen={isDeleteDialogOpen}
        setBulkActionDialogOpen={setIsDeleteDialogOpen}
        bulkAction="delete"
        setBulkAction={() => {}}
        selectedJobs={selectedJobs}
        handleBulkAction={handleBulkDelete}
      />
    </div>
  );
};

export default HospitalJobList;
