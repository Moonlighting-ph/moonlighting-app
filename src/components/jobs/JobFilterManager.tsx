
import React, { useState, useEffect } from 'react';

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

interface JobFilterManagerProps {
  jobListings: Job[];
  searchTerm: string;
  savedOnly: boolean;
  urgentOnly: boolean;
  jobType: string[];
  selectedLocations: string[];
  savedJobs: string[];
  salaryRange: [number, number];
  children: (filteredJobs: Job[]) => React.ReactNode;
}

const JobFilterManager: React.FC<JobFilterManagerProps> = ({ 
  jobListings,
  searchTerm,
  savedOnly,
  urgentOnly,
  jobType,
  selectedLocations,
  savedJobs,
  salaryRange,
  children
}) => {
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

  return <>{children(filteredJobs)}</>;
};

export default JobFilterManager;
