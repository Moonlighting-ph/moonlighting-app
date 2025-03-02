
import { supabase } from '@/integrations/supabase/client';
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

  // The jobs table doesn't have separate columns for compensation details
  // including base_salary, benefits_value, etc.
  // Instead we'll include them as part of the salary field in a structured format
  
  // Format the comprehensive salary information
  const salaryInfo = {
    base: formData.baseSalary,
    benefits: formData.benefitsValue,
    bonus: formData.bonusStructure,
    frequency: formData.paymentFrequency
  };
  
  // Potentially update the salary field to include all compensation details
  const enhancedSalary = formData.salary || JSON.stringify(salaryInfo);

  return {
    title: formData.title,
    company: companyName,
    logo: logo,
    location: formData.location,
    type: formData.type,
    salary: enhancedSalary,
    deadline: new Date(formData.deadline).toISOString(),
    description: formData.description,
    requirements,
    benefits,
    urgent: formData.urgent,
    created_by: userID,
    qualifications
    // We're no longer trying to add these columns directly
    // base_salary, benefits_value, bonus_structure, payment_frequency
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
