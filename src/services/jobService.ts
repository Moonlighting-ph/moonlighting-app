
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';
import { JobFilters } from '@/types/filter';

export const getJobs = async (filters?: JobFilters) => {
  try {
    let query = supabase
      .from('jobs')
      .select('*')
      .order('posted_date', { ascending: false });

    // Apply filters if they exist
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.specialization) {
      query = query.eq('specialization', filters.specialization);
    }

    if (filters?.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
    }

    if (filters?.isUrgent) {
      query = query.eq('is_urgent', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }

    return data as Job[];
  } catch (error) {
    console.error('Unexpected error fetching jobs:', error);
    throw error;
  }
};

// Get a single job by ID
export const getJobById = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Error fetching job:', error);
      throw error;
    }

    return data as Job;
  } catch (error) {
    console.error('Unexpected error fetching job:', error);
    throw error;
  }
};

// Mock data for development until the jobs table is created in Supabase
export const getMockJobs = (): Job[] => {
  return [
    {
      id: '1',
      title: 'Emergency Room Nurse',
      company: 'Manila General Hospital',
      description: 'Experienced ER nurse needed for night shift. Must have at least 2 years of experience in emergency care.',
      type: 'Full-time',
      location: 'Manila',
      salary: '₱35,000 - ₱45,000',
      posted_date: new Date().toISOString(),
      specialization: 'Nursing',
      experience_level: 'Intermediate',
      is_urgent: true,
      requirements: ['BSN Degree', 'PRC License', '2+ years ER experience'],
      responsibilities: ['Patient assessment', 'Administering medication', 'Coordinating with doctors']
    },
    {
      id: '2',
      title: 'Pediatric Specialist',
      company: 'Children\'s Medical Center',
      description: 'Looking for a compassionate pediatric specialist to join our growing team.',
      type: 'Part-time',
      location: 'Quezon City',
      salary: '₱50,000 - ₱65,000',
      posted_date: new Date().toISOString(),
      specialization: 'Pediatrics',
      experience_level: 'Senior',
      requirements: ['MD with Pediatric specialization', 'Board Certified', '5+ years experience'],
      responsibilities: ['Patient diagnosis', 'Treatment planning', 'Family consultations']
    },
    {
      id: '3',
      title: 'Medical Technologist',
      company: 'National Diagnostic Center',
      description: 'Medical technologist needed for our laboratory division.',
      type: 'Contract',
      location: 'Cebu',
      salary: '₱25,000 - ₱30,000',
      posted_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      specialization: 'Laboratory',
      experience_level: 'Entry-level',
      requirements: ['BS Medical Technology', 'PRC License', 'Fresh graduates welcome'],
      responsibilities: ['Sample processing', 'Test performing', 'Result documentation']
    }
  ];
};

// Apply to a job
export const applyToJob = async (jobId: string, notes?: string) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        moonlighter_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
        notes: notes
      })
      .select()
      .single();

    if (error) {
      console.error('Error applying to job:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error applying to job:', error);
    throw error;
  }
};

// Get applications for a specific job
export const getJobApplications = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles:moonlighter_id (
          id,
          first_name,
          last_name,
          email,
          phone,
          specialization,
          years_of_experience
        )
      `)
      .eq('job_id', jobId);

    if (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching job applications:', error);
    throw error;
  }
};

// Get applications for a moonlighter
export const getMoonlighterApplications = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs:job_id (*)
      `)
      .eq('moonlighter_id', userData.user.id);

    if (error) {
      console.error('Error fetching moonlighter applications:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching moonlighter applications:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (applicationId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating application status:', error);
    throw error;
  }
};
