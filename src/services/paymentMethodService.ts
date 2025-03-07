
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types/payment';

export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as PaymentMethod[];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const addPaymentMethod = async (paymentMethod: {
  user_id: string;
  method: string;
  details: string;
  is_default?: boolean;
}): Promise<PaymentMethod> => {
  try {
    // If this is set as default, first reset all other methods
    if (paymentMethod.is_default) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.user_id);
    }
    
    // Add the new payment method
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(paymentMethod)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as PaymentMethod;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (methodId: string, userId: string): Promise<void> => {
  try {
    // First check if this is the default method
    const { data: method, error: fetchError } = await supabase
      .from('payment_methods')
      .select('is_default')
      .eq('id', methodId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete the payment method
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId)
      .eq('user_id', userId);
    
    if (deleteError) throw deleteError;
    
    // If this was the default method and there are other methods, set one as default
    if (method.is_default) {
      const { data: otherMethods, error: listError } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (listError) throw listError;
      
      if (otherMethods && otherMethods.length > 0) {
        await setDefaultPaymentMethod(otherMethods[0].id, userId);
      }
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (methodId: string, userId: string): Promise<void> => {
  try {
    // First clear all default flags
    const { error: clearError } = await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    if (clearError) throw clearError;
    
    // Then set the new default
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId)
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};
