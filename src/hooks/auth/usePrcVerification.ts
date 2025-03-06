
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ProfessionType = 
  'Registered Nurse' | 
  'Licensed Physician' | 
  'Medical Technologist' | 
  'Physical Therapist' | 
  'Radiologic Technologist' | 
  'Pharmacist' | 
  'Midwife' | 
  'Occupational Therapist' | 
  'Dentist';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type LicenseData = {
  id?: string;
  license_number: string;
  profession: string;
  full_name?: string;
  supporting_documents?: File[];
  appeal_reason?: string;
};

export const usePrcVerification = () => {
  const { session } = useAuth();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [licenseData, setLicenseData] = useState<any>(null);

  // Get verification status
  const getVerificationStatus = useCallback(async (userId: string) => {
    if (!userId) return null;
    
    try {
      setLoadingStatus(true);
      const { data, error } = await supabase
        .from('prc_licenses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching verification status:', error);
        return null;
      }
      
      if (data) {
        setVerificationStatus(data.status as VerificationStatus);
        setLicenseData(data);
      }
      
      return data;
    } catch (error) {
      console.error('Error in verification status check:', error);
      return null;
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  // Submit PRC license for verification
  const submitLicenseForVerification = useCallback(async (
    licenseData: LicenseData,
    isAppeal: boolean = false,
    existingLicenseId?: string
  ) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to submit verification");
      return { success: false };
    }
    
    try {
      setLoadingSubmit(true);
      
      if (isAppeal && existingLicenseId) {
        // Submit appeal for existing license
        const { error: appealError } = await supabase
          .from('verification_appeals')
          .insert({
            user_id: session.user.id,
            license_id: existingLicenseId,
            appeal_reason: licenseData.appeal_reason || 'No reason provided',
          });
        
        if (appealError) {
          console.error('Error submitting appeal:', appealError);
          toast.error("Failed to submit appeal. Please try again.");
          return { success: false };
        }
        
        toast.success("Your appeal has been submitted for review");
        return { success: true };
      }
      
      // Submit new license for verification
      const { error } = await supabase
        .from('prc_licenses')
        .insert({
          user_id: session.user.id,
          license_number: licenseData.license_number,
          profession: licenseData.profession,
        });
      
      if (error) {
        console.error('Error submitting license:', error);
        toast.error("Failed to submit license. Please try again.");
        return { success: false };
      }
      
      toast({
        description: "Your license has been submitted for verification."
      });
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error in license submission:', error);
      toast.error("An unexpected error occurred. Please try again.");
      return { success: false };
    } finally {
      setLoadingSubmit(false);
    }
  }, [session]);

  return {
    loadingStatus,
    loadingSubmit,
    verificationStatus,
    licenseData,
    getVerificationStatus,
    submitLicenseForVerification
  };
};
