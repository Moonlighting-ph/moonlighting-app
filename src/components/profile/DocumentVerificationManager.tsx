
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, submitDocumentVerification } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DocumentVerification } from './DocumentVerification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Profile } from '@/types/profile';

const DocumentVerificationManager = () => {
  const [prcLicense, setPrcLicense] = useState('');
  const [tin, setTin] = useState('');
  const [govId, setGovId] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile
  });

  // Use useEffect instead of onSuccess callback
  useEffect(() => {
    if (profile) {
      setPrcLicense(profile.prc_license || '');
      setTin(profile.tin_number || '');
      setGovId(profile.government_id || '');
    }
  }, [profile]);

  const submitMutation = useMutation({
    mutationFn: submitDocumentVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Documents Submitted",
        description: "Your verification documents have been submitted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error submitting documents:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your documents. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async () => {
    await submitMutation.mutateAsync({
      prc_license: prcLicense,
      tin_number: tin,
      government_id: govId
    });
  };

  const getVerificationStatusBadge = () => {
    const status = profile?.document_verification_status as "pending" | "submitted" | "verified" | "rejected" | null;
    
    if (!status || status === 'pending') {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending Verification
        </Badge>
      );
    } else if (status === 'submitted') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800">
          <Clock className="h-3 w-3 mr-1" />
          Under Review
        </Badge>
      );
    } else if (status === 'verified') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    } else if (status === 'rejected') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Verification Failed
        </Badge>
      );
    }
    
    return null;
  };

  if (isLoading) {
    return <div>Loading verification status...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Document Verification</CardTitle>
          {getVerificationStatusBadge()}
        </div>
        <CardDescription>
          {profile?.document_verification_status === 'verified' 
            ? "Your documents have been verified successfully. You can now apply for jobs." 
            : "Please submit your documents for verification to apply for healthcare jobs."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentVerification
          prcLicense={prcLicense}
          tin={tin}
          govId={govId}
          onPrcLicenseChange={setPrcLicense}
          onTinChange={setTin}
          onGovIdChange={setGovId}
          onSubmit={handleSubmit}
          isComplete={profile?.document_verification_status === 'verified'}
          status={profile?.document_verification_status || 'pending'}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentVerificationManager;
