
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment, PaymentMethodType, PaymentStatus } from '@/types/payment';

export const recordManualPayment = async (paymentData: Omit<ManualPayment, 'id' | 'created_at' | 'updated_at'>): Promise<ManualPayment | null> => {
  try {
    const { data, error } = await supabase
      .from('manual_payments')
      .insert(paymentData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Cast to the correct types
    return {
      ...data,
      payment_method_type: data.payment_method_type as PaymentMethodType,
      status: data.status as PaymentStatus
    } as ManualPayment;
  } catch (error) {
    console.error('Error recording manual payment:', error);
    return null;
  }
};

export const getManualPayments = async (userId: string, userType: 'provider' | 'moonlighter'): Promise<ManualPayment[]> => {
  try {
    const field = userType === 'provider' ? 'provider_id' : 'moonlighter_id';
    
    const { data, error } = await supabase
      .from('manual_payments')
      .select('*')
      .eq(field, userId);
    
    if (error) throw error;
    
    // Cast the data to the correct types
    return (data || []).map(item => ({
      ...item,
      payment_method_type: item.payment_method_type as PaymentMethodType,
      status: item.status as PaymentStatus
    })) as ManualPayment[];
  } catch (error) {
    console.error('Error fetching manual payments:', error);
    return [];
  }
};
