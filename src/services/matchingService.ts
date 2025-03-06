
import { supabase } from '@/integrations/supabase/client';

export interface MatchResult {
  matchScore: number;
  application: {
    id: string;
    job_id: string;
    moonlighter_id: string;
    status: string;
    applied_date: string;
    notes: string | null;
    ai_match_score: number;
  };
}

// Generate an AI match score for a job and moonlighter
export const generateMatchScore = async (
  jobId: string,
  moonlighterId: string
): Promise<MatchResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('job-matching', {
      body: {
        jobId,
        moonlighterId,
      },
    });

    if (error) {
      console.error('Error generating match score:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error generating match score:', error);
    throw error;
  }
};

// Get match scores for all applications to a job
export const getJobApplicationMatchScores = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        id,
        job_id,
        moonlighter_id,
        status,
        applied_date,
        ai_match_score,
        profiles:moonlighter_id (
          first_name,
          last_name,
          specialization,
          years_of_experience
        )
      `)
      .eq('job_id', jobId);

    if (error) {
      console.error('Error fetching job application match scores:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching job application match scores:', error);
    throw error;
  }
};

// Get match scores for a moonlighter's applications
export const getMoonlighterMatchScores = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        id,
        job_id,
        moonlighter_id,
        status,
        applied_date,
        ai_match_score,
        jobs:job_id (
          title,
          company,
          specialization,
          experience_level
        )
      `)
      .eq('moonlighter_id', userData.user.id);

    if (error) {
      console.error('Error fetching moonlighter match scores:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching moonlighter match scores:', error);
    throw error;
  }
};
