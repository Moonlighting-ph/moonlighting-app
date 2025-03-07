
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
      .select(`
        *,
        job:jobs(*)
      `)
      .eq('job_id', jobId)
      .order('applied_date', { ascending: false });
    
    if (error) throw error;
    
    if (!applications || applications.length === 0) {
      return [];
    }
    
    // Since we now store profile_info in the application, we can use that instead of fetching profiles separately
    const applicationsWithProfiles = applications.map(app => {
      return {
        ...app,
        moonlighter: app.profile_info || null,
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
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    if (!application?.job_id) {
      throw new Error('Application not found');
    }
    
    // Verify job ownership
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('provider_id')
      .eq('id', application.job_id)
      .maybeSingle();
    
    if (jobError) throw jobError;
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    if (job.provider_id !== providerId) {
      throw new Error('You do not have permission to update this application');
    }
    
    // Update the status
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select(`
        id, job_id, moonlighter_id, notes, status, applied_date, ai_match_score, profile_info,
        job:jobs(*)
      `)
      .single();
    
    if (error) {
      console.error('Supabase error updating application:', error);
      throw new Error('Failed to update application status');
    }
    
    if (!data) {
      throw new Error('Failed to update application status');
    }
    
    // Ensure moonlighter property exists using profile_info
    const result = {
      ...data,
      moonlighter: data.profile_info || null
    };
    
    return result as JobApplication;
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
      .select(`
        *,
        job:jobs(*)
      `)
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
