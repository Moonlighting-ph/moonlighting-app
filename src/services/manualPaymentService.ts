
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment, PaymentMethodType } from '@/types/payment';

export const createManualPayment = async (
  providerId: string,
  moonlighterId: string,
  jobId: string,
  applicationId: string,
  amount: number,
  methodId: string,
  methodType: PaymentMethodType,
  details: Record<string, any>,
  referenceNumber: string
): Promise<ManualPayment | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        provider_id: providerId,
        moonlighter_id: moonlighterId,
        job_id: jobId,
        application_id: applicationId,
        amount,
        currency: 'PHP',
        status: 'completed',
        payment_method_id: methodId,
        payment_method_type: methodType,
        payment_details: details,
        reference_number: referenceNumber,
        receipt_url: ''
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Cast to ManualPayment type
    return data as unknown as ManualPayment;
  } catch (error) {
    console.error('Error creating manual payment:', error);
    return null;
  }
};

export const fetchPaymentsByProvider = async (providerId: string): Promise<ManualPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('provider_id', providerId);

    if (error) {
      throw error;
    }

    // Cast to ManualPayment[] type
    return data as unknown as ManualPayment[];
  } catch (error) {
    console.error('Error fetching provider payments:', error);
    return [];
  }
};

export const fetchPaymentsByMoonlighter = async (moonlighterId: string): Promise<ManualPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('moonlighter_id', moonlighterId);

    if (error) {
      throw error;
    }

    // Cast to ManualPayment[] type
    return data as unknown as ManualPayment[];
  } catch (error) {
    console.error('Error fetching moonlighter payments:', error);
    return [];
  }
};
