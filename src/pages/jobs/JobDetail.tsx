
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Job, JobApplication } from '@/types/job';
import { useAuth } from '@/hooks/useAuth';
import { fetchJobById } from '@/services/jobService';
import { getApplicationForMoonlighter } from '@/services/jobApplicationService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import JobDetailHeader from './JobDetailHeader';
import JobDetailContent from './JobDetailContent';
import JobApplicationStatus from './JobApplicationStatus';
import JobApplicationDialog from './JobApplicationDialog';
import JobProviderActions from './JobProviderActions';
import MoonlighterActions from './MoonlighterActions';

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [userApplication, setUserApplication] = useState<JobApplication | null>(null);
  const [isProvider, setIsProvider] = useState(false);
  const [isMoonlighter, setIsMoonlighter] = useState(false);
  const [isJobProvider, setIsJobProvider] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        const jobData = await fetchJobById(jobId);
        
        if (!jobData) {
          toast.error('Job not found');
          navigate('/jobs');
          return;
        }
        
        setJob(jobData);
        
        // Check if current user is the provider of this job
        if (session?.user && jobData.provider_id === session.user.id) {
          setIsJobProvider(true);
        }
        
        // Check if user has already applied to this job
        if (session?.user) {
          const application = await getApplicationForMoonlighter(jobId, session.user.id);
          if (application) {
            setUserApplication(application);
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    // Get user type
    const getUserType = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user type:', error);
          return;
        }
        
        setIsProvider(data.user_type === 'provider');
        setIsMoonlighter(data.user_type === 'moonlighter');
      } catch (err) {
        console.error('Unexpected error fetching user type:', err);
      }
    };
    
    fetchJobDetails();
    if (session?.user) {
      getUserType();
    }
  }, [jobId, session, navigate]);
  
  const handleApplyClick = () => {
    if (!session) {
      toast('Please sign in to apply', {
        description: 'You need to be signed in as a healthcare professional to apply for jobs'
      });
      navigate('/auth/login');
      return;
    }
    
    if (!isMoonlighter) {
      toast.error('Only healthcare professionals can apply for jobs');
      return;
    }
    
    setShowApplicationDialog(true);
  };
  
  const handleEditJob = () => {
    navigate(`/provider/edit-job/${jobId}`);
  };

  if (loading) {
    return <JobDetailSkeleton />;
  }
  
  if (!job) {
    return <JobNotFound navigate={navigate} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate('/jobs')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <JobDetailHeader job={job} />
            <JobDetailContent job={job} />
          </div>
          
          <div className="space-y-6">
            {isJobProvider ? (
              <JobProviderActions job={job} onEdit={handleEditJob} />
            ) : userApplication ? (
              <JobApplicationStatus application={userApplication} />
            ) : isMoonlighter ? (
              <MoonlighterActions onApply={handleApplyClick} />
            ) : null}
          </div>
        </div>
      </div>
      
      {job && (
        <JobApplicationDialog
          job={job}
          open={showApplicationDialog}
          onOpenChange={setShowApplicationDialog}
          onSuccess={(application) => setUserApplication(application)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default JobDetail;
