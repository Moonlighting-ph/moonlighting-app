
import type { Database } from "@/integrations/supabase/types";

// Extend the Profile type with the missing properties
export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  tin_number?: string;
  government_id?: string;
  document_verification_status?: string;
};
