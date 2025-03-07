
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { submitJobApplication } from '@/services/jobApplicationService';
import { Job, JobApplication } from '@/types/job';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface JobApplicationDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (application: JobApplication) => void;
}

const JobApplicationDialog: React.FC<JobApplicationDialogProps> = ({
  job,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { session } = useAuth();
  const [applicationNotes, setApplicationNotes] = useState('');
  const [applying, setApplying] = useState(false);

  const handleSubmitApplication = async () => {
    if (!job || !session?.user) return;
    
    try {
      setApplying(true);
      
      const application = await submitJobApplication({
        job_id: job.id,
        moonlighter_id: session.user.id,
        notes: applicationNotes.trim() || null
      });
      
      setApplicationNotes('');
      onOpenChange(false);
      toast.success('Application submitted successfully');
      
      if (onSuccess) {
        onSuccess(application);
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Add a note to the healthcare provider about why you're a good fit for this role (optional)
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="Share your interest, relevant experience, or ask questions about the job..."
            value={applicationNotes}
            onChange={(e) => setApplicationNotes(e.target.value)}
            className="h-32"
          />
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={applying}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSubmitApplication}
            disabled={applying}
          >
            {applying ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
