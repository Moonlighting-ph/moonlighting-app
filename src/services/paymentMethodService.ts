
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';

export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    // Add the type property to match the PaymentMethod interface
    return data.map(method => ({
      ...method,
      type: method.method as PaymentMethodType // Add the missing type property
    })) as PaymentMethod[];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

// Create an alias for compatibility with existing code
export const fetchUserPaymentMethods = fetchPaymentMethods;

export const addPaymentMethod = async (
  userId: string, 
  type: PaymentMethodType, 
  details: Record<string, any>
): Promise<PaymentMethod | null> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        method: type,
        details: JSON.stringify(details),
        is_default: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add the type property to match the PaymentMethod interface
    return { ...data, type: data.method as PaymentMethodType } as PaymentMethod;
  } catch (error) {
    console.error('Error adding payment method:', error);
    return null;
  }
};

export const deletePaymentMethod = async (methodId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};
