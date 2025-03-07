
import React, { useEffect, useState } from 'react';
import { Job } from '@/types/job';
import { JobFilters } from '@/types/filter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import JobFilterForm from './JobFilterForm';
import { fetchJobsWithFallback, getJobsMock } from '@/services/jobService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

    if (filters.type) {
      result = result.filter(job => job.type === filters.type);
    }

    if (filters.location) {
      result = result.filter(
        job => job.location && job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.specialization) {
      result = result.filter(job => job.specialization === filters.specialization);
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

  const handleViewJob = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading jobs...</div>;
  }

  if (!filteredJobs || filteredJobs.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <JobFilterForm 
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </div>
        <div className="md:col-span-3 p-8 text-center bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
          <Button onClick={resetFilters} variant="link" className="mt-2">
            Reset Filters
          </Button>
        </div>
      </div>
    );
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
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="h-full flex flex-col">
              <CardHeader className="cursor-pointer" onClick={() => handleViewJob(job)}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                  {job.is_urgent && (
                    <Badge variant="destructive" className="ml-2">Urgent</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow cursor-pointer" onClick={() => handleViewJob(job)}>
                <p className="mb-4 text-sm line-clamp-3">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{job.type}</Badge>
                  {job.specialization && <Badge variant="secondary">{job.specialization}</Badge>}
                  {job.experience_level && (
                    <Badge variant="outline" className="bg-blue-50">
                      {job.experience_level}
                    </Badge>
                  )}
                </div>
                {job.location && <p className="text-sm text-gray-500 mb-1">📍 {job.location}</p>}
                {job.salary && <p className="text-sm text-gray-500 mb-1">💰 {job.salary}</p>}
                {job.posted_date && (
                  <p className="text-xs text-gray-400 mt-2">
                    Posted {new Date(job.posted_date).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleViewJob(job)}
                >
                  View Details
                </Button>
                {userType === 'moonlighter' && (
                  <Button 
                    onClick={() => handleApply(job)} 
                    className="flex-1"
                  >
                    Apply Now
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
