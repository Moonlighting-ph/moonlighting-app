
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

interface AddPaymentMethodParams {
  userId: string;
  method: string;
  details: string;
  isDefault?: boolean;
}

export const addPaymentMethod = async (params: AddPaymentMethodParams): Promise<PaymentMethod> => {
  try {
    const { userId, method, details, isDefault = false } = params;
    
    // If this is the first payment method or isDefault is true, make it the default
    let shouldBeDefault = isDefault;
    
    if (!isDefault) {
      // Check if this is the first payment method
      const { count, error: countError } = await supabase
        .from('payment_methods')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (countError) throw countError;
      
      // If no payment methods exist yet, make this the default
      shouldBeDefault = count === 0;
    }
    
    // Insert the new payment method
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        method: method as PaymentMethodType,
        details,
        is_default: shouldBeDefault,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as PaymentMethod;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

export const fetchUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []) as PaymentMethod[];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const setDefaultPaymentMethod = async (methodId: string, userId: string): Promise<void> => {
  try {
    // Start a transaction
    // 1. First, set all payment methods for this user to not default
    const { error: resetError } = await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    if (resetError) throw resetError;
    
    // 2. Then set the selected method as default
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

export const deletePaymentMethod = async (methodId: string, userId: string): Promise<void> => {
  try {
    // Check if this is the default method
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
    
    // If this was the default method, set a new default if other methods exist
    if (method.is_default) {
      const { data: remainingMethods, error: listError } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (listError) throw listError;
      
      if (remainingMethods && remainingMethods.length > 0) {
        await setDefaultPaymentMethod(remainingMethods[0].id, userId);
      }
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};
