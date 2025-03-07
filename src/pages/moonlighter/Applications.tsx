
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchMoonlighterApplications } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Applications: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!session?.user) {
      navigate('/auth/login');
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await fetchMoonlighterApplications(session.user.id);
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session, navigate]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>
        
        {loading ? (
          <div className="text-center py-12">Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
            <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((application) => (
              <Card key={application.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{application.job?.title}</CardTitle>
                      <CardDescription>{application.job?.company}</CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  {application.job?.location && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      {application.job.location}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {application.job?.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Applied on {new Date(application.applied_date).toLocaleDateString()}
                  </div>
                  
                  {application.notes && (
                    <div className="mt-4">
                      <p className="font-medium text-sm">Your Application Note:</p>
                      <p className="text-sm text-gray-600 mt-1">{application.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/jobs/${application.job_id}`)}
                  >
                    View Job Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Applications;
