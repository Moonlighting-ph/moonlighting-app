
export type PaymentMethodType = 'gcash' | 'paymaya' | 'bank' | 'bank_account' | 'credit_card' | 'paypal';

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
  type: PaymentMethodType;
}

export interface Payment {
  id: string;
  amount: number;
  application_id?: string;
  provider_id?: string;
  moonlighter_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
  currency: string;
  receipt_url?: string;
  stripe_payment_intent_id?: string;
}

export interface ManualPayment {
  id?: string;
  amount: number;
  provider_id?: string;
  moonlighter_id?: string;
  job_id?: string;
  application_id?: string;
  payment_method_id?: string;
  payment_method_type: PaymentMethodType;
  payment_details: string | {
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    phone?: string;
    [key: string]: any;
  };
  reference_number?: string;
  notes?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  receipt_url?: string;
}

export interface PaymentMethodFormProps {
  onSuccess?: (method: PaymentMethod) => void;
  onCancel?: () => void;
}

export interface ManualPaymentFormProps {
  providerId: string;
  moonlighterId: string;
  jobId: string;
  applicationId: string;
  paymentMethods?: PaymentMethod[];
  onSuccess?: (payment: ManualPayment) => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

export interface StripePaymentFormProps {
  amount: number;
  currency: string;
  jobTitle: string;
  payeeName: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
}
