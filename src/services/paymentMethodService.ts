
import { PaymentMethod } from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const fetchUserPaymentMethods = async (userId?: string): Promise<PaymentMethod[]> => {
  try {
    if (!userId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      userId = session.user.id;
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as PaymentMethod[];
  } catch (error: any) {
    console.error('Error fetching payment methods:', error);
    toast.error('Failed to load payment methods');
    return [];
  }
};

export const fetchMoonlighterPaymentMethods = async (moonlighterId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', moonlighterId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data as PaymentMethod[];
  } catch (error: any) {
    console.error('Error fetching moonlighter payment methods:', error);
    toast.error('Failed to load moonlighter payment methods');
    return [];
  }
};

export const addPaymentMethod = async (method: 'gcash' | 'paymaya' | 'bank', details: string, isDefault: boolean = false): Promise<PaymentMethod | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    // If setting as default, unset any existing defaults
    if (isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', session.user.id)
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert([
        {
          user_id: session.user.id,
          method,
          details,
          is_default: isDefault
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Payment method added successfully');
    return data as PaymentMethod;
  } catch (error: any) {
    console.error('Error adding payment method:', error);
    toast.error(error.message || 'Failed to add payment method');
    return null;
  }
};

export const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    // If setting as default, unset any existing defaults
    if (updates.is_default) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', session.user.id)
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Payment method updated successfully');
    return data as PaymentMethod;
  } catch (error: any) {
    console.error('Error updating payment method:', error);
    toast.error(error.message || 'Failed to update payment method');
    return null;
  }
};

export const deletePaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;
    
    toast.success('Payment method deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting payment method:', error);
    toast.error(error.message || 'Failed to delete payment method');
    return false;
  }
};

export const setDefaultPaymentMethod = async (id: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    // Unset any existing defaults
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', session.user.id)
      .eq('is_default', true);

    // Set the new default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;
    
    toast.success('Default payment method updated');
    return true;
  } catch (error: any) {
    console.error('Error setting default payment method:', error);
    toast.error(error.message || 'Failed to set default payment method');
    return false;
  }
};
