
export interface PaymentMethod {
  id: string;
  user_id: string;
  method: string;
  details: string;
  is_default: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  amount: number;
  provider_id: string | null;
  moonlighter_id: string | null;
  application_id: string | null;
  created_at: string;
  updated_at: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  stripe_payment_intent_id: string | null;
}

export interface ManualPayment {
  id: string;
  amount: number;
  provider_id: string | null;
  moonlighter_id: string | null;
  job_id: string | null;
  application_id: string | null;
  payment_method_id: string | null;
  payment_method_type: string;
  payment_details: string;
  reference_number: string | null;
  notes: string | null;
  status: 'pending' | 'completed' | 'failed' | 'rejected';
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'rejected' | 'verified';
