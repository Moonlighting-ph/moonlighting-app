
export interface PaymentMethod {
  id: string;
  user_id: string;
  method: string;
  details: string;
  is_default: boolean;
  created_at: string;
  type: string;
}

export interface Payment {
  id: string;
  provider_id: string;
  moonlighter_id: string;
  application_id: string;
  amount: number;
  currency: string;
  status: string;
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ManualPayment extends Payment {
  job_id: string;
  payment_method_id: string;
  payment_method_type: string;
  payment_details: Record<string, any>;
  reference_number: string;
  receipt_url: string;
}

export interface PaymentMethodFormProps {
  userId: string;
  onComplete?: () => void;
}

export interface ManualPaymentFormProps {
  providerId: string;
  moonlighterId: string;
  jobId: string;
  applicationId: string;
  paymentMethods: PaymentMethod[];
  onComplete: () => void;
}

export type PaymentMethodType = 'bank_transfer' | 'gcash' | 'credit_card' | 'paypal';
