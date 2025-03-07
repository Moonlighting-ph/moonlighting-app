
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
    
    // Format the application data with proper typing
    const application: JobApplication = {
      ...data,
      status: data.status as JobApplication['status'],
      moonlighter: data.profile_info && typeof data.profile_info === 'object' ? data.profile_info : null,
      // Ensure job properties are properly typed
      job: data.job ? {
        ...data.job,
        requirements: Array.isArray(data.job.requirements) ? data.job.requirements : 
                     (data.job.requirements ? [String(data.job.requirements)] : []),
        responsibilities: Array.isArray(data.job.responsibilities) ? data.job.responsibilities : 
                         (data.job.responsibilities ? [String(data.job.responsibilities)] : [])
      } : undefined
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
    
    // Format all applications with moonlighter data and ensure correct typing
    const applications = data.map(app => ({
      ...app,
      status: app.status as JobApplication['status'],
      moonlighter: app.profile_info && typeof app.profile_info === 'object' ? app.profile_info : null,
      // Ensure job properties are properly typed
      job: app.job ? {
        ...app.job,
        requirements: Array.isArray(app.job.requirements) ? app.job.requirements : 
                     (app.job.requirements ? [String(app.job.requirements)] : []),
        responsibilities: Array.isArray(app.job.responsibilities) ? app.job.responsibilities : 
                         (app.job.responsibilities ? [String(app.job.responsibilities)] : [])
      } : undefined
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
    
    // Format all applications with moonlighter data and ensure correct typing
    const applications = data.map(app => ({
      ...app,
      status: app.status as JobApplication['status'],
      moonlighter: app.profile_info && typeof app.profile_info === 'object' ? app.profile_info : null,
      // Ensure job properties are properly typed
      job: app.job ? {
        ...app.job,
        requirements: Array.isArray(app.job.requirements) ? app.job.requirements : 
                     (app.job.requirements ? [String(app.job.requirements)] : []),
        responsibilities: Array.isArray(app.job.responsibilities) ? app.job.responsibilities : 
                         (app.job.responsibilities ? [String(app.job.responsibilities)] : [])
      } : undefined
    }));
    
    return applications as JobApplication[];
  } catch (error) {
    console.error('Error in fetchMoonlighterApplications:', error);
    throw error;
  }
};
