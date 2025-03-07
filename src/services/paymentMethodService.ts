
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment methods:', error);
    throw new Error('Failed to fetch payment methods');
  }

  return data || [];
};

export const createPaymentMethod = async (
  userId: string,
  type: PaymentMethodType,
  details: Record<string, any>,
  isDefault: boolean = false
): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: userId,
      type,
      details,
      is_default: isDefault
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating payment method:', error);
    throw new Error('Failed to create payment method');
  }

  return data;
};

export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', methodId);

  if (error) {
    console.error('Error deleting payment method:', error);
    throw new Error('Failed to delete payment method');
  }
};
