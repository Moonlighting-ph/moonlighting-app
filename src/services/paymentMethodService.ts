
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

export const fetchUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    
    if (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
    
    return data as PaymentMethod[];
  } catch (error) {
    console.error('Error in fetchUserPaymentMethods:', error);
    return [];
  }
};

// Alias for backward compatibility
export const fetchPaymentMethods = fetchUserPaymentMethods;

export const addPaymentMethod = async (
  userId: string,
  method: PaymentMethodType,
  details: string,
  makeDefault = false
): Promise<PaymentMethod> => {
  try {
    // If this is the default method, first clear any existing defaults
    if (makeDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }
    
    // Then add the new payment method
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        method,
        details,
        is_default: makeDefault
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as PaymentMethod;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (methodId: string, userId: string): Promise<void> => {
  try {
    // First clear any existing defaults
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    // Then set the new default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};
