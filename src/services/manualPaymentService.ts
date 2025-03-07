
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment, PaymentMethodType } from '@/types/payment';

interface CreateManualPaymentParams {
  amount: number;
  provider_id: string;
  moonlighter_id: string;
  job_id: string;
  application_id: string;
  payment_method_id?: string;
  payment_method_type: PaymentMethodType;
  payment_details: string;
  reference_number?: string;
  notes?: string;
}

export const createManualPayment = async (
  params: CreateManualPaymentParams
): Promise<ManualPayment> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .insert({
        amount: params.amount,
        provider_id: params.provider_id,
        moonlighter_id: params.moonlighter_id,
        job_id: params.job_id,
        application_id: params.application_id,
        payment_method_id: params.payment_method_id,
        payment_method_type: params.payment_method_type,
        payment_details: params.payment_details,
        reference_number: params.reference_number,
        notes: params.notes,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as ManualPayment;
  } catch (error) {
    console.error('Error creating manual payment:', error);
    throw error;
  }
};

export const fetchManualPaymentsByProvider = async (
  providerId: string
): Promise<ManualPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        moonlighter:profiles!manual_payments_moonlighter_id_fkey(*),
        job:jobs(*),
        application:job_applications(*)
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []) as ManualPayment[];
  } catch (error) {
    console.error('Error fetching provider manual payments:', error);
    return [];
  }
};

export const fetchManualPaymentsByMoonlighter = async (
  moonlighterId: string
): Promise<ManualPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        provider:profiles!manual_payments_provider_id_fkey(*),
        job:jobs(*),
        application:job_applications(*)
      `)
      .eq('moonlighter_id', moonlighterId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []) as ManualPayment[];
  } catch (error) {
    console.error('Error fetching moonlighter manual payments:', error);
    return [];
  }
};

export const updateManualPaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'verified' | 'rejected',
  userId: string
): Promise<ManualPayment> => {
  try {
    // First check if the user has permission to update this payment
    const { data: payment, error: fetchError } = await supabase
      .from('manual_payments')
      .select('provider_id, moonlighter_id')
      .eq('id', paymentId)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    // Only providers can verify payments, only moonlighters can reject them
    if (status === 'verified' && payment.moonlighter_id !== userId) {
      throw new Error('Only healthcare professionals can verify payments');
    }
    
    if (status === 'rejected' && payment.provider_id !== userId) {
      throw new Error('Only healthcare providers can reject payments');
    }
    
    // Update the payment status
    const { data, error } = await supabase
      .from('manual_payments')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error('Failed to update payment status');
    }
    
    // If payment is verified, update the application status to paid
    if (status === 'verified' && data.application_id) {
      const { error: appError } = await supabase
        .from('job_applications')
        .update({ status: 'paid' })
        .eq('id', data.application_id);
      
      if (appError) {
        console.error('Error updating application status:', appError);
      }
    }
    
    return data as ManualPayment;
  } catch (error) {
    console.error('Error updating manual payment status:', error);
    throw error;
  }
};
