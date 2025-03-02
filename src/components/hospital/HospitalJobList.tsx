
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Briefcase, MapPin, Calendar, Edit, Trash2, Plus, Eye } from 'lucide-react';

const HospitalJobList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  // Fetch jobs created by current user
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['hospitalJobs'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('created_by', userData.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('created_by', userData.user.id);
      
      if (error) throw error;
      return jobId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] });
      toast({
        title: "Job Deleted",
        description: "The job posting has been successfully deleted."
      });
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (jobToDelete) {
      deleteJobMutation.mutate(jobToDelete);
      setJobToDelete(null);
    }
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/platform/job/${jobId}`);
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/platform/hospital-jobs/edit/${jobId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-muted rounded-lg">
        <h3 className="text-lg font-medium">Error loading jobs</h3>
        <p className="text-muted-foreground mt-2">
          {(error as Error).message || "An unexpected error occurred"}
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['hospitalJobs'] })} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Job Postings</h2>
        <Button onClick={() => navigate('/platform/hospital-jobs/new')}>
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <Card key={job.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{job.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{job.type}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex mt-4 md:mt-0">
                      {job.urgent && (
                        <Badge variant="destructive" className="ml-2">Urgent</Badge>
                      )}
                      <Badge variant={job.is_active ? "default" : "outline"} className="ml-2">
                        {job.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Deadline: {formatDate(job.deadline)}</span>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewJob(job.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditJob(job.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => setJobToDelete(job.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete
                              this job posting and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setJobToDelete(null)}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border rounded-lg">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No job postings yet</h3>
          <p className="text-muted-foreground mt-2">
            Create your first job posting to start receiving applications
          </p>
          <Button onClick={() => navigate('/platform/hospital-jobs/new')} className="mt-6">
            Create Job Posting
          </Button>
        </div>
      )}
    </div>
  );
};

export default HospitalJobList;
