
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment } from '@/types/payment';

export const createManualPayment = async (paymentData: Omit<ManualPayment, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('manual_payments')
    .insert({
      ...paymentData,
      status: 'completed'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Add the missing function
export const recordManualPayment = createManualPayment;

export const getManualPayments = async (userId: string, type: 'moonlighter' | 'provider') => {
  const field = type === 'moonlighter' ? 'moonlighter_id' : 'provider_id';
  
  const { data, error } = await supabase
    .from('manual_payments')
    .select('*, payment_methods(*)')
    .eq(field, userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
