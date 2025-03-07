
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types/payment';

export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
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
    console.error('Error in fetchPaymentMethods:', error);
    throw error;
  }
};

export const createPaymentMethod = async (userId: string, method: string, details: string, isDefault: boolean = false): Promise<PaymentMethod> => {
  try {
    // If setting as default, first set all existing methods to non-default
    if (isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        method,
        details,
        is_default: isDefault
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
    
    return data as PaymentMethod;
  } catch (error) {
    console.error('Error in createPaymentMethod:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deletePaymentMethod:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (id: string, userId: string): Promise<void> => {
  try {
    // First, set all methods to non-default
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    // Then set the specific one as default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in setDefaultPaymentMethod:', error);
    throw error;
  }
};
