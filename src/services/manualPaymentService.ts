
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment } from '@/types/payment';

export const recordManualPayment = async (paymentData: Partial<ManualPayment>): Promise<ManualPayment> => {
  try {
    // Ensure required fields are present
    if (!paymentData.amount) {
      throw new Error('Payment amount is required');
    }
    
    if (!paymentData.payment_details || !paymentData.payment_method_type) {
      throw new Error('Payment details and method are required');
    }
    
    const { data, error } = await supabase
      .from('manual_payments')
      .insert({
        amount: paymentData.amount,
        provider_id: paymentData.provider_id,
        moonlighter_id: paymentData.moonlighter_id,
        job_id: paymentData.job_id,
        application_id: paymentData.application_id,
        payment_method_id: paymentData.payment_method_id,
        payment_details: paymentData.payment_details,
        payment_method_type: paymentData.payment_method_type,
        reference_number: paymentData.reference_number,
        notes: paymentData.notes,
        status: paymentData.status || 'pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error recording manual payment:', error);
      throw error;
    }
    
    return data as ManualPayment;
  } catch (error) {
    console.error('Error in recordManualPayment:', error);
    throw error;
  }
};

export const fetchManualPayments = async (userId: string, role: 'provider' | 'moonlighter'): Promise<ManualPayment[]> => {
  try {
    const column = role === 'provider' ? 'provider_id' : 'moonlighter_id';
    
    const { data, error } = await supabase
      .from('manual_payments')
      .select('*')
      .eq(column, userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching manual payments:', error);
      throw error;
    }
    
    return data as ManualPayment[];
  } catch (error) {
    console.error('Error in fetchManualPayments:', error);
    throw error;
  }
};
