
import React from 'react';
import { Button } from '@/components/ui/button';
import { Accordion } from "@/components/ui/accordion";
import { useNavigate } from 'react-router-dom';

// Import our refactored components
import JobBasicInfo from './job-form/JobBasicInfo';
import JobQualifications from './job-form/JobQualifications';
import JobRequirements from './job-form/JobRequirements';
import JobCompensation from './job-form/JobCompensation';
import JobBenefits from './job-form/JobBenefits';
import JobUrgencyToggle from './job-form/JobUrgencyToggle';
import { useJobFormState } from './job-form/useJobFormState';

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
  const navigate = useNavigate();
  
  const {
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
  } = useJobFormState({ initialData, onSuccess, navigate });

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
