
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { fetchJobById, applyForJob, checkJobApplication } from '@/integrations/supabase/client';

// Imported Components
import JobHeader from '@/components/jobs/JobHeader';
import JobDescription from '@/components/jobs/JobDescription';
import JobCompanyInfo from '@/components/jobs/JobCompanyInfo';
import JobPaymentInfo from '@/components/jobs/JobPaymentInfo';
import JobApplicationProcess from '@/components/jobs/JobApplicationProcess';
import JobApplyDialog from '@/components/jobs/JobApplyDialog';
import SimilarJobs from '@/components/jobs/SimilarJobs';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [applicationNote, setApplicationNote] = useState('');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  
  // Fetch job details
  const { data: jobData, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => id ? fetchJobById(id) : null,
    enabled: !!id
  });

  // Check if user has already applied
  const { data: existingApplication, isLoading: checkingApplication } = useQuery({
    queryKey: ['application', id],
    queryFn: () => id ? checkJobApplication(id) : null,
    enabled: !!id
  });

  // Apply for job mutation
  const applyMutation = useMutation({
    mutationFn: () => applyForJob(id!, applicationNote),
    onSuccess: () => {
      setShowApplyDialog(false);
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleApply = () => {
    if (!id) return;
    
    // If user has already applied, show a message
    if (existingApplication) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this job.",
        variant: "default",
      });
      return;
    }
    
    setShowApplyDialog(true);
  };
  
  const submitApplication = () => {
    applyMutation.mutate();
  };
  
  const toggleSaved = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Job Removed" : "Job Saved",
      description: isSaved ? "This job has been removed from your saved jobs." : "This job has been added to your saved jobs.",
      variant: "default",
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Job link has been copied to clipboard.",
      variant: "default",
    });
  };

  if (isLoading || checkingApplication) {
    return (
      <div className="container px-4 py-8 flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading job details...</span>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The job you're looking for might have been removed or is no longer available.
          </p>
          <Button onClick={() => navigate("/platform/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/platform/jobs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </a>
      </Button>
      
      {/* Job Header */}
      <JobHeader 
        job={jobData}
        isSaved={isSaved}
        toggleSaved={toggleSaved}
        handleShare={handleShare}
        existingApplication={existingApplication}
        handleApply={handleApply}
      />
      
      {/* Job Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="company" className="flex-1">Company</TabsTrigger>
              <TabsTrigger value="payment" className="flex-1">Payment Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <JobDescription 
                description={jobData.description}
                requirements={jobData.requirements}
                benefits={jobData.benefits}
                handleApply={handleApply}
                existingApplication={existingApplication}
              />
            </TabsContent>
            
            <TabsContent value="company" className="mt-6">
              <JobCompanyInfo 
                company={jobData.company}
                logo={jobData.logo}
                location={jobData.location}
              />
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <JobPaymentInfo salary={jobData.salary} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <JobApplicationProcess 
            handleApply={handleApply}
            existingApplication={existingApplication}
          />
          
          <SimilarJobs />
        </div>
      </div>

      {/* Apply Dialog */}
      <JobApplyDialog 
        showDialog={showApplyDialog}
        setShowDialog={setShowApplyDialog}
        jobTitle={jobData.title}
        companyName={jobData.company}
        applicationNote={applicationNote}
        setApplicationNote={setApplicationNote}
        submitApplication={submitApplication}
        isPending={applyMutation.isPending}
      />
    </div>
  );
};

export default JobDetail;
