
export interface PaymentMethod {
  id: string;
  user_id: string;
  method: 'gcash' | 'paymaya' | 'bank';
  details: string;
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
  payment_method_id?: string;
  payment_method_type: 'gcash' | 'paymaya' | 'bank';
  payment_details: string;
  reference_number?: string;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
  created_at: string;
  updated_at: string;
}
