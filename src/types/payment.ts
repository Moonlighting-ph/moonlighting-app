
export interface PaymentMethod {
  id: string;
  user_id?: string;
  method: string;
  details: string | {
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    phone?: string;
    [key: string]: any;
  };
  is_default?: boolean;
  created_at?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  created_at?: string;
  updated_at?: string;
  stripe_payment_intent_id?: string;
  application_id?: string;
  provider_id?: string;
  moonlighter_id?: string;
  receipt_url?: string;
}

export interface ManualPayment {
  id: string;
  amount: number;
  payment_method_type: string;
  payment_details: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  reference_number?: string;
  notes?: string;
  application_id?: string;
  job_id?: string;
  provider_id?: string;
  moonlighter_id?: string;
  payment_method_id?: string;
  receipt_url?: string;
}

export interface ManualPaymentFormProps {
  providerId: string;
  moonlighterId: string;
  jobId: string;
  applicationId: string;
  paymentMethods: PaymentMethod[];
  onComplete?: () => void;
}

export interface StripePaymentFormProps {
  amount: number;
  currency: string;
  jobTitle: string;
  payeeName: string;
  applicationId: string;
  providerId: string;
  moonlighterId: string;
}
