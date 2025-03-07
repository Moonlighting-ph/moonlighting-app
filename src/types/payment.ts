export type PaymentMethodType = "gcash" | "paymaya" | "bank";
export type PaymentStatus = "pending" | "completed" | "failed";

export interface PaymentMethod {
  id: string;
  user_id: string;
  details: string;
  method: PaymentMethodType;
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
  payment_method_id: string;
  payment_method_type: PaymentMethodType;
  payment_details: string;
  reference_number: string;
  status: PaymentStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}
