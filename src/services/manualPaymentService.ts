
import { supabase } from '@/integrations/supabase/client';
import { ManualPayment } from '@/types/payment';

export const recordManualPayment = async (paymentData: Omit<ManualPayment, 'id' | 'created_at' | 'updated_at'>): Promise<ManualPayment> => {
  const { data, error } = await supabase
    .from('manual_payments')
    .insert(paymentData)
    .select()
    .single();

  if (error) {
    console.error('Error recording manual payment:', error);
    throw error;
  }

  return data;
};

export const getManualPayments = async (userId: string, userType: 'provider' | 'moonlighter'): Promise<ManualPayment[]> => {
  const column = userType === 'provider' ? 'provider_id' : 'moonlighter_id';
  
  const { data, error } = await supabase
    .from('manual_payments')
    .select('*')
    .eq(column, userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching manual payments:', error);
    throw error;
  }

  // Ensure the payment_method_type is one of the valid types
  return (data || []).map(payment => ({
    ...payment,
    payment_method_type: validatePaymentMethodType(payment.payment_method_type)
  }));
};

// Helper function to validate payment method type
const validatePaymentMethodType = (type: string): 'gcash' | 'paymaya' | 'bank' => {
  const validTypes = ['gcash', 'paymaya', 'bank'] as const;
  return validTypes.includes(type as any) ? (type as 'gcash' | 'paymaya' | 'bank') : 'gcash';
};
