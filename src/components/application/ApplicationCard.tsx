
import React from 'react';
import { JobApplication } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, CheckCircle } from 'lucide-react';

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

  const isLoading = statusUpdateLoading === application.id;

  return (
    <TableRow key={application.id}>
      <TableCell className="font-medium">
        {application.moonlighter?.first_name} {application.moonlighter?.last_name}
      </TableCell>
      <TableCell>{application.job?.title}</TableCell>
      <TableCell>
        {new Date(application.applied_date).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(application.status)}>
          {isLoading ? (
            <span className="flex items-center">
              <span className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Updating...
            </span>
          ) : (
            application.status.charAt(0).toUpperCase() + application.status.slice(1)
          )}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onViewDetails(application)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLoading || application.status === 'reviewed'}
              onClick={() => onUpdateStatus(application.id, 'reviewed')}
            >
              Mark as Reviewed
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isLoading || application.status === 'approved'}
              onClick={() => onUpdateStatus(application.id, 'approved')}
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isLoading || application.status === 'rejected'}
              onClick={() => onUpdateStatus(application.id, 'rejected')}
              className="text-red-600"
            >
              Reject
            </DropdownMenuItem>
            {application.status === 'approved' && (
              <DropdownMenuItem
                disabled={isLoading || application.status === 'paid'}
                onClick={() => onUpdateStatus(application.id, 'paid')}
                className="text-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Paid
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationCard;
