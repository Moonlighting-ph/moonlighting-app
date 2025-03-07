
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { submitJobApplication } from '@/services/jobApplicationService';
import { Job } from '@/types/job';

interface JobApplicationFormProps {
  job: Job;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, onSuccess, onCancel }) => {
  const { session } = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error('You must be logged in to apply for jobs');
      return;
    }

    try {
      setLoading(true);
      
      await submitJobApplication({
        job_id: job.id,
        moonlighter_id: session.user.id,
        notes: notes.trim() || null,
      });
      
      toast.success('Application submitted successfully!');
      setNotes('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Apply for {job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Additional Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Share any relevant information about your qualifications or availability..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-y min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JobApplicationForm;
