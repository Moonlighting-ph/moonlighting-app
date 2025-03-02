
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import JobPostingForm from '@/components/provider/dashboard/JobPostingForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const NewJobPosting = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl px-4 py-6 md:py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/platform')}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/platform/hospital-jobs')}>Job Postings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>New Job</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Button 
        variant="outline" 
        className="mb-4" 
        onClick={() => navigate('/platform/hospital-jobs')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Job Posting</CardTitle>
          <CardDescription>
            Complete the form below to create a new job posting for healthcare professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobPostingForm onSuccess={() => navigate('/platform/hospital-jobs')} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewJobPosting;
