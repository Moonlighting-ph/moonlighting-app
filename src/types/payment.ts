
export type PaymentMethodType = 'bank' | 'gcash' | 'paymaya' | 'card';

export interface PaymentMethod {
  id: string;
  user_id: string;
  method: PaymentMethodType;
  details: string; // JSON string containing method-specific details
  is_default: boolean;
  created_at: string;
}

export interface ManualPayment {
  id: string;
  provider_id: string;
  moonlighter_id: string;
  job_id?: string;
  application_id?: string;
  amount: number;
  payment_method_id: string;
  payment_method_type: PaymentMethodType;
  payment_details: string;
  reference_number?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at?: string;
  job?: any;
  moonlighter?: any;
}

export interface StripePayment {
  id: string;
  application_id?: string;
  amount: number;
  provider_id: string;
  moonlighter_id: string;
  stripe_payment_intent_id: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at?: string;
  currency: string;
}
