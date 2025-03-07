
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';

interface JobApplicationSubmission {
  job_id: string;
  moonlighter_id: string;
  notes?: string | null;
  profile_info?: any; // Include profile info
}

export const submitJobApplication = async (
  applicationData: JobApplicationSubmission
): Promise<JobApplication> => {
  try {
    // First check if the user already applied for this job
    const { data: existingApp, error: checkError } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', applicationData.job_id)
      .eq('moonlighter_id', applicationData.moonlighter_id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingApp) {
      throw new Error('You have already applied for this job');
    }
    
    // Fetch the moonlighter's profile to include in application
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', applicationData.moonlighter_id)
      .single();
      
    if (profileError) throw profileError;
    
    // If no existing application, create a new one
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: applicationData.job_id,
        moonlighter_id: applicationData.moonlighter_id,
        notes: applicationData.notes,
        applied_date: new Date().toISOString(),
        status: 'pending',
        profile_info: profileData // Include the profile info
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as JobApplication;
  } catch (error) {
    console.error('Error submitting job application:', error);
    throw error;
  }
};
