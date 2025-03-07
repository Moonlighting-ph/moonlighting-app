
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchJobApplications, updateApplicationStatus } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/job';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CalendarClock, MoreVertical, User } from 'lucide-react';

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
        const jobIds = jobs.map(job => job.id);
        let allApplications: JobApplication[] = [];
        
        for (const jobId of jobIds) {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'outline';
      case 'rejected':
        return 'destructive';
      case 'reviewed':
        return 'secondary';
      default:
        return 'outline';
    }
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

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Job Applications</h1>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't received any applications yet.</p>
              <Button onClick={() => navigate('/provider/post-job')}>
                Post a New Job
              </Button>
            </CardContent>
          </Card>
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
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.moonlighter?.first_name} {application.moonlighter?.last_name}
                    </TableCell>
                    <TableCell>{application.job?.title}</TableCell>
                    <TableCell>
                      {new Date(application.applied_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowNoteDialog(true);
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={statusUpdateLoading === application.id || application.status === 'reviewed'}
                            onClick={() => handleUpdateStatus(application.id, 'reviewed')}
                          >
                            Mark as Reviewed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={statusUpdateLoading === application.id || application.status === 'approved'}
                            onClick={() => handleUpdateStatus(application.id, 'approved')}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={statusUpdateLoading === application.id || application.status === 'rejected'}
                            onClick={() => handleUpdateStatus(application.id, 'rejected')}
                            className="text-red-600"
                          >
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {selectedApplication && (
          <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  {selectedApplication.job?.title} at {selectedApplication.job?.company}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-medium">
                    {selectedApplication.moonlighter?.first_name} {selectedApplication.moonlighter?.last_name}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  <span>Applied on {new Date(selectedApplication.applied_date).toLocaleDateString()}</span>
                </div>
                
                <div>
                  <p className="font-medium mb-1">Status</p>
                  <Badge variant={getStatusBadgeVariant(selectedApplication.status)}>
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </Badge>
                </div>
                
                {selectedApplication.notes && (
                  <div>
                    <p className="font-medium mb-1">Applicant's Note</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedApplication.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      disabled={statusUpdateLoading === selectedApplication.id}
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={statusUpdateLoading === selectedApplication.id}
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Applications;
