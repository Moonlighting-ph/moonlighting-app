
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
      
      if (filters.experience) {
        query = query.eq('experience_level', filters.experience);
      }
      
      if (filters.urgent) {
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
