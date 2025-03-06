
import { ManualPayment } from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const createManualPayment = async (
  moonlighterId: string,
  jobId: string,
  applicationId: string,
  amount: number,
  paymentMethodType: 'gcash' | 'paymaya' | 'bank',
  paymentDetails: string,
  paymentMethodId?: string,
  referenceNumber?: string,
  notes?: string
): Promise<ManualPayment | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('manual_payments')
      .insert([
        {
          provider_id: session.user.id,
          moonlighter_id: moonlighterId,
          job_id: jobId,
          application_id: applicationId,
          amount,
          payment_method_id: paymentMethodId,
          payment_method_type: paymentMethodType,
          payment_details: paymentDetails,
          reference_number: referenceNumber,
          notes,
          status: 'completed' // Assuming the provider is confirming they already sent the payment
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Update job application status
    await supabase
      .from('job_applications')
      .update({ status: 'paid' })
      .eq('id', applicationId);
      
    toast.success('Payment recorded successfully');
    return data as ManualPayment;
  } catch (error: any) {
    console.error('Error recording payment:', error);
    toast.error(error.message || 'Failed to record payment');
    return null;
  }
};

export const fetchUserManualPayments = async (isProvider: boolean): Promise<ManualPayment[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    
    const userId = session.user.id;
    const column = isProvider ? 'provider_id' : 'moonlighter_id';
    
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        jobs(title, company),
        job_applications(status, moonlighter_id),
        profiles_provider:profiles!provider_id(first_name, last_name),
        profiles_moonlighter:profiles!moonlighter_id(first_name, last_name)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as ManualPayment[];
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    toast.error('Failed to load payment history');
    return [];
  }
};

export const updateManualPaymentStatus = async (
  paymentId: string, 
  status: 'pending' | 'completed' | 'failed',
  referenceNumber?: string
): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const updates: any = { status };
    if (referenceNumber) {
      updates.reference_number = referenceNumber;
    }

    const { error } = await supabase
      .from('manual_payments')
      .update(updates)
      .eq('id', paymentId)
      .eq('provider_id', session.user.id);

    if (error) throw error;
    
    toast.success('Payment status updated');
    return true;
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    toast.error(error.message || 'Failed to update payment status');
    return false;
  }
};
