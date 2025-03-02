
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface JobApplyDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  jobTitle: string;
  companyName: string;
  applicationNote: string;
  setApplicationNote: (note: string) => void;
  submitApplication: () => void;
  isPending: boolean;
}

const JobApplyDialog: React.FC<JobApplyDialogProps> = ({
  showDialog,
  setShowDialog,
  jobTitle,
  companyName,
  applicationNote,
  setApplicationNote,
  submitApplication,
  isPending
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Submit your application for this position at {companyName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add a note to your application (optional)</h4>
            <Textarea
              placeholder="Introduce yourself and explain why you're a good fit for this position..."
              value={applicationNote}
              onChange={(e) => setApplicationNote(e.target.value)}
              className="min-h-32"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button 
            onClick={submitApplication} 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplyDialog;
