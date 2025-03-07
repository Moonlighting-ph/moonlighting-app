
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { fetchJobApplications, updateApplicationStatus } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/job';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import ApplicationsList from '@/components/application/ApplicationsList';
import EmptyApplicationsList from '@/components/application/EmptyApplicationsList';
import ApplicationDetailsDialog from '@/components/application/ApplicationDetailsDialog';

const Applications: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState<boolean>(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      navigate('/auth/login');
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        // First get all jobs by this provider
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('id')
          .eq('provider_id', session.user.id);
        
        if (jobsError) {
          throw jobsError;
        }

        if (!jobs || jobs.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }

        // Then get applications for those jobs
        let allApplications: JobApplication[] = [];
        
        for (const jobId of jobs.map(job => job.id)) {
          const jobApplications = await fetchJobApplications(jobId);
          allApplications = [...allApplications, ...jobApplications];
        }
        
        setApplications(allApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session, navigate]);

  const handleUpdateStatus = async (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    if (!session?.user) return;
    
    try {
      setStatusUpdateLoading(applicationId);
      await updateApplicationStatus(applicationId, status, session.user.id);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      toast.success(`Application marked as ${status}`);
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast.error(error.message || 'Failed to update application status');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowNoteDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Job Applications</h1>
          <div className="text-center py-12">Loading applications...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Job Applications</h1>
        
        {applications.length === 0 ? (
          <EmptyApplicationsList />
        ) : (
          <ApplicationsList 
            applications={applications}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            statusUpdateLoading={statusUpdateLoading}
          />
        )}
        
        <ApplicationDetailsDialog
          application={selectedApplication}
          open={showNoteDialog}
          onOpenChange={setShowNoteDialog}
          onUpdateStatus={handleUpdateStatus}
          statusUpdateLoading={statusUpdateLoading}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Applications;
