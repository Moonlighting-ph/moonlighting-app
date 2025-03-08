
// Import the necessary components and types
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { JobApplication } from '@/types/job';
import { updateApplicationStatus } from '@/services/application';
import { Label } from '@/components/ui/label';

interface ApplicationDetailsDialogProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'paid') => void;
  statusUpdateLoading: string | null;
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  application,
  isOpen,
  onClose,
  onStatusChange,
  statusUpdateLoading
}) => {
  const [status, setStatus] = useState<string>('');
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
  };
  
  const updateStatus = async () => {
    if (!application || !status) return;
    
    try {
      onStatusChange(application.id, status as 'pending' | 'reviewed' | 'approved' | 'rejected' | 'paid');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };
  
  // Format date to a readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!application) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            Reviewing application from {application.user_name} for {application.job_title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Applicant</Label>
              <p className="font-medium">{application.user_name}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p className="font-medium capitalize">{application.status}</p>
            </div>
            <div>
              <Label>Applied On</Label>
              <p>{formatDate(application.created_at)}</p>
            </div>
            <div>
              <Label>Contact</Label>
              <p>{application.user_email}</p>
            </div>
          </div>
          
          <div className="mt-2">
            <Label>Cover Letter / Note</Label>
            <div className="p-3 bg-gray-50 rounded-md mt-1">
              {application.cover_letter || 'No cover letter provided'}
            </div>
          </div>
          
          <div className="mt-2">
            <Label>Job Applied For</Label>
            <p className="font-medium">{application.job_title}</p>
            <p className="text-sm text-gray-500">{application.job_company}</p>
          </div>
          
          {/* Only show status update if not paid yet */}
          {application.status !== 'paid' && (
            <div className="mt-4">
              <Label htmlFor="status-select">Update Status</Label>
              <Select onValueChange={handleStatusChange} defaultValue={application.status}>
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {/* Only show update button if not paid yet and status is different */}
          {application.status !== 'paid' && status && status !== application.status && (
            <Button 
              onClick={updateStatus}
              disabled={statusUpdateLoading === application.id}
            >
              {statusUpdateLoading === application.id ? 'Updating...' : 'Update Status'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
