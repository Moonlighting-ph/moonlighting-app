
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment } from '@/types/payment';

export const fetchManualPayments = async (userId: string, userType: 'provider' | 'moonlighter'): Promise<ManualPayment[]> => {
  try {
    const fieldName = userType === 'provider' ? 'provider_id' : 'moonlighter_id';
    
    const { data, error } = await supabase
      .from('manual_payments')
      .select('*, job:jobs(*)')
      .eq(fieldName, userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as ManualPayment[];
  } catch (error) {
    console.error('Error fetching manual payments:', error);
    return [];
  }
};

export const recordManualPayment = async (paymentData: {
  amount: number;
  application_id: string;
  job_id?: string;
  provider_id: string;
  moonlighter_id: string;
  payment_method_id?: string;
  payment_method_type: string;
  payment_details: string;
  reference_number?: string;
  notes?: string;
}): Promise<ManualPayment> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .insert({
        amount: paymentData.amount,
        application_id: paymentData.application_id,
        job_id: paymentData.job_id,
        provider_id: paymentData.provider_id,
        moonlighter_id: paymentData.moonlighter_id,
        payment_method_id: paymentData.payment_method_id,
        payment_method_type: paymentData.payment_method_type,
        payment_details: paymentData.payment_details,
        reference_number: paymentData.reference_number,
        notes: paymentData.notes,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as ManualPayment;
  } catch (error) {
    console.error('Error recording manual payment:', error);
    throw error;
  }
};

export const fetchMoonlighterPayments = async (moonlighterId: string): Promise<ManualPayment[]> => {
  return fetchManualPayments(moonlighterId, 'moonlighter');
};

export const fetchProviderPayments = async (providerId: string): Promise<ManualPayment[]> => {
  return fetchManualPayments(providerId, 'provider');
};
