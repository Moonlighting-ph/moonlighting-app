
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobApplication, Job } from '@/types/job';
import { fetchProviderJobs } from '@/services/jobService';
import { fetchJobApplications, updateApplicationStatus } from '@/services/jobApplicationService';
import { toast } from 'sonner';

const ApplicationStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case 'reviewed':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reviewed</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const ProviderApplicationsPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!session?.user?.id) return;
      
      try {
        setJobsLoading(true);
        const jobsData = await fetchProviderJobs(session.user.id);
        setJobs(jobsData);
        
        // Select the first job by default if available
        if (jobsData.length > 0 && !selectedJobId) {
          setSelectedJobId(jobsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setJobsLoading(false);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [session]);

  // Fetch applications when selectedJobId changes
  useEffect(() => {
    const fetchApplicationsForJob = async () => {
      if (!selectedJobId) return;
      
      try {
        setApplicationsLoading(true);
        const applicationsData = await fetchJobApplications(selectedJobId);
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchApplicationsForJob();
  }, [selectedJobId]);

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handlePostJob = () => {
    navigate('/provider/post-job');
  };

  const handleUpdateStatus = async (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    if (!session?.user?.id) return;
    
    try {
      await updateApplicationStatus(applicationId, status, session.user.id);
      
      // Update the local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      toast.success(`Application status updated to ${status}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleViewMoonlighterProfile = (moonlighterId: string) => {
    // Navigate to moonlighter profile page (to be implemented)
    // For now, we'll just show a toast
    toast('View moonlighter profile feature coming soon');
  };

  if (!session) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <p>Please sign in to view applications for your jobs.</p>
        </div>
        <Footer />
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Manage Applications</h1>
            <Button onClick={handlePostJob}>Post New Job</Button>
          </div>

          {loading || jobsLoading ? (
            <div className="text-center py-12">
              <p>Loading your jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                <Button onClick={handlePostJob}>Post Your First Job</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <label htmlFor="job-select" className="block text-sm font-medium mb-2">
                  Select Job
                </label>
                <Select
                  value={selectedJobId}
                  onValueChange={handleJobChange}
                >
                  <SelectTrigger id="job-select" className="w-full md:w-96">
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {applicationsLoading ? (
                <div className="text-center py-12">
                  <p>Loading applications...</p>
                </div>
              ) : !selectedJobId ? (
                <div className="text-center py-12">
                  <p>Please select a job to view applications</p>
                </div>
              ) : applications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                    <p className="text-gray-500">
                      This job hasn't received any applications yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>
                              {app.moonlighter?.first_name} {app.moonlighter?.last_name}
                            </CardTitle>
                            <CardDescription>
                              {app.moonlighter?.specialization || 'No specialization'} • 
                              {app.moonlighter?.years_of_experience 
                                ? ` ${app.moonlighter.years_of_experience} years experience` 
                                : ' Experience not specified'}
                            </CardDescription>
                          </div>
                          <ApplicationStatusBadge status={app.status} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        {app.notes && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-1">Applicant Notes:</h4>
                            <p className="text-sm italic bg-gray-50 p-3 rounded">{app.notes}</p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 items-center mt-4">
                          {app.ai_match_score && (
                            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-blue-700 mr-1">Match Score:</span>
                              <span className="text-sm font-bold text-blue-800">{Math.round(app.ai_match_score)}%</span>
                            </div>
                          )}
                          
                          <div className="ml-auto flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => app.moonlighter && handleViewMoonlighterProfile(app.moonlighter.id)}
                            >
                              View Profile
                            </Button>
                            
                            <Select
                              value={app.status}
                              onValueChange={(value) => 
                                handleUpdateStatus(
                                  app.id, 
                                  value as 'pending' | 'reviewed' | 'approved' | 'rejected'
                                )
                              }
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                      {app.applied_date && (
                        <div className="px-6 py-2 bg-gray-50 text-sm text-gray-500">
                          Applied on {new Date(app.applied_date).toLocaleDateString()}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
};

export default ProviderApplicationsPage;
