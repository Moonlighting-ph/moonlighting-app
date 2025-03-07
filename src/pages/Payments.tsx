
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchMoonlighterPayments, fetchProviderPayments } from '@/services/manualPaymentService';
import { ManualPayment } from '@/types/payment';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentCard from '@/components/PaymentCard';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Payments: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProvider, setIsProvider] = useState<boolean>(false);

  useEffect(() => {
    if (!session?.user) {
      navigate('/auth/login');
      return;
    }

    const getUserTypeAndPayments = async () => {
      try {
        setLoading(true);
        
        // Get user type
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) throw profileError;
        
        const isProviderUser = profileData.user_type === 'provider';
        setIsProvider(isProviderUser);
        
        // Fetch payments based on user type
        let paymentData: ManualPayment[] = [];
        
        if (isProviderUser) {
          paymentData = await fetchProviderPayments(session.user.id);
        } else {
          paymentData = await fetchMoonlighterPayments(session.user.id);
        }
        
        setPayments(paymentData);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    getUserTypeAndPayments();
  }, [session, navigate]);

  const renderEmptyState = () => (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <h3 className="text-xl font-medium text-gray-900 mb-2">No payments yet</h3>
      <p className="text-gray-500 mb-6">
        {isProvider
          ? "You haven't made any payments to moonlighters yet."
          : "You haven't received any payments yet."}
      </p>
      {isProvider && (
        <Button onClick={() => navigate('/provider/applications')}>
          View Applications
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Payment History</h1>
          {isProvider && (
            <Button onClick={() => navigate('/provider/make-payment')}>
              Make a Payment
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading payment history...</div>
        ) : payments.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <PaymentCard 
                key={payment.id} 
                payment={payment as any} 
                isProvider={isProvider} 
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
