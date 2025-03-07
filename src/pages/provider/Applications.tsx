
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
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Loader2 } from 'lucide-react';

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
          .select('id, title, company')
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
        
        for (const job of jobs) {
          const jobApplications = await fetchJobApplications(job.id);
          
          // Add job details to each application
          const applicationsWithDetails = jobApplications.map(app => ({
            ...app,
            job: {
              ...app.job,
              title: job.title,
              company: job.company
            }
          }));
          
          allApplications = [...allApplications, ...applicationsWithDetails];
        }
        
        // Log to debug
        console.log('Fetched applications:', allApplications);
        
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

  const handleUpdateStatus = async (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'paid') => {
    if (!session?.user) return;
    
    try {
      setStatusUpdateLoading(applicationId);
      
      console.log(`Updating application ${applicationId} to status ${status}`);
      
      const updatedApplication = await updateApplicationStatus(applicationId, status, session.user.id);
      
      console.log('Update successful:', updatedApplication);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      toast.success(`Application marked as ${status}`);
      
      // Close the dialog if it's open
      if (showNoteDialog && selectedApplication?.id === applicationId) {
        setShowNoteDialog(false);
      }
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast.error(error.message || 'Failed to update application status');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleViewDetails = (application: JobApplication) => {
    console.log('Viewing application details:', application);
    setSelectedApplication(application);
    setShowNoteDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/provider')}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Job Applications</h1>
              <p className="text-muted-foreground">Manage applications from healthcare professionals</p>
            </div>
            <Button onClick={() => navigate('/provider/post-job')} className="whitespace-nowrap">
              <Briefcase className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading applications...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/provider')}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Job Applications</h1>
            <p className="text-muted-foreground">Manage applications from healthcare professionals</p>
          </div>
          <Button onClick={() => navigate('/provider/post-job')} className="whitespace-nowrap">
            <Briefcase className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
        
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
