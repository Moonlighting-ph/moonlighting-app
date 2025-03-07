
export interface JobFilters {
  searchTerm?: string;
  type?: string;
  location?: string;
  specialization?: string;
  experience_level?: string;
  isUrgent?: boolean;
  limit?: number;
  keyword?: string; // Adding this to maintain compatibility with useJobFilters
}
