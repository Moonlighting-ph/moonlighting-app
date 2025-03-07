
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';

// Helper function to ensure requirements and responsibilities are string arrays
const formatJobData = (jobData: any) => {
  if (!jobData) return null;
  
  // Ensure requirements is a string array
  const requirements = Array.isArray(jobData.requirements) 
    ? jobData.requirements.map(r => String(r)) 
    : [];
    
  // Ensure responsibilities is a string array
  const responsibilities = Array.isArray(jobData.responsibilities) 
    ? jobData.responsibilities.map(r => String(r)) 
    : [];
    
  return {
    ...jobData,
    requirements,
    responsibilities
  };
};

export const updateApplicationStatus = async (
  applicationId: string, 
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'paid',
  providerId: string
): Promise<JobApplication> => {
  try {
    console.log(`Starting update for application ${applicationId} to status: ${status}`);
    
    // First verify that the provider owns the job
    const { data: application, error: fetchError } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('id', applicationId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching application:', fetchError);
      throw fetchError;
    }
    
    if (!application?.job_id) {
      console.error('Application not found or does not have a job_id');
      throw new Error('Application not found');
    }
    
    console.log(`Found application with job_id: ${application.job_id}`);
    
    // Verify job ownership
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('provider_id')
      .eq('id', application.job_id)
      .maybeSingle();
    
    if (jobError) {
      console.error('Error fetching job:', jobError);
      throw jobError;
    }
    
    if (!job) {
      console.error('Job not found');
      throw new Error('Job not found');
    }
    
    if (job.provider_id !== providerId) {
      console.error(`Permission denied: user ${providerId} is not the owner of job ${application.job_id}`);
      throw new Error('You do not have permission to update this application');
    }
    
    console.log(`Updating application ${applicationId} to status: ${status}`);
    
    // Update the status with fewer conditions to debug
    const { data: updateData, error: updateError } = await supabase
      .from('job_applications') // Ensure this matches your actual table name
      .update({ status })
      .eq('id', applicationId)
      .select('*');
    
    if (updateError) {
      console.error('Supabase error updating application:', updateError);
      throw new Error(`Failed to update application status: ${updateError.message}`);
    }
    
    console.log('Update response:', updateData);
    
    if (!updateData || updateData.length === 0) {
      console.error('No rows updated', updateData);
      throw new Error('Application not found after update');
    }
    
    // Fetch the updated application with job details to return
    const { data: updatedApplication, error: fetchUpdatedError } = await supabase
      .from('job_applications')
      .select(`
        id, job_id, moonlighter_id, notes, status, applied_date, ai_match_score, profile_info,
        job:jobs(*)
      `)
      .eq('id', applicationId)
      .maybeSingle();
    
    if (fetchUpdatedError) {
      console.error('Error fetching updated application:', fetchUpdatedError);
      throw new Error('Application updated but could not retrieve the updated record');
    }
    
    if (!updatedApplication) {
      console.error('Updated application not found when fetching details');
      throw new Error('Application not found after update');
    }
    
    // Ensure moonlighter property exists using profile_info and correct typing
    const result: JobApplication = {
      ...updatedApplication,
      status: updatedApplication.status as JobApplication['status'],
      moonlighter: updatedApplication.profile_info && typeof updatedApplication.profile_info === 'object' ? updatedApplication.profile_info : null,
      job: formatJobData(updatedApplication.job)
    };
    
    console.log('Updated application successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};
