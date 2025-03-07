
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Job } from '@/types/job';

const applicationSchema = z.object({
  notes: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface JobApplicationDialogProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormValues) => void;
  isSubmitting: boolean;
}

const JobApplicationDialog: React.FC<JobApplicationDialogProps> = ({
  job,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      notes: '',
    },
  });

  const handleSubmit = (data: ApplicationFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Position</DialogTitle>
          <DialogDescription>
            You are applying for the following job:
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>{job.type}</Badge>
            {job.location && <Badge variant="outline">📍 {job.location}</Badge>}
            {job.salary && <Badge variant="outline">💰 {job.salary}</Badge>}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share why you're a good fit for this position..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
