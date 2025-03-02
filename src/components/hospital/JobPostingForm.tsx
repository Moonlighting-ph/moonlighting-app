
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion } from "@/components/ui/accordion";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Import our new components
import JobBasicInfo from './job-form/JobBasicInfo';
import JobQualifications from './job-form/JobQualifications';
import JobRequirements from './job-form/JobRequirements';
import JobCompensation from './job-form/JobCompensation';
import JobBenefits from './job-form/JobBenefits';
import JobUrgencyToggle from './job-form/JobUrgencyToggle';

interface JobPostingFormProps {
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
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ 
  initialData,
  onSuccess 
}) => {
  const isEditing = !!initialData?.id;
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    salary: initialData?.salary || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
    description: initialData?.description || '',
    requirementsText: initialData?.requirements?.join('\n') || '',
    benefitsText: initialData?.benefits?.join('\n') || '',
    urgent: initialData?.urgent || false,
    qualificationsText: initialData?.qualifications?.join('\n') || '',
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
        .select('company,id')
        .eq('id', userData.user.id)
        .single();

      if (profileError || !profileData.company) {
        toast({
          title: "Profile Error",
          description: "Please complete your hospital profile first",
          variant: "destructive",
        });
        return;
      }

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
      } else {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <JobBasicInfo
        title={formData.title}
        location={formData.location}
        type={formData.type}
        deadline={formData.deadline}
        description={formData.description}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />

      <Accordion type="single" collapsible className="w-full">
        <JobQualifications
          qualificationsText={formData.qualificationsText}
          tags={tags}
          newTag={newTag}
          handleChange={handleChange}
          setNewTag={setNewTag}
          addTag={addTag}
          removeTag={removeTag}
        />
        
        <JobRequirements
          requirementsText={formData.requirementsText}
          handleChange={handleChange}
        />
        
        <JobCompensation
          salary={formData.salary}
          baseSalary={formData.baseSalary}
          benefitsValue={formData.benefitsValue}
          paymentFrequency={formData.paymentFrequency}
          bonusStructure={formData.bonusStructure}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />
        
        <JobBenefits
          benefitsText={formData.benefitsText}
          handleChange={handleChange}
        />
      </Accordion>

      <JobUrgencyToggle
        urgent={formData.urgent}
        handleSwitchChange={handleSwitchChange}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : isEditing ? 'Update Job Posting' : 'Post Job'}
      </Button>
    </form>
  );
};

export default JobPostingForm;
