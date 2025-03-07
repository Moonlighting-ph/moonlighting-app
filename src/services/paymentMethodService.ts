
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

export const fetchUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data as PaymentMethod[];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Alias for backward compatibility
export const fetchPaymentMethods = fetchUserPaymentMethods;

export const addPaymentMethod = async (
  userId: string,
  methodType: PaymentMethodType,
  details: string,
  makeDefault = false
): Promise<PaymentMethod> => {
  try {
    // If this is the first payment method or makeDefault is true, make it default
    let isDefault = makeDefault;
    
    if (!isDefault) {
      // Check if this is the first payment method for this user
      const { count, error: countError } = await supabase
        .from('payment_methods')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (countError) throw countError;
      
      if (count === 0) {
        isDefault = true;
      }
    }
    
    // If making this method default, update all other methods to not default
    if (isDefault) {
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
    }
    
    // Add the new payment method
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        method: methodType,
        details,
        is_default: isDefault,
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

export const setDefaultPaymentMethod = async (userId: string, methodId: string): Promise<void> => {
  try {
    // First set all methods to not default
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
    
    // Then set the selected method to default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId)
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (userId: string, methodId: string): Promise<void> => {
  try {
    // Check if this is the default method
    const { data, error: fetchError } = await supabase
      .from('payment_methods')
      .select('is_default')
      .eq('id', methodId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete the payment method
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // If this was the default method, set another method as default
    if (data.is_default) {
      const { data: otherMethods, error: fetchOthersError } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (fetchOthersError) throw fetchOthersError;
      
      if (otherMethods && otherMethods.length > 0) {
        const { error: updateError } = await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', otherMethods[0].id);
        
        if (updateError) throw updateError;
      }
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};
