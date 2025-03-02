
import type { Database } from "@/integrations/supabase/types";

// Extend the Profile type with the missing properties
export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  tin_number: string | null;
  government_id: string | null;
  document_verification_status: "pending" | "submitted" | "verified" | "rejected" | null;
};
