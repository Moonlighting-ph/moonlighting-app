
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
  notes: string | null;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'paid';
  applied_date: string;
  ai_match_score: number | null;
  profile_info?: any;
  job?: Job;
  moonlighter?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    [key: string]: any;
  } | null;
}

export type JobFilterLimitProp = {
  limit?: number;
};
