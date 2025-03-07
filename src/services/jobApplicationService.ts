
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
        ...applicationData,
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

export const fetchMoonlighterApplications = async (moonlighterId: string): Promise<JobApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job:jobs(*)
      `)
      .eq('moonlighter_id', moonlighterId)
      .order('applied_date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []) as JobApplication[];
  } catch (error) {
    console.error('Error fetching moonlighter applications:', error);
    return [];
  }
};

export const fetchJobApplications = async (jobId: string): Promise<JobApplication[]> => {
  try {
    // Fetch the applications
    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .order('applied_date', { ascending: false });
    
    if (error) throw error;
    
    if (!applications || applications.length === 0) {
      return [];
    }
    
    // Fetch moonlighter profiles
    const moonlighterIds = applications.map(app => app.moonlighter_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', moonlighterIds);
    
    if (profilesError) throw profilesError;
    
    // Combine the data
    const applicationsWithProfiles = applications.map(app => {
      const moonlighter = profiles?.find(p => p.id === app.moonlighter_id) || null;
      return {
        ...app,
        moonlighter,
        // Add profile_info if not already present
        profile_info: app.profile_info || moonlighter
      };
    });
    
    return applicationsWithProfiles as JobApplication[];
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

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
      .single();
    
    if (fetchError) throw fetchError;
    
    if (!application?.job_id) {
      throw new Error('Application not found');
    }
    
    // Verify job ownership
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('provider_id')
      .eq('id', application.job_id)
      .single();
    
    if (jobError) throw jobError;
    
    if (job?.provider_id !== providerId) {
      throw new Error('You do not have permission to update this application');
    }
    
    // Update the status
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as JobApplication;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

export const getApplicationForMoonlighter = async (
  jobId: string,
  moonlighterId: string
): Promise<JobApplication | null> => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .eq('moonlighter_id', moonlighterId)
      .maybeSingle();
    
    if (error) throw error;
    
    return data as JobApplication | null;
  } catch (error) {
    console.error('Error fetching application:', error);
    return null;
  }
};
