
import React from 'react';
import { JobApplication } from '@/types/job';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, User, CheckCircle } from 'lucide-react';

interface ApplicationDetailsDialogProps {
  application: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'paid') => void;
  statusUpdateLoading: string | null;
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  application,
  open,
  onOpenChange,
  onUpdateStatus,
  statusUpdateLoading
}) => {
  if (!application) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            {application.job?.title} at {application.job?.company}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">
              {application.moonlighter?.first_name} {application.moonlighter?.last_name}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <CalendarClock className="h-4 w-4 mr-2" />
            <span>Applied on {new Date(application.applied_date).toLocaleDateString()}</span>
          </div>
          
          <div>
            <p className="font-medium mb-1">Status</p>
            <Badge variant={getStatusBadgeVariant(application.status)}>
              {isLoading ? 'Updating...' : application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
          
          {application.notes && (
            <div>
              <p className="font-medium mb-1">Applicant's Note</p>
              <p className="text-sm bg-gray-50 p-3 rounded">{application.notes}</p>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            
            <div className="space-x-2">
              {application.status === 'approved' && (
                <Button
                  variant="default"
                  disabled={isLoading || application.status === 'paid'}
                  onClick={() => onUpdateStatus(application.id, 'paid')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
              {application.status !== 'approved' && application.status !== 'paid' && (
                <>
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => onUpdateStatus(application.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isLoading || application.status === 'rejected'}
                    onClick={() => onUpdateStatus(application.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
