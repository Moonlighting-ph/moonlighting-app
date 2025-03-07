
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment } from '@/types/payment';

export const createManualPayment = async (paymentData: Partial<ManualPayment>): Promise<ManualPayment> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;
    return data as ManualPayment;
  } catch (error) {
    console.error('Error creating manual payment:', error);
    throw error;
  }
};

export const fetchMoonlighterPayments = async (moonlighterId: string): Promise<ManualPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .select('*')
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
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ManualPayment[];
  } catch (error) {
    console.error('Error fetching provider payments:', error);
    return [];
  }
};

export const updateManualPaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'completed' | 'failed',
  notes?: string
): Promise<ManualPayment> => {
  try {
    const updates: Partial<ManualPayment> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from('manual_payments')
      .update(updates)
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

export const getManualPaymentById = async (paymentId: string): Promise<ManualPayment | null> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) throw error;
    return data as ManualPayment;
  } catch (error) {
    console.error('Error fetching payment by id:', error);
    return null;
  }
};
