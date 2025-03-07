
export type PaymentMethodType = 'bank_account' | 'gcash' | 'paymaya' | 'bank_transfer' | 'credit_card' | 'paypal';

export interface PaymentMethod {
  id: string;
  method: PaymentMethodType;
  details: string | {
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    phone?: string;
    [key: string]: any;
  };
  user_id?: string;
  is_default?: boolean;
  created_at?: string;
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
}

export interface PaymentMethodFormProps {
  onSuccess?: (method: PaymentMethod) => void;
  onCancel?: () => void;
}

export interface ManualPaymentFormProps {
  jobId?: string;
  applicationId?: string;
  providerId?: string;
  moonlighterId?: string;
  amount?: number;
  onSuccess?: (payment: ManualPayment) => void;
  onCancel?: () => void;
}

export interface StripePaymentFormProps {
  amount: number;
  currency: string;
  jobTitle: string;
  payeeName: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: any) => void;
}
