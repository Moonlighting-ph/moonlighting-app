
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, submitDocumentVerification } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DocumentVerification } from './DocumentVerification';

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

  const isVerificationComplete = profile && 
    profile.document_verification_status === 'verified';

  if (isLoading) {
    return <div>Loading verification status...</div>;
  }

  return (
    <DocumentVerification
      prcLicense={prcLicense}
      tin={tin}
      govId={govId}
      onPrcLicenseChange={setPrcLicense}
      onTinChange={setTin}
      onGovIdChange={setGovId}
      onSubmit={handleSubmit}
      isComplete={isVerificationComplete}
    />
  );
};

export default DocumentVerificationManager;
