
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchJobs } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Imported Components
import JobListHeader from '@/components/jobs/JobListHeader';
import JobFilters from '@/components/jobs/JobFilters';
import JobsList from '@/components/jobs/JobsList';
import JobFilterManager from '@/components/jobs/JobFilterManager';
import JobSaveManager from '@/components/jobs/JobSaveManager';
import { formatJobDeadline } from '@/utils/formatters';

const Jobs = () => {
  const [savedOnly, setSavedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([800, 2000]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { data: jobListings = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

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

  const resetFilters = () => {
    setSavedOnly(false);
    setUrgentOnly(false);
    setSearchTerm('');
    setSalaryRange([800, 2000]);
    setJobType([]);
    setSelectedLocations([]);
  };

  return (
    <div className="container px-4 py-6 md:py-8">
      <JobSaveManager>
        {(savedJobs, toggleSaved) => (
          <>
            <JobListHeader 
              title="Browse Jobs"
              subtitle="Find the perfect healthcare job opportunity"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              toggleMobileSortVisible={toggleMobileSortVisible}
              totalJobs={jobListings.length}
              filteredCount={
                <JobFilterManager
                  jobListings={jobListings}
                  searchTerm={searchTerm}
                  savedOnly={savedOnly}
                  urgentOnly={urgentOnly}
                  jobType={jobType}
                  selectedLocations={selectedLocations}
                  savedJobs={savedJobs}
                  salaryRange={salaryRange}
                >
                  {filteredJobs => filteredJobs.length}
                </JobFilterManager>
              }
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
                <JobFilterManager
                  jobListings={jobListings}
                  searchTerm={searchTerm}
                  savedOnly={savedOnly}
                  urgentOnly={urgentOnly}
                  jobType={jobType}
                  selectedLocations={selectedLocations}
                  savedJobs={savedJobs}
                  salaryRange={salaryRange}
                >
                  {filteredJobs => (
                    <JobsList
                      isLoading={isLoading}
                      error={error}
                      filteredJobs={filteredJobs}
                      savedJobs={savedJobs}
                      toggleSaved={toggleSaved}
                      resetFilters={resetFilters}
                      formatDeadline={formatJobDeadline}
                    />
                  )}
                </JobFilterManager>
              </div>
            </div>
          </>
        )}
      </JobSaveManager>
    </div>
  );
};

export default Jobs;
