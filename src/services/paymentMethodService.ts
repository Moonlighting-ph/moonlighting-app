
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

export interface CreatePaymentMethodParams {
  user_id: string;
  method: PaymentMethodType;
  details: string;
  is_default?: boolean;
}

export const createPaymentMethod = async (
  params: CreatePaymentMethodParams
): Promise<PaymentMethod> => {
  try {
    // Check if this should be the default method
    const shouldBeDefault = params.is_default || false;
    
    // If this payment method should be default, update all other payment methods to not be default
    if (shouldBeDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', params.user_id);
    }
    
    // Then insert the new payment method
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: params.user_id,
        method: params.method,
        details: params.details,
        is_default: shouldBeDefault,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as PaymentMethod;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as PaymentMethod[];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (methodId: string, userId: string): Promise<void> => {
  try {
    // First, set all methods to not default
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    // Then set this one as default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};
