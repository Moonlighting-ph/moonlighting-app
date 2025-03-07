
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';

export const fetchMoonlighterApplications = async (moonlighterId: string): Promise<JobApplication[]> => {
  try {
    console.log(`Fetching applications for moonlighter: ${moonlighterId}`);
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job:jobs(*)
      `)
      .eq('moonlighter_id', moonlighterId)
      .order('applied_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching moonlighter applications:', error);
      throw error;
    }
    
    console.log('Fetched moonlighter applications:', data);
    
    // Process the applications to ensure we have the proper moonlighter property
    const processedApplications = (data || []).map(app => {
      return {
        ...app,
        moonlighter: app.profile_info || null
      };
    });
    
    return processedApplications as JobApplication[];
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

export const getApplicationForMoonlighter = async (
  jobId: string,
  moonlighterId: string
): Promise<JobApplication | null> => {
  try {
    console.log(`Fetching application for moonlighter ${moonlighterId} and job ${jobId}`);
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job:jobs(*)
      `)
      .eq('job_id', jobId)
      .eq('moonlighter_id', moonlighterId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
    
    console.log('Fetched moonlighter application:', data);
    
    if (data) {
      return {
        ...data,
        moonlighter: data.profile_info || null
      } as JobApplication;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching application:', error);
    return null;
  }
};
