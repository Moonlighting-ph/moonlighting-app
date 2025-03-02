
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalJobList from '@/components/provider/dashboard/HospitalJobList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const HospitalJobs = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container px-4 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your hospital's job postings and applications
          </p>
        </div>
        <Button onClick={() => navigate('/platform/hospital-jobs/new')}>
          <Plus className="h-4 w-4 mr-2" /> Create New Job
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Current Job Postings</CardTitle>
          <CardDescription>
            View and manage all your current job openings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HospitalJobList />
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalJobs;
