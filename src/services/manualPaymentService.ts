
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment } from '@/types/payment';

export const createManualPayment = async (payment: Omit<ManualPayment, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ManualPayment> => {
  try {
    const paymentData = {
      ...payment,
      amount: Number(payment.amount),
      status: 'pending'
    };
    
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
      .select(`
        *,
        job:jobs(*),
        payment_method:payment_methods(*)
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
        moonlighter:profiles(*)
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

export const recordManualPayment = async (paymentData: Partial<ManualPayment>): Promise<ManualPayment> => {
  try {
    // Ensure amount is a number
    const data = {
      ...paymentData,
      amount: Number(paymentData.amount)
    };
    
    const { data: payment, error } = await supabase
      .from('manual_payments')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    
    return payment as ManualPayment;
  } catch (error) {
    console.error('Error recording manual payment:', error);
    throw error;
  }
};
