
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  calculateCompletionPercentage, 
  isDocumentVerificationComplete,
  initializeFormDataFromProfile
} from "@/utils/ProfileUtils";
import type { Profile } from "@/types/profile";

type ProfileFormData = {
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  contact_email: string;
  phone: string;
  company: string;
  avatar_url: string;
  prc_license: string;
  work_experience: string;
  preferred_location: string;
  tin_number: string;
  government_id: string;
  document_verification_status: "pending" | "submitted" | "verified" | "rejected";
};

export function useProfileForm() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<ProfileFormData>(
    initializeFormDataFromProfile(profile as Profile | null, user?.email)
  );
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(initializeFormDataFromProfile(profile as Profile | null, user?.email));
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          title: formData.title,
          bio: formData.bio,
          contact_email: formData.contact_email,
          phone: formData.phone,
          company: formData.company,
          avatar_url: formData.avatar_url,
          prc_license: formData.prc_license,
          work_experience: formData.work_experience,
          preferred_location: formData.preferred_location,
          tin_number: formData.tin_number,
          government_id: formData.government_id,
          document_verification_status: formData.document_verification_status,
          user_type: profile?.user_type || 'medical_professional',
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      navigate("/platform");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitDocuments = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          prc_license: formData.prc_license,
          tin_number: formData.tin_number,
          government_id: formData.government_id,
          document_verification_status: "submitted",
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setFormData(prev => ({
        ...prev,
        document_verification_status: "submitted"
      }));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Check if verification is needed based on user type
  const needsDocumentVerification = profile?.user_type === 'medical_professional';
  
  const completion = calculateCompletionPercentage(formData, profile?.user_type);
  
  // For hospital/providers, we don't need document verification
  const documentVerificationComplete = !needsDocumentVerification || 
    isDocumentVerificationComplete(
      formData.document_verification_status,
      formData.prc_license,
      formData.tin_number,
      formData.government_id
    );

  return {
    formData,
    activeTab,
    loading,
    profile,
    handleChange,
    handleSubmit,
    submitDocuments,
    setActiveTab,
    calculateCompletionPercentage: completion,
    isDocumentVerificationComplete: documentVerificationComplete
  };
}
