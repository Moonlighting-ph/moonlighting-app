
import { supabase } from '@/integrations/supabase/client';
import { Payment, PaymentMethodType } from '@/types/payment';

export const recordManualPayment = async (payment: {
  provider_id: string;
  moonlighter_id: string;
  job_id: string;
  application_id: string;
  amount: number;
  payment_method_type: PaymentMethodType;
  payment_details: string;
  reference_number?: string;
  notes?: string;
}): Promise<Payment> => {
  try {
    // Insert the payment record
    const { data, error } = await supabase
      .from('manual_payments')
      .insert({
        provider_id: payment.provider_id,
        moonlighter_id: payment.moonlighter_id,
        job_id: payment.job_id,
        application_id: payment.application_id,
        amount: payment.amount,
        payment_method_type: payment.payment_method_type,
        payment_details: payment.payment_details,
        reference_number: payment.reference_number,
        notes: payment.notes,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error recording manual payment:', error);
      throw error;
    }
    
    return data as unknown as Payment;
  } catch (error) {
    console.error('Failed to record manual payment:', error);
    throw error;
  }
};

export const fetchMoonlighterPayments = async (moonlighterId: string): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        provider:profiles!manual_payments_provider_id_fkey(first_name, last_name)
      `)
      .eq('moonlighter_id', moonlighterId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching moonlighter payments:', error);
      throw error;
    }
    
    return (data || []) as unknown as Payment[];
  } catch (error) {
    console.error('Failed to fetch moonlighter payments:', error);
    return [];
  }
};

export const fetchProviderPayments = async (providerId: string): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        moonlighter:profiles!manual_payments_moonlighter_id_fkey(first_name, last_name)
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching provider payments:', error);
      throw error;
    }
    
    return (data || []) as unknown as Payment[];
  } catch (error) {
    console.error('Failed to fetch provider payments:', error);
    return [];
  }
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'completed' | 'rejected',
  userId: string,
  isProvider: boolean
): Promise<Payment> => {
  try {
    // Verify user owns the payment
    const userColumn = isProvider ? 'provider_id' : 'moonlighter_id';
    
    const { data: payment, error: fetchError } = await supabase
      .from('manual_payments')
      .select('*')
      .eq('id', paymentId)
      .eq(userColumn, userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching payment:', fetchError);
      throw fetchError;
    }
    
    if (!payment) {
      throw new Error('Payment not found or you do not have permission to update it');
    }
    
    // Update the status
    const { data, error } = await supabase
      .from('manual_payments')
      .update({ status })
      .eq('id', paymentId)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
    
    return data as unknown as Payment;
  } catch (error) {
    console.error('Failed to update payment status:', error);
    throw error;
  }
};
