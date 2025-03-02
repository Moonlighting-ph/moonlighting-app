
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Briefcase, 
  Clock, 
  Calendar, 
  DollarSign, 
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  Clock3,
  CalendarRange
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fetchUserApplications } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ApplicationStatus {
  [key: string]: {
    label: string;
    color: string;
    icon: React.ReactNode;
  };
}

const statusConfig: ApplicationStatus = {
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: <Clock3 className="h-4 w-4 text-yellow-600" />
  },
  reviewing: {
    label: 'Being Reviewed',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: <CalendarRange className="h-4 w-4 text-blue-600" />
  },
  interview: {
    label: 'Interview Stage',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: <Calendar className="h-4 w-4 text-purple-600" />
  },
  accepted: {
    label: 'Accepted',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: <CheckCircle className="h-4 w-4 text-green-600" />
  },
  rejected: {
    label: 'Not Selected',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: <XCircle className="h-4 w-4 text-red-600" />
  }
};

const MyApplications = () => {
  const navigate = useNavigate();
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchUserApplications
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading your applications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Applications</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading your job applications. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/platform/jobs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </a>
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">My Applications</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>
      </div>

      {applications && applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((application: any) => (
            <Card key={application.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 md:h-20 md:w-20 bg-muted rounded-md overflow-hidden">
                      <img 
                        src={application.jobs.logo} 
                        alt={application.jobs.company}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="font-medium text-base">{application.jobs.title}</h3>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[application.status]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                            {statusConfig[application.status]?.icon}
                            <span className="ml-1">{statusConfig[application.status]?.label || 'Unknown Status'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{application.jobs.company}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{application.jobs.location}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{application.jobs.type}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{application.jobs.salary}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Applied on {formatDate(application.created_at)}</span>
                      </div>
                    </div>
                    
                    {application.note && (
                      <div className="mt-4 p-3 bg-muted/40 rounded-md text-sm">
                        <p className="font-medium text-xs mb-1">Your application note:</p>
                        <p className="text-muted-foreground text-xs">{application.note}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-muted/30">
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-2">
                      {application.status === 'accepted' ? 'Congratulations! Your application has been accepted.' : 
                       application.status === 'rejected' ? 'This position has been filled.' : 
                       'Application is being processed.'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8 w-full sm:w-auto"
                      onClick={() => navigate(`/platform/job/${application.jobs.id}`)}
                    >
                      View Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-8">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">No Applications Yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            You haven't applied to any jobs yet. Browse available positions and start applying!
          </p>
          <Button onClick={() => navigate('/platform/jobs')}>
            Browse Jobs
          </Button>
        </Card>
      )}
    </div>
  );
};

export default MyApplications;
