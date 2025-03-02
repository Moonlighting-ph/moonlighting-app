
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Building, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  Heart, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Award,
  Briefcase,
  Calendar as CalendarIcon,
  Loader2,
  CheckCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fetchJobById, applyForJob, checkJobApplication } from '@/integrations/supabase/client';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
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
      <Card className="mb-6 overflow-hidden">
        <div className="h-40 overflow-hidden relative">
          <img 
            src={jobData.logo}
            alt={jobData.company}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-background bg-white">
              <img 
                src={jobData.logo}
                alt={jobData.company}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{jobData.title}</h1>
              <p className="text-lg">{jobData.company}</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{jobData.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{jobData.type}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{jobData.salary}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span>Posted: {new Date(jobData.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mr-2" />
                <span>Apply by: {new Date(jobData.deadline).toLocaleDateString()}</span>
              </div>
              {jobData.urgent && (
                <Badge variant="destructive" className="uppercase">Urgent</Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button 
              className="flex-1 sm:flex-none" 
              onClick={handleApply}
              disabled={!!existingApplication}
            >
              {existingApplication ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Applied
                </>
              ) : (
                "Apply Now"
              )}
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={toggleSaved}>
              <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              {isSaved ? 'Saved' : 'Save Job'}
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
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
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p>{jobData.description}</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                    <ul className="space-y-2">
                      {jobData.requirements.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                    <ul className="space-y-2">
                      {jobData.benefits.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  className="w-full md:w-auto" 
                  onClick={handleApply}
                  disabled={!!existingApplication}
                >
                  {existingApplication ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Already Applied
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="company" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{jobData.company}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-border mr-4">
                      <img 
                        src={jobData.logo}
                        alt={jobData.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Healthcare Institution
                      </p>
                    </div>
                  </div>
                  
                  <p>A leading healthcare institution providing quality medical services to patients.</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Location</h3>
                    <p className="text-muted-foreground">
                      {jobData.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-accent/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-1">Payment Method</h3>
                      <p className="text-lg">Direct deposit</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-1">Frequency</h3>
                      <p className="text-lg">Bi-monthly</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-1">Rate</h3>
                      <p className="text-lg">{jobData.salary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Apply Online</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your application through our platform
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Initial Screening</h3>
                  <p className="text-sm text-muted-foreground">
                    Our recruitment team will review your qualifications
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Interview</h3>
                  <p className="text-sm text-muted-foreground">
                    Virtual or in-person interview with the hiring manager
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Job Offer</h3>
                  <p className="text-sm text-muted-foreground">
                    If selected, you'll receive an official job offer
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  className="w-full" 
                  onClick={handleApply}
                  disabled={!!existingApplication}
                >
                  {existingApplication ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Application Submitted
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
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
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for {jobData.title}</DialogTitle>
            <DialogDescription>
              Submit your application for this position at {jobData.company}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Add a note to your application (optional)</h4>
              <Textarea
                placeholder="Introduce yourself and explain why you're a good fit for this position..."
                value={applicationNote}
                onChange={(e) => setApplicationNote(e.target.value)}
                className="min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
            <Button 
              onClick={submitApplication} 
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetail;
