
export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  type: string;
  location?: string;
  salary?: string;
  posted_date?: string;
  deadline?: string;
  requirements?: string[];
  responsibilities?: string[];
  specialization?: string;
  experience_level?: string;
  is_urgent?: boolean;
  provider_id?: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  moonlighter_id: string;
  applied_date: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  notes?: string | null;
  ai_match_score?: number | null;
  job?: Job;
  moonlighter?: any; // Profile information
  profile_info?: any; // Additional profile information
}

// Adding this to fix the reference in the JobFilters type
export type JobFilterLimitProp = {
  limit?: number;
};
