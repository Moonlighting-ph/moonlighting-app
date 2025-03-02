
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JobFormData {
  title: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
  requirementsText: string;
  benefitsText: string;
  urgent: boolean;
  qualificationsText: string;
  baseSalary: string;
  benefitsValue: string;
  bonusStructure: string;
  paymentFrequency: string;
}

interface JobFormState {
  formData: JobFormData;
  tags: string[];
  newTag: string;
  isSubmitting: boolean;
}

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

export const useJobFormState = ({ initialData, onSuccess, navigate }: JobFormProps) => {
  const isEditing = !!initialData?.id;
  const { toast } = useToast();

  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    salary: initialData?.salary || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
    description: initialData?.description || '',
    requirementsText: initialData?.requirements?.join('\n') || '',
    benefitsText: initialData?.benefits?.join('\n') || '',
    urgent: initialData?.urgent || false,
    qualificationsText: initialData?.qualifications?.filter(q => !q.startsWith('#')).join('\n') || '',
    baseSalary: initialData?.compensation_details?.base_salary || '',
    benefitsValue: initialData?.compensation_details?.benefits_value || '',
    bonusStructure: initialData?.compensation_details?.bonus_structure || '',
    paymentFrequency: initialData?.compensation_details?.payment_frequency || 'Monthly',
  });

  const [tags, setTags] = useState<string[]>(
    initialData?.qualifications?.filter(q => q.startsWith('#')) || []
  );
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

      // Check if company name is set for hospital/provider users
      if (!profileData.company) {
        toast({
          title: "Profile Incomplete",
          description: "Please add your hospital or company name to your profile first",
          variant: "destructive",
        });
        return;
      }

      // For hospital/provider users, we don't need to check verification status
      
      const requirements = formData.requirementsText
        .split('\n')
        .filter(line => line.trim() !== '');
      
      const benefits = formData.benefitsText
        .split('\n')
        .filter(line => line.trim() !== '');
        
      const qualifications = [
        ...formData.qualificationsText
          .split('\n')
          .filter(line => line.trim() !== ''),
        ...tags
      ];

      // Get company logo (placeholder for now)
      const logo = "https://placehold.co/600x400/png"; // Default placeholder

      const jobData = {
        title: formData.title,
        company: profileData.company,
        logo: logo,
        location: formData.location,
        type: formData.type,
        salary: formData.salary,
        deadline: new Date(formData.deadline).toISOString(),
        description: formData.description,
        requirements,
        benefits,
        urgent: formData.urgent,
        created_by: userData.user.id,
        qualifications,
        compensation_details: {
          base_salary: formData.baseSalary,
          benefits_value: formData.benefitsValue,
          bonus_structure: formData.bonusStructure,
          payment_frequency: formData.paymentFrequency,
        }
      };

      let result;
      
      if (isEditing && initialData?.id) {
        // Update existing job
        result = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', initialData.id)
          .eq('created_by', userData.user.id); // Ensure job belongs to this user
      } else {
        // Create new job
        result = await supabase
          .from('jobs')
          .insert([jobData])
          .select();
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
