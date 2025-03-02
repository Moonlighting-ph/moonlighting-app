
import React, { useState, useEffect } from 'react';

interface JobSaveManagerProps {
  children: (savedJobs: string[], toggleSaved: (jobId: string) => void) => React.ReactNode;
}

const JobSaveManager: React.FC<JobSaveManagerProps> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const toggleSaved = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  return <>{children(savedJobs, toggleSaved)}</>;
};

export default JobSaveManager;
