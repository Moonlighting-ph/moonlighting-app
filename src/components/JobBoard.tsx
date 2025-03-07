
import React, { useEffect, useState } from 'react';
import { Job } from '@/types/job';
import { JobFilters } from '@/types/filter';
import { toast } from 'sonner';
import JobFilterForm from './JobFilterForm';
import { fetchJobsWithFallback } from '@/services/jobService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import JobList from './job/JobList';

interface JobBoardProps {
  jobs?: Job[];
  loading?: boolean;
  initialFilters?: JobFilters;
}

const JobBoard = ({ jobs: propJobs, loading: propLoading, initialFilters }: JobBoardProps) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(propLoading || true);
  const [filters, setFilters] = useState<JobFilters>(initialFilters || {});
  const [userType, setUserType] = useState<string | null>(null);

  // Initialize with either provided jobs or fetch them
  useEffect(() => {
    if (propJobs && propJobs.length > 0) {
      setJobs(propJobs);
      setFilteredJobs(propJobs);
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        // Try to fetch from Supabase first with fallback to mock data
        const data = await fetchJobsWithFallback(filters);
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast('Failed to load job listings', {
          description: 'Please try again later'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [propJobs, filters]);

  // Apply filters when they change
  useEffect(() => {
    if (jobs.length === 0) return;

    let result = [...jobs];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        job => 
          job.title.toLowerCase().includes(searchLower) || 
          job.description.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter(job => job.type === filters.type);
    }

    if (filters.location) {
      result = result.filter(
        job => job.location && job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.specialization && filters.specialization !== 'all') {
      result = result.filter(job => job.specialization === filters.specialization);
    }

    if (filters.experience_level && filters.experience_level !== 'all') {
      result = result.filter(job => job.experience_level === filters.experience_level);
    }

    if (filters.isUrgent) {
      result = result.filter(job => job.is_urgent === true);
    }

    setFilteredJobs(result);
  }, [jobs, filters]);

  // Get user type
  useEffect(() => {
    const getUserType = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user type:', error);
          return;
        }
        
        if (data) {
          setUserType(data.user_type);
        }
      } catch (err) {
        console.error('Unexpected error fetching user type:', err);
      }
    };
    
    getUserType();
  }, [session]);

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
  };

  const handleApply = (job: Job) => {
    if (!session) {
      toast('Please sign in to apply', {
        description: 'You need to be signed in as a healthcare professional to apply for jobs'
      });
      navigate('/auth/login');
      return;
    }

    if (userType !== 'moonlighter') {
      toast.error('Only healthcare professionals can apply for jobs');
      return;
    }

    // Navigate to job detail page where they can apply
    navigate(`/jobs/${job.id}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading jobs...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <JobFilterForm 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />
      </div>
      <div className="md:col-span-3">
        <JobList 
          jobs={filteredJobs} 
          userType={userType} 
          onApply={handleApply}
          onResetFilters={resetFilters}
        />
      </div>
    </div>
  );
};

export default JobBoard;
