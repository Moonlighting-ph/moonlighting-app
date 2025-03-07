
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getRecommendedJobs } from '@/services/jobService';
import { Job } from '@/types/job';

const JobRecommendations: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const jobs = await getRecommendedJobs(session.user.id, 3);
        setRecommendedJobs(jobs);
      } catch (err) {
        console.error('Error fetching recommended jobs:', err);
        setError('Failed to load job recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [session]);

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recommended Jobs</h3>
        </div>
        <div className="text-center py-8">Loading recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recommended Jobs</h3>
        </div>
        <div className="text-center py-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Recommended Jobs</h3>
        <Button variant="outline" size="sm" onClick={handleViewAllJobs}>
          View All Jobs
        </Button>
      </div>
      
      {recommendedJobs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No job recommendations available.</p>
            <Button variant="link" onClick={handleViewAllJobs}>
              Browse all available jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recommendedJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                  {job.is_urgent && (
                    <Badge variant="destructive" className="ml-2">Urgent</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{job.type}</Badge>
                  {job.specialization && <Badge variant="secondary">{job.specialization}</Badge>}
                  {job.experience_level && (
                    <Badge variant="outline" className="bg-blue-50">
                      {job.experience_level}
                    </Badge>
                  )}
                </div>
                {job.location && <p className="text-sm text-gray-500 mb-1">📍 {job.location}</p>}
                {job.salary && <p className="text-sm text-gray-500 mb-1">💰 {job.salary}</p>}
                <Button 
                  onClick={() => handleViewJob(job.id)} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
