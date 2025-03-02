
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobFormData } from './types';

// This function prepares the job data for submission
export const prepareJobDataForSubmission = (
  formData: JobFormData, 
  tags: string[], 
  companyName: string,
  userID: string
) => {
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

  // Default placeholder logo
  const logo = "https://placehold.co/600x400/png";

  // We need to flatten the compensation_details because the database schema 
  // doesn't appear to have a compensation_details column
  return {
    title: formData.title,
    company: companyName,
    logo: logo,
    location: formData.location,
    type: formData.type,
    salary: formData.salary,
    deadline: new Date(formData.deadline).toISOString(),
    description: formData.description,
    requirements,
    benefits,
    urgent: formData.urgent,
    created_by: userID,
    qualifications,
    // Instead of the nested object, we'll use flattened fields
    base_salary: formData.baseSalary,
    benefits_value: formData.benefitsValue,
    bonus_structure: formData.bonusStructure,
    payment_frequency: formData.paymentFrequency
  };
};

// Function to submit a new job
export const submitNewJob = async (jobData: any) => {
  const result = await supabase
    .from('jobs')
    .insert([jobData])
    .select();
  
  return result;
};

// Function to update an existing job
export const updateExistingJob = async (jobId: string, jobData: any, userId: string) => {
  const result = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', jobId)
    .eq('created_by', userId);
  
  return result;
};
