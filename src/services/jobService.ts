
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';
import { JobFilters } from '@/types/filter';
import { getUserProfile } from './profileService';

export const fetchJobs = async (filters?: JobFilters): Promise<Job[]> => {
  try {
    let query = supabase
      .from('jobs')
      .select('*');
    
    // Apply filters
    if (filters) {
      if (filters.searchTerm) {
        const searchTerm = `%${filters.searchTerm}%`;
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm},company.ilike.${searchTerm}`);
      }
      
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters.type && filters.type !== '') {
        query = query.eq('type', filters.type);
      }
      
      if (filters.specialization && filters.specialization !== '') {
        query = query.eq('specialization', filters.specialization);
      }
      
      if (filters.experience_level && filters.experience_level !== '') {
        query = query.eq('experience_level', filters.experience_level);
      }
      
      if (filters.isUrgent) {
        query = query.eq('is_urgent', true);
      }
    }
    
    const { data, error } = await query
      .order('posted_date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []) as Job[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

export const fetchJobById = async (id: string): Promise<Job | null> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as Job;
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error);
    return null;
  }
};

export const fetchProviderJobs = async (providerId: string): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('provider_id', providerId)
      .order('posted_date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []) as Job[];
  } catch (error) {
    console.error('Error fetching provider jobs:', error);
    return [];
  }
};

export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Job;
  } catch (error) {
    console.error(`Error updating job ${id}:`, error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting job ${id}:`, error);
    throw error;
  }
};

export const getRecommendedJobs = async (userId: string, limit = 5): Promise<Job[]> => {
  try {
    // Fetch the user profile to get their specialization and experience level
    const profile = await getUserProfile(userId);
    
    if (!profile || !profile.specialization) {
      // If there's no profile or specialization, return all jobs
      return await fetchJobs({ limit: limit });
    }
    
    // First try to match by specialization
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('specialization', profile.specialization)
      .order('posted_date', { ascending: false })
      .limit(limit);
    
    let { data, error } = await query;
    
    if (error) throw error;
    
    if (data && data.length >= limit) {
      return data as Job[];
    }
    
    // If we don't have enough matches by specialization, query more jobs
    const remainingLimit = limit - (data?.length || 0);
    
    if (remainingLimit > 0) {
      const { data: moreJobs, error: moreError } = await supabase
        .from('jobs')
        .select('*')
        .neq('specialization', profile.specialization) // Exclude the ones we already have
        .order('posted_date', { ascending: false })
        .limit(remainingLimit);
      
      if (moreError) throw moreError;
      
      // Combine the results
      return [...(data || []), ...(moreJobs || [])] as Job[];
    }
    
    return (data || []) as Job[];
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    return [];
  }
};

// For fallback in case supabase isn't available
export const getJobsMock = (): Job[] => {
  // Return mock data for testing
  return [
    {
      id: '1',
      title: 'Emergency Room Physician',
      company: 'Metro General Hospital',
      description: 'We need an ER doctor for weekend shifts. Must have 3+ years experience in emergency medicine.',
      type: 'Part-time',
      location: 'Manila',
      salary: '₱5,000 per shift',
      posted_date: new Date().toISOString(),
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      requirements: ['MD License', 'Board Certified', 'ACLS Certification'],
      responsibilities: ['Patient assessment', 'Emergency procedures', 'Documentation'],
      specialization: 'Emergency Medicine',
      experience_level: 'Experienced',
      is_urgent: true,
      provider_id: 'provider-123'
    },
    {
      id: '2',
      title: 'Pediatric Nurse',
      company: 'Children\'s Medical Center',
      description: 'Looking for a pediatric nurse to join our team for a 3-month contract.',
      type: 'Contract',
      location: 'Cebu',
      salary: '₱35,000 per month',
      posted_date: new Date().toISOString(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      requirements: ['RN License', '2+ years in pediatrics'],
      responsibilities: ['Patient care', 'Medication administration', 'Family education'],
      specialization: 'Pediatrics',
      experience_level: 'Intermediate',
      is_urgent: false,
      provider_id: 'provider-456'
    }
  ];
};

// Fallback function to either fetch from Supabase or return mock data
export const fetchJobsWithFallback = async (filters?: JobFilters): Promise<Job[]> => {
  try {
    // Try to fetch real jobs first
    const jobs = await fetchJobs(filters);
    if (jobs && jobs.length > 0) {
      return jobs;
    }
    // Fall back to mock data if no real jobs found
    return getJobsMock();
  } catch (error) {
    console.error('Error fetching jobs, falling back to mock data:', error);
    return getJobsMock();
  }
};
