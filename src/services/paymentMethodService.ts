
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

// Fetch all payment methods for a user
export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
    
    // Transform to correct type
    return data.map(method => ({
      ...method,
      type: method.method as PaymentMethodType, // Add type property for compatibility
      details: method.details ? 
        (typeof method.details === 'string' ? JSON.parse(method.details) : method.details) : 
        {}
    })) as PaymentMethod[];
  } catch (error) {
    console.error('Error in fetchPaymentMethods:', error);
    throw error;
  }
};

// Create a new payment method for a user
export const createPaymentMethod = async (
  userId: string,
  methodType: PaymentMethodType,
  details: Record<string, any>,
  isDefault: boolean = false
): Promise<PaymentMethod> => {
  try {
    // Format the details as JSON string
    const formattedDetails = JSON.stringify(details);
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        method: methodType,
        details: formattedDetails,
        is_default: isDefault
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
    
    // Transform to correct type
    return {
      ...data,
      type: data.method as PaymentMethodType,
      details: typeof data.details === 'string' ? JSON.parse(data.details) : data.details
    } as PaymentMethod;
  } catch (error) {
    console.error('Error in createPaymentMethod:', error);
    throw error;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);
      
    if (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deletePaymentMethod:', error);
    throw error;
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (userId: string, methodId: string): Promise<void> => {
  try {
    // First, set all methods to non-default
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
  } catch (error) {
    console.error('Error in setDefaultPaymentMethod:', error);
    throw error;
  }
};
