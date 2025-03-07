
export type PaymentMethodType = 'bank_transfer' | 'gcash' | 'paymaya' | 'other';

export interface PaymentMethod {
  id: string;
  user_id: string;
  method: PaymentMethodType;
  details: string;
  is_default: boolean;
  created_at: string;
}

export interface ManualPayment {
  id: string;
  provider_id: string;
  moonlighter_id: string;
  job_id: string;
  application_id: string;
  amount: number;
  payment_method_id?: string;
  payment_method_type: PaymentMethodType;
  payment_details: string;
  reference_number?: string;
  notes?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  // Relationships
  provider?: any;
  moonlighter?: any;
  job?: any;
  application?: any;
}

export interface Payment {
  id: string;
  application_id?: string;
  amount: number;
  provider_id?: string;
  moonlighter_id?: string;
  created_at: string;
  updated_at: string;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  stripe_payment_intent_id?: string;
}
