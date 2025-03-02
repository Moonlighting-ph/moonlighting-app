
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface JobDeleteConfirmDialogProps {
  jobToDelete: string | null;
  setJobToDelete: (id: string | null) => void;
  handleDelete: () => void;
  isDeleting?: boolean;
}

export const JobDeleteConfirmDialog = ({
  jobToDelete,
  setJobToDelete,
  handleDelete,
  isDeleting = false,
}: JobDeleteConfirmDialogProps) => {
  return (
    <AlertDialog 
      open={!!jobToDelete} 
      onOpenChange={(open) => !open && setJobToDelete(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this job posting? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => setJobToDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            asChild
          >
            <Button variant="destructive">
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
