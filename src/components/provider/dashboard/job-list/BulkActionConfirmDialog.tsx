
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
} from "@/components/ui/alert-dialog";

interface BulkActionConfirmDialogProps {
  bulkActionDialogOpen: boolean;
  setBulkActionDialogOpen: (isOpen: boolean) => void;
  bulkAction: 'delete' | 'archive' | null;
  setBulkAction: (action: 'delete' | 'archive' | null) => void;
  selectedJobs: string[];
  handleBulkAction: () => void;
}

export const BulkActionConfirmDialog: React.FC<BulkActionConfirmDialogProps> = ({
  bulkActionDialogOpen,
  setBulkActionDialogOpen,
  bulkAction,
  setBulkAction,
  selectedJobs,
  handleBulkAction
}) => {
  return (
    <AlertDialog 
      open={bulkActionDialogOpen} 
      onOpenChange={setBulkActionDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm {bulkAction === 'delete' ? 'Deletion' : 'Archive'}</AlertDialogTitle>
          <AlertDialogDescription>
            {bulkAction === 'delete' 
              ? `Are you sure you want to delete ${selectedJobs.length} job postings? This action cannot be undone.`
              : `Are you sure you want to archive ${selectedJobs.length} job postings? They will no longer be visible to applicants.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setBulkActionDialogOpen(false);
            setBulkAction(null);
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleBulkAction}>
            {bulkAction === 'delete' ? 'Delete' : 'Archive'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
