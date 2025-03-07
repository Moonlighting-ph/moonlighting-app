
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JobApplication } from '@/types/job';

interface ApplicationsStatsProps {
  applications: JobApplication[];
}

const ApplicationsStats: React.FC<ApplicationsStatsProps> = ({ applications }) => {
  
  const countApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{applications.length}</CardTitle>
          <CardDescription>Total Applications</CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{countApplicationsByStatus('approved')}</CardTitle>
          <CardDescription>Approved Applications</CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{countApplicationsByStatus('pending')}</CardTitle>
          <CardDescription>Pending Applications</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ApplicationsStats;
