
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const usePrcVerification = () => {
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected' | null>(null);

  const verifyLicense = useCallback(async (userId: string, licenseNumber: string, profession: string) => {
    if (!userId || !licenseNumber || !profession) {
      toast.error('Missing verification information');
      return { success: false, error: 'Missing verification information' };
    }

    setVerifying(true);
    setVerificationStatus('pending');

    try {
      console.log('Verifying license:', licenseNumber, 'for profession:', profession);
      
      // First check if a license record already exists
      const { data: existingLicense, error: fetchError } = await supabase
        .from('prc_licenses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking license:', fetchError);
        toast.error('Error checking license status');
        setVerifying(false);
        return { success: false, error: fetchError.message };
      }

      // If license record exists, update it
      if (existingLicense) {
        const { error: updateError } = await supabase
          .from('prc_licenses')
          .update({
            license_number: licenseNumber,
            profession: profession,
            status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLicense.id);

        if (updateError) {
          console.error('Error updating license:', updateError);
          toast.error('Error updating license information');
          setVerifying(false);
          return { success: false, error: updateError.message };
        }
      } else {
        // If no license record exists, create one
        const { error: insertError } = await supabase
          .from('prc_licenses')
          .insert({
            user_id: userId,
            license_number: licenseNumber,
            profession: profession,
            status: 'pending'
          });

        if (insertError) {
          console.error('Error saving license:', insertError);
          toast.error('Error saving license information');
          setVerifying(false);
          return { success: false, error: insertError.message };
        }
      }

      // In a real-world implementation, we would call an external API to verify the license
      // For demo purposes, we'll simulate a verification process that completes after a short delay
      
      // Simulate license verification - in a real app, this would call the PRC API
      setTimeout(async () => {
        // Auto-verify most licenses for demo purposes (80% success rate)
        const isVerified = Math.random() > 0.2;
        
        const { error: statusUpdateError } = await supabase
          .from('prc_licenses')
          .update({
            status: isVerified ? 'verified' : 'rejected',
            verification_date: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (statusUpdateError) {
          console.error('Error updating verification status:', statusUpdateError);
        }
        
        setVerificationStatus(isVerified ? 'verified' : 'rejected');
        toast(isVerified ? 
          { title: 'License Verified', description: 'Your PRC license has been successfully verified.' } : 
          { title: 'Verification Failed', description: 'Your license could not be verified. Please check the information or submit an appeal.', icon: '⚠️' }
        );
        
        setVerifying(false);
      }, 3000);
      
      toast.success('License submitted for verification');
      return { success: true };
    } catch (error: any) {
      console.error('License verification error:', error);
      toast.error('An unexpected error occurred during verification');
      setVerifying(false);
      return { success: false, error: error.message || 'Unexpected error' };
    }
  }, []);

  const checkVerificationStatus = useCallback(async (userId: string) => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('prc_licenses')
        .select('status, verification_date')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking verification status:', error);
        return null;
      }
      
      if (data) {
        setVerificationStatus(data.status as 'pending' | 'verified' | 'rejected');
        return data.status;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching verification status:', error);
      return null;
    }
  }, []);

  return {
    verifying,
    verificationStatus,
    verifyLicense,
    checkVerificationStatus
  };
};
