
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchJobById } from '@/services/jobService';
import { getApplicationForMoonlighter, submitJobApplication } from '@/services/jobApplicationService';
import { Job } from '@/types/job';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { CalendarClock, MapPin, BriefcaseBusiness, BuildingIcon, GraduationCapIcon } from 'lucide-react';

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = React.useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);

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
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, navigate]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!session?.user || !jobId || userType !== 'moonlighter') return;
      
      try {
        const application = await getApplicationForMoonlighter(jobId, session.user.id);
        if (application) {
          setApplicationStatus(application.status);
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    };

    checkApplicationStatus();
  }, [session, jobId, userType]);

  useEffect(() => {
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
        
        if (data) {
          setUserType(data.user_type);
        }
      } catch (err) {
        console.error('Unexpected error fetching user type:', err);
      }
    };
    
    getUserType();
  }, [session]);

  const handleApply = async () => {
    if (!session?.user) {
      toast('Please sign in to apply', {
        description: 'You need to be signed in as a healthcare professional to apply for jobs'
      });
      navigate('/auth/login');
      return;
    }

    if (userType !== 'moonlighter') {
      toast.error('Only healthcare professionals can apply for jobs');
      return;
    }

    if (!job) return;

    try {
      setApplyLoading(true);
      await submitJobApplication({
        job_id: job.id,
        moonlighter_id: session.user.id,
        notes: notes.trim() || null
      });

      toast.success('Application submitted successfully!');
      setApplicationStatus('pending');
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 min-h-screen">
          <div className="text-center">Loading job details...</div>
        </div>
        <Footer />
      </SmoothScroll>
    );
  }

  if (!job) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
            <p className="mb-6">Sorry, the job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
          </div>
        </div>
        <Footer />
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/jobs')}
        >
          ← Back to Jobs
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-600 mb-1">
                    <BuildingIcon className="h-4 w-4 mr-2" />
                    <span>{job.company}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {job.is_urgent && (
                    <Badge variant="destructive" className="mb-2">Urgent</Badge>
                  )}
                  <Badge variant="outline">{job.type}</Badge>
                </div>
              </div>
              
              {job.posted_date && (
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  <span>Posted on {new Date(job.posted_date).toLocaleDateString()}</span>
                  {job.deadline && (
                    <span className="ml-4">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {job.specialization && (
                  <Badge variant="secondary">{job.specialization}</Badge>
                )}
                {job.experience_level && (
                  <div className="flex items-center">
                    <GraduationCapIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm text-gray-600">{job.experience_level}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">💰 {job.salary}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="whitespace-pre-line text-gray-700">{job.description}</div>
              </div>
              
              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={`req-${index}`} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={`resp-${index}`} className="text-gray-700">{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                {!session?.user ? (
                  <div className="text-center p-4">
                    <p className="mb-4">Sign in to apply for this job</p>
                    <Button 
                      onClick={() => navigate('/auth/login')}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  </div>
                ) : userType === 'moonlighter' ? (
                  applicationStatus ? (
                    <div className="text-center p-4">
                      <h3 className="text-lg font-semibold mb-2">Application Status</h3>
                      <Badge 
                        className="text-sm py-1 px-3"
                        variant={
                          applicationStatus === 'approved' ? 'success' :
                          applicationStatus === 'rejected' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
                      </Badge>
                      <p className="mt-4 text-sm text-gray-500">
                        {applicationStatus === 'pending' && "Your application is being reviewed."}
                        {applicationStatus === 'reviewed' && "Your application has been reviewed."}
                        {applicationStatus === 'approved' && "Congratulations! Your application has been approved."}
                        {applicationStatus === 'rejected' && "Unfortunately, your application was not selected."}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Apply for this Job</h3>
                      <div className="mb-4">
                        <Textarea
                          placeholder="Add a note with your application (optional)"
                          className="resize-y"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleApply} 
                        className="w-full"
                        disabled={applyLoading}
                      >
                        {applyLoading ? 'Submitting...' : 'Apply Now'}
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-500">
                      Only healthcare professionals can apply for jobs
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
};

export default JobDetail;
