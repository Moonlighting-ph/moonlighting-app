
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment, PaymentMethodType } from '@/types/payment';

interface CreateManualPaymentParams {
  provider_id: string;
  moonlighter_id: string;
  job_id: string;
  application_id?: string;
  amount: number;
  currency: string;
  payment_method_id: string;
  payment_method_type: PaymentMethodType;
  receipt_number: string;
  notes: string;
  payment_details: string;
}

export const createManualPayment = async (params: CreateManualPaymentParams): Promise<ManualPayment> => {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      provider_id: params.provider_id,
      moonlighter_id: params.moonlighter_id,
      job_id: params.job_id,
      application_id: params.application_id,
      amount: params.amount,
      currency: params.currency,
      status: 'completed',
      payment_method_id: params.payment_method_id,
      payment_method_type: params.payment_method_type,
      receipt_number: params.receipt_number,
      notes: params.notes,
      payment_details: params.payment_details,
      payment_type: 'manual'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating manual payment:', error);
    throw new Error('Failed to create payment');
  }

  return data as ManualPayment;
};

export const fetchManualPayments = async (userId: string, isProvider: boolean): Promise<ManualPayment[]> => {
  const column = isProvider ? 'provider_id' : 'moonlighter_id';
  
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq(column, userId)
    .eq('payment_type', 'manual')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching manual payments:', error);
    throw new Error('Failed to fetch payments');
  }

  return data as ManualPayment[];
};
