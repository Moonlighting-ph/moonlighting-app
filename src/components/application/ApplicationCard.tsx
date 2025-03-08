
import React from 'react';
import { JobApplication } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye, CheckCircle, X } from 'lucide-react';

interface ApplicationCardProps {
  application: JobApplication;
  onViewDetails: (application: JobApplication) => void;
  onUpdateStatus: (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'paid') => void;
  statusUpdateLoading: string | null;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onViewDetails,
  onUpdateStatus,
  statusUpdateLoading
}) => {
  const { id, status, applied_date, moonlighter, job } = application;
  
  const isLoading = statusUpdateLoading === id;
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'outline';
      case 'rejected':
        return 'destructive';
      case 'reviewed':
        return 'secondary';
      case 'paid':
        return 'success';
      default:
        return 'outline';
    }
  };
  
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">
          {moonlighter?.first_name} {moonlighter?.last_name}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{job?.title}</div>
        <div className="text-xs text-gray-500">{job?.company}</div>
      </TableCell>
      <TableCell>
        {applied_date ? new Date(applied_date).toLocaleDateString() : 'N/A'}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(status)}>
          {isLoading ? 'Updating...' : getStatusText(status)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onViewDetails(application)}
            size="sm"
            variant="ghost"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {status !== 'approved' && status !== 'paid' && (
            <Button
              onClick={() => onUpdateStatus(id, 'approved')}
              size="sm"
              variant="ghost"
              disabled={isLoading}
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
            </Button>
          )}
          
          {status !== 'rejected' && (
            <Button
              onClick={() => onUpdateStatus(id, 'rejected')}
              size="sm"
              variant="ghost"
              disabled={isLoading}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationCard;
