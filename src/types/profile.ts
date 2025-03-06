
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  user_type: "provider" | "moonlighter" | "admin";
  created_at: string;
  updated_at: string;
  specialization?: string | null;
  years_of_experience?: number | null;
  bio?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  postal_code?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
}
