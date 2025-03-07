
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobApplication } from '@/types/job';
import { fetchMoonlighterApplications } from '@/services/jobApplicationService';

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

const JobApplicationsPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const data = await fetchMoonlighterApplications(session.user.id);
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session]);

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleBrowseJobs = () => {
    navigate('/jobs');
  };

  if (!session) {
    return (
      <SmoothScroll>
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <p>Please sign in to view your applications.</p>
        </div>
        <Footer />
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">My Job Applications</h1>
            <Button onClick={handleBrowseJobs}>Browse Jobs</Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium mb-2">No applications found</h3>
                <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
                <Button onClick={handleBrowseJobs}>Find Jobs to Apply</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <CardHeader className="flex-1 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{app.job?.title || 'Untitled Job'}</CardTitle>
                          <CardDescription>{app.job?.company || 'Unknown Company'}</CardDescription>
                        </div>
                        <ApplicationStatusBadge status={app.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-end p-4">
                      {app.ai_match_score && (
                        <div className="mr-4 text-center">
                          <div className="text-lg font-semibold">{Math.round(app.ai_match_score)}%</div>
                          <div className="text-xs text-gray-500">Match</div>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => app.job && handleViewJob(app.job.id)}
                      >
                        View Job
                      </Button>
                    </CardContent>
                  </div>
                  {app.applied_date && (
                    <div className="px-6 py-2 bg-gray-50 text-sm text-gray-500">
                      Applied on {new Date(app.applied_date).toLocaleDateString()}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </SmoothScroll>
  );
};

export default JobApplicationsPage;
