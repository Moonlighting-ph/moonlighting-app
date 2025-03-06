import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define types for license and form data
interface License {
  id: string;
  user_id: string;
  license_number: string;
  profession: string;
  expiry_date: string;
  document_url: string;
  status: 'pending' | 'verified' | 'rejected';
  rejection_reason: string | null;
  appeal_message: string | null;
}

interface FormData {
  licenseNumber: string;
  profession: string;
  expiryDate: Date | null;
  document: File | null;
}

export const usePrcVerification = (userId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch license data
  const { data: license, isLoading, isError, refetch } = useQuery({
    queryKey: ['prc-license', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('prc_licenses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as License;
    },
    enabled: !!userId,
  });

  // Mutation for submitting the license application
  const submitLicense = useMutation(
    async (formData: FormData) => {
      if (!userId) throw new Error('User ID is required');
      if (!formData.document) throw new Error('Document is required');

      setIsSubmitting(true);
      setFormError(null);

      // Upload the document to Supabase storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('prc_documents')
        .upload(`${userId}/${formData.document.name}`, formData.document, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        throw storageError;
      }

      const document_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageData?.fullPath}`;

      // Insert the license data into the database
      const { error } = await supabase
        .from('prc_licenses')
        .insert([
          {
            user_id: userId,
            license_number: formData.licenseNumber,
            profession: formData.profession,
            expiry_date: formData.expiryDate?.toISOString(),
            document_url: document_url,
            status: 'pending',
          },
        ]);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        setIsSubmitting(false);
        toast('Verification request submitted successfully!');
        refetch(); // Refetch license data to update the UI
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        setFormError(error.message || 'An error occurred while submitting the form.');
        toast.error(formError);
      },
    }
  );

  // Mutation for submitting an appeal
  const submitAppeal = useMutation(
    async ({ licenseId, appealMessage }: { licenseId: string, appealMessage: string }) => {
      if (!licenseId) throw new Error('License ID is required');
      if (!appealMessage) throw new Error('Appeal message is required');

      setIsSubmitting(true);
      setFormError(null);

      const { error } = await supabase
        .from('prc_licenses')
        .update({
          status: 'pending',
          appeal_message: appealMessage,
          rejection_reason: null,
        })
        .eq('id', licenseId);

      if (error) {
        console.error('Appeal submission error:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        setIsSubmitting(false);
        toast('Appeal submitted successfully!');
        refetch(); // Refetch license data to update the UI
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        setFormError(error.message || 'An error occurred while submitting the appeal.');
        toast.error(formError);
      },
    }
  );

  const verificationStatus = () => {
    if (isLoading) {
      toast('Checking verification status...');
    }

    if (isSubmitting) {
      toast('Submitting verification request...');
    }
  };

  return {
    license,
    isLoading,
    isError,
    formError,
    submitLicense,
    submitAppeal,
    isSubmitting,
    verificationStatus,
  };
};
