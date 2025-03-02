
import { JobFormData } from './types';
import { useToast } from '@/hooks/use-toast';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateJobForm = (formData: JobFormData, toast: ReturnType<typeof useToast>): boolean => {
  // Validate title
  if (!formData.title.trim()) {
    toast({
      title: "Validation Error",
      description: "Job title is required",
      variant: "destructive",
    });
    return false;
  }

  // Validate description
  if (!formData.description.trim()) {
    toast({
      title: "Validation Error",
      description: "Job description is required",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

export const validateCompanyProfile = (
  profileData: { company?: string } | null,
  toast: ReturnType<typeof useToast>,
  navigate?: (path: string) => void
): boolean => {
  // Check if company name is set for hospital/provider users
  if (!profileData?.company || profileData.company.trim() === '') {
    toast({
      title: "Profile Incomplete",
      description: "Please add your hospital or company name to your profile before posting a job",
      variant: "destructive",
    });
    
    // Redirect to profile page
    if (navigate) {
      navigate('/platform/hospital-profile');
    }
    return false;
  }
  
  return true;
};
