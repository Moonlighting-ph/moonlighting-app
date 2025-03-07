
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { fetchJobById } from '@/services/jobService';
import { fetchJobApplications, updateApplicationStatus } from '@/services/jobApplicationService';
import { Job, JobApplication } from '@/types/job';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { CalendarClock, CheckCircle, Clock, XCircle, User } from 'lucide-react';

const Applications: React.FC = () => {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const jobId = location.state?.jobId;
  
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) {
        navigate('/provider');
        return;
      }

      if (!jobId) {
        toast.error('No job selected');
        navigate('/provider');
        return;
      }

      try {
        setLoading(true);
        // Fetch the job details first
        const jobData = await fetchJobById(jobId);
        
        if (!jobData) {
          toast.error('Job not found');
          navigate('/provider');
          return;
        }

        // Check if this job belongs to the current provider
        if (jobData.provider_id !== session.user.id) {
          toast.error('You do not have permission to view these applications');
          navigate('/provider');
          return;
        }

        setJob(jobData);

        // Now fetch the applications for this job
        const applicationsData = await fetchJobApplications(jobId);
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching job or applications:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, session, navigate]);

  const handleStatusChange = async (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    if (!session?.user?.id) return;

    try {
      setStatusUpdating(prev => ({ ...prev, [applicationId]: true }));
      
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
    } finally {
      setStatusUpdating(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  // Filter applications by status
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status === 'reviewed');
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  if (loading) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 min-h-screen">
          <div className="text-center">Loading applications...</div>
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
            <p className="mb-6">The job you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/provider')}>Back to Dashboard</Button>
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
          onClick={() => navigate('/provider')}
        >
          ← Back to Dashboard
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Applications for: {job.title}</h1>
          <div className="flex items-center gap-3 text-gray-600">
            <span>{job.company}</span>
            {job.location && (
              <>
                <span className="text-gray-400">•</span>
                <span>{job.location}</span>
              </>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All <Badge className="ml-2" variant="outline">{applications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending <Badge className="ml-2" variant="outline">{pendingApplications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed <Badge className="ml-2" variant="outline">{reviewedApplications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved <Badge className="ml-2" variant="outline">{approvedApplications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected <Badge className="ml-2" variant="outline">{rejectedApplications.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderApplicationsList(applications)}
          </TabsContent>
          
          <TabsContent value="pending">
            {renderApplicationsList(pendingApplications)}
          </TabsContent>
          
          <TabsContent value="reviewed">
            {renderApplicationsList(reviewedApplications)}
          </TabsContent>
          
          <TabsContent value="approved">
            {renderApplicationsList(approvedApplications)}
          </TabsContent>
          
          <TabsContent value="rejected">
            {renderApplicationsList(rejectedApplications)}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </SmoothScroll>
  );

  function renderApplicationsList(apps: JobApplication[]) {
    if (apps.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No applications found in this category</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {apps.map((application) => (
          <Card key={application.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    {application.moonlighter?.first_name} {application.moonlighter?.last_name}
                  </CardTitle>
                  <CardDescription>
                    {application.moonlighter?.email}
                    {application.moonlighter?.specialization && (
                      <span className="ml-2">• {application.moonlighter.specialization}</span>
                    )}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    application.status === 'approved' ? 'success' :
                    application.status === 'rejected' ? 'destructive' :
                    application.status === 'reviewed' ? 'secondary' :
                    'outline'
                  }
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  <span>Applied on {new Date(application.applied_date).toLocaleDateString()}</span>
                </div>
                
                {application.moonlighter?.years_of_experience && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    <span>{application.moonlighter.years_of_experience} years of experience</span>
                  </div>
                )}
                
                {application.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Notes from Applicant</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm">{application.notes}</div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-6">
                {/* Left side - status selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Update status:</span>
                  <Select
                    value={application.status}
                    onValueChange={(value) => 
                      handleStatusChange(
                        application.id, 
                        value as 'pending' | 'reviewed' | 'approved' | 'rejected'
                      )
                    }
                    disabled={statusUpdating[application.id]}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Right side - action buttons */}
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={statusUpdating[application.id] || application.status === 'rejected'}
                    onClick={() => handleStatusChange(application.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    variant="default"
                    size="sm"
                    disabled={statusUpdating[application.id] || application.status === 'approved'}
                    onClick={() => handleStatusChange(application.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default Applications;
