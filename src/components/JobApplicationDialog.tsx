
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import JobApplicationForm from './JobApplicationForm';

interface JobApplicationDialogProps {
  job: {
    id: string;
    title: string;
    facility: string;
    location: string;
    rate: string;
    shift: string;
    date: string;
    urgent?: boolean;
    description?: string;
  };
  triggerText?: string;
}

const JobApplicationDialog: React.FC<JobApplicationDialogProps> = ({ 
  job, 
  triggerText = "Apply Now" 
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <JobApplicationForm job={job} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
