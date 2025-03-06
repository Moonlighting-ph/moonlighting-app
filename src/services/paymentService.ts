
import { supabase } from '@/integrations/supabase/client';

export interface PaymentIntent {
  id: string;
  client_secret: string;
}

export interface Payment {
  id: string;
  application_id: string;
  amount: number;
  currency: string;
  provider_id: string;
  moonlighter_id: string;
  status: 'pending' | 'completed' | 'failed';
  stripe_payment_intent_id: string;
  created_at: string;
  updated_at: string;
}

// Create a payment intent
export const createPayment = async (
  applicationId: string,
  amount: number,
  providerId: string,
  moonlighterId: string
): Promise<{ paymentIntent: PaymentIntent; payment: Payment }> => {
  try {
    const { data, error } = await supabase.functions.invoke('payment', {
      body: {
        applicationId,
        amount,
        providerId,
        moonlighterId,
      },
    });

    if (error) {
      console.error('Error creating payment:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating payment:', error);
    throw error;
  }
};

// Get payments for a provider
export const getProviderPayments = async (): Promise<Payment[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        job_applications:application_id (
          *,
          moonlighter:moonlighter_id (
            first_name,
            last_name,
            email
          ),
          job:job_id (
            title,
            company
          )
        )
      `)
      .eq('provider_id', userData.user.id);

    if (error) {
      console.error('Error fetching provider payments:', error);
      throw error;
    }

    return data as unknown as Payment[];
  } catch (error) {
    console.error('Unexpected error fetching provider payments:', error);
    throw error;
  }
};

// Get payments for a moonlighter
export const getMoonlighterPayments = async (): Promise<Payment[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        job_applications:application_id (
          *,
          provider:provider_id (
            first_name,
            last_name,
            email
          ),
          job:job_id (
            title,
            company
          )
        )
      `)
      .eq('moonlighter_id', userData.user.id);

    if (error) {
      console.error('Error fetching moonlighter payments:', error);
      throw error;
    }

    return data as unknown as Payment[];
  } catch (error) {
    console.error('Unexpected error fetching moonlighter payments:', error);
    throw error;
  }
};

// Update payment status (webhook handler would typically do this)
export const updatePaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'completed' | 'failed'
): Promise<Payment> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }

    return data as Payment;
  } catch (error) {
    console.error('Unexpected error updating payment status:', error);
    throw error;
  }
};
