
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const JobDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-6 w-32 mb-4" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
            
            {/* Job Description Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
            
            {/* Requirements Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailSkeleton;
