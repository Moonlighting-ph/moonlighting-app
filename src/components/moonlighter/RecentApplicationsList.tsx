
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobApplication } from '@/types/job';

interface ApplicationStatusBadgeProps {
  status: string;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
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

interface RecentApplicationsListProps {
  applications: JobApplication[];
  loading: boolean;
  onViewAllClick: () => void;
  onFindJobsClick: () => void;
}

const RecentApplicationsList: React.FC<RecentApplicationsListProps> = ({ 
  applications, 
  loading, 
  onViewAllClick, 
  onFindJobsClick 
}) => {
  const navigate = useNavigate();

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Recent Applications</h3>
        <Button variant="outline" size="sm" onClick={onViewAllClick}>
          View All
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading applications...</div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">You haven't applied to any jobs yet.</p>
            <Button variant="link" onClick={onFindJobsClick}>
              Browse available jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
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
  );
};

export default RecentApplicationsList;
