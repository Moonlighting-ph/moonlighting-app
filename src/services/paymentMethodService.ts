
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

export const fetchUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Properly cast the method field to PaymentMethodType
    return (data || []).map(item => ({
      ...item,
      method: item.method as PaymentMethodType
    })) as PaymentMethod[];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id' | 'created_at'>): Promise<PaymentMethod | null> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(paymentMethod)
      .select()
      .single();
    
    if (error) throw error;
    
    // Properly cast the method field to PaymentMethodType
    return {
      ...data,
      method: data.method as PaymentMethodType
    } as PaymentMethod;
  } catch (error) {
    console.error('Error adding payment method:', error);
    return null;
  }
};

export const setDefaultPaymentMethod = async (userId: string, methodId: string): Promise<boolean> => {
  try {
    // First reset all to false
    const { error: resetError } = await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);
    
    if (resetError) throw resetError;
    
    // Then set selected one to true
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId)
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }
};

export const deletePaymentMethod = async (userId: string, methodId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};
