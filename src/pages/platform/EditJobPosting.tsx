
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JobPostingForm from '@/components/hospital/JobPostingForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const EditJobPosting = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) throw new Error('Job ID is required');
      
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('created_by', userData.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl px-4 py-6 md:py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading job...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
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
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium">Error loading job</h3>
            <p className="text-muted-foreground mt-2">
              {(error as Error)?.message || "Job not found or you don't have permission to edit it."}
            </p>
            <Button onClick={() => navigate('/platform/hospital-jobs')} className="mt-4">
              Return to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardTitle>Edit Job Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <JobPostingForm 
            initialData={job} 
            onSuccess={() => navigate('/platform/hospital-jobs')}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditJobPosting;
