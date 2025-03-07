
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
import { MoreVertical, CheckCircle, User, Calendar, ExternalLink } from 'lucide-react';

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
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'reviewed':
        return 'secondary';
      case 'paid':
        return 'default';
      default:
        return 'outline';
    }
  };

  const isLoading = statusUpdateLoading === application.id;

  return (
    <TableRow key={application.id} className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-medium block">
              {application.moonlighter?.first_name} {application.moonlighter?.last_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {application.moonlighter?.email || 'No email provided'}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{application.job?.title}</span>
          <span className="text-xs text-muted-foreground">{application.job?.company}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {new Date(application.applied_date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(application.status)} className="capitalize">
          {isLoading ? (
            <span className="flex items-center">
              <span className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Updating...
            </span>
          ) : (
            application.status
          )}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => onViewDetails(application)}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isLoading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => onViewDetails(application)}
                className="cursor-pointer"
              >
                View Application Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={isLoading || application.status === 'reviewed'}
                onClick={() => onUpdateStatus(application.id, 'reviewed')}
                className="cursor-pointer"
              >
                Mark as Reviewed
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoading || application.status === 'approved'}
                onClick={() => onUpdateStatus(application.id, 'approved')}
                className="cursor-pointer"
              >
                Approve Application
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoading || application.status === 'rejected'}
                onClick={() => onUpdateStatus(application.id, 'rejected')}
                className="text-destructive cursor-pointer"
              >
                Reject Application
              </DropdownMenuItem>
              {application.status === 'approved' && (
                <DropdownMenuItem
                  disabled={isLoading || application.status === 'paid'}
                  onClick={() => onUpdateStatus(application.id, 'paid')}
                  className="text-green-600 cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationCard;
