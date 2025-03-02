
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchJobs } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Imported Components
import JobListHeader from '@/components/jobs/JobListHeader';
import JobFilters from '@/components/jobs/JobFilters';
import JobListItem from '@/components/jobs/JobListItem';
import EmptyJobsList from '@/components/jobs/EmptyJobsList';

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  urgent: boolean;
  created_at: string;
  applicants?: number;
}

const Jobs = () => {
  const [savedOnly, setSavedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([800, 2000]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { data: jobListings = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const filteredJobs = jobListings.filter((job: Job) => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !job.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (savedOnly && !savedJobs.includes(job.id)) {
      return false;
    }
    
    if (urgentOnly && !job.urgent) {
      return false;
    }
    
    if (jobType.length > 0) {
      let matchesType = false;
      for (const type of jobType) {
        if (job.type.toLowerCase().includes(type.toLowerCase())) {
          matchesType = true;
          break;
        }
      }
      if (!matchesType) return false;
    }
    
    if (selectedLocations.length > 0) {
      let matchesLocation = false;
      for (const location of selectedLocations) {
        if (job.location.toLowerCase().includes(location.toLowerCase())) {
          matchesLocation = true;
          break;
        }
      }
      if (!matchesLocation) return false;
    }
    
    return true;
  });
  
  const toggleSaved = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };
  
  const toggleMobileSortVisible = () => {
    setMobileSortVisible(!mobileSortVisible);
  };
  
  const handleJobTypeChange = (type: string) => {
    if (jobType.includes(type)) {
      setJobType(jobType.filter(t => t !== type));
    } else {
      setJobType([...jobType, type]);
    }
  };
  
  const handleLocationChange = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const formatDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Last day to apply';
    if (diffDays === 1) return '1 day left';
    if (diffDays <= 7) return `${diffDays} days left`;
    
    return `Apply by ${deadlineDate.toLocaleDateString()}`;
  };

  const resetFilters = () => {
    setSavedOnly(false);
    setUrgentOnly(false);
    setSearchTerm('');
    setSalaryRange([800, 2000]);
    setJobType([]);
    setSelectedLocations([]);
  };

  if (error) {
    return (
      <div className="container px-4 py-6 md:py-8">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Jobs</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading job listings. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 md:py-8">
      <JobListHeader 
        title="Browse Jobs"
        subtitle="Find the perfect healthcare job opportunity"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        toggleMobileSortVisible={toggleMobileSortVisible}
        totalJobs={jobListings.length}
        filteredCount={filteredJobs.length}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <div className="md:col-span-3 lg:col-span-3 hidden md:block">
          {!isMobile && (
            <JobFilters
              isMobile={false}
              savedOnly={savedOnly}
              setSavedOnly={setSavedOnly}
              urgentOnly={urgentOnly}
              setUrgentOnly={setUrgentOnly}
              salaryRange={salaryRange}
              setSalaryRange={setSalaryRange}
              jobType={jobType}
              handleJobTypeChange={handleJobTypeChange}
              selectedLocations={selectedLocations}
              handleLocationChange={handleLocationChange}
              toggleMobileSortVisible={toggleMobileSortVisible}
            />
          )}
        </div>
        
        {mobileSortVisible && (
          <JobFilters
            isMobile={true}
            savedOnly={savedOnly}
            setSavedOnly={setSavedOnly}
            urgentOnly={urgentOnly}
            setUrgentOnly={setUrgentOnly}
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
            jobType={jobType}
            handleJobTypeChange={handleJobTypeChange}
            selectedLocations={selectedLocations}
            handleLocationChange={handleLocationChange}
            toggleMobileSortVisible={toggleMobileSortVisible}
          />
        )}
        
        <div className="md:col-span-9 lg:col-span-9 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading jobs...</span>
            </div>
          ) : filteredJobs.length > 0 ? (
            <>
              {filteredJobs.map((job: Job) => (
                <JobListItem 
                  key={job.id}
                  job={job}
                  isSaved={savedJobs.includes(job.id)}
                  toggleSaved={toggleSaved}
                  formatDeadline={formatDeadline}
                />
              ))}
              
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="text-xs md:text-sm h-8 md:h-9">
                  Load More Jobs
                </Button>
              </div>
            </>
          ) : (
            <EmptyJobsList resetFilters={resetFilters} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
