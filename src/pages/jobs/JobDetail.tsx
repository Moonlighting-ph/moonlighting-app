
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Job, JobApplication } from '@/types/job';
import { useAuth } from '@/hooks/useAuth';
import { fetchJobById } from '@/services/jobService';
import { getApplicationForMoonlighter, submitJobApplication } from '@/services/jobApplicationService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import JobDetailHeader from './JobDetailHeader';
import JobDetailContent from './JobDetailContent';
import JobApplicationStatus from './JobApplicationStatus';

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [userApplication, setUserApplication] = useState<JobApplication | null>(null);
  const [isProvider, setIsProvider] = useState(false);
  const [isMoonlighter, setIsMoonlighter] = useState(false);
  const [isJobProvider, setIsJobProvider] = useState(false);
  
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
  
  const handleSubmitApplication = async () => {
    if (!job || !session?.user) return;
    
    try {
      setApplying(true);
      
      await submitJobApplication({
        job_id: job.id,
        moonlighter_id: session.user.id,
        notes: applicationNotes.trim() || null
      });
      
      // Get the updated application
      const application = await getApplicationForMoonlighter(job.id, session.user.id);
      setUserApplication(application);
      
      setShowApplicationDialog(false);
      toast.success('Application submitted successfully');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };
  
  const handleEditJob = () => {
    navigate(`/provider/edit-job/${jobId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">Loading job details...</div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Job not found</p>
            <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-700 font-medium mb-2">
                  You posted this job
                </p>
                <Button 
                  onClick={handleEditJob} 
                  className="w-full"
                >
                  Edit Job Post
                </Button>
              </div>
            ) : userApplication ? (
              <JobApplicationStatus application={userApplication} />
            ) : isMoonlighter ? (
              <div className="bg-white shadow-sm rounded-lg p-6 border">
                <h3 className="text-lg font-medium mb-2">Ready to Apply?</h3>
                <p className="text-gray-500 mb-4">
                  Submit your application for this position and the healthcare provider will review your profile.
                </p>
                <Button 
                  onClick={handleApplyClick} 
                  className="w-full"
                >
                  Apply Now
                </Button>
              </div>
            ) : null}
            
            {/* Job Provider Info Card could go here */}
          </div>
        </div>
      </div>
      
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Add a note to the healthcare provider about why you're a good fit for this role (optional)
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Share your interest, relevant experience, or ask questions about the job..."
              value={applicationNotes}
              onChange={(e) => setApplicationNotes(e.target.value)}
              className="h-32"
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={applying}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSubmitApplication}
              disabled={applying}
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
