
import React from 'react';
import { JobApplication } from '@/types/job';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarClock, 
  User, 
  Briefcase, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin,
  Building,
  Clock,
  XCircle,
  UserCheck,
  FileText
} from 'lucide-react';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Application Details</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{application.job?.title} at {application.job?.company}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Applicant Information
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {application.moonlighter?.first_name} {application.moonlighter?.last_name}
                    </span>
                  </div>
                  
                  {application.moonlighter?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {application.moonlighter.email}
                      </span>
                    </div>
                  )}
                  
                  {application.moonlighter?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {application.moonlighter.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {application.notes && (
                <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Cover Note
                  </h3>
                  <p className="text-sm text-muted-foreground">{application.notes}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Job Information
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {application.job?.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {application.job?.company}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {application.job?.type || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  Application Timeline
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Applied: {new Date(application.applied_date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Status:</span>
                    <Badge variant={getStatusBadgeVariant(application.status)} className="capitalize">
                      {isLoading ? 'Updating...' : application.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">Close</Button>
            </DialogClose>
            
            <div className="flex flex-wrap justify-end gap-2">
              {application.status !== 'reviewed' && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading || application.status === 'reviewed'}
                  onClick={() => onUpdateStatus(application.id, 'reviewed')}
                  className="whitespace-nowrap"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as Reviewed
                </Button>
              )}
              
              {application.status !== 'approved' && application.status !== 'paid' && (
                <Button
                  variant="default"
                  size="sm"
                  disabled={isLoading || application.status === 'approved'}
                  onClick={() => onUpdateStatus(application.id, 'approved')}
                  className="whitespace-nowrap"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              
              {application.status !== 'rejected' && (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isLoading || application.status === 'rejected'}
                  onClick={() => onUpdateStatus(application.id, 'rejected')}
                  className="whitespace-nowrap"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
              
              {(application.status === 'approved') && (
                <Button
                  variant="success"
                  size="sm"
                  disabled={isLoading || application.status === 'paid'}
                  onClick={() => onUpdateStatus(application.id, 'paid')}
                  className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
