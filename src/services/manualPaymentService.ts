
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment } from '@/types/payment';
import { PaymentMethodType } from '@/types/payment';

export const recordManualPayment = async (
  providerId: string,
  moonlighterId: string,
  applicationId: string | null,
  jobId: string | null,
  amount: number,
  paymentMethodId: string | null,
  paymentMethodType: PaymentMethodType,
  paymentDetails: string,
  notes?: string | null,
  referenceNumber?: string | null
): Promise<ManualPayment> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .insert({
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        application_id: applicationId,
        job_id: jobId,
        amount,
        payment_method_id: paymentMethodId,
        payment_method_type: paymentMethodType,
        payment_details: paymentDetails,
        notes,
        reference_number: referenceNumber,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // If this payment is for a job application, update the job application status
    if (applicationId) {
      const { error: updateError } = await supabase
        .from('job_applications')
        .update({ status: 'paid' })
        .eq('id', applicationId);
      
      if (updateError) {
        console.error('Error updating job application status:', updateError);
        // We don't throw here because the payment was already recorded
      }
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
        job:jobs(*),
        application:job_applications(*)
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
        job:jobs(*),
        application:job_applications(*),
        moonlighter:profiles!manual_payments_moonlighter_id_fkey(*)
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

export const updatePaymentStatus = async (
  paymentId: string, 
  status: 'pending' | 'verified' | 'rejected'
): Promise<ManualPayment> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', paymentId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as ManualPayment;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
