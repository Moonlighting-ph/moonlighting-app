
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { fetchProviderJobs } from '@/services/jobService';
import { Job } from '@/types/job';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  PlusCircle, 
  ExternalLink, 
  Clock, 
  Edit, 
  Calendar, 
  MapPin, 
  UserCheck 
} from 'lucide-react';

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

  // Count jobs by type
  const countJobsByType = () => {
    const counts: Record<string, number> = {};
    jobs.forEach(job => {
      counts[job.type] = (counts[job.type] || 0) + 1;
    });
    return counts;
  };
  
  const jobTypeCounts = countJobsByType();

  return (
    <section className="py-12 px-4 bg-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Provider Dashboard</h2>
            <p className="text-muted-foreground">Manage your job postings and applicants</p>
          </div>
          <Button size="lg" onClick={handlePostJob} className="mt-4 md:mt-0 flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Post New Job
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{jobs.length}</CardTitle>
                  <CardDescription>Active Job Posts</CardDescription>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground mt-2">
                {Object.entries(jobTypeCounts).map(([type, count], index) => (
                  <div key={type} className="inline-flex mr-3">
                    {count} {type}
                    {index < Object.entries(jobTypeCounts).length - 1 ? ',' : ''}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">-</CardTitle>
                  <CardDescription>Total Applications</CardDescription>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant="link" 
                className="px-0 text-sm text-primary" 
                onClick={() => navigate('/provider/applications')}
              >
                View all applications
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">-</CardTitle>
                  <CardDescription>Hired Moonlighters</CardDescription>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Approved and paid applications
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold">Your Job Posts</h3>
          <Button variant="outline" onClick={handlePostJob} className="mt-2 md:mt-0">
            <PlusCircle className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your job posts...</p>
          </div>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12 bg-white">
            <CardContent>
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No job posts yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first job posting to start finding qualified healthcare professionals for your needs.
              </p>
              <Button onClick={handlePostJob} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <CardHeader className="flex-1 pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {job.company}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {job.is_urgent && (
                          <Badge variant="destructive" className="font-normal">Urgent</Badge>
                        )}
                        <Badge variant="outline" className="font-normal capitalize">{job.type}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.specialization && (
                        <Badge variant="secondary" className="font-normal">
                          {job.specialization}
                        </Badge>
                      )}
                      {job.experience_level && (
                        <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 font-normal">
                          {job.experience_level} level
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-end gap-2 p-4 md:border-l">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditJob(job.id)}
                      className="flex items-center"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleViewApplicants(job.id)}
                      className="flex items-center"
                    >
                      <Users className="h-3.5 w-3.5 mr-1" />
                      Applicants
                    </Button>
                  </CardContent>
                </div>
                {job.posted_date && (
                  <div className="px-6 py-2 bg-slate-50 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Posted on {new Date(job.posted_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
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
