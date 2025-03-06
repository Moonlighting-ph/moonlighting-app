
export interface License {
  id: string;
  user_id: string;
  license_number: string;
  profession: string;
  status: string;
  verification_date: string | null;
  created_at: string;
  updated_at: string;
  expiry_date?: string | null;
  document_url?: string | null;
  rejection_reason?: string | null;
  appeal_message?: string | null;
}
