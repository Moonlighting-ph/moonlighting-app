
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const SimilarJobs: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Jobs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground p-4 text-center">
            Similar jobs will appear here as you browse more positions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarJobs;
