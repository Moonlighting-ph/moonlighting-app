
import type { Database } from "@/integrations/supabase/types";

// Base Profile type from the database
type BaseProfile = Database["public"]["Tables"]["profiles"]["Row"];

// Extended Profile type with all possible fields
export type Profile = BaseProfile & {
  tin_number: string | null;
  government_id: string | null;
  document_verification_status: "pending" | "submitted" | "verified" | "rejected" | null;
  company_address: string | null;
  facility_type: string | null;
};

// Moonlighter-specific profile type
export type MoonlighterProfile = Profile & {
  prc_license: string | null;
  work_experience: string | null;
  preferred_location: string | null;
};

// Hospital-specific profile type
export type HospitalProfile = Profile & {
  company: string | null;
  company_address: string | null;
  facility_type: string | null;
};

// Helper function to check profile type
export const isMoonlighter = (profile: Profile | null): boolean => {
  return profile?.user_type === 'medical_professional';
};

export const isHospital = (profile: Profile | null): boolean => {
  return profile?.user_type === 'medical_provider';
};
