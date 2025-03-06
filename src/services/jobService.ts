
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';
import { JobFilters } from '@/types/filter';

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
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.specialization) {
        query = query.eq('specialization', filters.specialization);
      }
      
      if (filters.experience_level) {
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

// Renamed from getMockJobs to getJobsMock for clarity
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

// Renamed from getJobs to fetchJobsWithFallback
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
