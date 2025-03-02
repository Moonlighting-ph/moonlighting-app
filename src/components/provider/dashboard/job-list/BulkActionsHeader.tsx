
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Archive, Trash2 } from 'lucide-react';

interface BulkActionsHeaderProps {
  jobs: any[];
  selectedJobs: string[];
  handleSelectAll: () => void;
  setBulkAction: (action: 'delete' | 'archive' | null) => void;
  setBulkActionDialogOpen: (isOpen: boolean) => void;
}

export const BulkActionsHeader: React.FC<BulkActionsHeaderProps> = ({
  jobs,
  selectedJobs,
  handleSelectAll,
  setBulkAction,
  setBulkActionDialogOpen
}) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="selectAll"
          checked={jobs && selectedJobs.length === jobs.length && jobs.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="selectAll" className="text-sm font-medium">
          Select All ({jobs.length})
        </label>
      </div>
      
      {selectedJobs.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Bulk Actions ({selectedJobs.length}) <MoreHorizontal className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              setBulkAction('archive');
              setBulkActionDialogOpen(true);
            }}>
              <Archive className="mr-2 h-4 w-4" /> Archive Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setBulkAction('delete');
              setBulkActionDialogOpen(true);
            }}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
