
import type { Database } from "@/integrations/supabase/types";

// Define the Profile type with all required properties
export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  tin_number: string | null;
  government_id: string | null;
  document_verification_status: "pending" | "submitted" | "verified" | "rejected" | null;
};
