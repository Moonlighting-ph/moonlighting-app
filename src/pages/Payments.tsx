
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { ManualPayment } from '@/types/payment';
import { fetchMoonlighterPayments, fetchProviderPayments } from '@/services/manualPaymentService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PaymentCard } from '@/components/PaymentCard';

const Payments: React.FC = () => {
  const { session } = useAuth();
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'provider' | 'moonlighter' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserType = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user type:', error);
          return;
        }
        
        if (data && (data.user_type === 'provider' || data.user_type === 'moonlighter')) {
          setUserType(data.user_type);
        }
      } catch (err) {
        console.error('Error in fetchUserType:', err);
      }
    };
    
    fetchUserType();
  }, [session]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user || !userType) return;
      
      try {
        setLoading(true);
        let data: ManualPayment[] = [];
        
        if (userType === 'provider') {
          data = await fetchProviderPayments(session.user.id);
        } else if (userType === 'moonlighter') {
          data = await fetchMoonlighterPayments(session.user.id);
        }
        
        setPayments(data);
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (userType) {
      fetchPayments();
    }
  }, [session, userType]);

  const handleMakePayment = () => {
    navigate('/provider/make-payment');
  };

  const handleManagePaymentMethods = () => {
    navigate('/moonlighter/payment-methods');
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">
              {userType === 'provider' ? 'Payments Made' : 'Payments Received'}
            </h1>
            {userType === 'provider' && (
              <Button onClick={handleMakePayment}>Make a Payment</Button>
            )}
            {userType === 'moonlighter' && (
              <Button onClick={handleManagePaymentMethods}>Manage Payment Methods</Button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p>Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">No payments found</h3>
              <p className="text-gray-500 mb-4">
                {userType === 'provider' 
                  ? "You haven't made any payments yet." 
                  : "You haven't received any payments yet."}
              </p>
              {userType === 'provider' && (
                <Button onClick={handleMakePayment} variant="outline">
                  Make Your First Payment
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} userType={userType} />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Payments;
