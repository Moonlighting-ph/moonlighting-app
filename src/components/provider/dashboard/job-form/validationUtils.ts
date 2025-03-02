
import { JobFormData } from './types';
import { type ToastProps } from "@/components/ui/toast";

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// The correct type for the toast function that matches the hooks/use-toast implementation
export const validateJobForm = (formData: JobFormData, toast: { toast: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => void }): boolean => {
  // Validate title
  if (!formData.title.trim()) {
    toast.toast({
      title: "Validation Error",
      description: "Job title is required",
      variant: "destructive",
    });
    return false;
  }

  // Validate description
  if (!formData.description.trim()) {
    toast.toast({
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
  toast: { toast: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => void },
  navigate?: (path: string) => void
): boolean => {
  // Check if company name is set for hospital/provider users
  if (!profileData?.company || profileData.company.trim() === '') {
    toast.toast({
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
