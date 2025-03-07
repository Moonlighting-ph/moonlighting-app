
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types/payment';

export const fetchUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }

  return data || [];
};

export const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id' | 'created_at'>): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert(paymentMethod)
    .select()
    .single();

  if (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }

  return data;
};

export const setDefaultPaymentMethod = async (userId: string, methodId: string): Promise<void> => {
  // First, set all methods for this user to non-default
  const { error: updateError } = await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error resetting default payment methods:', updateError);
    throw updateError;
  }

  // Then set the selected method as default
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', methodId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', methodId);

  if (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};
