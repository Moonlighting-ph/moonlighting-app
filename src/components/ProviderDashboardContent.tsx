
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { fetchProviderJobs } from '@/services/jobService';
import { Job } from '@/types/job';

const ProviderDashboardContent: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const jobsData = await fetchProviderJobs(session.user.id);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [session]);

  const handlePostJob = () => {
    navigate('/provider/post-job');
  };

  const handleViewApplicants = (jobId: string) => {
    navigate('/provider/applications', { state: { jobId } });
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/provider/edit-job/${jobId}`);
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">Provider Dashboard</h2>
          <Button size="lg" onClick={handlePostJob}>Post New Job</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{jobs.length}</CardTitle>
              <CardDescription>Active Job Posts</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">-</CardTitle>
              <CardDescription>Total Applications</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">-</CardTitle>
              <CardDescription>Filled Positions</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Your Job Posts</h3>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading your job posts...</p>
          </div>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-medium mb-2">No job posts yet</h3>
              <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
              <Button onClick={handlePostJob}>Post Your First Job</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <CardHeader className="flex-1 pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.company}</CardDescription>
                      </div>
                      {job.is_urgent && (
                        <Badge variant="destructive" className="ml-2">Urgent</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{job.type}</Badge>
                      {job.specialization && <Badge variant="secondary">{job.specialization}</Badge>}
                      {job.location && <div className="text-sm text-gray-500">📍 {job.location}</div>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-end gap-2 p-4">
                    <Button variant="outline" onClick={() => handleViewApplicants(job.id)}>View Applicants</Button>
                    <Button variant="secondary" onClick={() => handleEditJob(job.id)}>Edit</Button>
                  </CardContent>
                </div>
                {job.posted_date && (
                  <div className="px-6 py-2 bg-gray-50 text-sm text-gray-500">
                    Posted on {new Date(job.posted_date).toLocaleDateString()}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProviderDashboardContent;
