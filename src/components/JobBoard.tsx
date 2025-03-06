
import React, { useEffect, useState } from 'react';
import { Job } from '@/types/job';
import { JobFilters } from '@/types/filter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import JobFilterForm from './JobFilterForm';
import { getMockJobs, getJobs } from '@/services/jobService';

interface JobBoardProps {
  jobs?: Job[];
  loading?: boolean;
}

const JobBoard = ({ jobs: propJobs, loading: propLoading }: JobBoardProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(propLoading || true);
  const [filters, setFilters] = useState<JobFilters>({});

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
        // Try to fetch from Supabase first
        try {
          const data = await getJobs();
          setJobs(data);
          setFilteredJobs(data);
        } catch (error) {
          // If table doesn't exist or other Supabase error, use mock data
          console.log('Using mock jobs data instead:', error);
          const mockData = getMockJobs();
          setJobs(mockData);
          setFilteredJobs(mockData);
        }
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
  }, [propJobs]);

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

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
  };

  const handleApply = (job: Job) => {
    toast(`Applied for ${job.title} at ${job.company}`, {
      description: 'Your application has been submitted'
    });
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
              <CardHeader>
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
              <CardContent className="flex-grow">
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
              <CardFooter className="border-t pt-4">
                <Button onClick={() => handleApply(job)} className="w-full">
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
