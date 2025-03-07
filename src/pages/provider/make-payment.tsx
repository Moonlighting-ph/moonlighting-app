
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentMethod } from '@/types/payment';
import StripePaymentForm from '@/components/StripePaymentForm';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserPaymentMethods } from '@/services/paymentMethodService';
import { toast } from 'sonner';
import ManualPaymentForm from '@/components/payments/ManualPaymentForm';
import MoonlighterPaymentMethods from '@/components/payments/MoonlighterPaymentMethods';

const MakePayment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Get params from URL
  const searchParams = new URLSearchParams(location.search);
  const moonlighterId = searchParams.get('moonlighterId');
  const jobId = searchParams.get('jobId');
  const applicationId = searchParams.get('applicationId');
  const amount = parseFloat(searchParams.get('amount') || '0');
  
  useEffect(() => {
    if (!moonlighterId || !jobId || !applicationId || amount <= 0) {
      toast.error('Missing required payment information');
      navigate('/provider');
      return;
    }
    
    const fetchPaymentMethods = async () => {
      if (!moonlighterId) return;
      
      try {
        setLoading(true);
        const methods = await fetchUserPaymentMethods(moonlighterId);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, [moonlighterId, jobId, applicationId, amount, navigate]);
  
  const handleSuccess = () => {
    toast.success('Payment recorded successfully!');
    navigate('/provider');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <p>Loading payment details...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Make Payment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="manual">
              <TabsList className="mb-4">
                <TabsTrigger value="manual">Manual Payment</TabsTrigger>
                <TabsTrigger value="stripe" disabled>Stripe (Coming Soon)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <ManualPaymentForm 
                  providerId={user?.id || ''}
                  moonlighterId={moonlighterId || ''}
                  jobId={jobId || ''}
                  applicationId={applicationId || ''}
                  amount={amount}
                  paymentMethods={paymentMethods}
                  onSuccess={handleSuccess}
                />
              </TabsContent>
              
              <TabsContent value="stripe">
                <Card>
                  <CardContent className="py-12 text-center">
                    <p>Stripe payment integration coming soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Moonlighter Payment Methods</h2>
            <MoonlighterPaymentMethods moonlighterId={moonlighterId || ''} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MakePayment;
