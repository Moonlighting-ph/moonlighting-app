
import { useState, useCallback, useMemo } from 'react';

export type JobFilters = {
  keyword: string;
  location: string;
  specialization: string;
  payRange: [number, number];
  urgentOnly: boolean;
  dateRange: [Date | null, Date | null];
};

export const useJobFilters = <T extends Record<string, any>>(
  jobs: T[],
  filterFn: (job: T, filters: JobFilters) => boolean
) => {
  const [filters, setFilters] = useState<JobFilters>({
    keyword: '',
    location: '',
    specialization: '',
    payRange: [0, 5000],
    urgentOnly: false,
    dateRange: [null, null],
  });

  const updateFilter = useCallback(<K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      keyword: '',
      location: '',
      specialization: '',
      payRange: [0, 5000],
      urgentOnly: false,
      dateRange: [null, null],
    });
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => filterFn(job, filters));
  }, [jobs, filters, filterFn]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredJobs
  };
};

// Default job filter function that can be customized by consumers
export const defaultJobFilter = <T extends Record<string, any>>(job: T, filters: JobFilters): boolean => {
  const { keyword, location, specialization, payRange, urgentOnly, dateRange } = filters;

  // Keyword search (title, facility, description)
  const keywordMatch = !keyword || 
    (job.title && job.title.toLowerCase().includes(keyword.toLowerCase())) ||
    (job.facility && job.facility.toLowerCase().includes(keyword.toLowerCase())) ||
    (job.description && job.description.toLowerCase().includes(keyword.toLowerCase()));

  // Location filter
  const locationMatch = !location || 
    (job.location && job.location.toLowerCase().includes(location.toLowerCase()));

  // Specialization filter
  const specializationMatch = !specialization || 
    (job.specialization && job.specialization === specialization);

  // Pay range filter (if job has hourlyRate, rate, or pay field)
  const payRateField = job.hourlyRate || job.rate || job.pay;
  let payRateValue = 0;

  if (typeof payRateField === 'number') {
    payRateValue = payRateField;
  } else if (typeof payRateField === 'string') {
    // Try to extract numeric value from string like "₱1,500/hr"
    const match = payRateField.match(/₱?([\d,]+)/);
    if (match) {
      payRateValue = parseFloat(match[1].replace(/,/g, ''));
    }
  }

  const payRangeMatch = payRateValue >= payRange[0] && payRateValue <= payRange[1];

  // Urgent only filter
  const urgentMatch = !urgentOnly || (job.urgent === true);

  // Date range filter
  let dateMatch = true;
  if (dateRange[0] || dateRange[1]) {
    const jobDate = job.date ? new Date(job.date) : null;
    if (jobDate) {
      if (dateRange[0] && dateRange[1]) {
        dateMatch = jobDate >= dateRange[0] && jobDate <= dateRange[1];
      } else if (dateRange[0]) {
        dateMatch = jobDate >= dateRange[0];
      } else if (dateRange[1]) {
        dateMatch = jobDate <= dateRange[1];
      }
    } else {
      dateMatch = false;
    }
  }

  return keywordMatch && locationMatch && specializationMatch && payRangeMatch && urgentMatch && dateMatch;
};
