
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobFormData, JobFormState, JobFormHandlers } from './types';
import { initializeFormData, initializeTags } from './formDataUtils';
import { prepareJobDataForSubmission, submitNewJob, updateExistingJob } from './submitJobUtils';
import { validateJobForm, validateCompanyProfile } from './validationUtils';

interface JobFormProps {
  initialData?: {
    id?: string;
    title: string;
    location: string;
    type: string;
    salary: string;
    deadline: string;
    description: string;
    requirements: string[];
    benefits: string[];
    urgent: boolean;
    qualifications?: string[];
    compensation_details?: {
      base_salary?: string;
      benefits_value?: string;
      bonus_structure?: string;
      payment_frequency?: string;
    };
  };
  onSuccess?: () => void;
  navigate?: (path: string) => void;
}

export const useJobFormState = ({ initialData, onSuccess, navigate }: JobFormProps): JobFormState & JobFormHandlers => {
  const isEditing = !!initialData?.id;
  const { toast } = useToast();

  const [formData, setFormData] = useState<JobFormData>(initializeFormData(initialData));
  const [tags, setTags] = useState<string[]>(initializeTags(initialData));
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      urgent: checked,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(`#${newTag.trim()}`)) {
      setTags([...tags, `#${newTag.trim()}`]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate the form first
    if (!validateJobForm(formData, toast)) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to post a job",
          variant: "destructive",
        });
        return;
      }

      // Get user profile to get company info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('company,id,user_type')
        .eq('id', userData.user.id)
        .single();

      if (profileError) {
        toast({
          title: "Profile Error",
          description: "Failed to fetch your profile information",
          variant: "destructive",
        });
        return;
      }

      // Validate company profile
      if (!validateCompanyProfile(profileData, toast, navigate)) {
        return;
      }

      // Prepare job data for submission
      const jobData = prepareJobDataForSubmission(
        formData,
        tags,
        profileData.company,
        userData.user.id
      );

      let result;
      
      if (isEditing && initialData?.id) {
        // Update existing job
        result = await updateExistingJob(initialData.id, jobData, userData.user.id);
      } else {
        // Create new job
        result = await submitNewJob(jobData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Job Updated" : "Job Posted",
        description: isEditing 
          ? "Your job posting has been updated successfully." 
          : "Your job has been posted successfully.",
      });

      if (onSuccess) {
        onSuccess();
      } else if (navigate) {
        navigate('/platform/hospital-jobs');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'post'} job. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    tags,
    newTag,
    isSubmitting,
    isEditing,
    handleChange,
    handleSwitchChange,
    handleSelectChange,
    addTag,
    removeTag,
    handleSubmit,
    setNewTag,
  };
};
