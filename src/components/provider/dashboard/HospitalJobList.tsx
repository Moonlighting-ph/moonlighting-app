
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchHospitalJobs } from '@/integrations/supabase/client';
import { JobListTable } from './job-list/JobListTable';
import { BulkActionsHeader } from './job-list/BulkActionsHeader';
import { JobDeleteConfirmDialog } from './job-list/JobDeleteConfirmDialog';
import { BulkActionConfirmDialog } from './job-list/BulkActionConfirmDialog';
import { useJobActions } from './job-list/useJobActions';
import { useBulkActions } from './job-list/useBulkActions';
import HospitalJobsLoading from '../hospital/HospitalJobsLoading';
import EmptyHospitalJobsList from '../hospital/EmptyHospitalJobsList';

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
  
  // Navigate to edit page when job is set to edit
  React.useEffect(() => {
    if (jobToEdit) {
      navigate(`/platform/hospital-jobs/edit/${jobToEdit}`);
      setJobToEdit(null);
    }
  }, [jobToEdit, navigate, setJobToEdit]);
  
  // Navigate to applications page when viewing applications
  React.useEffect(() => {
    if (isViewingApplications) {
      navigate(`/platform/hospital-jobs/${isViewingApplications}/applications`);
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
        selectedCount={selectedJobs.length}
        onArchive={() => setIsArchiveDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
      
      {/* Jobs Table */}
      <JobListTable 
        jobs={jobs}
        selectedJobs={selectedJobs}
        onSelectJob={handleSelectJob}
        onSelectAll={handleSelectAllJobs}
        onViewApplications={handleViewApplications}
        onEdit={handleEdit}
        onDelete={setJobToDelete}
      />
      
      {/* Confirmation Dialogs */}
      <JobDeleteConfirmDialog 
        jobToDelete={jobToDelete}
        setJobToDelete={setJobToDelete}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
      />
      
      <BulkActionConfirmDialog 
        type="archive"
        isOpen={isArchiveDialogOpen}
        setIsOpen={setIsArchiveDialogOpen}
        selectedCount={selectedJobs.length}
        onConfirm={handleBulkArchive}
        isProcessing={isArchiving}
      />
      
      <BulkActionConfirmDialog 
        type="delete"
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        selectedCount={selectedJobs.length}
        onConfirm={handleBulkDelete}
        isProcessing={isBulkDeleting}
      />
    </div>
  );
};

export default HospitalJobList;
