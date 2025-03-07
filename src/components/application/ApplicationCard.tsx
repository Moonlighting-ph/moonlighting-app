
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
import { MoreVertical } from 'lucide-react';

interface ApplicationCardProps {
  application: JobApplication;
  onViewDetails: (application: JobApplication) => void;
  onUpdateStatus: (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => void;
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
      default:
        return 'outline';
    }
  };

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
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
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
              disabled={statusUpdateLoading === application.id || application.status === 'reviewed'}
              onClick={() => onUpdateStatus(application.id, 'reviewed')}
            >
              Mark as Reviewed
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={statusUpdateLoading === application.id || application.status === 'approved'}
              onClick={() => onUpdateStatus(application.id, 'approved')}
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={statusUpdateLoading === application.id || application.status === 'rejected'}
              onClick={() => onUpdateStatus(application.id, 'rejected')}
              className="text-red-600"
            >
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationCard;
