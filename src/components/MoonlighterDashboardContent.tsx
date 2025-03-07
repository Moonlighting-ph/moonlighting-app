
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { fetchMoonlighterApplications } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/job';
import JobRecommendations from './moonlighter/JobRecommendations';

const ApplicationStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = "bg-yellow-100 text-yellow-800"; // default for pending
  
  if (status === 'approved') {
    colorClass = "bg-green-100 text-green-800";
  } else if (status === 'rejected') {
    colorClass = "bg-red-100 text-red-800";
  } else if (status === 'reviewed') {
    colorClass = "bg-blue-100 text-blue-800";
  }
  
  return (
    <span className={`text-sm px-2.5 py-0.5 rounded-full ${colorClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MoonlighterDashboardContent: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const applications = await fetchMoonlighterApplications(session.user.id);
        setRecentApplications(applications.slice(0, 3)); // Get only the 3 most recent
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session]);

  const handleFindJobs = () => {
    navigate('/jobs');
  };
  
  const handleViewApplications = () => {
    navigate('/moonlighter/applications');
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const countApplicationsByStatus = (status: string) => {
    return recentApplications.filter(app => app.status === status).length;
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">Moonlighter Dashboard</h2>
          <Button size="lg" variant="default" onClick={handleFindJobs}>Find Shifts</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{recentApplications.length}</CardTitle>
              <CardDescription>Total Applications</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{countApplicationsByStatus('approved')}</CardTitle>
              <CardDescription>Approved Applications</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{countApplicationsByStatus('pending')}</CardTitle>
              <CardDescription>Pending Applications</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Recent Applications</h3>
              <Button variant="outline" size="sm" onClick={handleViewApplications}>
                View All
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : recentApplications.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                  <Button variant="link" onClick={handleFindJobs}>
                    Browse available jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <Card key={app.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <CardHeader className="flex-1 pb-2">
                        <CardTitle>{app.job?.title || 'Untitled Job'}</CardTitle>
                        <CardDescription>{app.job?.company || 'Unknown Company'}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-end p-4">
                        <ApplicationStatusBadge status={app.status} />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => app.job && handleViewJob(app.job.id)}
                        >
                          View
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <JobRecommendations />
        </div>
      </div>
    </section>
  );
};

export default MoonlighterDashboardContent;
