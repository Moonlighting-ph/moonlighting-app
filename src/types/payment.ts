
export interface Payment {
  id: string;
  amount: number;
  application_id?: string | null;
  provider_id?: string | null;
  moonlighter_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  currency: string;
  status: PaymentStatus;
  stripe_payment_intent_id?: string | null;
}

export interface ManualPayment {
  id: string;
  amount: number;
  application_id?: string | null;
  provider_id?: string | null;
  moonlighter_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  job_id?: string | null;
  payment_method_id?: string | null;
  payment_method_type: string;
  payment_details: string;
  notes?: string | null;
  status?: string | null;
  reference_number?: string | null;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'rejected' | 'verified';

export interface PaymentMethod {
  id: string;
  user_id?: string | null;
  method: string;
  details: string;
  is_default?: boolean | null;
  created_at?: string | null;
}

export type PaymentMethodType = 'gcash' | 'bank_transfer' | 'cash' | 'credit_card' | 'other';

export interface PaymentMethodFormProps {
  userId: string;
  onComplete: () => Promise<void>;
}

export interface ManualPaymentFormProps {
  userId: string;
  applicationId?: string;
  jobId?: string;
  moonlighterId?: string;
  onPaymentComplete: () => void;
}
