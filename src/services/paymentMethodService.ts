
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types/payment';

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

export const createPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id' | 'created_at'>): Promise<PaymentMethod> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(paymentMethod)
      .select()
      .single();
    
    if (error) throw error;
    
    // If this is the first payment method or it's set as default, make sure it's the only default
    if (paymentMethod.is_default) {
      // Get all other payment methods
      const { data: otherPaymentMethods } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', paymentMethod.user_id)
        .neq('id', data.id);
      
      if (otherPaymentMethods && otherPaymentMethods.length > 0) {
        // Update all other payment methods to not be default
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .in('id', otherPaymentMethods.map(pm => pm.id));
      }
    }
    
    return data as PaymentMethod;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (id: string, userId: string): Promise<void> => {
  try {
    // First check if this is the default payment method
    const { data, error } = await supabase
      .from('payment_methods')
      .select('is_default')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    // Delete the payment method
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (deleteError) throw deleteError;
    
    // If this was the default payment method, set another one as default
    if (data.is_default) {
      const { data: otherPaymentMethods, error: fetchError } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      if (otherPaymentMethods && otherPaymentMethods.length > 0) {
        const { error: updateError } = await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', otherPaymentMethods[0].id);
        
        if (updateError) throw updateError;
      }
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (id: string, userId: string): Promise<void> => {
  try {
    // First unset all defaults
    const { error: unsetError } = await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    if (unsetError) throw unsetError;
    
    // Then set the new default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};
