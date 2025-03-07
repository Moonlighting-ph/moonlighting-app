
import React from 'react';
import { JobApplication } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { getApplicationForMoonlighter } from '@/services/jobApplicationService';

interface JobApplicationStatusProps {
  application: JobApplication;
  onRefresh?: () => void;
}

const JobApplicationStatus: React.FC<JobApplicationStatusProps> = ({ 
  application,
  onRefresh
}) => {
  const [refreshing, setRefreshing] = React.useState(false);

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Congratulations! Your application has been approved.';
      case 'rejected':
        return 'We\'re sorry, your application has been rejected.';
      case 'reviewed':
        return 'Your application has been reviewed and is under consideration.';
      default:
        return 'Your application is pending review.';
    }
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
      toast.success('Application status refreshed');
    } catch (error) {
      toast.error('Failed to refresh application status');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Application Status</CardTitle>
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarClock className="h-4 w-4 mr-2" />
              <span>Applied on {new Date(application.applied_date).toLocaleDateString()}</span>
            </div>
            <Badge variant={getStatusBadgeVariant(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
          
          <div className="bg-gray-50 p-3 rounded text-sm">
            {getStatusMessage(application.status)}
          </div>
          
          {application.notes && (
            <div>
              <p className="font-medium text-sm mb-1">Your Application Note:</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{application.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationStatus;
