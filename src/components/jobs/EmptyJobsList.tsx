
import React from 'react';
import { Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyJobsListProps {
  resetFilters: () => void;
}

const EmptyJobsList: React.FC<EmptyJobsListProps> = ({ resetFilters }) => {
  return (
    <Card className="flex flex-col items-center justify-center p-8">
      <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-medium text-lg mb-2">No jobs found</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        We couldn't find any jobs matching your filters. Try adjusting your search criteria.
      </p>
      <Button onClick={resetFilters}>
        Reset Filters
      </Button>
    </Card>
  );
};

export default EmptyJobsList;
