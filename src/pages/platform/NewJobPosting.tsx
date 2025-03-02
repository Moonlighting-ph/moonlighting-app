
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JobPostingForm from '@/components/hospital/JobPostingForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NewJobPosting = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl px-4 py-6 md:py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/platform/hospital-jobs')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Job Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <JobPostingForm onSuccess={() => navigate('/platform/hospital-jobs')} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewJobPosting;
