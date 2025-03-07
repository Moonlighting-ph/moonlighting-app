
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

export const createPaymentMethod = async (
  method: PaymentMethodType,
  details: string | any,
  userId: string,
  isDefault: boolean = false
): Promise<PaymentMethod> => {
  try {
    // If setting this as default, first update any existing default methods
    if (isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    // Insert the new payment method
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : details;
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        method,
        details: detailsStr,
        user_id: userId,
        is_default: isDefault
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment method:', error);
      throw new Error('Failed to create payment method');
    }

    return data as PaymentMethod;
  } catch (error) {
    console.error('Error in createPaymentMethod:', error);
    throw error;
  }
};

export const getUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }

    return data.map(method => {
      try {
        // Try to parse the details if it's a JSON string
        const parsedDetails = typeof method.details === 'string' 
          ? JSON.parse(method.details) 
          : method.details;
        
        return {
          ...method,
          details: parsedDetails
        };
      } catch (e) {
        // If parsing fails, just return the original details
        return method;
      }
    }) as PaymentMethod[];
  } catch (error) {
    console.error('Error in getUserPaymentMethods:', error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (methodId: string, userId: string): Promise<void> => {
  try {
    // First, set all payment methods for this user to non-default
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Then set the selected one as default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', methodId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting default payment method:', error);
      throw new Error('Failed to set default payment method');
    }
  } catch (error) {
    console.error('Error in setDefaultPaymentMethod:', error);
    throw error;
  }
};

export const deletePaymentMethod = async (methodId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting payment method:', error);
      throw new Error('Failed to delete payment method');
    }
  } catch (error) {
    console.error('Error in deletePaymentMethod:', error);
    throw error;
  }
};
