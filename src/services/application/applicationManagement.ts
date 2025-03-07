
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';

export const updateApplicationStatus = async (
  applicationId: string, 
  status: 'pending' | 'reviewed' | 'approved' | 'rejected',
  providerId: string
): Promise<JobApplication> => {
  try {
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
      throw new Error('Application not found');
    }
    
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
      throw new Error('Job not found');
    }
    
    if (job.provider_id !== providerId) {
      throw new Error('You do not have permission to update this application');
    }
    
    console.log(`Updating application ${applicationId} to status: ${status}`);
    
    // Update the status - separate from the fetch
    const { data: updateData, error: updateError } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select();
    
    if (updateError) {
      console.error('Supabase error updating application:', updateError);
      throw new Error('Failed to update application status');
    }
    
    if (!updateData || updateData.length === 0) {
      console.error('No rows updated');
      throw new Error('Application not found after update');
    }
    
    console.log('Update response:', updateData);
    
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
      throw new Error('Application not found after update');
    }
    
    // Ensure moonlighter property exists using profile_info
    const result = {
      ...updatedApplication,
      moonlighter: updatedApplication.profile_info || null
    };
    
    console.log('Updated application successfully:', result);
    return result as JobApplication;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};
