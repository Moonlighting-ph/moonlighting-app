
// Add missing PaymentMethodType type to fix build errors

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  provider_id: string;
  moonlighter_id: string;
}

export interface ManualPayment extends Payment {
  job_id: string;
  payment_method_id: string;
  payment_method_type: PaymentMethodType;
  payment_details: string;
  receipt_number: string;
  notes: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: PaymentMethodType;
  details: {
    [key: string]: any;
  };
  is_default: boolean;
  created_at: string;
}

export type PaymentMethodType = 'bank_account' | 'gcash' | 'paymaya' | 'credit_card';

export interface PaymentMethodFormProps {
  onSuccess: (paymentMethod: PaymentMethod) => void;
  onCancel: () => void;
}

export interface ManualPaymentFormProps {
  onSuccess: (payment: ManualPayment) => void;
  onCancel: () => void;
}
