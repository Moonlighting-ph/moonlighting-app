
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment, PaymentMethodType } from '@/types/payment';

export interface ManualPaymentParams {
  provider_id: string;
  moonlighter_id: string;
  job_id: string;
  application_id: string;
  amount: number;
  payment_method_id: string;
  payment_method_type: PaymentMethodType;
  payment_details: string;
  reference_number: string;
  notes?: string;
}

export const recordManualPayment = async (params: ManualPaymentParams): Promise<ManualPayment> => {
  try {
    // First check if there's already a payment for this application
    const { data: existingPayment, error: checkError } = await supabase
      .from('manual_payments')
      .select('id')
      .eq('application_id', params.application_id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingPayment) {
      throw new Error('A payment has already been recorded for this application');
    }
    
    // Create the payment record
    const { data, error } = await supabase
      .from('manual_payments')
      .insert({
        provider_id: params.provider_id,
        moonlighter_id: params.moonlighter_id,
        job_id: params.job_id,
        application_id: params.application_id,
        amount: params.amount,
        payment_method_id: params.payment_method_id,
        payment_method_type: params.payment_method_type,
        payment_details: params.payment_details,
        reference_number: params.reference_number,
        notes: params.notes,
        status: 'completed',
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update job application status to 'paid'
    const { error: updateError } = await supabase
      .from('job_applications')
      .update({ status: 'paid' })
      .eq('id', params.application_id);
    
    if (updateError) {
      console.error('Error updating application status:', updateError);
      // We don't throw here as the payment is already recorded
    }
    
    return data as ManualPayment;
  } catch (error) {
    console.error('Error recording manual payment:', error);
    throw error;
  }
};

export const fetchMoonlighterPayments = async (moonlighterId: string): Promise<ManualPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        job:jobs(id, title, company)
      `)
      .eq('moonlighter_id', moonlighterId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as ManualPayment[];
  } catch (error) {
    console.error('Error fetching moonlighter payments:', error);
    return [];
  }
};

export const fetchProviderPayments = async (providerId: string): Promise<ManualPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        job:jobs(id, title, company),
        moonlighter:profiles(id, first_name, last_name)
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as ManualPayment[];
  } catch (error) {
    console.error('Error fetching provider payments:', error);
    return [];
  }
};
