
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
}
