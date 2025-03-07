
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';

// Fetch a specific application for a moonlighter
export const getApplicationForMoonlighter = async (jobId: string, moonlighterId: string): Promise<JobApplication | null> => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        id, job_id, moonlighter_id, notes, status, applied_date, ai_match_score, profile_info,
        job:jobs(*)
      `)
      .eq('job_id', jobId)
      .eq('moonlighter_id', moonlighterId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Format the application data
    const application: JobApplication = {
      ...data,
      moonlighter: data.profile_info
    };
    
    return application;
  } catch (error) {
    console.error('Error in getApplicationForMoonlighter:', error);
    throw error;
  }
};

// Fetch all applications for a specific job
export const fetchJobApplications = async (jobId: string): Promise<JobApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        id, job_id, moonlighter_id, notes, status, applied_date, ai_match_score, profile_info,
        job:jobs(*)
      `)
      .eq('job_id', jobId);
      
    if (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
    
    // Format all applications with moonlighter data
    const applications = data.map(app => ({
      ...app,
      moonlighter: app.profile_info
    }));
    
    return applications as JobApplication[];
  } catch (error) {
    console.error('Error in fetchJobApplications:', error);
    throw error;
  }
};

// Fetch all applications for a moonlighter
export const fetchMoonlighterApplications = async (moonlighterId: string): Promise<JobApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        id, job_id, moonlighter_id, notes, status, applied_date, ai_match_score, profile_info,
        job:jobs(*)
      `)
      .eq('moonlighter_id', moonlighterId)
      .order('applied_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching moonlighter applications:', error);
      throw error;
    }
    
    // Format all applications with moonlighter data
    const applications = data.map(app => ({
      ...app,
      moonlighter: app.profile_info
    }));
    
    return applications as JobApplication[];
  } catch (error) {
    console.error('Error in fetchMoonlighterApplications:', error);
    throw error;
  }
};
