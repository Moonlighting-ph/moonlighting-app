
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { License } from '@/types/license';

interface VerificationStatus {
  status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  message?: string;
  license?: License;
}

export const usePrcVerification = (userId: string) => {
  const [status, setStatus] = useState<VerificationStatus>({ 
    status: 'not_submitted' 
  });

  // Fetch license verification status
  const { data: license, isLoading, refetch } = useQuery({
    queryKey: ['license', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('prc_licenses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching license:', error);
        toast('Failed to fetch license information', {
          description: 'Please try again or contact support'
        });
        return null;
      }
      
      if (data) {
        // We need to ensure the data conforms to our License type
        const licenseData = data as unknown as License;
        setStatus({ 
          status: licenseData.status as 'pending' | 'verified' | 'rejected', 
          license: licenseData 
        });
        return licenseData;
      }
      
      setStatus({ status: 'not_submitted' });
      return null;
    },
    enabled: !!userId
  });

  // Submit PRC license for verification
  const { mutateAsync: submitVerification } = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const licenseNumber = formData.get('licenseNumber') as string;
        const profession = formData.get('profession') as string;
        
        if (!licenseNumber || !profession) {
          toast('Please fill all required fields', {
            description: 'License number and profession are required'
          });
          return;
        }
        
        const { data, error } = await supabase
          .from('prc_licenses')
          .insert([
            {
              user_id: userId,
              license_number: licenseNumber,
              profession,
              status: 'pending',
            },
          ])
          .select()
          .single();
        
        if (error) {
          console.error('Error submitting license:', error);
          toast('Failed to submit license for verification', {
            description: error.message
          });
          return;
        }
        
        toast('License submitted for verification', {
          description: 'We will process your request shortly'
        });
        
        setStatus({ 
          status: 'pending', 
          license: data as unknown as License,
          message: 'Your license has been submitted for verification. This may take up to 24 hours.' 
        });
        
        refetch();
      } catch (error: any) {
        console.error('Unexpected error:', error);
        toast('An error occurred during submission', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });

  // Submit an appeal for rejected verification
  const { mutateAsync: submitAppeal } = useMutation({
    mutationFn: async ({ licenseId, appealMessage }: { licenseId: string; appealMessage: string }) => {
      try {
        if (!appealMessage) {
          toast('Please provide an appeal message', {
            description: 'Explain why your license should be verified'
          });
          return;
        }
        
        const { data, error } = await supabase
          .from('verification_appeals')
          .insert([
            {
              user_id: userId,
              license_id: licenseId,
              appeal_reason: appealMessage,
              status: 'pending'
            },
          ])
          .select()
          .single();
        
        if (error) {
          console.error('Error submitting appeal:', error);
          toast('Failed to submit appeal', {
            description: error.message
          });
          return;
        }
        
        toast('Appeal submitted successfully', {
          description: 'We will review your appeal as soon as possible'
        });
        
        refetch();
      } catch (error: any) {
        console.error('Unexpected error:', error);
        toast('An error occurred during appeal submission', {
          description: error.message || 'Please try again later'
        });
      }
    }
  });

  return {
    status,
    isLoading,
    submitVerification,
    submitAppeal,
    license
  };
};
