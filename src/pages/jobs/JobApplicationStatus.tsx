
import React from 'react';
import { JobApplication } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock } from 'lucide-react';

interface JobApplicationStatusProps {
  application: JobApplication;
}

const JobApplicationStatus: React.FC<JobApplicationStatusProps> = ({ application }) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Your Application Status</CardTitle>
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
