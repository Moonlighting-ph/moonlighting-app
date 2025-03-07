
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'rejected' | 'verified';

export type PaymentMethodType = 'bank_transfer' | 'gcash' | 'paymaya' | 'credit_card' | 'cash';

export interface PaymentMethod {
  id: string;
  user_id: string;
  method: PaymentMethodType;
  details: string;
  is_default: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  application_id: string;
  amount: number;
  provider_id: string;
  moonlighter_id: string;
  job_id?: string;
  created_at: string;
  updated_at: string;
  status: PaymentStatus;
  payment_method_id?: string;
  payment_method_type?: PaymentMethodType;
  payment_details?: string;
  reference_number?: string;
  notes?: string;
}

export interface ManualPaymentFormProps {
  providerId: string;
  moonlighterId: string;
  jobId: string;
  applicationId: string;
  paymentMethods: PaymentMethod[];
  onComplete: () => void;
}

export interface PaymentMethodFormProps {
  userId: string;
  onComplete: () => Promise<void>;
}
